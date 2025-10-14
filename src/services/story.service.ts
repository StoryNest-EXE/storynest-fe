import https from "@/lib/axios";
import {
  CreateCommentRequest,
  CreateStoryRequest,
  CreateStoryResponse,
  SearchStoryResponse,
  StoryResponse,
  UpdateStoryRequest,
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

export const getMyDetailStory = async (id?: number, slug?: string) => {
  const response = await https.get("/api/Story/get-by-id-or-slug-owner", {
    params: { id, slug },
  });
  return response.data;
};

export const putUpdateStory = async (
  storyId: number,
  req: UpdateStoryRequest
) => {
  const response = await https.put(`/api/Story/update/${storyId}`, req);
  return response.data;
};

export const getDetailStory = async (id?: string, slug?: string) => {
  const response = await https.get("/api/Story/get-by-id-or-slug", {
    params: { id, slug },
  });
  return response.data;
};

export const getComment = async (
  id: number,
  limit: number,
  cursor: number,
  parentId?: string
) => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    cursor: cursor.toString(),
  });

  if (parentId) {
    params.append("parentId", parentId);
  }

  const response = await https.get(
    `/api/Comment/all-comment/${id}?${params.toString()}`
  );
  return response.data;
};

export const postCreateComment = async (
  data: CreateCommentRequest,
  id: string
) => {
  const response = await https.post(`/api/Comment/${id}`, data);
  return response.data;
};
