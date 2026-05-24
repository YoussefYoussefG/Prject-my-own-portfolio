// Shared validation constants used by both client (Contact.tsx) and server (route.ts)
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_MESSAGE_LENGTH = 5000;
export const MIN_NAME_LENGTH = 2;
export const MIN_MESSAGE_LENGTH = 10;
export const MAX_ATTACHMENT_SIZE_MB = 3; // 3MB limit (safe for Vercel's 4.5MB request limit)
export const MAX_ATTACHMENT_SIZE_BYTES = MAX_ATTACHMENT_SIZE_MB * 1024 * 1024;
export const ALLOWED_ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

// Simple email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
