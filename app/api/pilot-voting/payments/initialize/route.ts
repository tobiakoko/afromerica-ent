import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api/response';
import { ErrorCodes } from '@/lib/api/types';
import { pilotVoteInitSchema } from '@/lib/validations/schemas';
import {
  initializePayment,
  generatePaymentReference,
} from '@/lib/payments/paystack';
import type { Database } from '@/utils/supabase/types';

/**
 * POST /api/pilot-voting/payment/initialize
 * Initialize payment for pilot event votes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Validate request
    const validatedData = pilotVoteInitSchema.parse(body);

    // Check if voting is active
    const { data: settings } = await supabase
      .from('pilot_voting_settings')
      .select('*')
      .eq('is_active', true)
      .single() as { data: Database['public']['Tables']['pilot_voting_settings']['Row'] | null; error: any };

    if (!settings) {
      return errorResponse(
        ErrorCodes.VOTING_CLOSED,
        'Voting is not currently active'
      );
    }

    const now = new Date();
    const startDate = new Date(settings.voting_start_date);
    const endDate = new Date(settings.voting_end_date);

    if (now < startDate || now > endDate) {
      return errorResponse(
        ErrorCodes.VOTING_CLOSED,
        'Voting period has not started or has ended'
      );
    }

    // Fetch vote packages and artists
    const packageIds = validatedData.items.map((item) => item.package_id);
    const artistIds = validatedData.items.map((item) => item.artist_id);

    const { data: packages, error: packagesError } = await supabase
      .from('vote_packages')
      .select('*')
      .in('id', packageIds)
      .eq('active', true) as { data: Database['public']['Tables']['vote_packages']['Row'][] | null; error: any };

    const { data: artists, error: artistsError } = await supabase
      .from('pilot_artists')
      .select('id, stage_name')
      .in('id', artistIds) as { data: Array<Pick<Database['public']['Tables']['pilot_artists']['Row'], 'id' | 'stage_name'>> | null; error: any };

    if (packagesError || artistsError || !packages || !artists) {
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        'Failed to fetch vote packages or artists',
        { details: packagesError?.message || artistsError?.message }
      );
    }

    // Calculate total votes and amount
    let totalVotes = 0;
    let totalAmount = 0;
    const itemsSnapshot = [];

    for (const item of validatedData.items) {
      const pkg = packages.find((p) => p.id === item.package_id);
      const artist = artists.find((a) => a.id === item.artist_id);

      if (!pkg || !artist) {
        return errorResponse(
          ErrorCodes.NOT_FOUND,
          'Invalid package or artist ID'
        );
      }

      const itemVotes = pkg.votes * item.quantity;
      const itemAmount = pkg.price * item.quantity;

      totalVotes += itemVotes;
      totalAmount += itemAmount;

      itemsSnapshot.push({
        artist_id: artist.id,
        artist_name: artist.stage_name,
        package_id: pkg.id,
        package_name: pkg.name,
        votes: pkg.votes,
        price: pkg.price,
        quantity: item.quantity,
        total_votes: itemVotes,
        total_amount: itemAmount,
      });
    }

    // Get user ID if authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Generate payment reference
    const paymentReference = generatePaymentReference('VOTE');

    // Create vote purchase record
    const purchaseInsert: Database['public']['Tables']['vote_purchases']['Insert'] = {
      reference: paymentReference,
      email: validatedData.email,
      user_id: session?.user.id || null,
      total_votes: totalVotes,
      total_amount: totalAmount,
      currency: 'NGN',
      items: itemsSnapshot as any,
      payment_status: 'pending' as const,
      metadata: validatedData.metadata as any,
    };

    const { data: purchase, error: purchaseError } = (await supabase
      .from('vote_purchases')
      .insert(purchaseInsert as any)
      .select()
      .single()) as { data: Database['public']['Tables']['vote_purchases']['Row'] | null; error: any };

    if (purchaseError || !purchase) {
      return errorResponse(
        ErrorCodes.DATABASE_ERROR,
        'Failed to create vote purchase',
        { details: purchaseError?.message }
      );
    }

    // Initialize Paystack payment
    const paystackResponse = await initializePayment(
      {
        email: validatedData.email,
        amount: totalAmount,
        reference: paymentReference,
        metadata: {
          vote_purchase_id: purchase.id,
          purchase_reference: purchase.reference,
          total_votes: totalVotes,
          items: itemsSnapshot,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/pilot-vote/success`,
      },
      process.env.PAYSTACK_SECRET_KEY!
    );

    if (!paystackResponse.status) {
      // Rollback: delete purchase if payment initialization fails
      await supabase.from('vote_purchases').delete().eq('id', purchase.id);

      return errorResponse(
        ErrorCodes.EXTERNAL_SERVICE_ERROR,
        'Failed to initialize payment',
        { details: paystackResponse.message }
      );
    }

    // Update purchase with Paystack reference
    await (supabase
      .from('vote_purchases') as any)
      .update({
        paystack_reference: paystackResponse.data.reference,
      })
      .eq('id', purchase.id);

    return successResponse({
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
      purchase_reference: purchase.reference,
      total_votes: totalVotes,
      total_amount: totalAmount,
    });
  } catch (error) {
    return handleApiError(error);
  }
}