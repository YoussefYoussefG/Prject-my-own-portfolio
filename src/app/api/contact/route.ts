import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Validation Constraints ---
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_NAME_LENGTH = 2;
const MIN_MESSAGE_LENGTH = 10;

// --- HTML Escaping (prevents XSS in email templates) ---
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

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
    // Factor III: sender/recipient read from environment config
    const contactTo = process.env.CONTACT_TO_EMAIL;
    const contactFrom = process.env.CONTACT_FROM_EMAIL;

    if (!contactTo || !contactFrom) {
      console.error('Missing CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL env vars');
      // Message saved to DB, so still count as success
      return NextResponse.json({ success: true });
    }

    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage);

    const resend = new Resend(process.env.RESEND_API_KEY);
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
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center;">
            Sent from your portfolio website • ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      `,
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
