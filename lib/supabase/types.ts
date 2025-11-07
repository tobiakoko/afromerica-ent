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
      artists: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          bio: string | null
          image_url: string | null
          genre: string[]
          location: string | null
          city: string | null
          state: string | null
          country: string | null
          email: string | null
          phone: string | null
          website: string | null
          social_media: Json | null
          specialties: string[]
          awards: string[]
          rating: number | null
          total_bookings: number
          joined_date: string
          status: "active" | "inactive"
          featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          bio?: string | null
          image_url?: string | null
          genre?: string[]
          location?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          social_media?: Json | null
          specialties?: string[]
          awards?: string[]
          rating?: number | null
          total_bookings?: number
          joined_date?: string
          status?: "active" | "inactive"
          featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          bio?: string | null
          image_url?: string | null
          genre?: string[]
          location?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          email?: string | null
          phone?: string | null
          website?: string | null
          social_media?: Json | null
          specialties?: string[]
          awards?: string[]
          rating?: number | null
          total_bookings?: number
          joined_date?: string
          status?: "active" | "inactive"
          featured?: boolean
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          description: string | null
          short_description: string | null
          image_url: string | null
          category: string
          date: string
          start_time: string
          end_time: string
          venue: string
          address: string
          city: string
          state: string
          country: string
          zip_code: string | null
          latitude: number | null
          longitude: number | null
          pricing: Json
          capacity: number
          attendees: number
          highlights: string[]
          age_requirement: string | null
          dress_code: string | null
          refund_policy: string | null
          accessibility: string | null
          status: "upcoming" | "ongoing" | "past" | "cancelled"
          featured: boolean
          ticket_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          description?: string | null
          short_description?: string | null
          image_url?: string | null
          category: string
          date: string
          start_time: string
          end_time: string
          venue: string
          address: string
          city: string
          state: string
          country?: string
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          pricing: Json
          capacity: number
          attendees?: number
          highlights?: string[]
          age_requirement?: string | null
          dress_code?: string | null
          refund_policy?: string | null
          accessibility?: string | null
          status?: "upcoming" | "ongoing" | "past" | "cancelled"
          featured?: boolean
          ticket_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          image_url?: string | null
          category?: string
          date?: string
          start_time?: string
          end_time?: string
          venue?: string
          address?: string
          city?: string
          state?: string
          country?: string
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          pricing?: Json
          capacity?: number
          attendees?: number
          highlights?: string[]
          age_requirement?: string | null
          dress_code?: string | null
          refund_policy?: string | null
          accessibility?: string | null
          status?: "upcoming" | "ongoing" | "past" | "cancelled"
          featured?: boolean
          ticket_url?: string | null
        }
        Relationships: []
      }
      event_artists: {
        Row: {
          id: string
          event_id: string
          artist_id: string
          role: string
          set_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          artist_id: string
          role: string
          set_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          artist_id?: string
          role?: string
          set_time?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_artists_artist_id_fkey"
            columns: ["artist_id"]
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_artists_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          event_id: string
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          ticket_type: string
          quantity: number
          total_amount: number
          currency: string
          status: "pending" | "confirmed" | "cancelled" | "refunded"
          payment_status: "pending" | "completed" | "failed"
          payment_reference: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          event_id: string
          user_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          ticket_type: string
          quantity: number
          total_amount: number
          currency?: string
          status?: "pending" | "confirmed" | "cancelled" | "refunded"
          payment_status?: "pending" | "completed" | "failed"
          payment_reference?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          event_id?: string
          user_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          ticket_type?: string
          quantity?: number
          total_amount?: number
          currency?: string
          status?: "pending" | "confirmed" | "cancelled" | "refunded"
          payment_status?: "pending" | "completed" | "failed"
          payment_reference?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: "user" | "artist" | "admin"
          bio: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: "user" | "artist" | "admin"
          bio?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: "user" | "artist" | "admin"
          bio?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
