"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";
import { signUp } from "@/lib/auth/actions";

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  async function handleSubmit(formData: FormData) {
    setErrors({});
    setSuccess(false);

    // Client-side validation
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    let hasErrors = false;

    if (!fullName) {
      setErrors(prev => ({ ...prev, fullName: 'Full name is required' }));
      hasErrors = true;
    }

    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      hasErrors = true;
    }

    if (!password || password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
      hasErrors = true;
    } else if (!/[A-Z]/.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter' }));
      hasErrors = true;
    } else if (!/[a-z]/.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one lowercase letter' }));
      hasErrors = true;
    } else if (!/[0-9]/.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one number' }));
      hasErrors = true;
    }

    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      hasErrors = true;
    }

    if (hasErrors) return;

    startTransition(async () => {
      const result = await signUp(formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        setSuccess(true);
        toast.success(result.message || 'Account created! Check your email.');
      }
    });
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
        <p className="text-muted-foreground">
          We&apos;ve sent you a confirmation link. Please check your email to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          required
          disabled={isPending}
          autoComplete="name"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
        {errors.password && (
          <p className="text-sm text-destructive mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          disabled={isPending}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>
    </form>
  );
}
