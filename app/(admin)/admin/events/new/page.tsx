'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { generateSlug } from '@/lib/constants'

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [venues, setVenues] = useState<any[]>([])
  const [artists, setArtists] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    date: '',
    end_date: '',
    time: '',
    capacity: '',
    status: 'upcoming',
    category: 'concert',
    featured: false,
    image_url: '',
    cover_image_url: '',
    venue_id: '',
    ticket_types: [] as Array<{
      name: string
      description: string
      price: string
      quantity: string
      available: string
      max_per_order: string
    }>,
    event_artists: [] as string[],
  })

  useEffect(() => {
    fetchVenuesAndArtists()
  }, [])

  const fetchVenuesAndArtists = async () => {
    const supabase = createClient()

    const [{ data: venuesData }, { data: artistsData }] = await Promise.all([
      supabase.from('venues').select('id, name, city').order('name'),
      supabase.from('artists').select('id, name, stage_name').order('name'),
    ])

    setVenues(venuesData || [])
    setArtists(artistsData || [])
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    
    if (field === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }))
    }
  }

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      ticket_types: [
        ...prev.ticket_types,
        {
          name: '',
          description: '',
          price: '',
          quantity: '',
          available: '',
          max_per_order: '10',
        },
      ],
    }))
  }

  const removeTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types.filter((_, i) => i !== index),
    }))
  }

  const updateTicketType = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      ticket_types: prev.ticket_types.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Create event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          short_description: formData.short_description,
          date: formData.date,
          end_date: formData.end_date || null,
          time: formData.time,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          status: formData.status,
          category: formData.category,
          featured: formData.featured,
          image_url: formData.image_url,
          cover_image_url: formData.cover_image_url,
        })
        .select()
        .single()

      if (eventError) throw eventError

      // Link venue
      if (formData.venue_id) {
        await supabase.from('event_venues').insert({
          event_id: event.id,
          venue_id: formData.venue_id,
        })
      }

      // Link artists
      if (formData.event_artists.length > 0) {
        await supabase.from('event_artists').insert(
          formData.event_artists.map(artistId => ({
            event_id: event.id,
            artist_id: artistId,
          }))
        )
      }

      // Create ticket types
      if (formData.ticket_types.length > 0) {
        const ticketTypesData = formData.ticket_types.map(ticket => ({
          event_id: event.id,
          name: ticket.name,
          description: ticket.description,
          price: parseFloat(ticket.price),
          quantity: parseInt(ticket.quantity),
          available: parseInt(ticket.available),
          max_per_order: parseInt(ticket.max_per_order),
        }))

        await supabase.from('ticket_types').insert(ticketTypesData)
      }

      toast.success('Event created successfully!')
      router.push('/admin/events')
    } catch (error: any) {
      console.error('Error creating event:', error)
      toast.error(error.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>Add a new event to your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Afrobeat Night 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="afrobeat-night-2025"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in the URL: /events/{formData.slug || 'your-slug'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Brief description for cards and listings..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Full event description..."
                  rows={5}
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Date & Time</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Start Date *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Display Time</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  placeholder="8:00 PM - 2:00 AM"
                />
              </div>
            </div>

            {/* Venue & Capacity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Venue & Capacity</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue_id">Venue</Label>
                  <select
                    id="venue_id"
                    value={formData.venue_id}
                    onChange={(e) => handleInputChange('venue_id', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select a venue</option>
                    {venues.map(venue => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} - {venue.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="500"
                  />
                </div>
              </div>
            </div>

            {/* Category & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Category & Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="concert">Concert</option>
                    <option value="festival">Festival</option>
                    <option value="club">Club Night</option>
                    <option value="private">Private Event</option>
                    <option value="tour">Tour</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="soldout">Sold Out</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Artists */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Artists</h3>
              
              <div className="space-y-2">
                <Label>Select Artists</Label>
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
                  {artists.map(artist => (
                    <div key={artist.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`artist-${artist.id}`}
                        checked={formData.event_artists.includes(artist.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange('event_artists', [...formData.event_artists, artist.id])
                          } else {
                            handleInputChange('event_artists', formData.event_artists.filter(id => id !== artist.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`artist-${artist.id}`} className="cursor-pointer">
                        {artist.stage_name || artist.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ticket Types</h3>
                <Button type="button" size="sm" onClick={addTicketType}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ticket Type
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.ticket_types.map((ticket, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium">Ticket Type {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTicketType(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={ticket.name}
                            onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                            placeholder="General Admission"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Price (NGN)</Label>
                          <Input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                            placeholder="5000"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) => {
                              updateTicketType(index, 'quantity', e.target.value)
                              if (!ticket.available) {
                                updateTicketType(index, 'available', e.target.value)
                              }
                            }}
                            placeholder="100"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Available</Label>
                          <Input
                            type="number"
                            value={ticket.available}
                            onChange={(e) => updateTicketType(index, 'available', e.target.value)}
                            placeholder="100"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Max Per Order</Label>
                          <Input
                            type="number"
                            value={ticket.max_per_order}
                            onChange={(e) => updateTicketType(index, 'max_per_order', e.target.value)}
                            placeholder="10"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Input
                            value={ticket.description}
                            onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                            placeholder="Access to main floor"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Event Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://example.com/event-image.jpg"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  type="url"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Options</h3>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Feature this event on homepage
                </Label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}