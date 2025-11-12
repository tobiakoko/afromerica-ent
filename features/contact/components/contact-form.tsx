'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Send, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { contactSchema, type ContactFormData } from '../types/contact.types';

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Uncomment this when API route is ready
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitSuccess(true);
        reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        // Handle error (could show error toast)
        console.error('Form submission failed:', result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (could show error toast)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Success Message Overlay */}
      {submitSuccess && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-400 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
            <p className="text-white/70">We'll get back to you shortly.</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            Your Name <span className="text-lime-400">*</span>
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="John Doe"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-lime-400 focus:ring-lime-400/20"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="flex items-center gap-1 text-sm text-red-400 mt-1">
              <AlertCircle className="h-4 w-4" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email Address <span className="text-lime-400">*</span>
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john@example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-lime-400 focus:ring-lime-400/20"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="flex items-center gap-1 text-sm text-red-400 mt-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Subject Input */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
            Subject <span className="text-lime-400">*</span>
          </label>
          <Input
            id="subject"
            {...register('subject')}
            placeholder="Event Inquiry"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-lime-400 focus:ring-lime-400/20"
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="flex items-center gap-1 text-sm text-red-400 mt-1">
              <AlertCircle className="h-4 w-4" />
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
            Message <span className="text-lime-400">*</span>
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={6}
            className="flex min-h-[160px] w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/40 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            placeholder="Tell us about your inquiry..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="flex items-center gap-1 text-sm text-red-400 mt-1">
              <AlertCircle className="h-4 w-4" />
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-lime-400 text-black font-semibold hover:bg-lime-300 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}