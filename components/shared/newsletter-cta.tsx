'use client';

import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // TODO: Connect to email service (e.g., Resend, SendGrid)
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Successfully subscribed! Check your email.' });
        setEmail('');
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-lime-400/10 to-purple-600/10 p-12 md:p-16 text-center border border-white/10">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400/20 rounded-full mb-4">
              <Mail className="w-8 h-8 text-lime-400" />
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Never miss an event
            </h2>

            {/* Description */}
            <p className="text-white/70 text-lg md:text-xl">
              Subscribe to get exclusive access to presale tickets, special discounts, and event updates delivered straight to your inbox
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-lime-400 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-all duration-200 whitespace-nowrap hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {/* Message */}
              {message && (
                <p className={`mt-4 text-sm ${
                  message.type === 'success' ? 'text-lime-400' : 'text-red-400'
                }`}>
                  {message.text}
                </p>
              )}
            </form>

            {/* Privacy Note */}
            <p className="text-white/50 text-sm">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}