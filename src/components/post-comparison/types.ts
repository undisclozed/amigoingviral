export interface Post {
  id: string;
  username: string;
  timestamp: string;
  caption: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
  };
  thumbnail: string;
  engagementScore: number;
  url: string;
}

export interface PostCardProps {
  post: Post;
}

export interface PostSectionProps {
  title: string;
  posts: Post[];
  badgeText: string;
  badgeVariant?: "secondary" | "destructive";
  badgeClassName?: string;
}