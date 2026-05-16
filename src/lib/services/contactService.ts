import { supabase } from '../supabase';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export async function submitContactMessage(data: ContactMessage): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
        }
      ]);

    if (error) {
      console.error('Error submitting message:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}
