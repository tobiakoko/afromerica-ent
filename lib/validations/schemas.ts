import { z } from 'zod';

// ==========================================
// COMMON SCHEMAS
// ==========================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required');

export const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Invalid phone number format'
  )
  .optional();

// ==========================================
// EVENT SCHEMAS
// ==========================================

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  short_description: z.string().max(200).optional(),
  date: z.string().datetime('Invalid date format'),
  end_date: z.string().datetime('Invalid date format').optional(),
  time: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  status: z
    .enum(['upcoming', 'ongoing', 'completed', 'cancelled', 'soldout'])
    .default('upcoming'),
  category: z.enum(['concert', 'festival', 'club', 'private', 'tour']).optional(),
  featured: z.boolean().default(false),
  image_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const eventFilterSchema = z.object({
  status: z
    .enum(['upcoming', 'ongoing', 'completed', 'cancelled', 'soldout'])
    .optional(),
  category: z.enum(['concert', 'festival', 'club', 'private', 'tour']).optional(),
  featured: z.coerce.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ==========================================
// BOOKING SCHEMAS
// ==========================================

export const createBookingSchema = z.object({
  event_id: z.string().uuid('Invalid event ID'),
  email: emailSchema,
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: phoneSchema,
  items: z
    .array(
      z.object({
        ticket_type_id: z.string().uuid('Invalid ticket type ID'),
        quantity: z
          .number()
          .int()
          .positive('Quantity must be positive')
          .max(10, 'Maximum 10 tickets per type'),
      })
    )
    .min(1, 'At least one ticket must be selected'),
  metadata: z.record(z.unknown()).optional(),
});

export const verifyBookingSchema = z.object({
  booking_reference: z.string().min(1, 'Booking reference is required'),
});

// ==========================================
// VOTING SCHEMAS
// ==========================================

export const showcaseVoteSchema = z.object({
  finalist_id: z.string().uuid('Invalid finalist ID'),
  voter_id: z.string().min(1, 'Voter ID is required'),
  ip_address: z.string().ip().optional(),
  user_agent: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const pilotVoteInitSchema = z.object({
  email: emailSchema,
  items: z
    .array(
      z.object({
        artist_id: z.string().uuid('Invalid artist ID'),
        package_id: z.string().uuid('Invalid package ID'),
        quantity: z
          .number()
          .int()
          .positive('Quantity must be positive')
          .max(100, 'Maximum 100 packages per artist'),
      })
    )
    .min(1, 'At least one vote package must be selected'),
  metadata: z.record(z.unknown()).optional(),
});

// ==========================================
// PAYMENT SCHEMAS
// ==========================================

export const initializePaymentSchema = z.object({
  reference: z.string().min(1, 'Reference is required'),
  email: emailSchema,
  amount: z.number().positive('Amount must be positive'),
  metadata: z.record(z.unknown()).optional(),
});

export const verifyPaymentSchema = z.object({
  reference: z.string().min(1, 'Reference is required'),
});

// Paystack webhook event schema
export const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    reference: z.string(),
    amount: z.number(),
    status: z.string(),
    paid_at: z.string().optional(),
    customer: z
      .object({
        email: z.string().email(),
      })
      .optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
});

// ==========================================
// NEWSLETTER SCHEMAS
// ==========================================

export const subscribeNewsletterSchema = z.object({
  email: emailSchema,
  name: z.string().min(2).optional(),
  source: z.string().optional(),
});

// ==========================================
// AUTH SCHEMAS
// ==========================================

export const signupSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: phoneSchema,
  avatar_url: z.string().url().optional(),
});

// ==========================================
// CONTACT SCHEMAS
// ==========================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// ==========================================
// ARTIST SCHEMAS
// ==========================================

export const createArtistSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  stage_name: z.string().optional(),
  bio: z.string().optional(),
  genre: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  social_media: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional(),
      spotify: z.string().optional(),
    })
    .optional(),
  featured: z.boolean().default(false),
});

export const updateArtistSchema = createArtistSchema.partial();

// ==========================================
// TYPE INFERENCE
// ==========================================

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventFilterInput = z.infer<typeof eventFilterSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ShowcaseVoteInput = z.infer<typeof showcaseVoteSchema>;
export type PilotVoteInitInput = z.infer<typeof pilotVoteInitSchema>;
export type InitializePaymentInput = z.infer<typeof initializePaymentSchema>;
export type SubscribeNewsletterInput = z.infer<typeof subscribeNewsletterSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type CreateArtistInput = z.infer<typeof createArtistSchema>;
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;