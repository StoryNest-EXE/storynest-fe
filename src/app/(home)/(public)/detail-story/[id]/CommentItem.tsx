"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { timeAgoVi } from "@/helper/format-time";
import { useGetCommentMutation } from "@/queries/story.queries";
import { Comment } from "@/types/story.type";

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
  const [repliesData, setRepliesData] = useState<Comment[]>([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isErrorReplies, setIsErrorReplies] = useState(false);

  const commentMutation = useGetCommentMutation();

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung trả lời");
      return;
    }
    setIsSubmitting(true);
    try {
      const fakeReply = {
        id: Date.now(),
        content: replyContent,
        createdAt: new Date().toISOString(),
        isLiked: false,
        likeCount: 0,
        user: {
          username: "You",
          avatarUrl: "",
        },
        replies: [],
      };
      toast.success("Đã thêm trả lời");
      setReplyContent("");
      setShowReplyForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleReplies = async () => {
    console.log("call nè", comment.id.toString());
    if (!showReplies) {
      setIsLoadingReplies(true);
      setIsErrorReplies(false);
      try {
        const data = await commentMutation.mutateAsync({
          id: storyId,
          limit: 5,
          offset: 0,
          parentId: comment.id.toString(),
        });
        setRepliesData(data.data || []);
      } catch (err) {
        console.error(err);
        setIsErrorReplies(true);
        toast.error("Tải phản hồi thất bại");
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowReplies((prev) => !prev);
  };

  const handleReplyClick = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      setReplyContent(`@${comment.user.username} `);
    } else {
      setReplyContent("");
    }
  };

  // Parse content để hiển thị mention
  const renderContent = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="text-blue-500 font-semibold">
            @{part}
          </span>
        );
      }
      return part;
    });
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
            {renderContent(comment.content)}
          </p>

          <div className="flex items-center gap-1 pt-0.5">
            {!hasReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReplyClick}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                Trả lời
              </Button>
            )}

            {comment.repliesCount > 0 && !hasReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleReplies}
                disabled={isLoadingReplies}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                {isLoadingReplies
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
          <Textarea
            placeholder="Viết trả lời của bạn..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[70px] resize-none text-sm border-muted focus-visible:ring-1"
            autoFocus
          />
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
              onClick={handleReply}
              disabled={isSubmitting || !replyContent.trim()}
              className="h-8"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi"}
            </Button>
          </div>
        </div>
      )}

      {/* 🔸 Render replies */}
      {showReplies && (
        <>
          {isErrorReplies && (
            <p className="text-red-500 text-xs mt-2 ml-12">
              Tải bình luận thất bại
            </p>
          )}
          {repliesData.length > 0 && (
            <div className="mt-1 ml-6 relative">
              {/* Thread line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
              <div className="pl-6 space-y-0">
                {repliesData.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    storyId={storyId}
                    hasReply
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
