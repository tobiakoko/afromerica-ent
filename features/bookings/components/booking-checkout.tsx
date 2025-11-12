"use client";
 
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { generatePaymentReference } from "@/lib/payments/paystack";
import type { PaymentInitializeRequest } from "@/lib/payments/types";
 
interface BookingCheckoutProps {
  eventId: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}
 
export function BookingCheckout({
  eventId,
  eventTitle,
  ticketType,
  quantity,
  totalAmount,
  currency = "USD",
  onSuccess,
  onError,
}: BookingCheckoutProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
 
  const handleCheckout = async () => {
    setError("");
 
    // Validate fields
    if (!customerName) {
      setError("Please enter your name");
      return;
    }
 
    if (!customerEmail) {
      setError("Please enter your email address");
      return;
    }
 
    if (totalAmount <= 0) {
      setError("Invalid amount");
      return;
    }
 
    setProcessing(true);
 
    try {
      const supabase = createClient();
 
      // Generate payment reference
      const reference = generatePaymentReference("BOOK");
 
      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          event_id: eventId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || null,
          ticket_type: ticketType,
          quantity,
          total_amount: totalAmount,
          currency,
          status: "pending",
          payment_status: "pending",
          payment_reference: reference,
        })
        .select()
        .single();
 
      if (bookingError) {
        throw new Error("Failed to create booking record");
      }
 
      // Initialize payment with Paystack
      const paymentPayload: PaymentInitializeRequest = {
        email: customerEmail,
        amount: totalAmount,
        currency,
        type: "booking",
        metadata: {
          type: "booking",
          email: customerEmail,
          bookingId: booking.id,
          eventId,
          eventTitle,
          ticketType,
          quantity,
          customerName,
          description: `Ticket purchase for ${eventTitle}`,
        },
      };
 
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      });
 
      const result = await response.json();
 
      if (!result.success) {
        throw new Error(result.message || "Failed to initialize payment");
      }
 
      // Redirect to Paystack payment page
      window.location.href = result.data.authorizationUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred during checkout";
      setError(errorMessage);
      setProcessing(false);
      onError?.(errorMessage);
    }
  };
 
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Booking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking Summary */}
        <div className="space-y-2 p-4 bg-accent rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Event</span>
            <span className="text-sm font-medium">{eventTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Ticket Type</span>
            <span className="text-sm font-medium">{ticketType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Quantity</span>
            <span className="text-sm font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Total</span>
            <span>
              {currency} {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
 
        {/* Customer Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
 
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
 
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>
 
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}
 
        <Alert>
          <AlertDescription className="text-xs">
            Your booking will be confirmed immediately after successful payment.
            A confirmation email will be sent to your email address.
          </AlertDescription>
        </Alert>
 
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={processing || !customerName || !customerEmail}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {processing ? "Processing..." : `Pay ${currency} ${totalAmount.toFixed(2)}`}
        </Button>
      </CardContent>
    </Card>
  );
}