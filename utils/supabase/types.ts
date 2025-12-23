export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          last_login_at: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          last_login_at?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          artist_id: string | null
          bio: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          genre: string[] | null
          id: string
          instagram: string | null
          is_active: boolean
          location: string | null
          name: string
          photo_url: string | null
          rank: number | null
          previous_rank: number | null
          slug: string
          stage_name: string | null
          tiktok: string | null
          total_vote_amount: number
          total_votes: number
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          genre?: string[] | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          location?: string | null
          name: string
          photo_url?: string | null
          rank?: number | null
          previous_rank?: number | null
          slug: string
          stage_name?: string | null
          tiktok?: string | null
          total_vote_amount?: number
          total_votes?: number
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          genre?: string[] | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          location?: string | null
          name?: string
          photo_url?: string | null
          rank?: number | null
          previous_rank?: number | null
          slug?: string
          stage_name?: string | null
          tiktok?: string | null
          total_vote_amount?: number
          total_votes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          response: string | null
          status: Database["public"]["Enums"]["message_status"]
          subject: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          subject: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: Database["public"]["Enums"]["message_status"]
          subject?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          city: string | null
          cover_image_url: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          end_date: string | null
          event_date: string
          featured: boolean
          id: string
          image_url: string | null
          is_active: boolean
          is_published: boolean
          metadata: Json | null
          published_at: string | null
          short_description: string | null
          show_leaderboard: boolean
          slug: string
          status: Database["public"]["Enums"]["event_status"]
          ticket_price: number | null
          tickets_sold: number
          time: string | null
          title: string
          updated_at: string
          venue: string
          venue_address: string | null
        }
        Insert: {
          capacity?: number | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date: string
          featured?: boolean
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_published?: boolean
          metadata?: Json | null
          published_at?: string | null
          short_description?: string | null
          show_leaderboard?: boolean
          slug: string
          status?: Database["public"]["Enums"]["event_status"]
          ticket_price?: number | null
          tickets_sold?: number
          time?: string | null
          title: string
          updated_at?: string
          venue: string
          venue_address?: string | null
        }
        Update: {
          capacity?: number | null
          city?: string | null
          cover_image_url?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_published?: boolean
          metadata?: Json | null
          published_at?: string | null
          short_description?: string | null
          show_leaderboard?: boolean
          slug?: string
          status?: Database["public"]["Enums"]["event_status"]
          ticket_price?: number | null
          tickets_sold?: number
          time?: string | null
          title?: string
          updated_at?: string
          venue?: string
          venue_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      ticket_types: {
        Row: {
          available: number
          created_at: string
          currency: string
          description: string | null
          display_order: number | null
          event_id: string
          id: string
          is_active: boolean
          max_per_order: number | null
          name: string
          price: number
          quantity: number
          updated_at: string
        }
        Insert: {
          available: number
          created_at?: string
          currency?: string
          description?: string | null
          display_order?: number | null
          event_id: string
          id?: string
          is_active?: boolean
          max_per_order?: number | null
          name: string
          price: number
          quantity: number
          updated_at?: string
        }
        Update: {
          available?: number
          created_at?: string
          currency?: string
          description?: string | null
          display_order?: number | null
          event_id?: string
          id?: string
          is_active?: boolean
          max_per_order?: number | null
          name?: string
          price?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          booking_reference: string
          booking_status: Database["public"]["Enums"]["booking_status"]
          check_in_code: string | null
          checked_in_at: string | null
          created_at: string
          currency: string
          event_id: string
          id: string
          metadata: Json | null
          payment_method: string | null
          payment_reference: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          paystack_access_code: string | null
          paystack_reference: string | null
          price_per_ticket: number
          qr_code: string | null
          quantity: number
          ticket_type_id: string | null
          total_amount: number
          updated_at: string
          user_email: string
          user_name: string
          user_phone: string | null
          verified_at: string | null
        }
        Insert: {
          booking_reference?: string
          booking_status?: Database["public"]["Enums"]["booking_status"]
          check_in_code?: string | null
          checked_in_at?: string | null
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          paystack_access_code?: string | null
          paystack_reference?: string | null
          price_per_ticket: number
          qr_code?: string | null
          quantity: number
          ticket_type_id?: string | null
          total_amount: number
          updated_at?: string
          user_email: string
          user_name: string
          user_phone?: string | null
          verified_at?: string | null
        }
        Update: {
          booking_reference?: string
          booking_status?: Database["public"]["Enums"]["booking_status"]
          check_in_code?: string | null
          checked_in_at?: string | null
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          payment_reference?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          paystack_access_code?: string | null
          paystack_reference?: string | null
          price_per_ticket?: number
          qr_code?: string | null
          quantity?: number
          ticket_type_id?: string | null
          total_amount?: number
          updated_at?: string
          user_email?: string
          user_name?: string
          user_phone?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      vote_packages: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          discount: number | null
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          popular: boolean | null
          price: number
          updated_at: string
          votes: number
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          discount?: number | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          popular?: boolean | null
          price: number
          updated_at?: string
          votes: number
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          discount?: number | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          popular?: boolean | null
          price?: number
          updated_at?: string
          votes?: number
        }
        Relationships: []
      }
      vote_validations: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          identifier: string
          ip_address: string | null
          is_used: boolean | null
          is_verified: boolean | null
          max_attempts: number
          method: Database["public"]["Enums"]["otp_method"]
          user_agent: string | null
          verification_code: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at: string
          id?: string
          identifier: string
          ip_address?: string | null
          is_used?: boolean | null
          is_verified?: boolean | null
          max_attempts?: number
          method: Database["public"]["Enums"]["otp_method"]
          user_agent?: string | null
          verification_code: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          identifier?: string
          ip_address?: string | null
          is_used?: boolean | null
          is_verified?: boolean | null
          max_attempts?: number
          method?: Database["public"]["Enums"]["otp_method"]
          user_agent?: string | null
          verification_code?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          amount_paid: number
          artist_id: string
          created_at: string
          currency: string
          event_id: string | null
          id: string
          items: Json | null
          metadata: Json | null
          otp_verified: boolean | null
          payment_method: string | null
          payment_reference: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          paystack_access_code: string | null
          paystack_reference: string | null
          updated_at: string
          user_identifier: string
          user_name: string | null
          validation_token: string | null
          verified_at: string | null
          vote_count: number
        }
        Insert: {
          amount_paid: number
          artist_id: string
          created_at?: string
          currency?: string
          event_id?: string | null
          id?: string
          items?: Json | null
          metadata?: Json | null
          otp_verified?: boolean | null
          payment_method?: string | null
          payment_reference: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          paystack_access_code?: string | null
          paystack_reference?: string | null
          updated_at?: string
          user_identifier: string
          user_name?: string | null
          validation_token?: string | null
          verified_at?: string | null
          vote_count: number
        }
        Update: {
          amount_paid?: number
          artist_id?: string
          created_at?: string
          currency?: string
          event_id?: string | null
          id?: string
          items?: Json | null
          metadata?: Json | null
          otp_verified?: boolean | null
          payment_method?: string | null
          payment_reference?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          paystack_access_code?: string | null
          paystack_reference?: string | null
          updated_at?: string
          user_identifier?: string
          user_name?: string | null
          validation_token?: string | null
          verified_at?: string | null
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artist_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          headers: Json | null
          id: string
          payload: Json
          processed: boolean | null
          processed_at: string | null
          reference: string | null
          source: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          headers?: Json | null
          id?: string
          payload: Json
          processed?: boolean | null
          processed_at?: string | null
          reference?: string | null
          source: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          headers?: Json | null
          id?: string
          payload?: Json
          processed?: boolean | null
          processed_at?: string | null
          reference?: string | null
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      artist_final_leaderboard: {
        Row: {
          avg_votes_per_transaction: number | null
          completed_transactions: number | null
          final_rank: number | null
          id: string | null
          is_top_10: boolean | null
          judges_score: number | null
          name: string | null
          paid_score: number | null
          performance_score: number | null
          photo_url: string | null
          previous_rank: number | null
          public_score: number | null
          rank: number | null
          slug: string | null
          stage_name: string | null
          total_score: number | null
          total_vote_amount: number | null
          total_votes: number | null
          transaction_count: number | null
        }
        Relationships: []
      }
      artist_leaderboard: {
        Row: {
          avg_votes_per_transaction: number | null
          completed_transactions: number | null
          id: string | null
          name: string | null
          photo_url: string | null
          rank: number | null
          previous_rank: number | null
          slug: string | null
          stage_name: string | null
          total_vote_amount: number | null
          total_votes: number | null
          transaction_count: number | null
        }
        Relationships: []
      }
      event_analytics: {
        Row: {
          avg_ticket_value: number | null
          capacity: number | null
          completed_bookings: number | null
          event_date: string | null
          id: string | null
          occupancy_percentage: number | null
          slug: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          tickets_sold: number | null
          title: string | null
          total_bookings: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_validations: { Args: never; Returns: undefined }
      cleanup_old_webhook_logs: { Args: never; Returns: undefined }
      generate_booking_reference: { Args: never; Returns: string }
      generate_check_in_code: { Args: never; Returns: string }
      is_valid_email: { Args: { email: string }; Returns: boolean }
      is_valid_phone: { Args: { phone: string }; Returns: boolean }
      recalculate_artist_rankings: { Args: never; Returns: undefined }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "checked_in"
      event_status:
        | "draft"
        | "upcoming"
        | "ongoing"
        | "completed"
        | "cancelled"
        | "soldout"
        | "published"
      message_status: "new" | "read" | "replied" | "archived"
      otp_method: "email" | "sms"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "checked_in"],
      event_status: [
        "draft",
        "upcoming",
        "ongoing",
        "completed",
        "cancelled",
        "soldout",
        "published",
      ],
      message_status: ["new", "read", "replied", "archived"],
      otp_method: ["email", "sms"],
      payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
    },
  },
} as const

