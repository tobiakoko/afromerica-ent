import {
  Body,
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

interface OTPEmailProps {
  otp: string;
  expiresInMinutes?: number;
}

export const OTPEmail = ({
  otp = '123456',
  expiresInMinutes = 10,
}: OTPEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your verification code is {otp}</Preview>
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
          <Heading style={h1}>Verification Code</Heading>
          
          <Text style={text}>
            You requested a verification code to vote for your favorite artist. Use the code below to continue:
          </Text>

          {/* OTP Box */}
          <Section style={otpBox}>
            <Text style={otpCode}>{otp}</Text>
          </Section>

          <Text style={text}>
            This code will expire in <strong>{expiresInMinutes} minutes</strong>.
          </Text>

          {/* Warning */}
          <Section style={warningBox}>
            <Text style={warningText}>
              <strong>⚠️ Security Notice:</strong> Never share this code with anyone. {APP_METADATA.SHORT_NAME} staff will never ask for your verification code.
            </Text>
          </Section>

          <Text style={text}>
            If you didn&apos;t request this code, you can safely ignore this email.
          </Text>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            © {new Date().getFullYear()} {APP_METADATA.NAME}. All rights reserved.
          </Text>
          
          <Text style={footer}>
            Celebrating African Music & Culture
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OTPEmail;

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

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const otpBox = {
  backgroundColor: '#f3f4f6',
  border: '2px dashed #e5e7eb',
  borderRadius: '8px',
  padding: '32px',
  margin: '32px 40px',
  textAlign: 'center' as const,
};

const otpCode = {
  fontSize: '48px',
  fontWeight: 'bold',
  letterSpacing: '12px',
  color: '#1f2937',
  margin: '0',
  fontFamily: 'monospace',
};

const warningBox = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '16px 20px',
  margin: '32px 40px',
  borderRadius: '4px',
};

const warningText = {
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
