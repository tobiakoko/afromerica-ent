/**
 * Supabase Database Types
 * Generated types for type-safe database queries
 *
 * To regenerate: npx supabase gen types typescript --local > types/supabase.ts
 * Or from remote: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'editor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'editor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'editor'
          created_at?: string
          updated_at?: string
        }
      }
      venues: {
        Row: {
          id: string
          name: string
          slug: string
          address: string
          city: string
          state: string | null
          country: string
          coordinates: Json | null
          capacity: number | null
          description: string | null
          image_url: string | null
          amenities: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          address: string
          city: string
          state?: string | null
          country?: string
          coordinates?: Json | null
          capacity?: number | null
          description?: string | null
          image_url?: string | null
          amenities?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          address?: string
          city?: string
          state?: string | null
          country?: string
          coordinates?: Json | null
          capacity?: number | null
          description?: string | null
          image_url?: string | null
          amenities?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          short_description: string | null
          date: string
          end_date: string | null
          time: string | null
          capacity: number | null
          tickets_sold: number
          status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'soldout'
          category: 'concert' | 'festival' | 'club' | 'private' | 'tour' | null
          featured: boolean
          image_url: string | null
          cover_image_url: string | null
          gallery: Json | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          short_description?: string | null
          date: string
          end_date?: string | null
          time?: string | null
          capacity?: number | null
          tickets_sold?: number
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'soldout'
          category?: 'concert' | 'festival' | 'club' | 'private' | 'tour' | null
          featured?: boolean
          image_url?: string | null
          cover_image_url?: string | null
          gallery?: Json | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          short_description?: string | null
          date?: string
          end_date?: string | null
          time?: string | null
          capacity?: number | null
          tickets_sold?: number
          status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'soldout'
          category?: 'concert' | 'festival' | 'club' | 'private' | 'tour' | null
          featured?: boolean
          image_url?: string | null
          cover_image_url?: string | null
          gallery?: Json | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      event_venues: {
        Row: {
          event_id: string
          venue_id: string
        }
        Insert: {
          event_id: string
          venue_id: string
        }
        Update: {
          event_id?: string
          venue_id?: string
        }
      }
      ticket_types: {
        Row: {
          id: string
          event_id: string | null
          name: string
          description: string | null
          price: number
          currency: string
          quantity: number
          available: number
          max_per_order: number | null
          sale_start: string | null
          sale_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          name: string
          description?: string | null
          price: number
          currency?: string
          quantity: number
          available: number
          max_per_order?: number | null
          sale_start?: string | null
          sale_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          name?: string
          description?: string | null
          price?: number
          currency?: string
          quantity?: number
          available?: number
          max_per_order?: number | null
          sale_start?: string | null
          sale_end?: string | null
          created_at?: string
        }
      }
      artists: {
        Row: {
          id: string
          slug: string
          name: string
          stage_name: string | null
          bio: string | null
          genre: Json | null
          image_url: string | null
          cover_image_url: string | null
          social_media: Json | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          stage_name?: string | null
          bio?: string | null
          genre?: Json | null
          image_url?: string | null
          cover_image_url?: string | null
          social_media?: Json | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          stage_name?: string | null
          bio?: string | null
          genre?: Json | null
          image_url?: string | null
          cover_image_url?: string | null
          social_media?: Json | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      event_artists: {
        Row: {
          event_id: string
          artist_id: string
          performance_order: number | null
          performance_time: string | null
          set_duration: number | null
        }
        Insert: {
          event_id: string
          artist_id: string
          performance_order?: number | null
          performance_time?: string | null
          set_duration?: number | null
        }
        Update: {
          event_id?: string
          artist_id?: string
          performance_order?: number | null
          performance_time?: string | null
          set_duration?: number | null
        }
      }
      bookings: {
        Row: {
          id: string
          event_id: string | null
          user_id: string | null
          email: string
          full_name: string
          phone: string | null
          total_amount: number
          currency: string
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string | null
          payment_reference: string | null
          paystack_reference: string | null
          booking_reference: string
          qr_code: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          email: string
          full_name: string
          phone?: string | null
          total_amount: number
          currency?: string
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_reference?: string | null
          paystack_reference?: string | null
          booking_reference: string
          qr_code?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          user_id?: string | null
          email?: string
          full_name?: string
          phone?: string | null
          total_amount?: number
          currency?: string
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_reference?: string | null
          paystack_reference?: string | null
          booking_reference?: string
          qr_code?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      booking_items: {
        Row: {
          id: string
          booking_id: string | null
          ticket_type_id: string | null
          quantity: number
          price_per_ticket: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          ticket_type_id?: string | null
          quantity: number
          price_per_ticket: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string | null
          ticket_type_id?: string | null
          quantity?: number
          price_per_ticket?: number
          total_price?: number
          created_at?: string
        }
      }
      showcase_finalists: {
        Row: {
          id: string
          name: string
          slug: string
          stage_name: string
          bio: string | null
          genre: Json | null
          image_url: string | null
          cover_image_url: string | null
          social_media: Json | null
          video_url: string | null
          performance_video_url: string | null
          vote_count: number
          rank: number | null
          is_qualified: boolean
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          stage_name: string
          bio?: string | null
          genre?: Json | null
          image_url?: string | null
          cover_image_url?: string | null
          social_media?: Json | null
          video_url?: string | null
          performance_video_url?: string | null
          vote_count?: number
          rank?: number | null
          is_qualified?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          stage_name?: string
          bio?: string | null
          genre?: Json | null
          image_url?: string | null
          cover_image_url?: string | null
          social_media?: Json | null
          video_url?: string | null
          performance_video_url?: string | null
          vote_count?: number
          rank?: number | null
          is_qualified?: boolean
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      showcase_votes: {
        Row: {
          id: string
          finalist_id: string | null
          voter_id: string
          ip_address: string | null
          user_agent: string | null
          metadata: Json | null
          voted_at: string
        }
        Insert: {
          id?: string
          finalist_id?: string | null
          voter_id: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
          voted_at?: string
        }
        Update: {
          id?: string
          finalist_id?: string | null
          voter_id?: string
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
          voted_at?: string
        }
      }
      showcase_settings: {
        Row: {
          id: string
          voting_start_date: string
          voting_end_date: string
          is_active: boolean
          top_performers_count: number
          rules_text: string | null
          banner_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          voting_start_date: string
          voting_end_date: string
          is_active?: boolean
          top_performers_count?: number
          rules_text?: string | null
          banner_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          voting_start_date?: string
          voting_end_date?: string
          is_active?: boolean
          top_performers_count?: number
          rules_text?: string | null
          banner_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pilot_artists: {
        Row: {
          id: string
          name: string
          slug: string
          stage_name: string
          bio: string | null
          genre: Json | null
          image_url: string | null
          cover_image_url: string | null
          social_media: Json | null
          performance_video_url: string | null
          total_votes: number
          total_amount: number
          rank: number | null
          display_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          stage_name: string
          bio?: string | null
          genre?: Json | null
          image_url?: string | null
          cover_image_url?: string | null
          social_media?: Json | null
          performance_video_url?: string | null
          total_votes?: number
          total_amount?: number
          rank?: number | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          stage_name?: string
          bio?: string | null
          genre?: Json | null
          image_url?: string | null
          cover_image_url?: string | null
          social_media?: Json | null
          performance_video_url?: string | null
          total_votes?: number
          total_amount?: number
          rank?: number | null
          display_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      vote_packages: {
        Row: {
          id: string
          name: string
          votes: number
          price: number
          currency: string
          discount: number
          popular: boolean
          active: boolean
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          votes: number
          price: number
          currency?: string
          discount?: number
          popular?: boolean
          active?: boolean
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          votes?: number
          price?: number
          currency?: string
          discount?: number
          popular?: boolean
          active?: boolean
          description?: string | null
          created_at?: string
        }
      }
      vote_purchases: {
        Row: {
          id: string
          reference: string
          email: string
          user_id: string | null
          total_votes: number
          total_amount: number
          currency: string
          items: Json
          payment_status: 'pending' | 'completed' | 'failed'
          payment_method: string | null
          paystack_reference: string | null
          metadata: Json | null
          purchased_at: string
          verified_at: string | null
        }
        Insert: {
          id?: string
          reference: string
          email: string
          user_id?: string | null
          total_votes: number
          total_amount: number
          currency?: string
          items: Json
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_method?: string | null
          paystack_reference?: string | null
          metadata?: Json | null
          purchased_at?: string
          verified_at?: string | null
        }
        Update: {
          id?: string
          reference?: string
          email?: string
          user_id?: string | null
          total_votes?: number
          total_amount?: number
          currency?: string
          items?: Json
          payment_status?: 'pending' | 'completed' | 'failed'
          payment_method?: string | null
          paystack_reference?: string | null
          metadata?: Json | null
          purchased_at?: string
          verified_at?: string | null
        }
      }
      vote_transactions: {
        Row: {
          id: string
          purchase_id: string | null
          artist_id: string | null
          votes: number
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          purchase_id?: string | null
          artist_id?: string | null
          votes: number
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          purchase_id?: string | null
          artist_id?: string | null
          votes?: number
          amount?: number
          created_at?: string
        }
      }
      pilot_voting_settings: {
        Row: {
          id: string
          voting_start_date: string
          voting_end_date: string
          is_active: boolean
          rules_text: string | null
          banner_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          voting_start_date: string
          voting_end_date: string
          is_active?: boolean
          rules_text?: string | null
          banner_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          voting_start_date?: string
          voting_end_date?: string
          is_active?: boolean
          rules_text?: string | null
          banner_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          status: 'active' | 'unsubscribed'
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          status?: 'active' | 'unsubscribed'
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          status?: 'active' | 'unsubscribed'
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_booking_reference: {
        Args: Record<string, never>
        Returns: string
      }
      recalculate_showcase_rankings: {
        Args: Record<string, never>
        Returns: void
      }
      recalculate_pilot_rankings: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
