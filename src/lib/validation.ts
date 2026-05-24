// Shared validation constants used by both client (Contact.tsx) and server (route.ts)
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_MESSAGE_LENGTH = 5000;
export const MIN_NAME_LENGTH = 2;
export const MIN_MESSAGE_LENGTH = 10;

// Simple email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
