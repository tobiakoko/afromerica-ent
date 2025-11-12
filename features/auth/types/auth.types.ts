import type { Database } from "@/utils/supabase/types";
import type { User, Session } from "@supabase/supabase-js";
 
// Re-export Supabase auth types
export type { User, Session };
 
// Profile types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
 
export type UserRole = "user" | "artist" | "admin";
 
// Auth form data
export interface SignUpFormData {
  email: string;
  password: string;
  full_name: string;
}
 
export interface SignInFormData {
  email: string;
  password: string;
}
 
export interface UpdateProfileFormData {
  full_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
}
 
// Auth state
export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
}