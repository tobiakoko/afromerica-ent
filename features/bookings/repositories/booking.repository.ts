/*
  Booking Repository - Database persistence layer using Supabase

  Handles all database operations for bookings.
  Uses Supabase for type-safe database queries.
*/

import { createClient } from '@/utils/supabase/server';
import { Database } from '@/utils/supabase/types';

type BookingStatus = Database['public']['Tables']['bookings']['Row']['payment_status'];

export interface CreateBookingData {
  userId: string
  eventId: string
  ticketType: string
  quantity: number
  totalAmount: number
  attendeeInfo: any // JSON field - flexible structure
  paymentReference?: string
}

export interface UpdateBookingData {
  payment_status?: BookingStatus
  paymentReference?: string
  attendeeInfo?: any
}

export const bookingRepository = {
  /**
   * Create a new booking
   */
  async create(data: CreateBookingData) {
    const supabase = await createClient();
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        user_id: data.userId,
        event_id: data.eventId,
        email: '', // Should be provided in data
        full_name: '', // Should be provided in data
        booking_reference: '', // Should be generated
        total_amount: data.totalAmount,
        payment_status: 'pending',
        payment_reference: data.paymentReference,
        metadata: data.attendeeInfo,
      })
      .select()
      .single();

    if (error) throw error;
    return booking;
  },

  /**
   * Update an existing booking
   */
  async update(id: string, patch: UpdateBookingData) {
    const supabase = await createClient();
    const updateData: Record<string, any> = {};

    if (patch.payment_status !== undefined) {
      updateData.payment_status = patch.payment_status;
    }
    if (patch.paymentReference !== undefined) {
      updateData.payment_reference = patch.paymentReference;
    }
    if (patch.attendeeInfo !== undefined) {
      updateData.metadata = patch.attendeeInfo;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Find booking by ID
   */
  async findById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Find booking by payment reference
   */
  async findByPaymentReference(paymentReference: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('payment_reference', paymentReference)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all bookings (admin use)
   */
  async findAll(options?: {
    skip?: number
    take?: number
  }) {
    const supabase = await createClient();
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.skip) {
      query = query.range(options.skip, options.skip + (options.take || 10) - 1);
    } else if (options?.take) {
      query = query.limit(options.take);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Get bookings for a specific user
   */
  async findByUserId(userId: string, options?: {
    skip?: number
    take?: number
  }) {
    const supabase = await createClient();
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.skip) {
      query = query.range(options.skip, options.skip + (options.take || 10) - 1);
    } else if (options?.take) {
      query = query.limit(options.take);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Count bookings for an event (for capacity management)
   */
  async countByEventId(eventId: string, status?: BookingStatus) {
    const supabase = await createClient();
    let query = supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (status) {
      query = query.eq('payment_status', status);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  /**
   * Delete a booking (admin use or cancellation)
   */
  async delete(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Cancel a booking (soft delete - updates status)
   */
  async cancel(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bookings')
      .update({ payment_status: 'refunded' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get booking statistics for an event
   */
  async getEventStats(eventId: string) {
    const supabase = await createClient();

    const { count: total } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    const { count: confirmed } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('payment_status', 'completed');

    const { count: pending } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('payment_status', 'pending');

    const { count: cancelled } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('payment_status', 'refunded');

    const { data: revenueData } = await supabase
      .from('bookings')
      .select('total_amount')
      .eq('event_id', eventId)
      .eq('payment_status', 'completed');

    const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

    return {
      total: total || 0,
      confirmed: confirmed || 0,
      pending: pending || 0,
      cancelled: cancelled || 0,
      totalRevenue,
    };
  },
}