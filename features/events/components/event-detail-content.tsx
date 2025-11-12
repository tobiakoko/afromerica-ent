'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, Share2, Heart, Ticket } from 'lucide-react'
import { EventDetails } from './EventDetails'
import { BookingForm } from '@/features/bookings/components/booking-form/booking-form'
import { Button } from '@/components/ui/button'

interface EventDetailContentProps {
  event: any
}

export function EventDetailContent({ event }: EventDetailContentProps) {
  const [showBookingForm, setShowBookingForm] = useState(false)

  const handleBookNowClick = () => {
    setShowBookingForm(true)
    // Scroll to booking form
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Event Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-lime-400 text-black">
                {event.category || 'Event'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              {event.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.venue?.name && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{event.venue.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <EventDetails event={event} />
          </div>

          {/* Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                {/* Ticket Availability */}
                {event.capacity && event.ticketsSold !== undefined && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Tickets Sold</span>
                      <span className="text-white font-semibold">
                        {event.ticketsSold.toLocaleString()} /{' '}
                        {event.capacity.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-lime-400 transition-all duration-300"
                        style={{
                          width: `${(event.ticketsSold / event.capacity) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-white/40 text-xs mt-2">
                      {(event.capacity - event.ticketsSold).toLocaleString()} tickets
                      remaining
                    </p>
                  </div>
                )}

                {/* Ticket Types */}
                {event.ticketTypes && event.ticketTypes.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <h3 className="text-white font-semibold">Ticket Types</h3>
                    {event.ticketTypes.map((ticket: any) => (
                      <div
                        key={ticket.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-white font-semibold">{ticket.name}</h4>
                            {ticket.available !== undefined && (
                              <p className="text-white/40 text-sm">
                                {ticket.available} available
                              </p>
                            )}
                          </div>
                          <span className="text-xl font-bold text-lime-400">
                            ₦{ticket.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Buttons */}
                <Button
                  onClick={handleBookNowClick}
                  className="w-full bg-lime-400 text-black hover:bg-lime-300 font-semibold mb-3"
                  size="lg"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Book Now
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form Section */}
        {showBookingForm && (
          <div id="booking-section" className="mt-12 scroll-mt-24">
            <div className="max-w-3xl mx-auto bg-white/5 rounded-xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-6">Book Your Tickets</h2>
              <BookingForm
                eventId={event._id ?? event.id}
                ticketPrice={event.ticketTypes?.[0]?.price ?? event.price ?? 0}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
