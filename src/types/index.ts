export interface WallPost {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
  photo_url?: string | null;
  avatar_url?: string | null;
  likes_count?: number;
  user_has_liked?: boolean;
  comments?: WallComment[];
}

export interface WallComment {
  id: string;
  post_id: string;
  author_name: string;
  message: string;
  created_at: string;
  avatar_url?: string | null;
}

export interface AuthorProfile {
  name: string;
  avatarUrl: string;
  network?: string;
}
