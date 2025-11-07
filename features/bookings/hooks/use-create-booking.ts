"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BookingFormData } from "../types/booking.types";

export function useCreateBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createBooking = async (formData: BookingFormData, pricing: any) => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Calculate total amount
      const ticketPrice =
        formData.ticket_type === "earlyBird"
          ? pricing.earlyBird || pricing.general
          : formData.ticket_type === "vip"
          ? pricing.vip
          : pricing.general;

      const totalAmount = ticketPrice * formData.quantity;

      const bookingData = {
        event_id: formData.event_id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone || null,
        ticket_type: formData.ticket_type,
        quantity: formData.quantity,
        total_amount: totalAmount,
        currency: pricing.currency || "USD",
        notes: formData.notes || null,
        status: "pending" as const,
        payment_status: "pending" as const,
      };

      const { data, error } = await supabase
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    loading,
    error,
  };
}
