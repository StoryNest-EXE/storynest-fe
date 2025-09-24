import https from "@/lib/axios";
import {
  CreateStoryRequest,
  CreateStoryResponse,
  StoryResponse,
} from "@/types/story.type";

export const getStories = async (limit: number, cursor?: string) => {
  const response = await https.get<StoryResponse>("/api/Story/get-stories", {
    params: { limit, cursor },
  });
  return response.data;
};

export const postCreateStory = async (req: CreateStoryRequest) => {
  const response = await https.post<CreateStoryResponse>(
    "/api/Story/create",
    req
  );
  return response.data;
};

export const postLike = async (storyId: number) => {
  const response = await https.post(`/api/Like/like/${storyId}`);
  return response.data;
};

export const postUnlike = async (storyId: number) => {
  const response = await https.post(`/api/Like/unlike/${storyId}`);
  return response.data;
};
