"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Story } from "@/types/story.type"; // import từ type bạn đã định nghĩa

interface PostCardProps {
  story: Story;
}

export function PostCard({ story }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likeCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card className="bg-card border-border p-6 space-y-4">
      {/* User Info */}
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
              {new Date(story.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div
          className="prose prose-sm max-w-none text-card-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* Images */}
        {story.media.length > 0 && (
          <div
            className={`grid gap-2 ${
              story.media.length === 1
                ? "grid-cols-1"
                : story.media.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {story.media.map((m) => (
              <div key={m.id} className="relative overflow-hidden rounded-lg">
                <img
                  src={m.mediaUrl || "/placeholder.svg"}
                  alt={m.caption || "Post image"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-6 pt-2 border-t border-border">
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
    </Card>
  );
}
