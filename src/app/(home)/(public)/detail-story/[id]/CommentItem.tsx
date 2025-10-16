"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { timeAgoVi } from "@/helper/format-time";
import {
  useInfiniteRepliesQuery,
  usePostCreateMutation,
} from "@/queries/story.queries";
import { Comment, CommentResponse } from "@/types/story.type";
import { getAvatarFromLocalStorage } from "@/lib/localStorage";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";

interface CommentItemProps {
  comment: Comment;
  storyId: number;
  hasReply?: boolean;
}

export function CommentItem({ comment, storyId, hasReply }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const myAvatar = getAvatarFromLocalStorage();
  const queryClient = useQueryClient();

  const {
    data: repliesResponse,
    isLoading: isLoadingReplies,
    isError: isErrorReplies,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteRepliesQuery(storyId, comment.id.toString(), showReplies);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const createCommentMutation = usePostCreateMutation();

  // Lấy danh sách replies từ data trả về
  const repliesData =
    repliesResponse?.pages?.flatMap((page) => page.data.items) || [];

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

  const handleReply = async (id: string) => {
    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung trả lời");
      return;
    }
    setIsSubmitting(true);

    // Tạo optimistic comment
    const optimisticComment = {
      id: Date.now(), // id tạm
      content: replyContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentCommentId: Number(id),
      storyId,
      user: {
        id: -1,
        username: "Bạn",
        avatarUrl: `https://cdn.storynest.io.vn/${myAvatar}`,
      },
      repliesCount: 0,
    };

    // ✅ Cập nhật cache optimistically
    queryClient.setQueryData(
      ["replies", "infinite", storyId, id],
      (oldData: InfiniteData<CommentResponse>) => {
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

        return { ...oldData, pages: updatedPages };
      }
    );

    const data = {
      content: replyContent,
      isAnonymous: isAnonymous,
      parentCommentId: id,
    };

    try {
      await createCommentMutation.mutateAsync({
        data: data,
        id: storyId.toString(),
      });
    } catch (error) {
      toast.error("Gửi phản hồi thất bại");
      // Có thể rollback optimistic nếu muốn
    } finally {
      setShowReplyForm(false);
      setIsSubmitting(false);
      setReplyContent("");
      setShowReplies(true); //
    }
  };

  // Hàm này chỉ cần bật/tắt state, hook useRepliesQuery sẽ tự lo việc còn lại
  const handleToggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      // Tùy chọn: tự động điền @username khi trả lời
      // setReplyContent(`@${comment.user.username} `);
    } else {
      setReplyContent("");
    }
  };

  return (
    <div className={hasReply ? "ml-8" : ""}>
      <div className="flex gap-3 py-3">
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage
            src={comment.user.avatarUrl || "/placeholder.svg"}
            alt={comment.user.username}
          />
          <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {comment.user.username}
            </span>
            <span className="text-xs text-muted-foreground">
              {timeAgoVi(comment.createdAt)}
            </span>
          </div>

          <p className="text-sm leading-relaxed break-words text-foreground/90">
            {comment.content}
          </p>

          <div className="flex items-center gap-1 pt-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReplyClick}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1" />
              Trả lời
            </Button>

            {comment.repliesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleReplies}
                disabled={isLoadingReplies && showReplies}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                {isLoadingReplies && showReplies
                  ? "Đang tải..."
                  : showReplies
                  ? "Ẩn phản hồi"
                  : `Xem ${comment.repliesCount} phản hồi`}
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-12 mb-3 space-y-2">
          <div className="flex gap-2 items-start">
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage
                src={`https://cdn.storynest.io.vn/${myAvatar}`}
                alt="Your avatar"
              />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Viết trả lời của bạn..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-1 min-h-[70px] resize-none text-sm border-muted focus-visible:ring-1"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent("");
              }}
              className="h-8"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={() => handleReply(comment.id.toString())}
              disabled={isSubmitting || !replyContent.trim()}
              className="h-8"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </div>
      )}

      {/* Render replies */}
      {(showReplies || repliesData.length > 0) && (
        <>
          {isErrorReplies && (
            <p className="text-red-500 text-xs mt-2 ml-12">
              Tải bình luận thất bại
            </p>
          )}
          {repliesData.length > 0 && (
            <div className="mt-1 ml-6 relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
              <div className="pl-6 space-y-0">
                {repliesData.map((reply: Comment) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    storyId={storyId}
                    hasReply
                  />
                ))}
                {hasNextPage && (
                  <div
                    ref={loadMoreRef}
                    className="flex justify-center py-3 text-xs text-muted-foreground"
                  >
                    {isFetchingNextPage
                      ? "Đang tải thêm phản hồi..."
                      : "Đang tải..."}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
