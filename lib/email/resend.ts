import { Resend } from "resend"

// Initialize Resend client
const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.warn("RESEND_API_KEY is not set. Email functionality will be disabled.")
}

export const resend = new Resend(resendApiKey)

// Default email configuration
export const emailConfig = {
  from: process.env.RESEND_FROM_EMAIL || "Afromerica Entertainment <noreply@afromerica.com>",
  supportEmail: process.env.RESEND_SUPPORT_EMAIL || "support@afromerica.com",
  contactEmail: process.env.RESEND_CONTACT_EMAIL || "info@afromerica.com",
}

/**
 * Send a single email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = emailConfig.from,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}) {
  try {
    if (!resendApiKey) {
      console.log("Email sending skipped (no API key):", { to, subject })
      return { success: false, error: "RESEND_API_KEY not configured" }
    }

    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    })

    console.log("Email sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}

/**
 * Send bulk emails using Resend batch API
 */
export async function sendBulkEmails(
  emails: Array<{
    to: string | string[]
    subject: string
    html: string
    from?: string
    replyTo?: string
  }>
) {
  try {
    if (!resendApiKey) {
      console.log("Bulk email sending skipped (no API key)")
      return { success: false, error: "RESEND_API_KEY not configured" }
    }

    const emailsWithDefaults = emails.map((email) => ({
      ...email,
      from: email.from || emailConfig.from,
    }))

    const data = await resend.batch.send(emailsWithDefaults)

    console.log("Bulk emails sent successfully:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Failed to send bulk emails:", error)
    return { success: false, error }
  }
}
