import { z } from 'zod'

export const SendOTPSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  method: z.enum(['email', 'sms']),
}).refine(
  (data) => (data.method === 'email' && data.email) || (data.method === 'sms' && data.phone),
  { message: 'Email or phone required based on method' }
)

export const VerifyOTPSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  code: z.string().length(6).regex(/^\d+$/),
  method: z.enum(['email', 'sms']),
})

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
})

// Helper function
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown) {
  return schema.safeParse(data)
}
