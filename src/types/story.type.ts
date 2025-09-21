export interface StoryResponse {
  status: number;
  message: string;
  data: {
    nextCursor: string;
    hasMore: boolean;
    items: Story[];
  };
}

export interface Story {
  id: number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  coverImageUrl: string;
  createdAt: string; // ISO string
  publishedAt: string; // ISO string
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
  mediaType: string;
  caption: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  createdAt: string; // ISO string
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
}

// Response
export interface CreateStoryResponse {
  storyId: number;
}
