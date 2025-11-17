"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { signIn } from "@/lib/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignInForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      const errorMessages: Record<string, string> = {
        'unauthorized': 'You do not have admin access to this application',
        'inactive': 'Your account is inactive. Please contact support.',
        'auth_callback_error': 'Authentication failed. Please try again.',
        'verification_failed': 'Email verification failed. Please try again.',
      };
      setUrlError(errorMessages[error] || 'An error occurred. Please try again.');
    }
  }, [searchParams]);

  async function handleSubmit(formData: FormData) {
    setErrors({});
    setUrlError(null);

    // Client-side validation
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }

    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return;
    }

    startTransition(async () => {
      const result = await signIn(formData);

      if (result?.error) {
        toast.error(result.error);
      }
      // Success case is handled by redirect in the action
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {urlError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{urlError}</AlertDescription>
        </Alert>
      )}

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
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-sm text-destructive mt-1">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  );
}
