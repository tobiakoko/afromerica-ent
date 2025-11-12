'use client'

import { useBookings } from '@/features/bookings/hooks/use-bookings'
import { BookingListPresenter } from './BookingListPresenter'
import { useState } from 'react'

export function BookingListContainer() {
  const { bookings, isLoading, error, cancelBooking } = useBookings()
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  const filteredBookings = bookings.filter((booking) => {
    const eventDate = (booking as any).eventDate || (booking as any).date || (booking as any).createdAt
    if (!eventDate) return true

    if (filter === 'upcoming') {
      return new Date(eventDate) > new Date()
    }
    if (filter === 'past') {
      return new Date(eventDate) < new Date()
    }
    return true
  })

  const handleCancel = async (id: string) => {
    const confirmed = confirm('Are you sure you want to cancel this booking?')
    if (confirmed) {
      await cancelBooking(id)
    }
  }

  return (
    <BookingListPresenter
      bookings={filteredBookings}
      isLoading={isLoading}
      error={error}
      filter={filter}
      onFilterChange={setFilter}
      onCancel={handleCancel}
    />
  )
}