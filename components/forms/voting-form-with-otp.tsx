"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, ArrowLeft, Shield } from "lucide-react";

interface VotingFormWithOTPProps {
  artists: any[];
  packages: any[];
}

type Step = 'selection' | 'contact' | 'otp' | 'payment';

export function VotingFormWithOTP({ artists, packages }: VotingFormWithOTPProps) {
  const [step, setStep] = useState<Step>('selection');
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  
  const [formData, setFormData] = useState({
    artistId: '',
    packageId: '',
    email: '',
    phone: '',
    validationMethod: 'email',
    otpCode: '',
  });

  // Step 1: Artist & Package Selection
  const handleSelectionNext = () => {
    if (!formData.artistId || !formData.packageId) {
      toast.error('Please select an artist and package');
      return;
    }
    setStep('contact');
  };

  // Step 2: Send OTP
  const handleSendOTP = async () => {
    const contact = formData.validationMethod === 'email' ? formData.email : formData.phone;
    
    if (!contact) {
      toast.error(`Please enter your ${formData.validationMethod}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [formData.validationMethod]: contact,
          method: formData.validationMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Verification code sent to your ${formData.validationMethod}`);
        setStep('otp');
        setAttemptsLeft(3);
      } else {
        throw new Error(data.message || 'Failed to send code');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async () => {
    if (formData.otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
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
          code: formData.otpCode,
          method: formData.validationMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Verified! Redirecting to payment...');
        await initializePayment(data.token);
      } else {
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        throw new Error(data.message || 'Invalid code');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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

      const data = await response.json();

      if (data.success) {
        toast.success('New code sent!');
        setFormData({ ...formData, otpCode: '' });
        setAttemptsLeft(3);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Payment
  const initializePayment = async (verificationToken: string) => {
    try {
      const selectedPackage = packages.find(p => p.id === formData.packageId);
      const selectedArtist = artists.find(a => a.id === formData.artistId);
      
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vote',
          artistId: formData.artistId,
          artistName: selectedArtist.stage_name,
          packageId: formData.packageId,
          votes: selectedPackage.votes,
          email: formData.email || formData.phone,
          amount: selectedPackage.price,
          verificationToken,
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
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2">
          {['selection', 'contact', 'otp', 'payment'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : i < ['selection', 'contact', 'otp', 'payment'].indexOf(step)
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div className={`w-12 h-0.5 ${i < ['selection', 'contact', 'otp', 'payment'].indexOf(step) ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-12 mt-2 text-xs text-muted-foreground">
          <span>Select</span>
          <span>Contact</span>
          <span>Verify</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Step 1: Selection */}
      {step === 'selection' && (
        <div className="space-y-6">
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
                      src={artist.image_url || '/images/default-artist.svg'}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-semibold text-sm text-center truncate">
                    {artist.stage_name}
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    {artist.total_votes} votes
                  </p>
                </button>
              ))}
            </div>
          </Card>

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
                </button>
              ))}
            </div>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={handleSelectionNext}
            disabled={!formData.artistId || !formData.packageId}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Contact Info */}
      {step === 'contact' && (
        <Card className="p-8 md:p-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/60 dark:border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep('selection')}
            className="mb-6 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Contact Information</h2>
          <p className="text-gray-600 dark:text-gray-400 font-light mb-8">We'll send a verification code to confirm your identity</p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Method</Label>
              <Select
                value={formData.validationMethod}
                onValueChange={(value) => setFormData({ ...formData, validationMethod: value })}
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200/60 dark:border-gray-800 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200/60 dark:border-gray-800">
                  <SelectItem value="email" className="rounded-lg">Email</SelectItem>
                  <SelectItem value="sms" className="rounded-lg">Phone (SMS)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.validationMethod === 'email' ? (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 XXX XXX XXXX"
                  required
                  className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
                />
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 flex items-start gap-4 border border-gray-200/60 dark:border-gray-700/60">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Security Notice</p>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  We&apos;ll send a verification code to confirm your identity. This helps prevent fraud and ensures fair voting.
                </p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full h-12 mt-8 rounded-xl text-base font-semibold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            onClick={handleSendOTP}
            disabled={loading || (!formData.email && !formData.phone)}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Verification Code
          </Button>
        </Card>
      )}

      {/* Step 3: OTP Verification */}
      {step === 'otp' && (
        <Card className="p-8 md:p-10 max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/60 dark:border-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep('contact')}
            className="mb-6 -ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">Verify Your {formData.validationMethod === 'email' ? 'Email' : 'Phone'}</h2>
          <p className="text-gray-600 dark:text-gray-400 font-light mb-8">
            Enter the 6-digit code we sent to{' '}
            <strong className="font-semibold text-gray-900 dark:text-white">{formData.validationMethod === 'email' ? formData.email : formData.phone}</strong>
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</Label>
              <Input
                id="otp"
                value={formData.otpCode}
                onChange={(e) => setFormData({ ...formData, otpCode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                placeholder="000000"
                maxLength={6}
                className="h-16 text-center text-3xl tracking-[0.5em] font-semibold bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
                required
              />
              {attemptsLeft < 3 && (
                <p className="text-sm text-amber-600 dark:text-amber-500 mt-2 font-medium">
                  {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
                </p>
              )}
            </div>

            <Button
              size="lg"
              className="w-full h-12 rounded-xl text-base font-semibold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              onClick={handleVerifyOTP}
              disabled={loading || formData.otpCode.length !== 6}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Continue
            </Button>

            <Button
              variant="ghost"
              className="w-full h-12 rounded-xl text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleResendOTP}
              disabled={loading}
            >
              Resend Code
            </Button>
          </div>
        </Card>
      )}

      {/* Order Summary */}
      {(step === 'selection' || step === 'contact') && selectedPackage && selectedArtist && (
        <Card className="p-6 bg-muted/50 mt-6">
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