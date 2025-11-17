import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VoteConfirmationEmailProps {
  artistName: string;
  votes: number;
  amount: number;
  reference: string;
  customerEmail: string;
}

export const VoteConfirmationEmail = ({
  artistName = 'Artist Name',
  votes = 50,
  amount = 1800,
  reference = 'AFR-VOTE-123456',
  customerEmail = 'voter@example.com',
}: VoteConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Thank you for voting for {artistName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Heading style={logo}>Afromerica Entertainment</Heading>
          </Section>

          {/* Header */}
          <Heading style={h1}>Your Vote Counts! 🎤</Heading>
          
          <Text style={text}>
            Thank you for supporting {artistName}!
          </Text>
          
          <Text style={text}>
            Your vote has been successfully recorded. You're helping to shape the future of African music!
          </Text>

          {/* Vote Details Card */}
          <Section style={card}>
            <Heading style={h2}>Vote Details</Heading>
            
            <table style={detailsTable}>
              <tr>
                <td style={labelCell}>Reference:</td>
                <td style={valueCell}>
                  <strong>{reference}</strong>
                </td>
              </tr>
              <tr>
                <td style={labelCell}>Artist:</td>
                <td style={valueCell}>{artistName}</td>
              </tr>
              <tr>
                <td style={labelCell}>Votes Cast:</td>
                <td style={valueCell}>
                  <strong style={votesHighlight}>{votes} votes</strong>
                </td>
              </tr>
              <tr>
                <td style={labelCell}>Amount Paid:</td>
                <td style={valueCell}>₦{amount.toLocaleString()}</td>
              </tr>
            </table>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_BASE_URL}/events/december-showcase-2025/leaderboard`}>
              View Leaderboard
            </Button>
          </Section>

          {/* Share Section */}
          <Section style={shareBox}>
            <Text style={shareText}>
              🌟 <strong>Spread the word!</strong> Share with friends and family to get more votes for {artistName}.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            Questions? Contact us at{' '}
            <a href="mailto:votes@afromerica.com" style={link}>
              votes@afromerica.com
            </a>
          </Text>
          
          <Text style={footer}>
            © {new Date().getFullYear()} Afromerica Entertainment. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VoteConfirmationEmail;

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

const logo = {
  color: '#FF6B00',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
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
};

const valueCell = {
  color: '#1f2937',
  fontSize: '14px',
  padding: '8px 0',
  fontWeight: '500',
};

const votesHighlight = {
  color: '#FF6B00',
  fontSize: '16px',
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

const shareBox = {
  backgroundColor: '#eff6ff',
  borderLeft: '4px solid #3b82f6',
  padding: '16px 20px',
  margin: '32px 40px',
  borderRadius: '4px',
};

const shareText = {
  color: '#1e40af',
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