// ==========================================
// Updated TypeScript Types for Composite Scoring
// ==========================================

// Add to your existing types file (utils/supabase.types.ts)

export interface ArtistScoring {
  paid_score: number;           // 35% - from votes
  public_score: number;          // 10% - social media
  judges_score: number;          // 30% - judges evaluation
  performance_score: number;     // 25% - live performance
  total_score: number;           // 100% - composite
  final_rank: number | null;     // Final ranking
  is_top_10: boolean;            // Top 10 indicator
}

// Extended Artist type with scoring
export interface ArtistWithFinalScores extends Artist {
  paid_score: number;
  public_score: number;
  judges_score: number;
  performance_score: number;
  total_score: number;
  final_rank: number | null;
  is_top_10: boolean;
}

// Score history type
export interface ArtistScoreHistory {
  id: string;
  artist_id: string;
  paid_score: number;
  public_score: number;
  judges_score: number;
  performance_score: number;
  total_score: number;
  rank: number | null;
  notes: string | null;
  created_at: string;
  created_by: string | null;
}

// For the final leaderboard view
export interface FinalLeaderboardEntry {
  id: string;
  artist_id: string;
  slug: string;
  name: string;
  stage_name: string | null;
  photo_url: string | null;
  cover_image_url: string | null;
  genre: string[] | null;
  location: string | null;
  // Scoring breakdown
  paid_score: number;
  public_score: number;
  judges_score: number;
  performance_score: number;
  total_score: number;
  // Rankings
  final_rank: number;
  is_top_10: boolean;
  // Original vote data
  total_votes: number;
  total_vote_amount: number;
  leaderboard_rank: number | null;
  // Metadata
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Update your existing Artist type in the Row interface
export interface Artist {
  // ... existing fields ...
  paid_score: number;
  public_score: number;
  judges_score: number;
  performance_score: number;
  total_score: number;
  final_rank: number | null;
  is_top_10: boolean;
}