"use client";

import MoreOptionsButton from "@/components/StoryMoreMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLikeMutation, useUnlikeMutation } from "@/queries/story.queries";
import { Story } from "@/types/story.type";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PostCardProps {
  story: Story;
}

export function StoryCardPreview({ story }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(story.isLiked);
  const [likeCount, setLikeCount] = useState(story.likeCount);
  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();

  const handleLike = () => {
    const prevLiked = isLiked;
    const prevCount = likeCount;

    // 👉 Optimistic update (ngay lập tức update UI)
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    if (isLiked) {
      unlikeMutation.mutate(story.id, {
        onError: () => {
          // rollback
          setIsLiked(prevLiked);
          setLikeCount(prevCount);
          toast.error("Bỏ like thất bại, vui lòng thử lại");
        },
      });
    } else {
      likeMutation.mutate(story.id, {
        onError: () => {
          // rollback
          setIsLiked(prevLiked);
          setLikeCount(prevCount);
          toast.error("Like thất bại, vui lòng thử lại");
        },
      });
    }
  };

  return (
    <div className=" p-6 space-y-0 border-b-2">
      {/* User Info */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-border">
              <AvatarImage
                src={story.user.avatarUrl || "/placeholder.svg"}
                alt={story.user.username}
              />
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                {story.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground hover:text-accent cursor-pointer transition-colors">
                {story.user.username}
              </h3>
              <p className="text-sm text-muted-foreground">
                {new Intl.DateTimeFormat("en-GB", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(story.createdAt))}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreOptionsButton
              storyId={story.id}
              slug={story.slug}
              isAI={story.isAI}
            />
          </Button>
        </div>

        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {story.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4 mt-5">
        {story.title && (
          <h1 className="text-2xl font-bold text-card-foreground leading-tight">
            {story.title}
          </h1>
        )}

        <div className="space-y-2">
          <div
            className="text-card-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: story.summary }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-6 pt-2 ">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex items-center space-x-2 ${
            isLiked
              ? "text-red-500 hover:text-red-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{story.commentCount}</span>
        </Button>
      </div>
    </div>
  );
}
