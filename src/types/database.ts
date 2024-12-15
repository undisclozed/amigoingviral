export interface AccountMetrics {
  id: string;
  user_id: string;
  follower_count: number;
  follower_growth: number;
  post_count: number;
  posts_last_period: number;
  accounts_reached: number;
  accounts_engaged: number;
  avg_engagement_rate: number;
  avg_likes: number;
  avg_comments: number;
  avg_views: number;
  growth_score: number;
  created_at: string;
  updated_at: string;
}

export interface PostMetrics {
  id: string;
  post_id: string;
  user_id: string;
  virality_score: number;
  likes: number;
  comments: number;
  impressions: number;
  reach: number;
  saves: number;
  shares: number;
  engagement_rate: number;
  likes_reach_ratio: number;
  comments_reach_ratio: number;
  saves_reach_ratio: number;
  video_duration?: number;
  avg_watch_percentage?: number;
  follows_from_post: number;
  follows_reach_ratio: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      account_metrics: {
        Row: AccountMetrics;
        Insert: Omit<AccountMetrics, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AccountMetrics, 'id'>>;
      };
      post_metrics: {
        Row: PostMetrics;
        Insert: Omit<PostMetrics, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PostMetrics, 'id'>>;
      };
    };
  };
}