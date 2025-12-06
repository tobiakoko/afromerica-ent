"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Artist } from "@/types/models";
import { isValidEmail, isValidPhone, VALIDATION_MESSAGES } from "@/lib/constants/validation";

interface VotingFormProps {
  artists: Artist[];
  preselectedArtistSlug?: string;
  votePrice: number;
  eventId: string;
}

export function VotingForm({ artists, preselectedArtistSlug, votePrice, eventId }: VotingFormProps) {
  const [step, setStep] = useState<'select' | 'validate' | 'payment'>('select');
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [formData, setFormData] = useState({
    artistId: '',
    voteCount: '',
    amount: '',
    email: '',
    phone: '',
    validationMethod: 'email',
    verificationCode: '',
  });
  const isMountedRef = useRef(true);

  // Cleanup on unmount to prevent state updates
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Pre-select artist based on slug from URL
  useEffect(() => {
    if (preselectedArtistSlug && artists.length > 0) {
      const artist = artists.find(a => a.slug === preselectedArtistSlug);
      if (artist) {
        setFormData(prev => ({ ...prev, artistId: artist.id }));
        // Show toast to inform user
        toast.success(`${artist.stageName || artist.name} selected! Choose the number of votes to continue.`);
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
    // Validate input based on validation method
    if (formData.validationMethod === 'email') {
      if (!formData.email) {
        toast.error(VALIDATION_MESSAGES.REQUIRED_FIELD('Email'));
        return;
      }
      if (!isValidEmail(formData.email)) {
        toast.error(VALIDATION_MESSAGES.INVALID_EMAIL);
        return;
      }
    } else {
      if (!formData.phone) {
        toast.error(VALIDATION_MESSAGES.REQUIRED_FIELD('Phone number'));
        return;
      }
      if (!isValidPhone(formData.phone)) {
        toast.error(VALIDATION_MESSAGES.INVALID_PHONE);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [formData.validationMethod]: formData.validationMethod === 'email' ? formData.email : formData.phone,
          method: formData.validationMethod,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (!isMountedRef.current) return;
        toast.success('Verification code sent!');
        setStep('validate');
        setAttemptsLeft(3);
      } else {
        throw new Error(data.message || 'Failed to send code');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      const message = error instanceof Error ? error.message : 'Failed to send verification code';
      toast.error(message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async () => {
    if (formData.verificationCode.length !== 6) {
      toast.error(VALIDATION_MESSAGES.INVALID_OTP);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.validationMethod === 'email' ? formData.email : undefined,
          phone: formData.validationMethod === 'sms' ? formData.phone : undefined,
          code: formData.verificationCode,
          method: formData.validationMethod,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (!isMountedRef.current) return;
        toast.success('Verified! Proceeding to payment...');
        setStep('payment');
        await handleInitializePayment(data.token);
      } else {
        if (!isMountedRef.current) return;
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        throw new Error(data.message || 'Invalid code');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      const message = error instanceof Error ? error.message : 'Verification failed';
      toast.error(message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/otp/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [formData.validationMethod]: formData.validationMethod === 'email' ? formData.email : formData.phone,
          method: formData.validationMethod,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (!isMountedRef.current) return;
        toast.success('New code sent!');
        setFormData({ ...formData, verificationCode: '' });
        setAttemptsLeft(3);
      } else {
        throw new Error(data.message || 'Failed to resend code');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      const message = error instanceof Error ? error.message : 'Failed to resend code';
      toast.error(message);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
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
          eventId: eventId,
          voteCount: parseInt(formData.voteCount),
          email: formData.email,
          amount: parseFloat(formData.amount),
          validationToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.authorizationUrl) {
        // FIXME: Change window.location to next's redirect. See what the drawbacks are first
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      const message = error instanceof Error ? error.message : 'Payment initialization failed';
      toast.error(message);
      // Reset to validate step on error so user can retry
      setStep('validate');
    }
  };

  const selectedArtist = artists.find(a => a.id === formData.artistId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step 1: Select Artist & Package */}
      {step === 'select' && (
        <div className="space-y-6">
          {/* Artist Selection - Only show if multiple artists */}
          {artists.length > 1 && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Select Artist</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="artist">Artist</Label>
                  <Select
                    value={formData.artistId}
                    onValueChange={(value) => setFormData({ ...formData, artistId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an artist" />
                    </SelectTrigger>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id}>
                          {artist.stageName || artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose the artist you want to support
                  </p>
                </div>
              </div>
            </Card>
          )}

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
                    {[2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 1000].map((count) => (
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
                    <SelectItem value="sms">Phone (SMS)</SelectItem>
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
            disabled={
              loading ||
              !formData.artistId ||
              !formData.voteCount ||
              !formData.amount ||
              (formData.validationMethod === 'email' ? !formData.email : !formData.phone)
            }
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Sending Code...' : 'Continue to Verification'}
          </Button>
        </div>
      )}

      {/* Step 2: Verification - UPDATED WITH NEW OTP COMPONENT */}
      {step === 'validate' && (
        <Card className="p-8 md:p-10 max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/60 dark:border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep('select')}
            className="w-1/3 mb-6 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2 text-" />
            Back
          </Button>

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2 text-center">
            Verify Your {formData.validationMethod === 'email' ? 'Email' : 'Phone'}
          </h2>

          <FieldGroup>
            <Field>
              <FieldDescription className="text-gray-600 dark:text-gray-400 font-light mb-8">
                We sent a 6-digit verification code to{' '}
                <strong className="font-semibold text-gray-900 dark:text-white">
                  {formData.validationMethod === 'email' ? formData.email : formData.phone}
                </strong>
              </FieldDescription>

              <FieldLabel htmlFor="otp" className="sr-only">
                Verification Code
              </FieldLabel>

              <InputOTP
                maxLength={6}
                value={formData.verificationCode}
                onChange={(value) => setFormData({ ...formData, verificationCode: value })}
              >
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {attemptsLeft < 3 && (
                <p className="text-sm text-amber-600 dark:text-amber-500 mt-4 font-medium text-center">
                  {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
                </p>
              )}

              <FieldDescription className="text-center mt-6">
                Didn&apos;t receive the code?{' '}
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto font-medium"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend Code
                </Button>
              </FieldDescription>
            </Field>

            <Field className="mt-6">
              <Button
                type="button"
                size="lg"
                className="w-full h-12 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                onClick={handleVerifyCode}
                disabled={loading || formData.verificationCode.length !== 6}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Continue to Payment
              </Button>
            </Field>
          </FieldGroup>
        </Card>
      )}

      {/* Order Summary (shown on select step) */}
      {step === 'select' && selectedArtist && formData.voteCount && formData.amount && (
        <Card className="p-6 bg-muted/50 mt-6">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Artist:</span>
              <span className="font-semibold">{selectedArtist.stageName || selectedArtist.name}</span>
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