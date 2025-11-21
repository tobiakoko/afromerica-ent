"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface VotingFormProps {
  artists: any[];
  preselectedArtistSlug?: string;
  votePrice: number;
}

export function VotingForm({ artists, preselectedArtistSlug, votePrice }: VotingFormProps) {
  const [step, setStep] = useState<'select' | 'validate' | 'payment'>('select');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    artistId: '',
    voteCount: '',
    amount: '',
    email: '',
    phone: '',
    validationMethod: 'email',
    verificationCode: '',
  });

  // Pre-select artist based on slug from URL
  useEffect(() => {
    if (preselectedArtistSlug && artists.length > 0) {
      const artist = artists.find(a => a.slug === preselectedArtistSlug);
      if (artist) {
        setFormData(prev => ({ ...prev, artistId: artist.id }));
        // Show toast to inform user
        toast.success(`${artist.stage_name || artist.name} selected! Choose the number of votes to continue.`);
      } else {
        // Artist slug not found
        toast.error('Artist not found. Please select an artist to continue.');
      }
    }
  }, [preselectedArtistSlug, artists]);

  // Auto-calculate amount when vote count changes
  useEffect(() => {
    if (formData.voteCount && votePrice) {
      const calculatedAmount = parseInt(formData.voteCount) * parseFloat(votePrice.toString());
      setFormData(prev => ({ ...prev, amount: calculatedAmount.toFixed(2) }));
    }
  }, [formData.voteCount, votePrice]);

  // Step 1: Send Validation Code
  const handleSendCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/votes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [formData.validationMethod]: formData.validationMethod === 'email' ? formData.email : formData.phone,
          method: formData.validationMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Verification code sent!');
        setStep('validate');
      } else {
        throw new Error(data.message || 'Failed to send code');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/votes/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.validationMethod === 'email' ? formData.email : undefined,
          phone: formData.validationMethod === 'sms' ? formData.phone : undefined,
          code: formData.verificationCode,
          method: formData.validationMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Verified! Proceeding to payment...');
        setStep('payment');
        await handleInitializePayment(data.token);
      } else {
        throw new Error(data.message || 'Invalid code');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Initialize Payment
  const handleInitializePayment = async (validationToken: string) => {
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vote',
          artistId: formData.artistId,
          voteCount: parseInt(formData.voteCount),
          email: formData.email,
          amount: parseFloat(formData.amount),
          validationToken,
        }),
      });

      const data = await response.json();

      if (data.success && data.authorizationUrl) {
        // FIXME: Change window.location to next's redirect. See what the drawbacks are first
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const selectedArtist = artists.find(a => a.id === formData.artistId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step 1: Select Artist & Package */}
      {step === 'select' && (
        <div className="space-y-6">
          {/* Vote Details */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Enter Vote Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="voteCount">Number of Votes</Label>
                <Select
                  value={formData.voteCount}
                  onValueChange={(value) => setFormData({ ...formData, voteCount: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of votes" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((count) => (
                      <SelectItem key={count} value={count.toString()}>
                        {count} {count === 1 ? 'vote' : 'votes'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose the number of votes you want to purchase
                </p>
              </div>

              <div>
                <Label htmlFor="amount">Total Amount (₦)</Label>
                <Input
                  id="amount"
                  type="text"
                  value={formData.amount ? `₦${parseFloat(formData.amount).toLocaleString()}` : '₦0.00'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ₦{votePrice.toLocaleString()} per vote
                </p>
              </div>
            </div>
          </Card>

          {/* Contact Info */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label>Validation Method</Label>
                <Select
                  value={formData.validationMethod}
                  onValueChange={(value) => setFormData({ ...formData, validationMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone (SMS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.validationMethod === 'email' ? (
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 xxx xxx xxxx"
                    required
                  />
                </div>
              )}
            </div>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={handleSendCode}
            disabled={loading || !formData.artistId || !formData.voteCount || !formData.amount || (!formData.email && !formData.phone)}
          >
            {loading ? 'Sending Code...' : 'Continue to Verification'}
          </Button>
        </div>
      )}

      {/* Step 2: Verification */}
      {step === 'validate' && (
        <Card className="p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Verify Your {formData.validationMethod === 'email' ? 'Email' : 'Phone'}</h2>
          <p className="text-muted-foreground mb-6">
            We sent a 6-digit code to {formData.validationMethod === 'email' ? formData.email : formData.phone}
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleVerifyCode}
              disabled={loading || formData.verificationCode.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify & Continue to Payment'}
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep('select')}
            >
              Go Back
            </Button>
          </div>
        </Card>
      )}

      {/* Order Summary (shown on select step) */}
      {step === 'select' && selectedArtist && formData.voteCount && formData.amount && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Artist:</span>
              <span className="font-semibold">{selectedArtist.stage_name || selectedArtist.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Votes:</span>
              <span className="font-semibold">{parseInt(formData.voteCount).toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{parseFloat(formData.amount).toLocaleString()}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
