import { NextRequest } from "next/server"
import { z } from "zod"
import { emailService } from "@/lib/email/email.service"
import { successResponse, handleApiError } from "@/lib/api/response"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

/**
 * POST /api/contact
 * Handle contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validatedData = contactFormSchema.parse(body)

    // Send notification to admin (don't block on this)
    const adminEmailPromise = emailService.sendContactFormNotification({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
    })

    // Send auto-reply to customer (don't block on this)
    const autoReplyPromise = emailService.sendContactFormAutoReply({
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
    })

    // Wait for both emails to be sent
    const [adminResult, autoReplyResult] = await Promise.allSettled([
      adminEmailPromise,
      autoReplyPromise,
    ])

    // Log any errors but don't fail the request
    if (adminResult.status === "rejected") {
      console.error("Failed to send admin notification:", adminResult.reason)
    }

    if (autoReplyResult.status === "rejected") {
      console.error("Failed to send auto-reply:", autoReplyResult.reason)
    }

    return successResponse(
      null,
      { message: "Message sent successfully. We'll get back to you soon!" }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
