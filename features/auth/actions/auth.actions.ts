"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SignUpFormData, SignInFormData } from "../types/auth.types";

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(formData: SignUpFormData): Promise<AuthResponse> {
  try {
    const supabase = await createClient();
    const { email, password, full_name } = formData;

    // Validate input
    if (!email || !password || !full_name) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
        // Use the email confirmation route with token_hash pattern (recommended by Supabase)
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        error: error.message || "Failed to create account",
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Failed to create account",
      };
    }

    // Create profile entry
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email!,
      full_name,
      role: "user",
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Continue even if profile creation fails, as the user is already created
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        user: data.user,
        needsEmailConfirmation: !data.session, // If no session, email confirmation is required
      },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Sign in a user with email and password
 */
export async function signIn(formData: SignInFormData): Promise<AuthResponse> {
  try {
    const supabase = await createClient();
    const { email, password } = formData;

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        error: "Please fill in all fields",
      };
    }

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Verify the user with getUser() for security (best practice)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "Authentication failed",
      };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<AuthResponse> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return {
        success: false,
        error: "Failed to sign out",
      };
    }

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const supabase = await createClient();

    if (!email) {
      return {
        success: false,
        error: "Please provide an email address",
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm?next=/auth/reset-password/confirm`,
    });

    if (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        error: error.message || "Failed to send reset email",
      };
    }

    return {
      success: true,
      data: {
        message: "Password reset email sent. Please check your inbox.",
      },
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Update user password (after reset)
 */
export async function updatePassword(
  newPassword: string
): Promise<AuthResponse> {
  try {
    const supabase = await createClient();

    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Password update error:", error);
      return {
        success: false,
        error: error.message || "Failed to update password",
      };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      data: {
        message: "Password updated successfully",
      },
    };
  } catch (error) {
    console.error("Password update error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Sign in with OAuth provider (Google, etc.)
 */
export async function signInWithOAuth(
  provider: "google" | "github"
): Promise<AuthResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("OAuth sign in error:", error);
      return {
        success: false,
        error: error.message || "Failed to sign in with OAuth",
      };
    }

    if (data.url) {
      redirect(data.url);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("OAuth sign in error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
