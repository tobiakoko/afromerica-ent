/**
 * Supabase Helper Utilities
 * Common helper functions for working with Supabase
 */

import { createClient } from "./client";
import { createClient as createServerClient } from "./server";
import type { Database } from "@/utils/supabase/types";

/**
 * Get current user session (client-side)
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return user;
}

/**
 * Get current user session (server-side)
 */
export async function getCurrentUserServer() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return user;
}

/**
 * Get user profile with role
 */
export async function getUserProfile(userId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === "admin";
}

/**
 * Check if user is admin or editor
 */
export async function canManageContent(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === "admin" || profile?.role === "editor";
}

/**
 * Sign out user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    return { url: null, error };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { url: publicUrl, error: null };
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

/**
 * Get public URL for storage file
 */
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

/**
 * Subscribe to realtime changes
 */
export function subscribeToTable<T extends keyof Database["public"]["Tables"]>(
  table: T,
  callback: (payload: any) => void
) {
  const supabase = createClient();

  const subscription = supabase
    .channel(`${table}_changes`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: table,
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Handle Supabase errors with user-friendly messages
 */
export function handleSupabaseError(error: any): string {
  if (!error) return "An unknown error occurred";

  // Auth errors
  if (error.message?.includes("Invalid login credentials")) {
    return "Invalid email or password";
  }
  if (error.message?.includes("Email not confirmed")) {
    return "Please verify your email address";
  }
  if (error.message?.includes("User already registered")) {
    return "An account with this email already exists";
  }

  // Database errors
  if (error.code === "23505") {
    return "This record already exists";
  }
  if (error.code === "23503") {
    return "Cannot delete this record as it's referenced by other data";
  }
  if (error.code === "42501") {
    return "You don't have permission to perform this action";
  }

  // Storage errors
  if (error.message?.includes("The resource already exists")) {
    return "A file with this name already exists";
  }
  if (error.message?.includes("The object exceeded the maximum allowed size")) {
    return "File size is too large";
  }

  // Default
  return error.message || "An error occurred";
}

/**
 * Batch insert records with better error handling
 */
export async function batchInsert<T extends keyof Database["public"]["Tables"]>(
  table: T,
  records: Database["public"]["Tables"][T]["Insert"][]
) {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from(table).insert(records).select();

  if (error) {
    throw new Error(handleSupabaseError(error));
  }

  return data;
}

/**
 * Paginated query helper
 */
export async function paginatedQuery<
  T extends keyof Database["public"]["Tables"]
>(
  table: T,
  page: number = 1,
  pageSize: number = 10,
  filters?: Record<string, any>
) {
  const supabase = await createServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from(table).select("*", { count: "exact" });

  // Apply filters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    throw new Error(handleSupabaseError(error));
  }

  return {
    data,
    count,
    page,
    pageSize,
    totalPages: count ? Math.ceil(count / pageSize) : 0,
  };
}
