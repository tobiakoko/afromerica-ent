

/*
CTA / NEWSLETTER SIGNUP COMPONENT

{/* Newsletter Section *}
      <section id="newsletter">
        <NewsletterSignup />
      </section>
*/

/*

NEWSLETTER SIGNUP COMPONENT
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("You're all set! Check your inbox for confirmation.");
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden bg-obsidian-black py-20">
      {/* Background Pattern *}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading *}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl mb-4 tracking-tight">
              Stay <span className="text-electric-lime">Updated</span>
            </h2>
            <p className="text-soft-gray text-lg tracking-wide uppercase text-sm">
              The latest updates straight to your inbox
            </p>
          </div>

          {/* Newsletter Form *}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-14 bg-white/5 border-white/10 text-white placeholder:text-soft-gray focus:border-electric-lime"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-14 px-8 bg-electric-lime text-obsidian-black hover:bg-electric-lime/90 hover:scale-105 transition-all duration-200"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            <p className="text-xs text-soft-gray mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
*/