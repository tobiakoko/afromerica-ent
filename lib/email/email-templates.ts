// lib/email-templates.ts

// Welcome Email Template for New Users
export function welcomeEmailTemplate(data: { name: string; email: string }): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Afromerica</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 50px 30px; text-align: center; }
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    .content { padding: 40px 30px; }
    .welcome-icon { font-size: 80px; text-align: center; margin: 20px 0; }
    .cta-button { display: inline-block; padding: 15px 40px; background: #FF6B00; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 5px; }
    .features { display: grid; gap: 20px; margin: 30px 0; }
    .feature { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #FF6B00; }
    .feature h3 { color: #FF6B00; margin-bottom: 10px; }
    .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
    .footer a { color: #FF6B00; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Afromerica!</h1>
      <p>Your journey into African entertainment begins here</p>
    </div>

    <div class="content">
      <div class="welcome-icon">👋</div>

      <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.name},</p>
      <p style="margin-bottom: 30px;">
        Thank you for joining Afromerica Entertainment! We're thrilled to have you as part of our community.
        Get ready to experience the best of African music, culture, and entertainment.
      </p>

      <div class="features">
        <div class="feature">
          <h3>🎫 Book Events</h3>
          <p>Browse and book tickets to exclusive events featuring top African artists and performers.</p>
        </div>

        <div class="feature">
          <h3>🎵 Discover Artists</h3>
          <p>Explore our roster of talented artists and stay updated on their latest releases and performances.</p>
        </div>

        <div class="feature">
          <h3>🎪 Exclusive Access</h3>
          <p>Get early access to ticket sales, special discounts, and VIP experiences.</p>
        </div>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/events" class="cta-button">
          Browse Upcoming Events
        </a>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/artists" class="cta-button" style="background: #333;">
          Discover Artists
        </a>
      </div>

      <div style="background: #FFF5E6; border-left: 4px solid #FFB800; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <h3 style="color: #FF6B00; margin-bottom: 10px;">💡 Getting Started</h3>
        <ul style="padding-left: 20px;">
          <li>Complete your profile to personalize your experience</li>
          <li>Subscribe to our newsletter for exclusive updates</li>
          <li>Follow us on social media for behind-the-scenes content</li>
        </ul>
      </div>

      <p style="text-align: center; color: #666; margin-top: 30px;">
        Questions? We're here to help!<br>
        Contact us at <a href="mailto:support@afromerica.com" style="color: #FF6B00; text-decoration: none;">support@afromerica.com</a>
      </p>
    </div>

    <div class="footer">
      <p style="margin-bottom: 10px;">
        <strong style="color: #FF6B00;">Afromerica Entertainment</strong>
      </p>
      <p style="margin-bottom: 15px;">Celebrating African Music & Culture</p>

      <div style="margin: 20px 0;">
        <a href="https://instagram.com/afromerica">Instagram</a> •
        <a href="https://twitter.com/afromerica">Twitter</a> •
        <a href="https://facebook.com/afromerica">Facebook</a>
      </div>

      <p style="font-size: 12px; margin-top: 20px;">
        © ${new Date().getFullYear()} Afromerica Entertainment. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export interface BookingEmailData {
  bookingReference: string
  customerName: string
  eventTitle: string
  eventDate: string
  eventTime: string
  location: string
  ticketType: string
  quantity: number
  totalAmount: number
  venue?: {
    name: string
    address: string
  }
}

// Booking Confirmation Email Template
export function bookingConfirmationTemplate(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 10px; }
    .header p { font-size: 16px; opacity: 0.9; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
    .success-icon { width: 80px; height: 80px; background: #10B981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px; color: white; }
    .ticket-container { background: #f9f9f9; border: 2px dashed #FF6B00; border-radius: 12px; padding: 30px; margin: 30px 0; }
    .ticket-header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
    .ticket-header h2 { color: #FF6B00; font-size: 24px; margin-bottom: 10px; }
    .booking-ref { font-size: 20px; font-weight: bold; color: #333; letter-spacing: 1px; font-family: 'Courier New', monospace; }
    .ticket-details { margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
    .detail-label { color: #666; font-weight: 500; }
    .detail-value { color: #333; font-weight: 600; text-align: right; }
    .total-row { background: #FFF5E6; padding: 15px; margin-top: 15px; border-radius: 8px; }
    .total-row .detail-label { color: #FF6B00; font-size: 16px; }
    .total-row .detail-value { color: #FF6B00; font-size: 20px; }
    .qr-section { text-align: center; padding: 30px 0; background: white; border-radius: 8px; margin: 20px 0; }
    .qr-code { width: 200px; height: 200px; margin: 0 auto; background: #f0f0f0; border: 3px solid #FF6B00; }
    .important-info { background: #FFF9E6; border-left: 4px solid #FFB800; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .important-info h3 { color: #FF6B00; font-size: 16px; margin-bottom: 10px; }
    .important-info ul { list-style: none; padding-left: 0; }
    .important-info li { padding: 5px 0; padding-left: 20px; position: relative; }
    .important-info li:before { content: "✓"; position: absolute; left: 0; color: #10B981; font-weight: bold; }
    .btn { display: inline-block; padding: 15px 40px; background: #FF6B00; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
    .btn:hover { background: #FF5500; }
    .btn-secondary { background: #333; }
    .btn-secondary:hover { background: #222; }
    .actions { text-align: center; margin: 30px 0; }
    .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
    .footer a { color: #FF6B00; text-decoration: none; }
    .social-links { margin: 20px 0; }
    .social-links a { display: inline-block; margin: 0 10px; color: #FF6B00; }
    @media only screen and (max-width: 600px) {
      .content { padding: 20px 15px; }
      .ticket-container { padding: 20px 15px; }
      .btn { display: block; margin: 10px 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🎉 Booking Confirmed!</h1>
      <p>Your tickets are ready</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <!-- Success Icon -->
      <div class="success-icon">✓</div>
      
      <!-- Greeting -->
      <p class="greeting">Hi ${data.customerName},</p>
      <p style="margin-bottom: 20px;">Great news! Your booking has been confirmed. We're excited to see you at the event!</p>

      <!-- Ticket Container -->
      <div class="ticket-container">
        <div class="ticket-header">
          <h2>🎫 Your Ticket</h2>
          <div class="booking-ref">${data.bookingReference}</div>
        </div>

        <div class="ticket-details">
          <div class="detail-row">
            <span class="detail-label">Event</span>
            <span class="detail-value">${data.eventTitle}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date</span>
            <span class="detail-value">${new Date(data.eventDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Time</span>
            <span class="detail-value">${data.eventTime}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location</span>
            <span class="detail-value">${data.location}</span>
          </div>
          ${data.venue ? `
          <div class="detail-row">
            <span class="detail-label">Venue</span>
            <span class="detail-value">${data.venue.name}</span>
          </div>
          ` : ''}
          <div class="detail-row">
            <span class="detail-label">Ticket Type</span>
            <span class="detail-value">${data.ticketType}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Quantity</span>
            <span class="detail-value">${data.quantity} ticket(s)</span>
          </div>
          <div class="total-row">
            <div class="detail-row" style="border: none; padding: 0;">
              <span class="detail-label">Total Paid</span>
              <span class="detail-value">₦${data.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <!-- QR Code Section -->
        <div class="qr-section">
          <p style="color: #666; margin-bottom: 15px;">Show this QR code at the entrance</p>
          <div class="qr-code">
            <!-- QR code will be generated here -->
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/api/qr/${data.bookingReference}" alt="QR Code" style="width: 100%; height: 100%;" />
          </div>
        </div>
      </div>

      <!-- Important Information -->
      <div class="important-info">
        <h3>📋 Important Information</h3>
        <ul>
          <li>Please arrive at least 30 minutes before the event starts</li>
          <li>Bring a valid ID for verification</li>
          <li>This ticket is valid for ${data.quantity} person(s)</li>
          <li>Screenshots of this email are accepted</li>
          <li>Contact us if you need to make changes</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/booking/${data.bookingReference}" class="btn">
          View Booking Details
        </a>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/booking/${data.bookingReference}/download" class="btn btn-secondary">
          Download Ticket (PDF)
        </a>
      </div>

      <!-- Additional Info -->
      <p style="text-align: center; color: #666; margin-top: 30px;">
        Need help? Contact us at 
        <a href="mailto:support@afromerica.com" style="color: #FF6B00; text-decoration: none;">support@afromerica.com</a>
        or call +234 800 000 0000
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin-bottom: 10px;">
        <strong style="color: #FF6B00;">Afromerica Entertainment</strong>
      </p>
      <p style="margin-bottom: 15px;">Celebrating African Music & Culture</p>
      
      <div class="social-links">
        <a href="https://instagram.com/afromerica">Instagram</a> •
        <a href="https://twitter.com/afromerica">Twitter</a> •
        <a href="https://facebook.com/afromerica">Facebook</a>
      </div>
      
      <p style="font-size: 12px; margin-top: 20px;">
        123 Music Street, Lagos, Nigeria<br>
        © ${new Date().getFullYear()} Afromerica Entertainment. All rights reserved.
      </p>
      
      <p style="font-size: 12px; margin-top: 15px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms">Terms of Service</a> •
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Booking Reminder Email (24 hours before event)
export function eventReminderTemplate(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Reminder</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .countdown { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0; }
    .countdown h2 { font-size: 48px; margin-bottom: 10px; }
    .btn { display: inline-block; padding: 15px 40px; background: #FF6B00; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
    .checklist { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .checklist li { padding: 10px 0; padding-left: 30px; position: relative; }
    .checklist li:before { content: "□"; position: absolute; left: 0; font-size: 20px; color: #FF6B00; }
    .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Event Tomorrow!</h1>
      <p>Don't forget about your upcoming event</p>
    </div>

    <div class="content">
      <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.customerName},</p>
      <p style="margin-bottom: 30px;">This is a friendly reminder that your event is happening tomorrow!</p>

      <div class="countdown">
        <h2>24 Hours</h2>
        <p style="font-size: 18px;">Until ${data.eventTitle}</p>
      </div>

      <div style="background: #FFF9E6; border-left: 4px solid #FF6B00; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: #FF6B00; margin-bottom: 10px;">📅 Event Details</h3>
        <p><strong>Date:</strong> ${new Date(data.eventDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${data.eventTime}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Tickets:</strong> ${data.quantity} x ${data.ticketType}</p>
      </div>

      <div class="checklist">
        <h3 style="margin-bottom: 15px;">✓ Pre-Event Checklist</h3>
        <ul style="list-style: none;">
          <li>Check your email for your ticket</li>
          <li>Arrive 30 minutes early</li>
          <li>Bring a valid ID</li>
          <li>Charge your phone for the QR code</li>
          <li>Check the weather and dress accordingly</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/booking/${data.bookingReference}" class="btn">
          View Your Ticket
        </a>
      </div>

      <p style="text-align: center; color: #666; margin-top: 30px;">
        See you tomorrow! 🎉
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Afromerica Entertainment</p>
      <p style="margin-top: 10px;">
        Questions? Contact us at <a href="mailto:support@afromerica.com" style="color: #FF6B00;">support@afromerica.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Refund Confirmation Email
export function refundConfirmationTemplate(data: BookingEmailData & { refundAmount: number; refundReason: string }): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Refund Confirmation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .refund-box { background: #F0FDF4; border: 2px solid #10B981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .refund-amount { font-size: 36px; font-weight: bold; color: #10B981; }
    .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Refund Processed</h1>
      <p>Your refund has been initiated</p>
    </div>

    <div class="content">
      <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.customerName},</p>
      <p style="margin-bottom: 30px;">We've processed your refund request for booking <strong>${data.bookingReference}</strong>.</p>

      <div class="refund-box">
        <p style="color: #666; margin-bottom: 10px;">Refund Amount</p>
        <div class="refund-amount">₦${data.refundAmount.toLocaleString()}</div>
        <p style="color: #666; margin-top: 10px; font-size: 14px;">Processing time: 5-10 business days</p>
      </div>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-bottom: 15px;">Booking Details</h3>
        <p><strong>Event:</strong> ${data.eventTitle}</p>
        <p><strong>Original Amount:</strong> ₦${data.totalAmount.toLocaleString()}</p>
        <p><strong>Reason:</strong> ${data.refundReason}</p>
      </div>

      <div style="background: #FFF9E6; border-left: 4px solid #FFB800; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="font-size: 14px; color: #666;">
          The refund will be credited back to your original payment method within 5-10 business days. 
          You'll receive a notification once the refund is complete.
        </p>
      </div>

      <p style="text-align: center; color: #666; margin-top: 30px;">
        Need help? Contact us at <a href="mailto:support@afromerica.com" style="color: #FF6B00;">support@afromerica.com</a>
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Afromerica Entertainment</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Contact Form Response Email
export function contactFormResponseTemplate(data: { name: string; email: string; subject: string }): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Received Your Message</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 40px 30px; text-align: center; }
    .content { padding: 40px 30px; }
    .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✉️ Message Received</h1>
      <p>We'll get back to you soon</p>
    </div>

    <div class="content">
      <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.name},</p>
      <p style="margin-bottom: 30px;">
        Thank you for reaching out to Afromerica Entertainment. We've received your message regarding 
        "<strong>${data.subject}</strong>" and our team will respond within 24 hours.
      </p>

      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="color: #666; font-size: 14px;">
          In the meantime, feel free to:
        </p>
        <ul style="margin-top: 10px; padding-left: 20px;">
          <li>Browse our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/events" style="color: #FF6B00;">upcoming events</a></li>
          <li>Check out our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/artists" style="color: #FF6B00;">featured artists</a></li>
          <li>Read our <a href="${process.env.NEXT_PUBLIC_BASE_URL}/faq" style="color: #FF6B00;">FAQ</a></li>
        </ul>
      </div>

      <p style="text-align: center; color: #666; margin-top: 30px;">
        Best regards,<br>
        <strong>The Afromerica Team</strong>
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} Afromerica Entertainment</p>
    </div>
  </div>
</body>
</html>
  `;
}