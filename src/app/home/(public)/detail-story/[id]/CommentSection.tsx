"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  // 1. Import hook mới và bỏ hook cũ
  useInfiniteCommentsQuery,
  usePostCreateMutation,
} from "@/queries/story.queries";
import { CommentItem } from "./CommentItem";
import SparkleSwitch from "@/components/custom-ui/SparkleSwitch";
import { Label } from "@/components/ui/label";
import { UserX, Loader2 } from "lucide-react"; // Thêm icon loading
import StoryNestLoader from "@/components/story-nest-loader/StoryNestLoader";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { CommentResponse, CreateCommentRequest } from "@/types/story.type";

interface CommentSectionProps {
  storyId: number;
  commemtCount: number;
}

export function CommentSection({ storyId, commemtCount }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 2. Sử dụng hook useInfiniteCommentsQuery
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteCommentsQuery({
    id: storyId,
    limit: 5,
  });

  const queryClient = useQueryClient();

  const createCommentMutation = usePostCreateMutation({
    // Thêm onMutate
    onMutate: async (variables) => {
      // Dừng các query liên quan để tránh race condition
      await queryClient.cancelQueries({
        queryKey: ["comments", "infinite", storyId, undefined],
      });

      // Lưu lại snapshot dữ liệu hiện tại
      const previousData = queryClient.getQueryData([
        "comments",
        "infinite",
        storyId,
        undefined,
      ]);

      // Tạo 1 comment tạm
      const optimisticComment = {
        id: `temp-${Date.now()}`, // id tạm
        content: variables.data.content,
        user: {
          username: "Bạn",
          avatarUrl: "/placeholder.svg",
        },
        createdAt: new Date().toISOString(),
        repliesCount: 0,
        isAnonymous: variables.data.isAnonymous,
      };

      // Update cache tạm thời
      queryClient.setQueryData(
        ["comments", "infinite", storyId, undefined],
        (oldData: InfiniteData<CommentResponse> | undefined) => {
          if (!oldData) return oldData;
          const updatedPages = oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: {
                  ...page.data,
                  items: [optimisticComment, ...page.data.items],
                },
              };
            }
            return page;
          });

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );

      // Trả về snapshot để rollback nếu lỗi
      return { previousData };
    },

    //  Nếu lỗi → rollback
    onError: (
      err: unknown,
      variables: { data: CreateCommentRequest; id: string },
      context: unknown
    ) => {
      const typedContext = context as
        | { previousData?: InfiniteData<CommentResponse> }
        | undefined;
      if (typedContext?.previousData) {
        queryClient.setQueryData(
          ["comments", "infinite", storyId],
          typedContext.previousData
        );
      }
      toast.error("Gửi bình luận thất bại");
    },

    // ✅ Sau khi request xong → refetch để đồng bộ dữ liệu thật (id thật từ server)
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "infinite", storyId],
      });
    },
  });

  // 3. Gom tất cả bình luận từ các trang vào một mảng duy nhất
  const allComments = data?.pages.flatMap((page) => page.data.items) ?? [];

  // 4. Sử dụng IntersectionObserver để trigger fetchNextPage
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Nếu phần tử loadMoreRef hiển thị trên màn hình, còn trang tiếp theo, và không đang fetch
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.6 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }
    setIsSubmitting(true);
    try {
      createCommentMutation.mutate({
        data: { content: newComment, isAnonymous },
        id: storyId.toString(),
      });
      setNewComment("");
      toast.success("Đã thêm bình luận");
    } catch (error) {
      toast.error("Thêm bình luận thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý các trạng thái loading và lỗi
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2">Đang tải bình luận...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-6">Tải bình luận thất bại.</p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bình luận ({commemtCount})</h3>

      {/* Ô nhập bình luận */}
      <div className="space-y-3">
        {/* ... JSX cho ô nhập bình luận giữ nguyên ... */}
        <Textarea
          placeholder="Viết bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none text-sm"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-1 py-2.5 rounded-lg hover:bg-muted/70 transition-colors">
            <div style={{ transform: "scale(0.6)" }}>
              <SparkleSwitch checked={isAnonymous} onChange={setIsAnonymous} />
            </div>
            <Label
              htmlFor="anonymous"
              className="text-sm font-medium cursor-pointer flex items-center gap-2 m-0"
            >
              <UserX className="h-4 w-4 text-muted-foreground" />
              <span className="pr-2">Bình luận ẩn danh</span>
            </Label>
          </div>
          <Button
            size="sm"
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
          </Button>
        </div>
      </div>

      {/* Danh sách bình luận */}
      <div className="space-y-3">
        {allComments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6 text-sm">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </p>
        ) : (
          allComments.map((comment) => (
            <CommentItem key={comment.id} storyId={storyId} comment={comment} />
          ))
        )}

        {/* 5. Phần tử trigger và hiển thị trạng thái loading more */}
        <div ref={loadMoreRef} className="h-1" />
        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              <StoryNestLoader />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
