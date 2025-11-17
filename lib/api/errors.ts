export const errors = {
  missingBaseUrl: 'NEXT_PUBLIC_BASE_URL environment variable is required',
  missingSupabaseUrl: 'NEXT_PUBLIC_SUPABASE_URL environment variable is required',
  missingSupabaseKey: 'NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required',
  missingServiceRoleKey: 'SUPABASE_SERVICE_ROLE_KEY environment variable is required',
  missingJwtSecret: 'JWT_SECRET environment variable is required',
  missingPaystackKey: 'PAYSTACK_SECRET_KEY environment variable is required',
  missingResendKey: 'RESEND_API_KEY environment variable is required',
} as const

export default errors
