"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "info@afromerica-ent.com",
      action: "mailto:info@afromerica-ent.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm EST",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      contact: "123 Music Ave, New York, NY 10001",
      action: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "Our operating schedule",
      contact: "Mon-Fri: 9am-6pm EST",
      action: "#",
    },
  ];

  const inquiryTypes = [
    { value: "booking", label: "Artist Booking" },
    { value: "event", label: "Event Inquiry" },
    { value: "partnership", label: "Partnership Opportunity" },
    { value: "artist", label: "Join as an Artist" },
    { value: "general", label: "General Question" },
    { value: "support", label: "Technical Support" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // In production, this would send the data to your backend
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Get in{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Have questions about booking artists, hosting events, or partnering with us? We're here to help bring your vision to life.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription className="text-sm">{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {method.action !== "#" ? (
                      <a
                        href={method.action}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {method.contact}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground">
                        {method.contact}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a type</option>
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Quick Response</CardTitle>
                  <CardDescription>
                    We aim to respond to all inquiries within 24 hours during business days.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardHeader>
                  <CardTitle>For Artists</CardTitle>
                  <CardDescription className="space-y-3 mt-3">
                    <p>
                      Interested in joining our roster? We're always looking for talented artists to work with.
                    </p>
                    <p className="text-sm">
                      Please include:
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>" Your artist name and genre</li>
                      <li>" Links to your music/portfolio</li>
                      <li>" Brief bio and experience</li>
                      <li>" Social media handles</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardHeader>
                  <CardTitle>For Event Organizers</CardTitle>
                  <CardDescription className="space-y-3 mt-3">
                    <p>
                      Planning an event and need talent? We can help you find the perfect artists.
                    </p>
                    <p className="text-sm">
                      Please include:
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>" Event date and location</li>
                      <li>" Type of event and expected attendance</li>
                      <li>" Budget range</li>
                      <li>" Genre preferences</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                  <CardDescription className="space-y-3 mt-3">
                    <div>
                      <p className="font-semibold text-foreground mb-1">How far in advance should I book?</p>
                      <p className="text-sm">We recommend booking at least 4-6 weeks in advance for best availability.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Do you work nationwide?</p>
                      <p className="text-sm">Yes! We work with artists and venues across the United States.</p>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Visit Our Office</h2>
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
              <p className="text-lg font-semibold">123 Music Ave</p>
              <p className="text-muted-foreground">New York, NY 10001</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
