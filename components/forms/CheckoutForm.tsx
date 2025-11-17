"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface CheckoutFormProps {
  event: any;
  ticketTypes: any[];
}

export function CheckoutForm({ event, ticketTypes }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ticketTypeId: '',
    quantity: 1,
    fullName: '',
    email: '',
    phone: '',
  });

  const selectedTicket = ticketTypes.find(t => t.id === formData.ticketTypeId);
  const totalAmount = selectedTicket ? selectedTicket.price * formData.quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Initialize payment
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ticket',
          eventId: event.id,
          ticketTypeId: formData.ticketTypeId,
          quantity: formData.quantity,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          amount: totalAmount,
        }),
      });

      const data = await response.json();

      if (data.success && data.authorizationUrl) {
        // Redirect to Paystack
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
      {/* Ticket Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Tickets</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="ticketType">Ticket Type</Label>
            <Select
              value={formData.ticketTypeId}
              onValueChange={(value) => setFormData({ ...formData, ticketTypeId: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose ticket type" />
              </SelectTrigger>
              <SelectContent>
                {ticketTypes.map((ticket) => (
                  <SelectItem key={ticket.id} value={ticket.id}>
                    {ticket.name} - ₦{ticket.price.toLocaleString()} ({ticket.available} available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedTicket?.available || 1}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>
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
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-2">
          {selectedTicket && (
            <>
              <div className="flex justify-between">
                <span>{selectedTicket.name} x {formData.quantity}</span>
                <span>₦{(selectedTicket.price * formData.quantity).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={loading || !formData.ticketTypeId}>
        {loading ? 'Processing...' : `Pay ₦${totalAmount.toLocaleString()}`}
      </Button>
    </form>
  );
}