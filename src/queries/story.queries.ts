import {
  deleteStory,
  getComment,
  getDetailStory,
  getMyAIStories,
  getMyDetailStory,
  getMyStories,
  getSearchStories,
  getStories,
  postCreateComment,
  postCreateStory,
  postLike,
  postUnlike,
  putUpdateStory,
} from "@/services/story.service";
import {
  CommentResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  CreateStoryRequest,
  DetailStory,
  LikeResponse,
  SearchStoryResponse,
  StoryResponse,
  UpdateStoryRequest,
} from "@/types/story.type";
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  useQuery,
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

export const useMyStoriesQuery = (limit: number) => {
  return useInfiniteQuery<StoryResponse>({
    queryKey: ["my-stories", limit],
    queryFn: ({ pageParam }) =>
      getMyStories(limit, pageParam as string | undefined),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
    initialPageParam: undefined,
  });
};

export const useMyAIStoriesQuery = (limit: number) => {
  return useInfiniteQuery<StoryResponse>({
    queryKey: ["my-ai-stories", limit],
    queryFn: ({ pageParam }) =>
      getMyAIStories(limit, pageParam as string | undefined),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
    initialPageParam: undefined,
  });
};

export const useDeleteStoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (storyId: number) => deleteStory(storyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-stories"] });
      queryClient.invalidateQueries({ queryKey: ["my-ai-stories"] });
      toast.success("Xóa thành công!");
    },
    onError: (error) => {
      toast.error("Xóa thất bại");
      console.log("Xóa thất bại", error);
    },
  });
};

export const useMyDetailStoryQuery = (id?: number, slug?: string) => {
  return useQuery<DetailStory>({
    queryKey: ["my-detail-story"],
    queryFn: () => getMyDetailStory(id, slug),
    enabled: !!id || !!slug,
  });
};

export const useUpdateStoryMutation = (storyId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateStoryRequest) => putUpdateStory(storyId, data),
    onSuccess: async (data) => {
      await queryClient.refetchQueries({
        queryKey: ["my-stories"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["my-ai-stories"],
        exact: false,
      });
      console.log("Data response: ", data);
      toast.success("Cập nhật câu chuyện thành công");
    },
    onError: (error) => {
      console.log("Lỗi nè: ", error);
      toast.error("Cập nhật thất bại");
    },
  });
};

export const useDetailStoryQuery = (id?: string, slug?: string) => {
  return useQuery<DetailStory>({
    queryKey: ["detail-story", id, slug],
    queryFn: () => getDetailStory(id, slug),
    enabled: !!id || !!slug,
  });
};

export const useInfiniteCommentsQuery = ({
  id,
  limit,
  parentId,
}: {
  id: number;
  limit: number;
  parentId?: string;
}) => {
  return useInfiniteQuery({
    // queryKey phải ổn định và không chứa tham số trang (cursor)
    queryKey: ["comments", "infinite", id, parentId],

    // queryFn giờ sẽ nhận vào một object chứa pageParam
    queryFn: ({ pageParam }) => getComment(id, limit, pageParam, parentId),

    // Giá trị cursor ban đầu
    initialPageParam: 0,

    // Hàm quyết định cursor cho trang tiếp theo
    // `lastPage` là dữ liệu trả về từ API của lần gọi gần nhất
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
  });
};

export const useInfiniteRepliesQuery = (
  storyId: number,
  parentId: string,
  enabled: boolean
) => {
  return useInfiniteQuery({
    queryKey: ["comments", storyId, "replies", parentId],
    queryFn: ({ pageParam }) => getComment(storyId, 5, pageParam, parentId),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasMore ? lastPage.data.nextCursor : undefined,
    enabled: enabled,
  });
};

export const usePostCreateMutation = (
  options?: UseMutationOptions<
    CreateCommentResponse, // Type của kết quả trả về (TData)
    unknown, // Type của lỗi (TError)
    { data: CreateCommentRequest; id: string } // Type của biến (TVariables)
  >
) => {
  return useMutation({
    mutationFn: ({ data, id }: { data: CreateCommentRequest; id: string }) =>
      postCreateComment(data, id),
    ...options,
  });
};
