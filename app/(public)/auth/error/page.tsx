"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "You do not have permission to sign in."
      case "Verification":
        return "The verification token has expired or has already been used."
      case "OAuthSignin":
        return "Error in constructing an authorization URL."
      case "OAuthCallback":
        return "Error in handling the response from the OAuth provider."
      case "OAuthCreateAccount":
        return "Could not create OAuth provider user in the database."
      case "EmailCreateAccount":
        return "Could not create email provider user in the database."
      case "Callback":
        return "Error in the OAuth callback handler route."
      case "OAuthAccountNotLinked":
        return "Email already in use with different provider."
      case "EmailSignin":
        return "Could not send the email with the verification token."
      case "CredentialsSignin":
        return "Sign in failed. Check the details you provided are correct."
      case "SessionRequired":
        return "Please sign in to access this page."
      case "auth_callback_error":
        return "There was an error processing the authentication callback."
      case "invalid_credentials":
        return "Invalid email or password. Please try again."
      case "user_already_exists":
        return "An account with this email already exists."
      case "email_not_confirmed":
        return "Please confirm your email before signing in."
      case "password_reset_required":
        return "Password reset is required. Please check your email."
      case "unauthorized":
        return "You are not authorized to access this resource."
      default:
        return "An unexpected error occurred. Please try again."
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-4">
            Authentication Error
          </h1>

          <p className="text-gray-400 text-center mb-8">
            {getErrorMessage(error)}
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center"
            >
              Back to Sign In
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
