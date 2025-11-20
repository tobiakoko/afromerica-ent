import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { APP_METADATA } from '@/lib/constants';

interface TicketConfirmationEmailProps {
  bookingReference: string;
  eventTitle: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  customerName: string;
  totalAmount: number;
  ticketCount: number;
}

export const TicketConfirmationEmail = ({
  bookingReference = 'AFR-TICKET-123456',
  eventTitle = 'December Showcase 2025',
  eventDate = 'December 15, 2025 at 7:00 PM',
  venueName = 'Eko Convention Centre',
  venueAddress = 'Victoria Island, Lagos',
  customerName = 'John Doe',
  totalAmount = 10000,
  ticketCount = 2,
}: TicketConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your tickets for {eventTitle} are confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`}
              alt={APP_METADATA.NAME}
              width="150"
              height="40"
              style={logoImage}
            />
          </Section>

          {/* Header */}
          <Heading style={h1}>Ticket Confirmed! 🎉</Heading>
          
          <Text style={text}>
            Hi {customerName},
          </Text>
          
          <Text style={text}>
            Great news! Your ticket purchase has been confirmed. We're excited to see you at the event!
          </Text>

          {/* Booking Details Card */}
          <Section style={card}>
            <Heading style={h2}>Booking Details</Heading>
            
            <table style={detailsTable}>
              <tr>
                <td style={labelCell}>Booking Reference:</td>
                <td style={valueCell}>
                  <strong>{bookingReference}</strong>
                </td>
              </tr>
              <tr>
                <td style={labelCell}>Event:</td>
                <td style={valueCell}>{eventTitle}</td>
              </tr>
              <tr>
                <td style={labelCell}>Date & Time:</td>
                <td style={valueCell}>{eventDate}</td>
              </tr>
              <tr>
                <td style={labelCell}>Venue:</td>
                <td style={valueCell}>
                  {venueName}<br />
                  <span style={subtext}>{venueAddress}</span>
                </td>
              </tr>
              <tr>
                <td style={labelCell}>Tickets:</td>
                <td style={valueCell}>{ticketCount}</td>
              </tr>
              <tr>
                <td style={labelCell}>Total Paid:</td>
                <td style={valueCell}>
                  <strong>₦{totalAmount.toLocaleString()}</strong>
                </td>
              </tr>
            </table>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${bookingReference}`}>
              View Your Ticket
            </Button>
          </Section>

          {/* Important Info */}
          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Important:</strong> Please bring your booking reference or this email to the event for check-in.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            If you have any questions, please contact us at{' '}
            <a href={`mailto:${APP_METADATA.SUPPORT_EMAIL}`} style={link}>
              {APP_METADATA.SUPPORT_EMAIL}
            </a>
          </Text>
          
          <Text style={footer}>
            © {new Date().getFullYear()} {APP_METADATA.NAME}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TicketConfirmationEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const logoImage = {
  margin: '0 auto',
  display: 'block',
};

const h1 = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
  margin: '16px 0',
};

const card = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  margin: '32px 40px',
};

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const labelCell = {
  color: '#6b7280',
  fontSize: '14px',
  padding: '8px 0',
  width: '40%',
  verticalAlign: 'top' as const,
};

const valueCell = {
  color: '#1f2937',
  fontSize: '14px',
  padding: '8px 0',
  fontWeight: '500',
};

const subtext = {
  color: '#6b7280',
  fontSize: '12px',
};

const buttonSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#FF6B00',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const infoBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '16px 20px',
  margin: '32px 40px',
  borderRadius: '4px',
};

const infoText = {
  color: '#92400e',
  fontSize: '14px',
  margin: 0,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const link = {
  color: '#FF6B00',
  textDecoration: 'underline',
};