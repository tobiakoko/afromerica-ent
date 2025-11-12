import { apiClient } from '@/lib/api/client'
import type { Booking } from '@/types'
import type { BookingFormData } from '../types/booking.schema'

export const bookingsApi = {
  createBooking: async (data: BookingFormData): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', data)
    return response.data
  },

  getUserBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>('/bookings')
    return response.data
  },

  getBooking: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${id}`)
    return response.data
  },

  cancelBooking: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`)
  },
}