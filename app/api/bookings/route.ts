import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api/response';
import { ErrorCodes } from '@/lib/api/types';
import { createBookingSchema } from '@/lib/validations/schemas';
import type { Database } from '@/utils/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate request body
    const validatedData = createBookingSchema.parse(body);

    // Check ticket availability
    const { data: ticketTypes, error: ticketError } = await supabase
      .from('ticket_types')
      .select('id, name, price, available, max_per_order')
      .in(
        'id',
        validatedData.items.map((item) => item.ticket_type_id)
      ) as { data: Database['public']['Tables']['ticket_types']['Row'][] | null; error: any };

    if (ticketError || !ticketTypes) {
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        'Failed to fetch ticket information',
        { details: ticketError?.message }
      );
    }

    // Validate availability and calculate total
    let totalAmount = 0;
    for (const item of validatedData.items) {
      const ticketType = ticketTypes.find((tt) => tt.id === item.ticket_type_id);

      if (!ticketType) {
        return errorResponse(
          ErrorCodes.NOT_FOUND,
          `Ticket type ${item.ticket_type_id} not found`
        );
      }

      if (ticketType.available < item.quantity) {
        return errorResponse(
          ErrorCodes.INSUFFICIENT_TICKETS,
          `Insufficient tickets for ${ticketType.name}. Only ${ticketType.available} left.`
        );
      }

      if (ticketType.max_per_order && item.quantity > ticketType.max_per_order) {
        return errorResponse(
          ErrorCodes.VALIDATION_ERROR,
          `Maximum ${ticketType.max_per_order} tickets per order for ${ticketType.name}`
        );
      }

      totalAmount += ticketType.price * item.quantity;
    }

    // Generate booking reference
    const bookingReference = await supabase.rpc('generate_booking_reference') as { data: string | null; error: any };

    if (!bookingReference.data) {
      return errorResponse(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to generate booking reference'
      );
    }

    // Get user ID if authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Create booking
    const bookingInsert: Database['public']['Tables']['bookings']['Insert'] = {
      event_id: validatedData.event_id,
      user_id: session?.user.id || null,
      email: validatedData.email,
      full_name: validatedData.full_name,
      phone: validatedData.phone,
      total_amount: totalAmount,
      currency: 'NGN',
      payment_status: 'pending' as const,
      booking_reference: bookingReference.data,
      metadata: validatedData.metadata as any,
    };

    const { data: booking, error: bookingError } = (await supabase
      .from('bookings')
      .insert(bookingInsert as any)
      .select()
      .single()) as { data: Database['public']['Tables']['bookings']['Row'] | null; error: any };

    if (bookingError || !booking) {
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        'Failed to create booking',
        { details: bookingError?.message }
      );
    }

    // Create booking items
    const bookingItems: Database['public']['Tables']['booking_items']['Insert'][] = validatedData.items.map((item) => {
      const ticketType = ticketTypes.find((tt) => tt.id === item.ticket_type_id);
      return {
        booking_id: booking.id,
        ticket_type_id: item.ticket_type_id,
        quantity: item.quantity,
        price_per_ticket: ticketType!.price,
        total_price: ticketType!.price * item.quantity,
      };
    });

    const { error: itemsError } = (await supabase
      .from('booking_items')
      .insert(bookingItems as any)) as { error: any };

    if (itemsError) {
      // Rollback: delete booking if items creation fails
      await supabase.from('bookings').delete().eq('id', booking.id);

      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        'Failed to create booking items',
        { details: itemsError.message }
      );
    }

    // Return booking with items
    const { data: fullBooking } = await supabase
      .from('bookings')
      .select(
        `
        *,
        event:events(id, title, slug, date, venue:venues(name, city)),
        items:booking_items(
          *,
          ticket_type:ticket_types(name, price)
        )
      `
      )
      .eq('id', booking.id)
      .single();

    return successResponse(fullBooking, {
      message: 'Booking created successfully',
      status: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/bookings
 * Get user's bookings
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return errorResponse(ErrorCodes.UNAUTHORIZED, 'Authentication required');
    }

    // Get bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(
        `
        *,
        event:events(id, title, slug, date, image_url, venue:venues(name, city)),
        items:booking_items(
          *,
          ticket_type:ticket_types(name, price)
        )
      `
      )
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        'Failed to fetch bookings',
        { details: bookingsError.message }
      );
    }

    return successResponse(bookings);
  } catch (error) {
    return handleApiError(error);
  }
}