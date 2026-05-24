"use client";

import React, { useState, useRef } from "react";
import { Send, Mail, CheckCircle, AlertCircle, Coffee } from "lucide-react";
import { playSuccessChime } from "../lib/sounds";
import { FadeInUp } from "./Animations";
import { submitContactMessage } from "../lib/services/contactService";
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
} from "../lib/validation";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id.replace('contact-', '')]: e.target.value });
    // Clear error state when user starts typing
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const formatBytes = (bytes: number) => {
    const sizeInMb = bytes / (1024 * 1024);
    if (sizeInMb >= 1) {
      return `${sizeInMb.toFixed(1)}MB`;
    }
    return `${Math.ceil(bytes / 1024)}KB`;
  };

  const validateAttachment = (file: File) => {
    if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
      return `File must be under ${MAX_ATTACHMENT_SIZE_MB}MB.`;
    }
    if (!ALLOWED_ATTACHMENT_MIME_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload a PDF, DOC, DOCX, PNG, or JPG.";
    }
    return "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachmentError("");
    setAttachment(null);

    if (!file) {
      return;
    }

    const validationError = validateAttachment(file);
    if (validationError) {
      setAttachmentError(validationError);
      e.target.value = "";
      return;
    }

    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }

    setAttachment(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus("error");
      setErrorMessage("Please fill out all fields.");
      return;
    }

    if (trimmedName.length < MIN_NAME_LENGTH) {
      setStatus("error");
      setErrorMessage("Name must be at least 2 characters.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      setStatus("error");
      setErrorMessage("Message must be at least 10 characters.");
      return;
    }

    if (attachmentError) {
      setStatus("error");
      setErrorMessage(attachmentError);
      return;
    }

    if (attachment) {
      const validationError = validateAttachment(attachment);
      if (validationError) {
        setStatus("error");
        setErrorMessage(validationError);
        return;
      }
    }

    setStatus("submitting");
    const result = await submitContactMessage({ ...formData, attachment });

    if (result.success) {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setAttachment(null);
      setAttachmentError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      playSuccessChime();
      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Failed to send message.");
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/10 bg-card mb-8">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span className="text-xs font-semibold tracking-widest uppercase text-foreground/70">
                Contact
              </span>
            </div>
          </FadeInUp>
          
          <FadeInUp delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
              Let&apos;s build something calm, confident, and memorable.
            </h2>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <p className="text-foreground/70 mb-8 max-w-xl">
              Tell me about your next product or brand story. I respond within 48 hours and prioritize projects with design-led impact.
            </p>
          </FadeInUp>
          
          <FadeInUp delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <a href="mailto:yg.youssef.gamal16@gmail.com" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-accent hover:opacity-80 transition-opacity">
                <Mail className="w-4 h-4" />
                yg.youssef.gamal16@gmail.com
              </a>
              
              <div className="flex flex-wrap gap-2 sm:ml-4 items-center">
                <a href="https://www.linkedin.com/in/youssef-gamal123" target="_blank" rel="noopener noreferrer" aria-label="Visit Youssef's LinkedIn profile" title="LinkedIn" className="p-2.5 bg-card rounded-full border border-foreground/10 hover:border-foreground/30 hover:-translate-y-0.5 transition-all text-foreground/70 hover:text-foreground">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a href="https://github.com/YoussefYoussefG" target="_blank" rel="noopener noreferrer" aria-label="Visit Youssef's GitHub profile" title="GitHub" className="p-2.5 bg-card rounded-full border border-foreground/10 hover:border-foreground/30 hover:-translate-y-0.5 transition-all text-foreground/70 hover:text-foreground">
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a href="https://buymeacoffee.com/focuswithyoussef" target="_blank" rel="noopener noreferrer" aria-label="Buy Youssef a coffee" className="p-2.5 bg-card rounded-full border border-foreground/10 hover:border-foreground/30 hover:-translate-y-0.5 transition-all text-foreground/70 hover:text-foreground" title="Buy me a coffee">
                  <Coffee className="w-4 h-4" />
                </a>
              </div>
            </div>
          </FadeInUp>
        </div>

        {/* Form Card */}
        <FadeInUp delay={0.3}>
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-sm border border-foreground/5 relative overflow-hidden">
            {status === "success" && (
              <div className="absolute inset-0 bg-card/95 z-10 flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-2xl font-serif mb-2">Message Sent</h3>
                <p className="text-foreground/70">Thank you for reaching out. I&apos;ll get back to you shortly!</p>
              </div>
            )}
            
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-xs font-semibold tracking-widest uppercase text-foreground/50 block">
                  Name
                </label>
                <input 
                  type="text" 
                  id="contact-name" 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  placeholder="Your name" 
                  minLength={MIN_NAME_LENGTH}
                  maxLength={MAX_NAME_LENGTH}
                  className="w-full bg-transparent border-b border-foreground/20 pb-3 text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/30 disabled:opacity-50"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-xs font-semibold tracking-widest uppercase text-foreground/50 block">
                  Email
                </label>
                <input 
                  type="email" 
                  id="contact-email" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  placeholder="you@studio.com" 
                  maxLength={MAX_EMAIL_LENGTH}
                  className="w-full bg-transparent border-b border-foreground/20 pb-3 text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/30 disabled:opacity-50"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-xs font-semibold tracking-widest uppercase text-foreground/50 block">
                  Message
                </label>
                <textarea 
                  id="contact-message" 
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  placeholder="Share a few details about the project..." 
                  minLength={MIN_MESSAGE_LENGTH}
                  maxLength={MAX_MESSAGE_LENGTH}
                  className="w-full bg-transparent border-b border-foreground/20 pb-3 text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/30 resize-none disabled:opacity-50"
                ></textarea>
                <div className="text-right text-xs text-foreground/30 mt-1">
                  {formData.message.length}/{MAX_MESSAGE_LENGTH}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-attachment" className="text-xs font-semibold tracking-widest uppercase text-foreground/50 block">
                  Attachment (optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="contact-attachment"
                  onChange={handleFileChange}
                  disabled={status === "submitting"}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="w-full bg-transparent border-b border-foreground/20 pb-3 text-foreground focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/30 disabled:opacity-50"
                />
                <div className="text-xs text-foreground/40">
                  Max {MAX_ATTACHMENT_SIZE_MB}MB. PDF, DOC, DOCX, PNG, or JPG.
                </div>
                {attachment && (
                  <div className="text-xs text-foreground/60">
                    Selected: {attachment.name} ({formatBytes(attachment.size)})
                  </div>
                )}
                {attachmentError && (
                  <div className="text-xs text-red-500">{attachmentError}</div>
                )}
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={status === "submitting"}
                className="group inline-flex items-center gap-3 border border-foreground text-foreground px-6 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-foreground"
              >
                {status === "submitting" ? "SENDING..." : "SEND MESSAGE"}
                {!status.includes("submitting") && (
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
              </button>
            </form>
          </div>
        </FadeInUp>

      </div>
    </section>
  );
}
