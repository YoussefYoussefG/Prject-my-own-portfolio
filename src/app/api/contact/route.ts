import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid name.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters.' },
        { status: 400 }
      );
    }

    // --- Save to Supabase ---
    const { error: dbError } = await supabase
      .from('messages')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
        },
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save message.' },
        { status: 500 }
      );
    }

    // --- Send Email Notification ---
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'yg.youssef.gamal16@gmail.com',
      subject: `New Portfolio Message from ${name.trim()}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f8f6; padding: 40px; border-radius: 16px;">
          <h1 style="font-size: 24px; color: #2D2D2D; margin-bottom: 8px;">📬 New Contact Message</h1>
          <p style="color: #666; font-size: 14px; margin-bottom: 32px;">Someone reached out through your portfolio website.</p>
          
          <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #eee;">
            <div style="margin-bottom: 20px;">
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 0 0 4px 0;">Name</p>
              <p style="font-size: 16px; color: #2D2D2D; margin: 0; font-weight: 600;">${name.trim()}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 0 0 4px 0;">Email</p>
              <p style="font-size: 16px; color: #E05C43; margin: 0;">
                <a href="mailto:${email.trim()}" style="color: #E05C43; text-decoration: none;">${email.trim()}</a>
              </p>
            </div>
            
            <div>
              <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 0 0 4px 0;">Message</p>
              <p style="font-size: 15px; color: #2D2D2D; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message.trim()}</p>
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
