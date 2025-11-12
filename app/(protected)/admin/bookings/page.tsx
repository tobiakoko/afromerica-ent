import { bookingService } from '@/features/bookings/services/booking.service'
import { BookingsTable } from '@/features/bookings/components/admin/BookingsTable'

export default async function AdminBookingsPage() {
  const bookings = await bookingService.getAllBookings()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      <BookingsTable bookings={bookings} />
    </div>
  )
}