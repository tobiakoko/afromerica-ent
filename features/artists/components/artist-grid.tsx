"use client";
/*
 
Grid layout for artists
    Layout wrapper for displaying artists in a grid format
    - Maps through a list of artists and renders ArtistCard components
    - Should only handle layout logic.
*/

import React, { useState } from 'react';
import { Play, Music, Calendar, MapPin, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react';

// Type Definitions
interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  image?: string;
  coverImage?: string;
  followers: string;
  monthlyListeners: string;
  social: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    youtube?: string;
  };
}

interface Album {
  id: string;
  title: string;
  year: number;
  cover?: string;
  tracks: number;
  streamingUrl?: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  city: string;
  venue: string;
  ticketsUrl?: string;
}

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    genre: string;
    image?: string;
  };
}

// Navigation Component
const Navigation: React.FC = () => {
  const navItems: Array<{ label: string; href: string }> = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Artists', href: '/artists' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="text-white text-2xl font-bold tracking-wider">
            Afromerica
          </div>
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Artist Card Component (Grid View)
const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-lime-400/20 to-purple-600/20">
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
      {artist.image ? (
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Music className="w-20 h-20 text-white/40" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-16 h-16 rounded-full bg-lime-400 flex items-center justify-center">
          <Play className="w-8 h-8 text-black ml-1" />
        </div>
      </div>
    </div>
    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-lime-400 transition-colors">
      {artist.name}
    </h3>
    <p className="text-white/60 text-sm">{artist.genre}</p>
  </div>
);

// Album Card Component
interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-lime-400/10 to-purple-600/10">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
    <h4 className="text-white font-semibold text-sm mb-1">{album.title}</h4>
    <p className="text-white/60 text-xs">{album.year} • {album.tracks} tracks</p>
  </div>
);

// Event Row Component
interface EventRowProps {
  event: UpcomingEvent;
}

// Featured Events Row Component
const EventRow: React.FC<EventRowProps> = ({ event }) => (
  <div className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-lime-400/50 transition-all duration-300">
    <div className="flex-1">
      <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-lime-400 transition-colors">
        {event.title}
      </h4>
      <div className="flex flex-wrap gap-4 text-white/60 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}, {event.city}</span>
        </div>
      </div>
    </div>
    <button className="px-6 py-3 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-500 transition-colors duration-200 whitespace-nowrap">
      Tickets
    </button>
  </div>
);

// Artists Listing Page Component
const ArtistsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'afrobeats' | 'hiphop' | 'rnb'>('all');

  const featuredArtists = [
    { id: '1', name: 'Burna Boy', genre: 'Afrobeats', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80' },
    { id: '2', name: 'Wizkid', genre: 'Afrobeats', image: 'https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=400&q=80' },
    { id: '3', name: 'Tems', genre: 'R&B/Soul', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80' },
    { id: '4', name: 'Rema', genre: 'Afrobeats', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
    { id: '5', name: 'Ayra Starr', genre: 'Afrobeats/Pop', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
    { id: '6', name: 'Asake', genre: 'Afrobeats', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' },
    { id: '7', name: 'Omah Lay', genre: 'Afrobeats/R&B', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
    { id: '8', name: 'Fireboy DML', genre: 'Afrobeats', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80' }
  ];

  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Afrobeat Nights',
      date: 'SAT, DEC 14',
      location: 'Eko Hotel',
      city: 'Lagos',
      venue: 'Grand Ballroom'
    },
    {
      id: '2',
      title: 'Hip-Hop Summit',
      date: 'FRI, DEC 20',
      location: 'Hard Rock Cafe',
      city: 'Lagos',
      venue: 'Main Stage'
    },
    {
      id: '3',
      title: 'New Year Countdown',
      date: 'TUE, DEC 31',
      location: 'Landmark Beach',
      city: 'Lagos',
      venue: 'Beach Stage'
    },
    {
      id: '4',
      title: 'Jazz & Soul Night',
      date: 'SAT, JAN 11',
      location: 'Terra Kulture',
      city: 'Lagos',
      venue: 'Arena'
    }
  ];

  const albums: Album[] = [
    { id: '1', title: 'African Giant', year: 2023, tracks: 19 },
    { id: '2', title: 'Made in Lagos', year: 2023, tracks: 14 },
    { id: '3', title: 'For Broken Ears', year: 2022, tracks: 11 },
    { id: '4', title: 'Love Damini', year: 2024, tracks: 19 }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-transparent to-transparent"></div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-lime-400/10 text-lime-400 text-xs font-bold uppercase tracking-wider rounded-full border border-lime-400/20">
                Featured Artists
              </span>
            </div>
            <h1 className="mb-6 font-light text-6xl md:text-8xl text-white leading-tight">
              Discover
              <span className="block text-lime-400">African talent</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
              From Afrobeats to Hip-Hop, explore the artists shaping the sound of a generation
            </p>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          {/* Filters */}
          <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
            {(['all', 'afrobeats', 'hiphop', 'rnb'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-lime-400 text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Artists' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Artists Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container mx-auto px-8">
          <div className="mb-12">
            <p className="text-lime-400 text-sm font-semibold uppercase tracking-wider mb-2">
              Upcoming
            </p>
            <h2 className="text-5xl font-light text-white mb-4">Events</h2>
            <p className="text-white/60">
              Track to get concert, live stream and tour updates.
            </p>
          </div>

          <div className="space-y-4 max-w-5xl">
            {upcomingEvents.map((event: UpcomingEvent) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-12">
            <button className="px-8 py-4 bg-white/5 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200 border border-white/10">
              View All Events
            </button>
          </div>
        </div>
      </section>

      {/* Discography Section */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="mb-12">
            <h2 className="text-5xl font-light text-white mb-4">Latest releases</h2>
            <p className="text-white/60">
              New music from our featured artists
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album: Album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-lime-400 to-lime-500 p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-black mb-6">
                Become a featured artist
              </h2>
              <p className="text-black/80 text-xl mb-8 max-w-2xl mx-auto">
                Join Afromerica Entertainment and reach thousands of music lovers
              </p>
              <button className="px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-black/90 transition-colors duration-200">
                Submit Your Music
              </button>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArtistsPage;