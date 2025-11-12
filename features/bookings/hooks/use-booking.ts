import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../api/bookings-api'

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsApi.getBooking(id),
  })
}
