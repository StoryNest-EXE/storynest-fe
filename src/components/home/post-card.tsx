"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Story } from "@/types/story.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

        {/* Media */}
        {story.media.length > 0 && (
          <>
            {story.media.length === 1 ? (
              <div className="relative overflow-hidden rounded-lg w-full flex items-center justify-center">
                <img
                  src={story.media[0].mediaUrl || "/placeholder.svg"}
                  alt={story.media[0].caption || "Post image"}
                  className="w-full max-h-96 object-contain"
                />
              </div>
            ) : (
              <Carousel className="relative w-full">
                <CarouselContent className="mx-auto">
                  {story.media.map((m) => (
                    <CarouselItem
                      key={m.id}
                      className="flex items-center justify-center"
                    >
                      <div className="relative overflow-hidden rounded-lg w-full flex items-center justify-center">
                        <img
                          src={m.mediaUrl || "/placeholder.svg"}
                          alt={m.caption || "Post image"}
                          className="w-[85%] max-h-96 object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="right-1 top-1/2 -translate-y-1/2" />
              </Carousel>
            )}
          </>
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
