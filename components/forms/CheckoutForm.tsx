"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Event Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-200/60 dark:border-gray-700/60">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">{event.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-6">
          {new Date(event.event_date).toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">{formatCurrency(ticketPrice)}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-light">per ticket</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-light mt-2">
          {event.tickets_available} tickets remaining
        </p>
      </div>

      {/* Ticket Quantity */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Select Quantity</h2>

        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 dark:text-gray-300">Number of Tickets</Label>
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
            className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
          />
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 font-light">
            Maximum {maxQuantity} tickets per purchase
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Contact Information</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              placeholder="Your full name"
              className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
              className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="+234 XXX XXX XXXX"
              className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-200/60 dark:border-gray-700/60">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">Order Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between text-gray-600 dark:text-gray-400 font-light">
            <span>Tickets × {formData.quantity}</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(ticketPrice * formData.quantity)}</span>
          </div>
          <div className="border-t border-gray-200/60 dark:border-gray-700/60 pt-4 flex justify-between">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
            <span className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full h-14 rounded-xl text-lg font-semibold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        disabled={loading || event.tickets_available === 0 || !formData.fullName || !formData.email || !formData.phone}
      >
        {loading ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
      </Button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-500 font-light">
        Secure payment powered by Paystack
      </p>
    </form>
  );
}