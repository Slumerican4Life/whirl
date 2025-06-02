export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_agents: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          description: string
          id: string
          name: string
          personality: Json | null
          specialization: string
          title: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          personality?: Json | null
          specialization: string
          title: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          personality?: Json | null
          specialization?: string
          title?: string
        }
        Relationships: []
      }
      avatar_customizations: {
        Row: {
          avatar_url: string | null
          effects: Database["public"]["Enums"]["avatar_effect_enum"][] | null
          frame_type:
            | Database["public"]["Enums"]["avatar_frame_type_enum"]
            | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          effects?: Database["public"]["Enums"]["avatar_effect_enum"][] | null
          frame_type?:
            | Database["public"]["Enums"]["avatar_frame_type_enum"]
            | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          effects?: Database["public"]["Enums"]["avatar_effect_enum"][] | null
          frame_type?:
            | Database["public"]["Enums"]["avatar_frame_type_enum"]
            | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avatar_customizations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      badge_definitions: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          requirements: Json | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          requirements?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          requirements?: Json | null
        }
        Relationships: []
      }
      battles: {
        Row: {
          battle_type: string | null
          category: string | null
          created_at: string | null
          end_time: string | null
          id: string
          start_time: string | null
          status: string | null
          updated_at: string | null
          video1_id: string | null
          video2_id: string | null
          winner_video_id: string | null
        }
        Insert: {
          battle_type?: string | null
          category?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          video1_id?: string | null
          video2_id?: string | null
          winner_video_id?: string | null
        }
        Update: {
          battle_type?: string | null
          category?: string | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
          video1_id?: string | null
          video2_id?: string | null
          winner_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "battles_video1_id_fkey"
            columns: ["video1_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_video2_id_fkey"
            columns: ["video2_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battles_winner_video_id_fkey"
            columns: ["winner_video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      boosted_videos: {
        Row: {
          boost_type: Database["public"]["Enums"]["boost_type_enum"]
          created_at: string
          end_time: string
          id: string
          start_time: string
          user_id: string
          video_id: string
        }
        Insert: {
          boost_type: Database["public"]["Enums"]["boost_type_enum"]
          created_at?: string
          end_time: string
          id?: string
          start_time?: string
          user_id: string
          video_id: string
        }
        Update: {
          boost_type?: Database["public"]["Enums"]["boost_type_enum"]
          created_at?: string
          end_time?: string
          id?: string
          start_time?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "boosted_videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boosted_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      help_articles: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          keywords: string[] | null
          page_context: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          page_context?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          page_context?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      help_sessions: {
        Row: {
          created_at: string | null
          id: string
          messages: Json | null
          page_url: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages?: Json | null
          page_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          messages?: Json | null
          page_url?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      owner_settings: {
        Row: {
          created_at: string
          current_owner_email: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_owner_email: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_owner_email?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_stripe_connected: boolean | null
          stripe_connect_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          is_stripe_connected?: boolean | null
          stripe_connect_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_stripe_connected?: boolean | null
          stripe_connect_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      role_change_log: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_role: Database["public"]["Enums"]["app_role"] | null
          previous_role: Database["public"]["Enums"]["app_role"] | null
          reason: string | null
          target_email: string | null
          target_user_id: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"] | null
          previous_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          target_email?: string | null
          target_user_id?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"] | null
          previous_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          target_email?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      shoutouts: {
        Row: {
          created_at: string
          id: string
          message: string
          shout_type: Database["public"]["Enums"]["shoutout_type_enum"] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          shout_type?: Database["public"]["Enums"]["shoutout_type_enum"] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          shout_type?: Database["public"]["Enums"]["shoutout_type_enum"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shoutouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tip_jar: {
        Row: {
          amount_cents: number
          created_at: string
          from_user_id: string
          id: string
          stripe_charge_id: string | null
          tier: Database["public"]["Enums"]["tip_tier_enum"]
          to_user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          from_user_id: string
          id?: string
          stripe_charge_id?: string | null
          tier: Database["public"]["Enums"]["tip_tier_enum"]
          to_user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          from_user_id?: string
          id?: string
          stripe_charge_id?: string | null
          tier?: Database["public"]["Enums"]["tip_tier_enum"]
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tip_jar_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tip_jar_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      token_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          gift_message: string | null
          gifted_by: string | null
          id: string
          recipient_email: string | null
          related_battle_id: string | null
          related_video_id: string | null
          stripe_checkout_session_id: string | null
          transaction_type: Database["public"]["Enums"]["token_transaction_type_enum"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          gift_message?: string | null
          gifted_by?: string | null
          id?: string
          recipient_email?: string | null
          related_battle_id?: string | null
          related_video_id?: string | null
          stripe_checkout_session_id?: string | null
          transaction_type: Database["public"]["Enums"]["token_transaction_type_enum"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          gift_message?: string | null
          gifted_by?: string | null
          id?: string
          recipient_email?: string | null
          related_battle_id?: string | null
          related_video_id?: string | null
          stripe_checkout_session_id?: string | null
          transaction_type?: Database["public"]["Enums"]["token_transaction_type_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_related_video_id_fkey"
            columns: ["related_video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      token_wallets: {
        Row: {
          balance: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      truth_analyses: {
        Row: {
          agent_id: string | null
          analysis_text: string
          confidence_score: number | null
          created_at: string | null
          evidence_links: Json | null
          id: string
          truth_video_id: string | null
          verdict: string
        }
        Insert: {
          agent_id?: string | null
          analysis_text: string
          confidence_score?: number | null
          created_at?: string | null
          evidence_links?: Json | null
          id?: string
          truth_video_id?: string | null
          verdict: string
        }
        Update: {
          agent_id?: string | null
          analysis_text?: string
          confidence_score?: number | null
          created_at?: string | null
          evidence_links?: Json | null
          id?: string
          truth_video_id?: string | null
          verdict?: string
        }
        Relationships: [
          {
            foreignKeyName: "truth_analyses_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "truth_analyses_truth_video_id_fkey"
            columns: ["truth_video_id"]
            isOneToOne: false
            referencedRelation: "truth_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      truth_videos: {
        Row: {
          category: string
          claims: Json | null
          created_at: string | null
          id: string
          truth_score: number | null
          verification_status: string | null
          video_id: string | null
        }
        Insert: {
          category: string
          claims?: Json | null
          created_at?: string | null
          id?: string
          truth_score?: number | null
          verification_status?: string | null
          video_id?: string | null
        }
        Update: {
          category?: string
          claims?: Json | null
          created_at?: string | null
          id?: string
          truth_score?: number | null
          verification_status?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "truth_videos_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_2fa_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string | null
          enabled: boolean | null
          id: string
          method: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          method?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          method?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_phone_verification: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          phone_number: string
          user_id: string
          verification_code: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          phone_number: string
          user_id: string
          verification_code: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          phone_number?: string
          user_id?: string
          verification_code?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          permissions: Json | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          permissions?: Json | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          battles_participated: number | null
          created_at: string | null
          id: string
          tokens_earned: number | null
          total_losses: number | null
          total_wins: number | null
          updated_at: string | null
          user_id: string
          videos_uploaded: number | null
        }
        Insert: {
          battles_participated?: number | null
          created_at?: string | null
          id?: string
          tokens_earned?: number | null
          total_losses?: number | null
          total_wins?: number | null
          updated_at?: string | null
          user_id: string
          videos_uploaded?: number | null
        }
        Update: {
          battles_participated?: number | null
          created_at?: string | null
          id?: string
          tokens_earned?: number | null
          total_losses?: number | null
          total_wins?: number | null
          updated_at?: string | null
          user_id?: string
          videos_uploaded?: number | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier_enum"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier_enum"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier_enum"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          boost_expiry: string | null
          boosted: boolean | null
          caption: string | null
          category: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          thumbnail_url: string | null
          title: string
          user_id: string
          video_url: string
        }
        Insert: {
          boost_expiry?: string | null
          boosted?: boolean | null
          caption?: string | null
          category?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          thumbnail_url?: string | null
          title: string
          user_id: string
          video_url: string
        }
        Update: {
          boost_expiry?: string | null
          boosted?: boolean | null
          caption?: string | null
          category?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          user_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      viral_content: {
        Row: {
          description: string | null
          engagement_score: number | null
          external_id: string
          fetched_at: string | null
          id: string
          platform: string
          processed: boolean | null
          thumbnail_url: string | null
          title: string
          video_url: string
          view_count: number | null
        }
        Insert: {
          description?: string | null
          engagement_score?: number | null
          external_id: string
          fetched_at?: string | null
          id?: string
          platform: string
          processed?: boolean | null
          thumbnail_url?: string | null
          title: string
          video_url: string
          view_count?: number | null
        }
        Update: {
          description?: string | null
          engagement_score?: number | null
          external_id?: string
          fetched_at?: string | null
          id?: string
          platform?: string
          processed?: boolean | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string
          view_count?: number | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          tokens_spent: number
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tokens_spent?: number
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tokens_spent?: number
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "manager" | "user"
      avatar_effect_enum: "none" | "sparkle" | "vortex"
      avatar_frame_type_enum: "basic" | "premium" | "glowing"
      boost_type_enum: "homepage_pin" | "battle_highlight"
      shoutout_type_enum: "standard" | "highlighted"
      subscription_tier_enum: "basic" | "premium"
      tip_tier_enum: "small" | "medium" | "large"
      token_transaction_type_enum:
        | "purchase"
        | "vote"
        | "boost_video"
        | "avatar_customization"
        | "tip_sent"
        | "tip_received"
        | "gift"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "manager", "user"],
      avatar_effect_enum: ["none", "sparkle", "vortex"],
      avatar_frame_type_enum: ["basic", "premium", "glowing"],
      boost_type_enum: ["homepage_pin", "battle_highlight"],
      shoutout_type_enum: ["standard", "highlighted"],
      subscription_tier_enum: ["basic", "premium"],
      tip_tier_enum: ["small", "medium", "large"],
      token_transaction_type_enum: [
        "purchase",
        "vote",
        "boost_video",
        "avatar_customization",
        "tip_sent",
        "tip_received",
        "gift",
      ],
    },
  },
} as const
