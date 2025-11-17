import Link from "next/link";
import { SignUpForm } from "@/components/auth/SignupForm";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: 'Sign Up',
  description: 'Create a new account',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Sign up to get started</p>
        </div>

        <SignUpForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}