import { getStories, postCreateStory } from "@/services/story.service";
import { CreateStoryRequest, StoryResponse } from "@/types/story.type";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStoriesQuery = (limit: number) => {
  return useInfiniteQuery<StoryResponse>({
    queryKey: ["stories", limit],
    queryFn: ({ pageParam }) =>
      getStories(limit, pageParam as string | undefined),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
    initialPageParam: undefined,
  });
};

export const useCreateStoryMutation = () => {
  return useMutation({
    mutationFn: (data: CreateStoryRequest) => postCreateStory(data),
    onSuccess: (data) => {
      console.log("Create Story success", data);
      toast.success("Tạo story thành công nè");
    },
    onError: (error) => {
      console.log("Tạo bài viết thất bại", error);
    },
  });
};
