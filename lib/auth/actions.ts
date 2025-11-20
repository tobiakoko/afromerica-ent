'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { APP_METADATA } from '@/lib/constants'

const BASE_URL = APP_METADATA.URL


// Validation helpers
function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required'
  if (!emailRegex.test(email)) return 'Invalid email format'
  return null
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
  return null
}

function validateFullName(name: string): string | null {
  if (!name || name.trim().length < 2) return 'Full name is required (at least 2 characters)'
  return null
}

/**
 * Sign up a new admin user
 * Creates both an auth user and an admin record in the database
 */
export async function signUp(formData: FormData) {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const password = formData.get('password') as string
    const fullName = (formData.get('fullName') as string)?.trim()

    // Validate inputs
    const emailError = validateEmail(email)
    if (emailError) return { error: emailError }

    const passwordError = validatePassword(password)
    if (passwordError) return { error: passwordError }

    const nameError = validateFullName(fullName)
    if (nameError) return { error: nameError }

    const supabase = await createClient()

    // Check if user already exists
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .single()

    if (existingAdmin) {
      return { error: 'An account with this email already exists' }
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${BASE_URL}/callback?next=/admin`,
      },
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Failed to create user account' }
    }

    // Create admin record using admin client (bypasses RLS)
    const adminClient = createAdminClient()
    const { error: adminError } = await adminClient
      .from('admins')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'admin',
        is_active: false, // Will be activated after email verification
      })

    if (adminError) {
      console.error('Admin record creation error:', adminError)
      // Try to clean up the auth user
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return { error: 'Failed to create admin account. Please try again.' }
    }

    return {
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
    }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Sign in an admin user
 * Checks if user exists in admins table and is active
 */
export async function signIn(formData: FormData) {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const password = formData.get('password') as string

    // Validate inputs
    const emailError = validateEmail(email)
    if (emailError) return { error: emailError }

    if (!password) return { error: 'Password is required' }

    const supabase = await createClient()

    // Attempt sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('Sign in error:', authError)

      // Provide user-friendly error messages
      if (authError.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password' }
      }
      if (authError.message.includes('Email not confirmed')) {
        return { error: 'Please verify your email before signing in' }
      }
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Sign in failed. Please try again.' }
    }

    // Check if user is an active admin
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id, is_active, full_name, role')
      .eq('id', authData.user.id)
      .single()

    if (adminError || !admin) {
      await supabase.auth.signOut()
      return { error: 'You do not have admin access to this application' }
    }

    if (!admin.is_active) {
      await supabase.auth.signOut()
      return { error: 'Your account is inactive. Please contact support.' }
    }

    // Update last login timestamp
    const adminClient = createAdminClient()
    await adminClient
      .from('admins')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id)

    revalidatePath('/', 'layout')
    redirect('/admin')
  } catch (error) {
    // Handle redirect
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Unexpected sign in error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    // Handle redirect
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Sign out error:', error)
    return { error: 'Failed to sign out. Please try again.' }
  }
}

/**
 * Request a password reset email
 */
export async function resetPassword(formData: FormData) {
  try {
    const email = (formData.get('email') as string)?.trim().toLowerCase()

    const emailError = validateEmail(email)
    if (emailError) return { error: emailError }

    const supabase = await createClient()

    // Check if admin exists
    const { data: admin } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .single()

    // Always return success to prevent email enumeration
    const successMessage = 'If an account exists with this email, you will receive a password reset link.'

    if (!admin) {
      return { success: true, message: successMessage }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${BASE_URL}/callback?next=/reset-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      // Still return success to prevent email enumeration
      return { success: true, message: successMessage }
    }

    return { success: true, message: successMessage }
  } catch (error) {
    console.error('Unexpected password reset error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Update user password (used after reset)
 */
export async function updatePassword(formData: FormData) {
  try {
    const password = formData.get('password') as string

    const passwordError = validatePassword(password)
    if (passwordError) return { error: passwordError }

    const supabase = await createClient()

    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'You must be signed in to update your password' }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      console.error('Password update error:', error)
      return { error: error.message }
    }

    return { success: true, message: 'Password updated successfully' }
  } catch (error) {
    console.error('Unexpected password update error:', error)
    return { error: 'An unexpected error occurred. Please try again.' }
  }
}

/**
 * Activate admin account after email verification
 * Called from the callback route
 */
export async function activateAdmin(userId: string) {
  try {
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('admins')
      .update({ is_active: true })
      .eq('id', userId)

    if (error) {
      console.error('Admin activation error:', error)
      return { error: 'Failed to activate account' }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected activation error:', error)
    return { error: 'Failed to activate account' }
  }
}
