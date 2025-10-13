"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import VoicePlayer from "@/components/VoicePlayer";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useDetailStoryQuery,
  useLikeMutation,
  useUnlikeMutation,
} from "@/queries/story.queries";
import { useState } from "react";
import { toast } from "sonner";
import { CommentSection } from "@/app/(home)/(public)/detail-story/[id]/CommentSection";

export default function StoryDetailPage() {
  const params = useParams();
  const storyId = params.id as string;
  const { data: detailStory } = useDetailStoryQuery(storyId, "");

  const images =
    detailStory?.data.media.filter((m) => m.mediaType === "Image") ?? [];
  const audio = detailStory?.data.media.find((m) => m.mediaType === "Audio");

  const [isLiked, setIsLiked] = useState(detailStory?.data.isLiked ?? 0);
  const [likeCount, setLikeCount] = useState(detailStory?.data.likeCount ?? 0);
  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();

  const handleLike = () => {
    const prevLiked = isLiked;
    const prevCount = likeCount;

    // 👉 Optimistic update (ngay lập tức update UI)
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    if (detailStory?.data.id) {
      if (isLiked) {
        unlikeMutation.mutate(detailStory.data.id, {
          onError: () => {
            // rollback
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
            toast.error("Bỏ like thất bại, vui lòng thử lại");
          },
        });
      } else {
        likeMutation.mutate(detailStory.data.id, {
          onError: () => {
            // rollback
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
            toast.error("Like thất bại, vui lòng thử lại");
          },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        {/* Story Detail Card */}
        <Card className="bg-card border-border p-6 space-y-4">
          {/* User Info */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10 border-2 border-border">
                  <AvatarImage
                    src={detailStory?.data.user.avatarUrl || "/placeholder.svg"}
                    alt={detailStory?.data.user.username}
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {detailStory?.data.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-base text-card-foreground hover:text-accent cursor-pointer transition-colors">
                    {detailStory?.data.user.username}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {detailStory?.data.createdAt &&
                      new Intl.DateTimeFormat("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(detailStory.data.createdAt))}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Tags */}
            {detailStory?.data.tags && detailStory?.data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {detailStory?.data.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          {detailStory?.data.title && (
            <h1 className="text-2xl md:text-3xl font-bold text-card-foreground leading-tight">
              {detailStory?.data.title}
            </h1>
          )}

          {/* Content */}
          <div
            className="text-card-foreground leading-relaxed text-base prose prose-invert max-w-none prose-p:my-3 prose-strong:text-card-foreground prose-em:text-card-foreground"
            dangerouslySetInnerHTML={{
              __html: detailStory?.data.content || "",
            }}
          />

          {/* Media Gallery */}
          {images?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-card-foreground">
                Hình ảnh
              </h3>
              {images.length === 1 ? (
                <div className="relative overflow-hidden rounded-lg w-full flex items-center justify-center">
                  <img
                    src={images[0].mediaUrl || "/placeholder.svg"}
                    alt={images[0].caption || "Story image"}
                    className="w-full h-auto max-h-[400px] object-contain"
                  />
                </div>
              ) : (
                <Carousel className="relative w-full">
                  <CarouselContent className="mx-auto">
                    {images.map((img) => (
                      <CarouselItem
                        key={img.id}
                        className="flex items-center justify-center"
                      >
                        <div className="relative overflow-hidden rounded-lg w-full flex items-center justify-center">
                          <img
                            src={img.mediaUrl || "/placeholder.svg"}
                            alt={img.caption || "Story image"}
                            className="w-full max-h-[400px] object-contain"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="right-4 top-1/2 -translate-y-1/2" />
                </Carousel>
              )}
            </div>
          )}

          {/* Audio Player */}
          {audio && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-card-foreground">
                Audio
              </h3>
              <VoicePlayer className="w-full" audioUrl={audio.mediaUrl} />
            </div>
          )}

          {/* Actions - Client Component */}
          {/* <StoryDetailClient
            storyId={story.id}
            initialIsLiked={story.isLiked}
            initialLikeCount={story.likeCount}
            commentCount={story.commentCount}
          /> */}
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
              // onClick={() => handleComment(story.id)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{detailStory?.data.commentCount}</span>
            </Button>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 mt-4">
          <CommentSection
            storyId={detailStory?.data.id || 0}
            commemtCount={Number(detailStory?.data.commentCount)}
          />
        </Card>
      </div>
    </div>
  );
}
