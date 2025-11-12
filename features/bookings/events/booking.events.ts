import { eventEmitter } from '@/lib/events/event-emitter'
import { emailService } from '@/lib/email/email.service'
import { analyticsService } from '@/lib/analytics/analytics.service'
import { Booking } from '../types'

// Register event listeners
eventEmitter.on('booking.created', async (booking: Booking) => {
  console.log('Booking created:', booking.id)

  // TODO: Send confirmation email - needs proper data transformation
  // The booking object needs to be enriched with event details and customer info
  // await emailService.sendBookingConfirmation({
  //   ...booking,
  //   customerEmail: booking.attendeeInfo[0]?.email,
  //   customerName: booking.attendeeInfo[0]?.name,
  //   eventTitle: 'Event Title', // Need to fetch from event service
  //   eventDate: 'Event Date',
  //   eventTime: 'Event Time',
  //   location: 'Location',
  // })

  // Track analytics
  await analyticsService.track('booking_created', {
    bookingId: booking.id,
    eventId: booking.eventId,
    amount: booking.totalAmount,
  })
})

eventEmitter.on('booking.confirmed', async (booking: Booking) => {
  console.log('Booking confirmed:', booking.id)

  // TODO: Send tickets - needs proper data transformation
  // await emailService.sendTickets(booking)

  // Update inventory
  // Handled in service layer
})

eventEmitter.on('booking.cancelled', async (booking: Booking) => {
  console.log('Booking cancelled:', booking.id)

  // TODO: Send cancellation email - needs proper data transformation
  // await emailService.sendBookingCancellation({
  //   ...booking,
  //   customerEmail: booking.attendeeInfo[0]?.email,
  //   refundAmount: booking.totalAmount,
  //   refundReason: 'Customer requested cancellation',
  // })

  // Track analytics
  await analyticsService.track('booking_cancelled', {
    bookingId: booking.id,
  })
})