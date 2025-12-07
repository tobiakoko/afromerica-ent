"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    // Track form submission start
    analytics.formStart('contact_form', 'contact_page');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully!', {
          description: 'We\'ll get back to you within 24 hours.',
          icon: <CheckCircle2 className="w-5 h-5" />,
        });
        analytics.formSubmit('contact_form', true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message', {
        description: error instanceof Error ? error.message : 'Please try again later or contact us directly.',
      });
      analytics.formSubmit('contact_form', false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`h-12 px-4 bg-gray-50 dark:bg-gray-950 border rounded-xl text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 ${
            errors.name ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 dark:border-gray-800'
          }`}
          placeholder="John Doe"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <span className="text-xs">●</span> {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={`h-12 px-4 bg-gray-50 dark:bg-gray-950 border rounded-xl text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 ${
            errors.email ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 dark:border-gray-800'
          }`}
          placeholder="john@example.com"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <span className="text-xs">●</span> {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Subject <span className="text-red-500">*</span>
        </Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          className={`h-12 px-4 bg-gray-50 dark:bg-gray-950 border rounded-xl text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 ${
            errors.subject ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 dark:border-gray-800'
          }`}
          placeholder="How can we help you?"
          disabled={loading}
        />
        {errors.subject && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <span className="text-xs">●</span> {errors.subject}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          rows={6}
          className={`px-4 py-3 bg-gray-50 dark:bg-gray-950 border rounded-xl text-base transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 resize-none ${
            errors.message ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 dark:border-gray-800'
          }`}
          placeholder="Tell us more about your inquiry..."
          disabled={loading}
        />
        {errors.message && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <span className="text-xs">●</span> {errors.message}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formData.message.length} / 10 minimum characters
        </p>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Message
          </span>
        )}
      </Button>
    </form>
  );
}