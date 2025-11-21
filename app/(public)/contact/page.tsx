import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { APP_METADATA } from "@/lib/constants";

// This page uses client components with state
export const dynamic = 'force-dynamic';

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: APP_METADATA.EMAIL,
    href: `mailto:${APP_METADATA.EMAIL}`
  },
  {
    icon: Phone,
    label: "Phone",
    value: APP_METADATA.PHONE,
    href: `tel:${APP_METADATA.PHONE}`
  },
  {
    icon: MapPin,
    label: "Address",
    value: APP_METADATA.LOCATION,
    href: null
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950" />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center px-4 py-1.5 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-6 shadow-lg">
              Contact Us
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              We&apos;d love to hear from you
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pb-24 md:pb-32">
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '200ms' }}>
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-6">
                  Contact Information
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-8">
                  Reach out to us through any of these channels
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;

                  const content = (
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${300 + index * 100}ms` }}>
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">
                            {info.label}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white wrap-break-word">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );

                  return info.href ? (
                    <a key={info.label} href={info.href} className="block group">
                      {content}
                    </a>
                  ) : (
                    <div key={info.label}>{content}</div>
                  );
                })}
              </div>

              {/* Business Hours */}
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '600ms' }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-1">
                      Business Hours
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Monday - Friday
                    </p>
                  </div>
                </div>
                <div className="ml-16 space-y-1 text-sm text-gray-600 dark:text-gray-400 font-light">
                  <p>9:00 AM - 6:00 PM WAT</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 md:p-10 shadow-2xl shadow-black/10 dark:shadow-black/40 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-gray-600 dark:text-gray-400 stroke-[1.5]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                      Send us a Message
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                      We&apos;ll get back to you within 24 hours
                    </p>
                  </div>
                </div>
                <ContactForm />
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500 animate-in fade-in duration-1000" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Your information is secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>24-hour response time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
