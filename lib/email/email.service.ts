import { sendEmail, emailConfig } from "./resend"
import {
  bookingConfirmationTemplate,
  eventReminderTemplate,
  refundConfirmationTemplate,
  contactFormResponseTemplate,
  welcomeEmailTemplate,
  BookingEmailData,
} from "./email-templates"

/**
 * Email Service - Handles all email operations
 */
export const emailService = {
  /**
   * Send a generic email
   */
  async send(to: string, subject: string, html: string) {
    return await sendEmail({ to, subject, html })
  },

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(user: { name: string; email: string }) {
    const subject = "Welcome to Afromerica Entertainment! 🎉"
    const html = welcomeEmailTemplate(user)

    return await sendEmail({
      to: user.email,
      subject,
      html,
    })
  },

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(booking: BookingEmailData & { customerEmail: string }) {
    const subject = `Booking Confirmed - ${booking.eventTitle}`
    const html = bookingConfirmationTemplate(booking)

    return await sendEmail({
      to: booking.customerEmail,
      subject,
      html,
    })
  },

  /**
   * Send booking cancellation/refund email
   */
  async sendBookingCancellation(
    booking: BookingEmailData & {
      customerEmail: string
      refundAmount: number
      refundReason: string
    }
  ) {
    const subject = `Booking Cancelled - Refund Processed`
    const html = refundConfirmationTemplate(booking)

    return await sendEmail({
      to: booking.customerEmail,
      subject,
      html,
    })
  },

  /**
   * Send event reminder email (24 hours before event)
   */
  async sendEventReminder(booking: BookingEmailData & { customerEmail: string }) {
    const subject = `Reminder: ${booking.eventTitle} is Tomorrow! ⏰`
    const html = eventReminderTemplate(booking)

    return await sendEmail({
      to: booking.customerEmail,
      subject,
      html,
    })
  },

  /**
   * Send ticket/QR code email
   */
  async sendTickets(booking: BookingEmailData & { customerEmail: string }) {
    const subject = `Your Tickets - ${booking.eventTitle}`
    const html = bookingConfirmationTemplate(booking)

    return await sendEmail({
      to: booking.customerEmail,
      subject,
      html,
    })
  },

  /**
   * Send contact form auto-reply to customer
   */
  async sendContactFormAutoReply(data: {
    name: string
    email: string
    subject: string
  }) {
    const subject = "We've received your message"
    const html = contactFormResponseTemplate(data)

    return await sendEmail({
      to: data.email,
      subject,
      html,
    })
  },

  /**
   * Send contact form notification to admin
   */
  async sendContactFormNotification(data: {
    name: string
    email: string
    subject: string
    message: string
  }) {
    const subject = `New Contact Form: ${data.subject}`
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF6B00; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #666; margin-bottom: 5px; }
          .value { background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #FF6B00; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${data.name}</div>
            </div>
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${data.subject}</div>
            </div>
            <div class="field">
              <div class="label">Message:</div>
              <div class="value">${data.message.replace(/\n/g, "<br>")}</div>
            </div>
            <p style="margin-top: 30px; padding: 15px; background: #FFF9E6; border-radius: 4px;">
              <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    return await sendEmail({
      to: emailConfig.contactEmail,
      subject,
      html,
      replyTo: data.email,
    })
  },

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(data: {
    email: string
    name: string
    resetToken: string
  }) {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${data.resetToken}`
    const subject = "Reset Your Password"
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 15px 40px; background: #FF6B00; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .warning { background: #FFF9E6; border-left: 4px solid #FFB800; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.name},</p>
            <p style="margin-bottom: 30px;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <div class="warning">
              <p style="margin: 0; font-size: 14px;">
                This link will expire in 1 hour for security reasons. If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #FF6B00; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Afromerica Entertainment</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await sendEmail({
      to: data.email,
      subject,
      html,
    })
  },

  /**
   * Send email verification email
   */
  async sendEmailVerification(data: {
    email: string
    name: string
    verificationToken: string
  }) {
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${data.verificationToken}`
    const subject = "Verify Your Email Address"
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 15px 40px; background: #FF6B00; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Verify Your Email</h1>
          </div>
          <div class="content">
            <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.name},</p>
            <p style="margin-bottom: 30px;">
              Please verify your email address to complete your registration and access all features.
            </p>
            <div style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email Address</a>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verifyUrl}" style="color: #FF6B00; word-break: break-all;">${verifyUrl}</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Afromerica Entertainment</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await sendEmail({
      to: data.email,
      subject,
      html,
    })
  },

  /**
   * Send vote purchase confirmation email
   */
  async sendVotePurchaseConfirmation(data: {
    email: string
    name: string
    purchaseReference: string
    totalVotes: number
    totalAmount: number
    currency: string
    artists: Array<{ name: string; votes: number }>
  }) {
    const subject = `Vote Purchase Confirmed - ${data.totalVotes} Votes`
    const artistsList = data.artists
      .map(a => `<li><strong>${a.name}</strong>: ${a.votes} ${a.votes === 1 ? 'vote' : 'votes'}</li>`)
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; }
          .success-icon { font-size: 60px; text-align: center; margin: 20px 0; }
          .details-box { background: #f9f9f9; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4CAF50; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
          .detail-label { font-weight: 600; color: #666; }
          .detail-value { color: #333; }
          .artists-list { list-style: none; padding: 0; margin: 15px 0; }
          .artists-list li { padding: 12px; background: white; margin: 8px 0; border-radius: 6px; border-left: 3px solid #FF6B00; }
          .total-box { background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; }
          .total-amount { font-size: 32px; font-weight: bold; margin: 10px 0; }
          .button { display: inline-block; padding: 15px 40px; background: #FF6B00; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #1A1A1A; color: #999; padding: 30px; text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Vote Purchase Confirmed!</h1>
            <p>Thank you for supporting our artists</p>
          </div>
          <div class="content">
            <div class="success-icon">🎉</div>
            <p style="font-size: 18px; margin-bottom: 20px;">Hi ${data.name || 'there'},</p>
            <p style="margin-bottom: 30px;">
              Your vote purchase has been successfully processed! Your votes have been counted and added to the leaderboard.
            </p>

            <div class="total-box">
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Total Votes Purchased</p>
              <div class="total-amount">${data.totalVotes}</div>
              <p style="margin: 0; font-size: 16px;">${data.currency} ${data.totalAmount.toLocaleString()}</p>
            </div>

            <div class="details-box">
              <h3 style="margin-top: 0; color: #FF6B00;">Purchase Details</h3>
              <div class="detail-row">
                <span class="detail-label">Reference:</span>
                <span class="detail-value">${data.purchaseReference}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>

            <h3 style="color: #FF6B00; margin-top: 30px;">Votes Distribution</h3>
            <ul class="artists-list">
              ${artistsList}
            </ul>

            <div style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 20px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #2E7D32;">
                <strong>✓ Your votes have been counted!</strong><br>
                Check the leaderboard to see the updated rankings.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/pilot-vote" class="button">View Leaderboard</a>
            </div>

            <p style="text-align: center; color: #666; margin-top: 30px; font-size: 14px;">
              Questions about your purchase?<br>
              Contact us at <a href="mailto:support@afromerica.com" style="color: #FF6B00; text-decoration: none;">support@afromerica.com</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Afromerica Entertainment</p>
            <p style="margin-top: 10px; font-size: 12px;">This is an automated confirmation email.</p>
          </div>
        </div>
      </body>
      </html>
    `

    return await sendEmail({
      to: data.email,
      subject,
      html,
    })
  },
}
