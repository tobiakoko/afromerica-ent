/**
 * Event Checkout Page
 * Handles ticket purchases for events
 */

import { notFound } from 'next/navigation'
import { CheckoutForm } from '@/components/forms/CheckoutForm'
import { getEventBySlug } from '@/lib/services/events'
import { PageHero } from '@/components/layout/page-hero'

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
      <PageHero
        title="Checkout"
        description={`Complete your purchase for ${event.title}`}
      />

      <section className="container-wide py-12 max-w-2xl">
        <CheckoutForm event={event} />
      </section>
    </div>
  )
}