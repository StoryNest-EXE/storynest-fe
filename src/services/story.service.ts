import https from "@/lib/axios";
import {
  CreateStoryRequest,
  CreateStoryResponse,
  SearchStoryResponse,
  StoryResponse,
} from "@/types/story.type";

export const getStories = async (limit: number, cursor?: string) => {
  const response = await https.get<StoryResponse>("/api/Story/get-stories", {
    params: { limit, cursor },
  });
  return response.data;
};

export const getSearchStories = async (
  keyword: string,
  limit: number,
  lastId?: number
) => {
  const response = await https.get<SearchStoryResponse>("/api/Story/search", {
    params: {
      keyword,
      limit,
      lastId,
    },
  });
  console.log("data 123123123", response.data);
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

export const getMyStories = async (limit: number, cursor?: string) => {
  const response = await https.get<StoryResponse>("/api/Story/get-by-owner", {
    params: { limit, cursor },
  });
  return response.data;
};

export const getMyAIStories = async (limit: number, cursor?: string) => {
  const response = await https.get<StoryResponse>(
    "/api/Story/get-by-owner-ai",
    {
      params: { limit, cursor },
    }
  );
  return response.data;
};

export const deleteStory = async (storyId: number) => {
  const response = await https.delete(`/api/Story/delete/${storyId}`);
  return response.data;
};
