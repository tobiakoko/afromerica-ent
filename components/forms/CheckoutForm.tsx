"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import type { PublicEvent } from "@/lib/validations/event";
import { formatCurrency } from "@/lib/constants";

interface CheckoutFormProps {
  event: PublicEvent;
}

export function CheckoutForm({ event }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    fullName: '',
    email: '',
    phone: '',
  });

  const ticketPrice = event.ticket_price || 0;
  const maxQuantity = Math.min(event.tickets_available, 10); // Limit to 10 tickets per purchase
  const totalAmount = ticketPrice * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate ticket availability
    if (formData.quantity > event.tickets_available) {
      toast.error(`Only ${event.tickets_available} tickets available`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ticket',
          eventId: event.id,
          eventSlug: event.slug,
          quantity: formData.quantity,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          amount: totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Event Summary */}
      <Card className="p-6 bg-muted/50">
        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {new Date(event.event_date).toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">{formatCurrency(ticketPrice)}</span>
          <span className="text-sm text-muted-foreground">per ticket</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {event.tickets_available} tickets remaining
        </p>
      </Card>

      {/* Ticket Quantity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Quantity</h2>

        <div>
          <Label htmlFor="quantity">Number of Tickets</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max={maxQuantity}
            value={formData.quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setFormData({ ...formData, quantity: Math.min(Math.max(1, value), maxQuantity) });
            }}
            required
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Maximum {maxQuantity} tickets per purchase
          </p>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
        </div>
      </Card>

      {/* Order Summary */}
      <Card className="p-6 border-primary/20">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Tickets × {formData.quantity}</span>
            <span>{formatCurrency(ticketPrice * formData.quantity)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading || event.tickets_available === 0 || !formData.fullName || !formData.email || !formData.phone}
      >
        {loading ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        🔒 Secure payment powered by Paystack
      </p>
    </form>
  );
}