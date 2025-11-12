import { Booking } from '../types'
import { CreateBookingData } from '../types/booking.schema'

export interface IBookingRepository {
  create(data: CreateBookingData): Promise<Booking>
  findById(id: string): Promise<Booking | null>
  findAll(): Promise<Booking[]>
  findByUserId(userId: string): Promise<Booking[]>
  findByEventId(eventId: string): Promise<Booking[]>
  update(id: string, data: Partial<Booking>): Promise<Booking>
  delete(id: string): Promise<void>
  countByEventId(eventId: string): Promise<number>
}