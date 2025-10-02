import {
  getSearchStories,
  getStories,
  postCreateStory,
  postLike,
  postUnlike,
} from "@/services/story.service";
import {
  CreateStoryRequest,
  LikeResponse,
  SearchStoryResponse,
  StoryResponse,
} from "@/types/story.type";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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

export const useSearchStoriesQuery = (keyword: string, limit: number) => {
  return useInfiniteQuery<SearchStoryResponse>({
    queryKey: ["searchStories", keyword, limit], // cache riêng theo keyword
    queryFn: ({ pageParam }) =>
      getSearchStories(keyword, limit, pageParam as number | undefined),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.lastId : undefined,
    initialPageParam: undefined,
    enabled: !!keyword,
  });
};

export const useCreateStoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStoryRequest) => postCreateStory(data),
    onSuccess: (data) => {
      console.log("Create Story success", data);
      queryClient.invalidateQueries({
        queryKey: ["stories"],
      });
    },
    onError: (error) => {
      toast.error("Tạo bài viết thất bại");
      console.log("Loi nè", error);
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
