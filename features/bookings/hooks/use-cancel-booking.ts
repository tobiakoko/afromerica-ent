"use client";
 
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
 
export function useCancelBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
 
  const cancelBooking = async (bookingId: string) => {
    setLoading(true);
    setError(null);
 
    try {
      const supabase = createClient();
 
      const { data, error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
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
    cancelBooking,
    loading,
    error,
  };
}