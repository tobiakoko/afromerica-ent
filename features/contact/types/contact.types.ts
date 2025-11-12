import { z } from 'zod';

// Contact form validation schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

// Contact form data type
export type ContactFormData = z.infer<typeof contactSchema>;

// Contact info type (for display)
export interface ContactInfo {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

// API response type
export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
}