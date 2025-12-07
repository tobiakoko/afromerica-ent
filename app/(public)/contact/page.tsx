import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { APP_METADATA } from "@/lib/constants";

// This page uses client components with state
export const dynamic = 'force-dynamic';

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: APP_METADATA.SUPPORT_EMAIL,
    href: `mailto:${APP_METADATA.SUPPORT_EMAIL}`,
    description: "For general inquiries"
  },
  {
    icon: Phone,
    label: "Phone",
    value: APP_METADATA.PHONE,
    href: `tel:${APP_METADATA.PHONE}`,
    description: "Mon - Fri, 9AM - 6PM WAT"
  },
  {
    icon: MapPin,
    label: "Location",
    value: APP_METADATA.LOCATION,
    href: null,
    description: "Visit our office"
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 mb-8 shadow-sm">
              <Send className="w-4 h-4" />
              <span>We&apos;re here to help</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Have a question or want to work together? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose your preferred way to reach us
                </p>
              </div>

              {contactInfo.map((info) => {
                const Icon = info.icon;
                const content = (
                  <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          {info.label}
                        </p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white mb-1 break-words">
                          {info.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );

                return info.href ? (
                  <a key={info.label} href={info.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={info.label}>{content}</div>
                );
              })}

              {/* Business Hours Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-start gap-4 mb-3">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Business Hours
                    </p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      Monday - Friday
                    </p>
                  </div>
                </div>
                <div className="ml-16">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    9:00 AM - 6:00 PM WAT
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Weekend: By appointment
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-xl">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
                        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Send us a Message
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-13">
                      Fill out the form below and we&apos;ll get back to you within 24 hours
                    </p>
                  </div>

                  <ContactForm />
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure & confidential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>24-hour response time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
