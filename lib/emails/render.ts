import { render } from '@react-email/render';
import { getResend } from '@/lib/resend/client';
import TicketConfirmationEmail from '@/lib/resend/templates/ticket-confirmation';
import VoteConfirmationEmail from '@/lib/resend/templates/vote-confirmation';
import OTPEmail from '@/lib/resend/templates/otp-email';

// FIXME: Add error handling
// FIXME: Hardcoded email domains should be in env vars

export async function sendTicketConfirmation(data: {
  to: string;
  booking: any;
}) {
  const emailHtml = await render(
    TicketConfirmationEmail({
      bookingReference: data.booking.booking_reference,
      eventTitle: data.booking.event?.title || 'Event',
      eventDate: new Date(data.booking.event?.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }),
      venueName: data.booking.venue?.name || 'Venue',
      venueAddress: `${data.booking.venue?.address}, ${data.booking.venue?.city}`,
      customerName: data.booking.full_name,
      totalAmount: data.booking.total_amount,
      ticketCount: data.booking.quantity || 1,
    })
  );

  return getResend().emails.send({
    from: 'Afromerica Tickets <support@afromericaent.com>',
    to: data.to,
    subject: `Ticket Confirmed: ${data.booking.event?.title}`,
    html: emailHtml,
  });
}

export async function sendVoteConfirmation(data: {
  to: string;
  artistName: string;
  votes: number;
  amount: number;
  reference?: string;
}) {
  const emailHtml = await render(
    VoteConfirmationEmail({
      artistName: data.artistName,
      votes: data.votes,
      amount: data.amount,
      reference: data.reference || 'N/A',
      customerEmail: data.to,
    })
  );

  return getResend().emails.send({
    from: 'Afromerica Votes <support@afromericaent.com>',
    to: data.to,
    subject: `Vote Confirmed for ${data.artistName}!`,
    html: emailHtml,
  });
}

export async function sendOTP(data: {
  to: string;
  otp: string;
  expiresInMinutes?: number;
}) {
  const emailHtml = await render(
    OTPEmail({
      otp: data.otp,
      expiresInMinutes: data.expiresInMinutes || 10,
    })
  );

  return getResend().emails.send({
    from: 'Afromerica <support@afromericaent.com>',
    to: data.to,
    subject: `Your verification code: ${data.otp}`,
    html: emailHtml,
  });
}