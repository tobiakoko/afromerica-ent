import type { Database } from "@/lib/supabase/types";

// Re-export Supabase types
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

// Extended types for UI
export interface BookingWithEvent extends Booking {
  event?: {
    id: string;
    title: string;
    slug: string;
    date: string;
    start_time: string;
    venue: string;
    city: string;
    state: string;
    image_url: string | null;
  };
}

export interface BookingFormData {
  event_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  ticket_type: "earlyBird" | "general" | "vip";
  quantity: number;
  notes?: string;
}

export interface TicketType {
  id: "earlyBird" | "general" | "vip";
  label: string;
  price: number;
  available: boolean;
  description?: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";
export type PaymentStatus = "pending" | "completed" | "failed";
