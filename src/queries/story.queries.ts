"use client";

import {
  getStories,
  postCreateStory,
  postLike,
  postUnlike,
} from "@/services/story.service";
import {
  CreateStoryRequest,
  LikeResponse,
  StoryResponse,
} from "@/types/story.type";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStoryRequest) => postCreateStory(data),
    onSuccess: (data) => {
      console.log("Create Story success", data);
      toast.success("Tạo story thành công nè");
      router.push("/");
      queryClient.invalidateQueries({
        queryKey: ["stories"],
      });
    },
    onError: (error) => {
      console.log("Tạo bài viết thất bại", error);
    },
  });
};

export const useLikeMutation = () => {
  return useMutation({
    mutationFn: (storyId: number) => postLike(storyId),
    onSuccess: (data: LikeResponse) => {
      console.log("Like success", data);
    },
  });
};

export const useUnlikeMutation = () => {
  return useMutation({
    mutationFn: (storyId: number) => postUnlike(storyId),
    onSuccess: (data: LikeResponse) => {
      console.log("Unlike success", data);
    },
  });
};
