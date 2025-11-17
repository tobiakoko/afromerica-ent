"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth/actions";

export function SignInForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  async function handleSubmit(formData: FormData) {
    setErrors({});

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
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={isPending}
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
