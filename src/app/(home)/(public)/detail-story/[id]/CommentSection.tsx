"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCommentQuery } from "@/queries/story.queries";
import { CommentItem } from "./CommentItem";

interface CommentSectionProps {
  storyId: number;
  commemtCount: number;
}

export function CommentSection({ storyId, commemtCount }: CommentSectionProps) {
  const { data: comments } = useCommentQuery({
    id: storyId,
    limit: 5,
    offset: 0,
  });
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [length, setLength] = useState<number>(10);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    setIsSubmitting(true);
    try {
      const fakeComment = {
        id: Date.now(),
        content: newComment,
        createdAt: new Date().toISOString(),
        isLiked: false,
        likeCount: 0,
        repliesCount: 0,
        user: {
          username: "You",
          avatarUrl: "",
        },
        replies: [],
      };

      setNewComment("");
      toast.success("Đã thêm bình luận");
    } catch (error) {
      toast.error("Thêm bình luận thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bình luận ({commemtCount})</h3>

      {/* Ô nhập bình luận */}
      <div className="space-y-2">
        <Textarea
          placeholder="Viết bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none text-sm"
        />
        <div className="flex justify-end">
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
        {commemtCount === 0 ? (
          <p className="text-center text-muted-foreground py-6 text-sm">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </p>
        ) : (
          comments?.data.map((comment) => (
            <CommentItem key={comment.id} storyId={storyId} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
