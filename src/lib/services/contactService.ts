import { supabase } from '../supabase';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Rate limiting: track last submission time per session
let lastSubmissionTime = 0;
const RATE_LIMIT_MS = 30000; // 30 seconds between submissions

export async function submitContactMessage(data: ContactMessage): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate required fields
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      return { success: false, error: 'All fields are required.' };
    }

    // Validate name length
    if (data.name.trim().length < 2) {
      return { success: false, error: 'Please enter a valid name.' };
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Validate message length
    if (data.message.trim().length < 10) {
      return { success: false, error: 'Message must be at least 10 characters.' };
    }

    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmissionTime < RATE_LIMIT_MS) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmissionTime)) / 1000);
      return { success: false, error: `Please wait ${remainingSeconds} seconds before sending another message.` };
    }

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          message: data.message.trim(),
        }
      ]);

    if (error) {
      console.error('Error submitting message:', error);
      return { success: false, error: 'Failed to send message. Please try again later.' };
    }

    // Update last submission time on success
    lastSubmissionTime = now;
    return { success: true };
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
