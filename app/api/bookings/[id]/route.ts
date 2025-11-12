import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response';
import { ErrorCodes } from '@/lib/api/types';
import { bookingRepository } from '@/features/bookings/repositories/booking.repository';
import { createClient } from '@/utils/supabase/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/bookings/[id]
 * Get a specific booking by ID
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return errorResponse(ErrorCodes.VALIDATION_ERROR, 'Booking ID is required');
    }

    const booking = await bookingRepository.findById(id);

    if (!booking) {
      return errorResponse(ErrorCodes.NOT_FOUND, 'Booking not found');
    }

    return successResponse({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return handleApiError(error);
  }
}

/**
 * DELETE /api/bookings/[id]
 * Cancel a booking (admin only or booking owner)
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    if (!id) {
      return errorResponse(ErrorCodes.VALIDATION_ERROR, 'Booking ID is required');
    }

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required');
    }

    // Get booking to check ownership
    const booking = await bookingRepository.findById(id);

    if (!booking) {
      return errorResponse(ErrorCodes.NOT_FOUND, 'Booking not found');
    }

    // Check if user owns this booking or is admin
    const { data: profile } = (await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()) as any;

    const isAdmin = profile?.role === 'admin';
    const isOwner = (booking as any).user_id === session.user.id;

    if (!isAdmin && !isOwner) {
      return errorResponse(
        ErrorCodes.FORBIDDEN,
        'You do not have permission to cancel this booking'
      );
    }

    // Cancel the booking (soft delete)
    await bookingRepository.cancel(id);

    return successResponse({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return handleApiError(error);
  }
}
