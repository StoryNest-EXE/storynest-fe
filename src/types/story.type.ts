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
  isAnonymous: boolean;
  likeCount: number;
  commentCount: number;
  privacyStatus: PrivacyStatus;
  storyStatus: StoryStatus;
  user: StoryUser;
  media: StoryMedia[];
  tags: StoryTag[];
}

export enum PrivacyStatus {
  Public = 0,
  Private = 1,
  Unlisted = 2,
}

export enum StoryStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
  Deleted = 3,
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

export type StoryFormData = {
  title: string;
  tags: string[];
  content: string;
  privacyStatus: number;
  storyStatus: number;
  mediaList?: { key: string; url: string }[];
  isAnonymous: boolean;
};

export type DetailStory = {
  status: number;
  message: string;
  data: Story;
};

export type UpdateStoryRequest = {
  title: string;
  content: string;
  coverImageUrl: string;
  tags: string[];
  privacyStatus: number;
  storyStatus: number;
  isAnonymous: boolean;
  mediaUrls: string[];
  audioUrls: string[];
};

export interface CommentUser {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface Comment {
  id: number;
  storyId: number;
  userId: number;
  parentCommentId: number | null;
  content: string;
  commentStatus: number;
  createdAt: string;
  updatedAt: string | null;
  user: CommentUser;
  repliesCount: number;
  hasReplies: boolean;
  replies?: Comment[];
  length: 10;
}

export interface CommentResponse {
  status: number;
  message: string;
  data: Comment[];
}
