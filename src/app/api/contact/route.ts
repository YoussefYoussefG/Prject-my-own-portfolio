import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import {
  MAX_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
  MIN_NAME_LENGTH,
  MIN_MESSAGE_LENGTH,
  isValidEmail,
  MAX_ATTACHMENT_SIZE_BYTES,
  MAX_ATTACHMENT_SIZE_MB,
  ALLOWED_ATTACHMENT_MIME_TYPES,
} from '@/lib/validation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Module-level Resend client (reused across requests)
const resend = new Resend(process.env.RESEND_API_KEY);

// --- HTML Escaping (prevents XSS in email templates) ---
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Stateless Rate Limiting via Backing Service (Factor VI) ---
// Queries the messages table for recent submissions from the same email.
// Works identically across multiple processes/serverless instances (Factor VIII).
async function isRateLimited(email: string): Promise<boolean> {
  const maxPerHour = parseInt(process.env.RATE_LIMIT_MAX_PER_HOUR || '5', 10);
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', oneHourAgo);

  if (error) {
    // If we can't check rate limit, allow the request (fail open)
    console.error('Rate limit check error:', error);
    return false;
  }

  return (count ?? 0) >= maxPerHour;
}

// Max request size (file + fields)
const MAX_REQUEST_BYTES = MAX_ATTACHMENT_SIZE_BYTES + 20_000;

function formatBytes(bytes: number): string {
  const sizeInMb = bytes / (1024 * 1024);
  if (sizeInMb >= 1) {
    return `${sizeInMb.toFixed(1)}MB`;
  }
  return `${Math.ceil(bytes / 1024)}KB`;
}

export async function POST(request: NextRequest) {
  try {
    // --- Request size guard ---
    const contentLength = parseInt(request.headers.get('content-length') || '0');
    if (contentLength && contentLength > MAX_REQUEST_BYTES) {
      return NextResponse.json(
        { error: 'Request too large.' },
        { status: 413 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let name: string | undefined;
    let email: string | undefined;
    let message: string | undefined;
    let attachment: File | null = null;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      name = body?.name;
      email = body?.email;
      message = body?.message;
    } else {
      const formData = await request.formData();
      const nameValue = formData.get('name');
      const emailValue = formData.get('email');
      const messageValue = formData.get('message');
      const attachmentValue = formData.get('attachment');

      if (typeof nameValue === 'string') {
        name = nameValue;
      }
      if (typeof emailValue === 'string') {
        email = emailValue;
      }
      if (typeof messageValue === 'string') {
        message = messageValue;
      }
      if (attachmentValue instanceof File && attachmentValue.size > 0) {
        attachment = attachmentValue;
      }
    }

    // --- Validation ---
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMessage = message.trim();

    if (trimmedName.length < MIN_NAME_LENGTH) {
      return NextResponse.json(
        { error: 'Please enter a valid name.' },
        { status: 400 }
      );
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Name must be under ${MAX_NAME_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
      return NextResponse.json(
        { error: 'Email address is too long.' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters.' },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (attachment) {
      if (attachment.size > MAX_ATTACHMENT_SIZE_BYTES) {
        return NextResponse.json(
          { error: `Attachment must be under ${MAX_ATTACHMENT_SIZE_MB}MB.` },
          { status: 413 }
        );
      }
      if (!ALLOWED_ATTACHMENT_MIME_TYPES.includes(attachment.type)) {
        return NextResponse.json(
          { error: 'Unsupported attachment type.' },
          { status: 400 }
        );
      }
    }

    // --- Rate Limiting (stateless, backed by Supabase) ---
    if (await isRateLimited(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Too many messages sent recently. Please try again later.' },
        { status: 429 }
      );
    }

    // --- Save to Supabase ---
    const { error: dbError } = await supabase
      .from('messages')
      .insert([
        {
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
        },
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save message.' },
        { status: 500 }
      );
    }

    // --- Send Email Notification (with XSS-safe escaping) ---
    const contactTo = process.env.CONTACT_TO_EMAIL || 'yg.youssef.gamal16@gmail.com';
    const contactFrom = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage);
    const safeAttachmentName = attachment ? escapeHtml(attachment.name || 'attachment') : null;

    let attachments: Array<{ filename: string; content: string; contentType?: string }> | undefined;
    if (attachment) {
      const buffer = Buffer.from(await attachment.arrayBuffer());
      attachments = [
        {
          filename: attachment.name || 'attachment',
          content: buffer,
          contentType: attachment.type || 'application/octet-stream',
        },
      ];
    }

    const { error: emailError } = await resend.emails.send({
      from: contactFrom,
      to: contactTo,
      subject: `New Portfolio Message from ${safeName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f8f6; padding: 40px; border-radius: 16px;">
          <h1 style="font-size: 24px; color: #2D2D2D; margin-bottom: 8px;">📬 New Contact Message</h1>
          <p style="color: #666; font-size: 14px; margin-bottom: 32px;">Someone reached out through your portfolio website.</p>
          
          <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #eee;">
            <div style="margin-bottom: 20px;">
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 0 0 4px 0;">Name</p>
              <p style="font-size: 16px; color: #2D2D2D; margin: 0; font-weight: 600;">${safeName}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 0 0 4px 0;">Email</p>
              <p style="font-size: 16px; color: #E05C43; margin: 0;">
                <a href="mailto:${safeEmail}" style="color: #E05C43; text-decoration: none;">${safeEmail}</a>
              </p>
            </div>
            
            <div>
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 0 0 4px 0;">Message</p>
              <p style="font-size: 15px; color: #2D2D2D; margin: 0; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
            </div>
            ${attachment ? `
              <div style="margin-top: 20px;">
                <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 0 0 4px 0;">Attachment</p>
                <p style="font-size: 14px; color: #2D2D2D; margin: 0;">${safeAttachmentName} (${formatBytes(attachment.size)})</p>
              </div>
            ` : ''}
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center;">
            Sent from your portfolio website • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      `,
      ...(attachments ? { attachments } : {}),
    });

    if (emailError) {
      // Email failed, but message was saved to DB — still count as success
      console.error('Email error:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
