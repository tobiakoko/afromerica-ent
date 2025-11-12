import { z } from 'zod'

export const attendeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
})

export const bookingSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  ticketType: z.string().min(1, 'Please select a ticket type'),
  quantity: z.number().min(1).max(10, 'Maximum 10 tickets per booking'),
  attendeeInfo: z.array(attendeeSchema).min(1, 'At least one attendee required'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export type BookingFormData = z.infer<typeof bookingSchema>

export type CreateBookingData = BookingFormData
