"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";

interface VotingFormProps {
  artists: any[];
  packages: any[];
}

export function VotingForm({ artists, packages }: VotingFormProps) {
  const [step, setStep] = useState<'select' | 'validate' | 'payment'>('select');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    artistId: '',
    packageId: '',
    email: '',
    phone: '',
    validationMethod: 'email',
    verificationCode: '',
  });

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
          [formData.validationMethod]: formData.validationMethod === 'email' ? formData.email : formData.phone,
          code: formData.verificationCode,
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
      const selectedPackage = packages.find(p => p.id === formData.packageId);
      
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vote',
          artistId: formData.artistId,
          packageId: formData.packageId,
          email: formData.email,
          amount: selectedPackage.price,
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

  const selectedPackage = packages.find(p => p.id === formData.packageId);
  const selectedArtist = artists.find(a => a.id === formData.artistId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step 1: Select Artist & Package */}
      {step === 'select' && (
        <div className="space-y-6">
          {/* Artist Selection */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Select Artist</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artists.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => setFormData({ ...formData, artistId: artist.id })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.artistId === artist.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                    <Image
                      src={artist.image_url || '/images/default-artist.jpg'}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-semibold text-sm text-center">{artist.stage_name}</p>
                  <p className="text-xs text-muted-foreground text-center">
                    {artist.total_votes} votes
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Package Selection */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Select Vote Package</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setFormData({ ...formData, packageId: pkg.id })}
                  className={`p-6 rounded-lg border-2 transition-all relative ${
                    formData.packageId === pkg.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </div>
                  )}
                  <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-primary mb-2">
                    ₦{pkg.price.toLocaleString()}
                  </p>
                  <p className="text-muted-foreground text-sm mb-2">
                    {pkg.votes} votes
                  </p>
                  {pkg.discount > 0 && (
                    <p className="text-xs text-green-600 font-semibold">
                      Save {pkg.discount}%
                    </p>
                  )}
                  {pkg.description && (
                    <p className="text-xs text-muted-foreground mt-2">{pkg.description}</p>
                  )}
                </button>
              ))}
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
            disabled={loading || !formData.artistId || !formData.packageId || (!formData.email && !formData.phone)}
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
      {step === 'select' && selectedPackage && selectedArtist && (
        <Card className="p-6 bg-muted/50">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Artist:</span>
              <span className="font-semibold">{selectedArtist.stage_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-semibold">{selectedPackage.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Votes:</span>
              <span className="font-semibold">{selectedPackage.votes}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₦{selectedPackage.price.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
