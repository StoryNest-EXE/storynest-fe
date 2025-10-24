import { getNotifications } from "@/services/notification.service";
import { NotificationResponse } from "@/types/notification";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfinityNotificationsQuery = (limit: number) => {
  return useInfiniteQuery<NotificationResponse>({
    queryKey: ["notifications", limit],
    queryFn: ({ pageParam }) =>
      getNotifications(limit, pageParam as string | undefined),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
    initialPageParam: undefined,
  });
};
