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
      account_metrics: {
        Row: {
          accounts_engaged: number
          accounts_reached: number
          avg_comments: number
          avg_engagement_rate: number
          avg_likes: number
          avg_views: number
          created_at: string
          follower_count: number
          follower_growth: number
          growth_score: number
          id: string
          post_count: number
          posts_last_period: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accounts_engaged?: number
          accounts_reached?: number
          avg_comments?: number
          avg_engagement_rate?: number
          avg_likes?: number
          avg_views?: number
          created_at?: string
          follower_count?: number
          follower_growth?: number
          growth_score?: number
          id?: string
          post_count?: number
          posts_last_period?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accounts_engaged?: number
          accounts_reached?: number
          avg_comments?: number
          avg_engagement_rate?: number
          avg_likes?: number
          avg_views?: number
          created_at?: string
          follower_count?: number
          follower_growth?: number
          growth_score?: number
          id?: string
          post_count?: number
          posts_last_period?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      instagram_reels: {
        Row: {
          average_watch_time: number | null
          caption: string | null
          comments_count: number | null
          created_at: string
          display_url: string | null
          engagement_rate: number | null
          follows_from_post: number | null
          hashtags: string[] | null
          id: string
          impressions_count: number | null
          instagram_account: string
          is_business_account: boolean | null
          is_private: boolean | null
          is_sponsored: boolean | null
          is_verified: boolean | null
          likes_count: number | null
          location_info: Json | null
          media_type: string | null
          mentions: string[] | null
          music_info: Json | null
          owner_full_name: string | null
          owner_id: string | null
          owner_profile_pic_url: string | null
          owner_username: string | null
          reach_count: number | null
          reel_id: string
          saves_count: number | null
          shares_count: number | null
          thumbnail_url: string | null
          timestamp: string
          updated_at: string
          url: string
          user_id: string
          video_duration: number | null
          views_count: number | null
        }
        Insert: {
          average_watch_time?: number | null
          caption?: string | null
          comments_count?: number | null
          created_at?: string
          display_url?: string | null
          engagement_rate?: number | null
          follows_from_post?: number | null
          hashtags?: string[] | null
          id?: string
          impressions_count?: number | null
          instagram_account: string
          is_business_account?: boolean | null
          is_private?: boolean | null
          is_sponsored?: boolean | null
          is_verified?: boolean | null
          likes_count?: number | null
          location_info?: Json | null
          media_type?: string | null
          mentions?: string[] | null
          music_info?: Json | null
          owner_full_name?: string | null
          owner_id?: string | null
          owner_profile_pic_url?: string | null
          owner_username?: string | null
          reach_count?: number | null
          reel_id: string
          saves_count?: number | null
          shares_count?: number | null
          thumbnail_url?: string | null
          timestamp: string
          updated_at?: string
          url: string
          user_id: string
          video_duration?: number | null
          views_count?: number | null
        }
        Update: {
          average_watch_time?: number | null
          caption?: string | null
          comments_count?: number | null
          created_at?: string
          display_url?: string | null
          engagement_rate?: number | null
          follows_from_post?: number | null
          hashtags?: string[] | null
          id?: string
          impressions_count?: number | null
          instagram_account?: string
          is_business_account?: boolean | null
          is_private?: boolean | null
          is_sponsored?: boolean | null
          is_verified?: boolean | null
          likes_count?: number | null
          location_info?: Json | null
          media_type?: string | null
          mentions?: string[] | null
          music_info?: Json | null
          owner_full_name?: string | null
          owner_id?: string | null
          owner_profile_pic_url?: string | null
          owner_username?: string | null
          reach_count?: number | null
          reel_id?: string
          saves_count?: number | null
          shares_count?: number | null
          thumbnail_url?: string | null
          timestamp?: string
          updated_at?: string
          url?: string
          user_id?: string
          video_duration?: number | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "instagram_reels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_metrics: {
        Row: {
          avg_watch_percentage: number | null
          comments: number
          comments_reach_ratio: number
          created_at: string
          engagement_rate: number
          follows_from_post: number
          follows_reach_ratio: number
          id: string
          impressions: number
          likes: number
          likes_reach_ratio: number
          post_id: string
          reach: number
          saves: number
          saves_reach_ratio: number
          shares: number
          updated_at: string
          user_id: string
          video_duration: number | null
          virality_score: number
        }
        Insert: {
          avg_watch_percentage?: number | null
          comments?: number
          comments_reach_ratio?: number
          created_at?: string
          engagement_rate?: number
          follows_from_post?: number
          follows_reach_ratio?: number
          id?: string
          impressions?: number
          likes?: number
          likes_reach_ratio?: number
          post_id: string
          reach?: number
          saves?: number
          saves_reach_ratio?: number
          shares?: number
          updated_at?: string
          user_id: string
          video_duration?: number | null
          virality_score?: number
        }
        Update: {
          avg_watch_percentage?: number | null
          comments?: number
          comments_reach_ratio?: number
          created_at?: string
          engagement_rate?: number
          follows_from_post?: number
          follows_reach_ratio?: number
          id?: string
          impressions?: number
          likes?: number
          likes_reach_ratio?: number
          post_id?: string
          reach?: number
          saves?: number
          saves_reach_ratio?: number
          shares?: number
          updated_at?: string
          user_id?: string
          video_duration?: number | null
          virality_score?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          instagram_account: string | null
          name: string | null
          niche: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          instagram_account?: string | null
          name?: string | null
          niche?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          instagram_account?: string | null
          name?: string | null
          niche?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reel_metrics_history: {
        Row: {
          comments_count: number | null
          created_at: string | null
          id: string
          likes_count: number | null
          reel_id: string
          saves_count: number | null
          shares_count: number | null
          timestamp: string | null
          user_id: string
          views_count: number | null
        }
        Insert: {
          comments_count?: number | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          reel_id: string
          saves_count?: number | null
          shares_count?: number | null
          timestamp?: string | null
          user_id: string
          views_count?: number | null
        }
        Update: {
          comments_count?: number | null
          created_at?: string | null
          id?: string
          likes_count?: number | null
          reel_id?: string
          saves_count?: number | null
          shares_count?: number | null
          timestamp?: string | null
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reel_metrics_history_reel_id_fkey"
            columns: ["reel_id"]
            isOneToOne: false
            referencedRelation: "instagram_reels"
            referencedColumns: ["reel_id"]
          },
          {
            foreignKeyName: "reel_metrics_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_recent_instagram_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
