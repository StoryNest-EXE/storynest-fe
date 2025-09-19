import { getStories } from "@/services/story.service";
import { StoryResponse } from "@/types/story.type";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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
