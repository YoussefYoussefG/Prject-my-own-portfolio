export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

// Rate limiting: track last submission time per session
let lastSubmissionTime = 0;
const RATE_LIMIT_MS = 30000; // 30 seconds between submissions

export async function submitContactMessage(data: ContactMessage): Promise<{ success: boolean; error?: string }> {
  try {
    // Basic client-side validation (server also validates)
    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      return { success: false, error: 'All fields are required.' };
    }

    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmissionTime < RATE_LIMIT_MS) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmissionTime)) / 1000);
      return { success: false, error: `Please wait ${remainingSeconds} seconds before sending another message.` };
    }

    // Call the API route (handles DB save + email notification)
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to send message.' };
    }

    // Update last submission time on success
    lastSubmissionTime = now;
    return { success: true };
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
