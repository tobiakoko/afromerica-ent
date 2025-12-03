/**
 * Event Checkout Page
 * Handles ticket purchases for events
 */

import { notFound } from 'next/navigation'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { getEventBySlug } from '@/lib/services/events'

export const dynamic = 'force-dynamic'

interface CheckoutPageProps {
  params: Promise<{ slug: string }>
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params

  // Fetch event using service layer
  const { event, error } = await getEventBySlug(slug)

  if (error || !event) {
    console.error('Error fetching event for checkout:', error)
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero with Subtle Gradient Background */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950" />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-6">
              Secure Checkout
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
              Complete Your Purchase
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              You&apos;re one step away from attending {event.title}
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Form Section */}
      <section className="relative pb-24 md:pb-32">
        <div className="relative max-w-3xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/60 dark:border-gray-800 p-8 md:p-10 shadow-2xl shadow-black/10 dark:shadow-black/40 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '200ms' }}>
            <CheckoutForm event={event} />
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500 animate-in fade-in duration-1000" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified Event</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}