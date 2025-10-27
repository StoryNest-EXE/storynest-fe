"use client";

import { Button } from "@/components/ui/button";
import { useLikeMutation, useUnlikeMutation } from "@/queries/story.queries";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StoryDetailClientProps {
  storyId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
  commentCount: number;
  onCommentClick?: () => void;
}

export function StoryDetailClient({
  storyId,
  initialIsLiked,
  initialLikeCount,
  commentCount,
  onCommentClick,
}: StoryDetailClientProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();

  const handleLike = () => {
    const prevLiked = isLiked;
    const prevCount = likeCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    if (isLiked) {
      unlikeMutation.mutate(storyId, {
        onError: () => {
          setIsLiked(prevLiked);
          setLikeCount(prevCount);
          toast.error("Bỏ like thất bại, vui lòng thử lại");
        },
      });
    } else {
      likeMutation.mutate(storyId, {
        onError: () => {
          setIsLiked(prevLiked);
          setLikeCount(prevCount);
          toast.error("Like thất bại, vui lòng thử lại");
        },
      });
    }
  };

  return (
    <div className="flex items-center space-x-6 pt-6 border-t border-border">
      <Button
        variant="ghost"
        size="lg"
        onClick={handleLike}
        className={`flex items-center space-x-2 ${
          isLiked
            ? "text-red-500 hover:text-red-600"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
        <span className="text-base">{likeCount}</span>
      </Button>

      <Button
        variant="ghost"
        size="lg"
        onClick={onCommentClick}
        className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="text-base">{commentCount}</span>
      </Button>
    </div>
  );
}
