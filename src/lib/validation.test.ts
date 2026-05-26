import { describe, it, expect } from "vitest";
import { isValidEmail, MAX_ATTACHMENT_SIZE_BYTES, MAX_ATTACHMENT_SIZE_MB } from "./validation";

describe("Validation Utilities", () => {
  describe("isValidEmail", () => {
    it("should return true for valid email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name+tag@domain.co.uk")).toBe(true);
      expect(isValidEmail("valid_email123@sub.domain.org")).toBe(true);
    });

    it("should return false for invalid email addresses", () => {
      expect(isValidEmail("test@.com")).toBe(false);
      expect(isValidEmail("test@com")).toBe(false);
      expect(isValidEmail("testexample.com")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@example.")).toBe(false);
      expect(isValidEmail("test @example.com")).toBe(false);
    });
  });

  describe("Constants", () => {
    it("should calculate max attachment size correctly in bytes", () => {
      expect(MAX_ATTACHMENT_SIZE_BYTES).toBe(MAX_ATTACHMENT_SIZE_MB * 1024 * 1024);
    });
  });
});