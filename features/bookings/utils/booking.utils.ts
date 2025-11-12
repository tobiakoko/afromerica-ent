import { bookingRepository } from '../repositories/booking.repository'
import { paymentService } from '@/features/payments/services/payment.service'
import { eventService } from '@/features/events/services/event.service'
import { emailService } from '@/lib/email/email.service'
import { CreateBookingData, Booking } from '../types'

class BookingService {
  async createBooking(dto: CreateBookingData): Promise<Booking> {
    // 1. Validate event exists and has capacity
    const event = await eventService.getEventById(dto.eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    const availableTickets = await this.getAvailableTickets(dto.eventId)
    if (availableTickets < dto.quantity) {
      throw new Error('Not enough tickets available')
    }

    // Calculate total amount based on ticket type and quantity
    const ticketType = event.ticketTypes?.find((t: any) => t.id === dto.ticketType)
    if (!ticketType) {
      throw new Error('Invalid ticket type')
    }
    const totalAmount = ticketType.price * dto.quantity

    // 2. Create booking in database
    const booking = await bookingRepository.create({
      ...dto,
      totalAmount,
    })

    // 3. Initialize payment
    const payment = await paymentService.initializePayment({
      amount: totalAmount,
      bookingId: booking.id,
      email: dto.attendeeInfo[0].email,
    })

    // 4. Update booking with payment reference
    const updatedBooking = await bookingRepository.update(booking.id, {
      paymentReference: payment.reference,
    })

    return {
      ...updatedBooking,
      paymentUrl: payment.authorizationUrl,
    }
  }

  async confirmBooking(bookingId: string): Promise<void> {
    const booking = await bookingRepository.findById(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }

    // Update booking status
    await bookingRepository.update(bookingId, {
      payment_status: 'completed',
    })

    // Send confirmation email
    await emailService.sendBookingConfirmation(booking)

    // Decrement ticket count
    await eventService.decrementTickets(booking.eventId, booking.quantity)
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const booking = await bookingRepository.findById(bookingId)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.payment_status === 'completed') {
      // Process refund
      await paymentService.refundPayment(booking.payment_reference || '')
    }

    // Update booking status
    await bookingRepository.update(bookingId, {
      payment_status: 'refunded',
    })

    // Increment ticket count back
    await eventService.incrementTickets(booking.eventId, booking.quantity)

    // Send cancellation email
    await emailService.sendBookingCancellation(booking)
  }

  async getAllBookings(): Promise<Booking[]> {
    return bookingRepository.findAll()
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return bookingRepository.findById(id)
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return bookingRepository.findByUserId(userId)
  }

  private async getAvailableTickets(eventId: string): Promise<number> {
    const event = await eventService.getEventById(eventId)
    const totalBooked = await bookingRepository.countByEventId(eventId)
    return event.capacity - totalBooked
  }
}

export const bookingService = new BookingService()