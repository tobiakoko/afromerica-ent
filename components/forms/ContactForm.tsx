"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Track form submission start
    analytics.formStart('contact_form', 'contact_page');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!');
        analytics.formSubmit('contact_form', true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
      analytics.formSubmit('contact_form', false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
          placeholder="Your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
          placeholder="your@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Subject
        </Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          className="h-12 px-4 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300"
          placeholder="What's this about?"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Message
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={5}
          required
          className="px-4 py-3 bg-white dark:bg-gray-900 border-gray-200/60 dark:border-gray-800 rounded-xl text-base font-light focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-300 resize-none"
          placeholder="Tell us more..."
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl text-base font-semibold bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}