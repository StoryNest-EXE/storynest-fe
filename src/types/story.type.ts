export interface StoryResponse {
  status: number;
  message: string;
  data: {
    nextCursor: string;
    hasMore: boolean;
    items: Story[];
  };
}

export interface SearchStoryResponse {
  status: number;
  message: string;
  data: {
    lastId: number;
    hasMore: boolean;
    stories: Story[];
  };
}

export interface Story {
  isAI: boolean;
  id: number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  coverImageUrl: string;
  createdAt: string;
  lastUpdatedAt: string;
  publishedAt: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  privacyStatus: number;
  storyStatus: number;
  user: StoryUser;
  media: StoryMedia[];
  tags: StoryTag[];
}

export interface StoryUser {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface StoryMedia {
  id: number;
  storyId: number;
  mediaUrl: string;
  mediaType: "Image" | "Audio";
  caption: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface StoryTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  iconUrl: string;
  createdAt: string; // ISO string
}

export interface CreateStoryRequest {
  title: string;
  content: string;
  coverImageUrl: string;
  tags: string[];
  privacyStatus: number;
  storyStatus: number;
  isAnonymous: boolean;
  mediaUrls?: string[];
  audioUrls?: string[];
}

// Response
export interface CreateStoryResponse {
  storyId: number;
}

export interface LikeResponse {
  status: number;
  message: string;
  data: number;
}

export interface StoryAICard {
  id: string;
  content: string;
  mediaUrl?: string;
  audioUrl?: string;
}
