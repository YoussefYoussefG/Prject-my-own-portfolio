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

// --- Server-Side Rate Limiting ---
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 5;   // max 5 requests per window per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// Periodically clean stale entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60_000); // every 5 minutes

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

export async function POST(request: NextRequest) {
  try {
    // --- Rate Limiting ---
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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
    const safeName = escapeHtml(trimmedName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'yg.youssef.gamal16@gmail.com',
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

