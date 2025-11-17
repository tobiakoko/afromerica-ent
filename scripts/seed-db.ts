import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n')

  try {
    // Seed venues
    console.log('📍 Seeding venues...')
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .insert([
        {
          name: 'Terra Kulture Arena',
          slug: 'terra-kulture-arena',
          address: '1376 Tiamiyu Savage Street, Victoria Island',
          city: 'Lagos',
          state: 'Lagos',
          country: 'Nigeria',
          capacity: 1500,
          description: 'Premier arts and cultural center featuring a 400-seat theater and art gallery.',
          amenities: ['Parking', 'Restaurant', 'Bar', 'VIP Section', 'Air Conditioning'],
        },
        {
          name: 'Eko Convention Centre',
          slug: 'eko-convention-centre',
          address: 'Plot 1, Water Corporation Drive, Oniru',
          city: 'Lagos',
          state: 'Lagos',
          country: 'Nigeria',
          capacity: 5000,
          description: 'World-class convention and event center on Victoria Island waterfront.',
          amenities: ['Parking', 'Multiple Halls', 'Catering', 'VIP Lounges', 'Security'],
        },
        {
          name: 'The Shrine',
          slug: 'the-shrine',
          address: '1A Mobolaji Bank Anthony Way, Ikeja',
          city: 'Lagos',
          state: 'Lagos',
          country: 'Nigeria',
          capacity: 3000,
          description: 'Iconic Afrobeat shrine, home of Fela Kuti\'s legacy.',
          amenities: ['Bar', 'Restaurant', 'Open Air', 'Live Band Stage'],
        },
      ])
      .select()

    if (venuesError) throw venuesError
    console.log(`✅ Created ${venues.length} venues\n`)

    // Seed artists
    console.log('🎤 Seeding artists...')
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .insert([
        {
          name: 'Kofi Mensah',
          slug: 'kofi-mensah',
          stage_name: 'Kofi The Afrobeat King',
          bio: 'Award-winning Afrobeat artist bringing authentic African rhythms to audiences worldwide. Known for electrifying performances and socially conscious lyrics.',
          genre: ['Afrobeat', 'Highlife', 'Afro-fusion'],
          featured: true,
          social_media: {
            instagram: '@kofi_mensah',
            twitter: '@kofibeats',
            spotify: 'https://open.spotify.com/artist/kofi',
          },
        },
        {
          name: 'Zara Williams',
          slug: 'zara-williams',
          stage_name: 'Zara',
          bio: 'Soulful R&B vocalist with a passion for blending traditional and contemporary sounds. Multi-platinum recording artist.',
          genre: ['R&B', 'Soul', 'Neo-Soul'],
          featured: true,
          social_media: {
            instagram: '@zarawilliams',
            twitter: '@zarasoul',
          },
        },
        {
          name: 'DJ Afro Thunder',
          slug: 'dj-afro-thunder',
          stage_name: 'DJ Afro Thunder',
          bio: 'Master DJ spinning the hottest Afrobeats, Hip Hop, and Amapiano. Resident DJ at top Lagos clubs.',
          genre: ['Afrobeats', 'Amapiano', 'Hip Hop'],
          featured: true,
          social_media: {
            instagram: '@djafrothunder',
            twitter: '@afrothunderdjmix',
          },
        },
      ])
      .select()

    if (artistsError) throw artistsError
    console.log(`✅ Created ${artists.length} artists\n`)

    // Seed events
    console.log('🎉 Seeding events...')
    const eventDate = new Date()
    eventDate.setDate(eventDate.getDate() + 30) // 30 days from now

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert([
        {
          title: 'Afrobeat Nights Lagos 2025',
          slug: 'afrobeat-nights-lagos-2025',
          description: 'Experience the electrifying sounds of Afrobeat with live performances from top artists. Dance the night away to authentic African rhythms in an unforgettable cultural celebration.',
          short_description: 'The biggest Afrobeat party of the year!',
          date: eventDate.toISOString(),
          time: '8:00 PM - 3:00 AM',
          capacity: 3000,
          status: 'upcoming',
          category: 'concert',
          featured: true,
        },
        {
          title: 'Soul & R&B Experience',
          slug: 'soul-rnb-experience-2025',
          description: 'An intimate evening of soulful R&B performances featuring Nigeria\'s finest vocalists. Enjoy smooth vibes and unforgettable melodies.',
          short_description: 'Smooth R&B vibes for the soul',
          date: new Date(eventDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          time: '7:00 PM - 11:00 PM',
          capacity: 1500,
          status: 'upcoming',
          category: 'concert',
          featured: true,
        },
      ])
      .select()

    if (eventsError) throw eventsError
    console.log(`✅ Created ${events.length} events\n`)

    // Link venues to events
    if (venues && events) {
      console.log('🔗 Linking events to venues...')
      await supabase.from('event_venues').insert([
        { event_id: events[0].id, venue_id: venues[2].id }, // Afrobeat Nights at The Shrine
        { event_id: events[1].id, venue_id: venues[0].id }, // Soul & R&B at Terra Kulture
      ])
      console.log('✅ Linked events to venues\n')
    }

    // Link artists to events
    if (artists && events) {
      console.log('🎸 Linking artists to events...')
      await supabase.from('event_artists').insert([
        { event_id: events[0].id, artist_id: artists[0].id, performance_order: 1 },
        { event_id: events[0].id, artist_id: artists[2].id, performance_order: 2 },
        { event_id: events[1].id, artist_id: artists[1].id, performance_order: 1 },
      ])
      console.log('✅ Linked artists to events\n')
    }

    // Create ticket types
    if (events) {
      console.log('🎫 Creating ticket types...')
      await supabase.from('ticket_types').insert([
        {
          event_id: events[0].id,
          name: 'Early Bird',
          description: 'Limited early bird special',
          price: 5000,
          quantity: 500,
          available: 500,
          currency: 'NGN',
          max_per_order: 5,
        },
        {
          event_id: events[0].id,
          name: 'General Admission',
          description: 'Standard entry',
          price: 8000,
          quantity: 2000,
          available: 2000,
          currency: 'NGN',
          max_per_order: 10,
        },
        {
          event_id: events[0].id,
          name: 'VIP',
          description: 'VIP access with exclusive perks',
          price: 25000,
          quantity: 500,
          available: 500,
          currency: 'NGN',
          max_per_order: 10,
        },
        {
          event_id: events[1].id,
          name: 'General Admission',
          description: 'Standard entry',
          price: 10000,
          quantity: 1000,
          available: 1000,
          currency: 'NGN',
          max_per_order: 8,
        },
        {
          event_id: events[1].id,
          name: 'VIP Table',
          description: 'Reserved table with bottle service',
          price: 50000,
          quantity: 50,
          available: 50,
          currency: 'NGN',
          max_per_order: 1,
        },
      ])
      console.log('✅ Created ticket types\n')
    }

    // Seed vote packages
    console.log('📦 Seeding vote packages...')
    await supabase.from('vote_packages').insert([
      {
        name: 'Starter Pack',
        votes: 10,
        price: 500,
        currency: 'NGN',
        discount: 0,
        popular: false,
        description: '10 votes to support your favorite artist',
      },
      {
        name: 'Supporter Pack',
        votes: 25,
        price: 1000,
        currency: 'NGN',
        discount: 20,
        popular: false,
        description: '25 votes with 20% discount',
      },
      {
        name: 'Fan Pack',
        votes: 50,
        price: 1800,
        currency: 'NGN',
        discount: 28,
        popular: true,
        description: '50 votes - Most popular package!',
      },
      {
        name: 'Super Fan Pack',
        votes: 100,
        price: 3200,
        currency: 'NGN',
        discount: 36,
        popular: false,
        description: '100 votes with maximum discount',
      },
    ])
    console.log('✅ Created vote packages\n')

    console.log('🎊 Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('\n✨ All done! Your database is ready to use.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error)
    process.exit(1)
  })
