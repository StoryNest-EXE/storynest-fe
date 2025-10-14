"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useCommentQuery,
  usePostCreateMutation,
} from "@/queries/story.queries";
import { CommentItem } from "./CommentItem";
import SparkleSwitch from "@/components/custom-ui/SparkleSwitch";
import { Label } from "@/components/ui/label";
import { UserX } from "lucide-react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const createCommentMutation = usePostCreateMutation();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("data request: ", newComment, isAnonymous, 0);
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bình luận ({commemtCount})</h3>

      {/* Ô nhập bình luận */}
      <div className="space-y-3">
        <Textarea
          ref={textareaRef}
          placeholder="Viết bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none text-sm"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-1 py-2.5 rounded-lg bg-muted/50 border border-border hover:bg-muted/70 transition-colors">
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
        {commemtCount === 0 ? (
          <p className="text-center text-muted-foreground py-6 text-sm">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </p>
        ) : (
          comments?.data.items.map((comment) => (
            <CommentItem key={comment.id} storyId={storyId} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
