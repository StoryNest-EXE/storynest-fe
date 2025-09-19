import https from "@/lib/axios";
import { StoryResponse } from "@/types/story.type";

export const getStories = async (limit: number, cursor?: string) => {
  const response = await https.get<StoryResponse>("/api/Story/get-stories", {
    params: { limit, cursor },
  });
  return response.data;
};
