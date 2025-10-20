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
import { Badge } from "../ui/badge";
import { useLikeMutation, useUnlikeMutation } from "@/queries/story.queries";
import { toast } from "sonner";
import VoicePlayer from "../VoicePlayer";
import { useRouter } from "next/navigation";

interface PostCardProps {
  story: Story;
}

export function PostCard({ story }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(story.isLiked);
  const [likeCount, setLikeCount] = useState(story.likeCount);
  const [showFullContent, setShowFullContent] = useState(false);
  const likeMutation = useLikeMutation();
  const unlikeMutation = useUnlikeMutation();
  const audio = story.media.find((m) => m.mediaType === "Audio");
  const images = story.media.filter((m) => m.mediaType === "Image");
  const router = useRouter();

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

  const handleReadMore = () => {
    if (story.summary) {
      setShowFullContent(true);
    }
  };

  const handleComment = (slug: string) => {
    router.push(`/detail-story/${slug}`);
  };

  return (
    <Card className="bg-card border-border p-6 space-y-0">
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
            <MoreHorizontal className="h-5 w-5" />
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
      <div className="space-y-4">
        {story.title && (
          <h1 className="text-2xl font-bold text-card-foreground leading-tight">
            {story.title}
          </h1>
        )}

        {/* <div className="space-y-2">
          <div
            className="text-card-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: story.summary }}
          ></div>
          {/* <Button
            variant="link"
            className="p-0 h-auto hover:text-accent/80 text-indigo-300"
            // onClick={handleReadMore}
          >
            xem thêm
          </Button>
        </div> */}

        {/* Cho phép xem full ở trang home luôn  */}
        {story.summary && !showFullContent ? (
          <div className="space-y-2">
            <p
              className="text-card-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: story.summary }}
            ></p>
            <Button
              variant="link"
              className="p-0 h-auto text-indigo-300 hover:text-indigo-300/80"
              onClick={handleReadMore}
            >
              Xem thêm
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p
              className="text-card-foreground leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: story.content }}
            ></p>
            {/* {story.summary && (
              <Link href={`/post/${story.id}`}>
                <Button
                  variant="link"
                  className="p-0 h-auto text-accent hover:text-accent/80"
                >
                  Xem chi tiết
                </Button>
              </Link>
            )} */}
          </div>
        )}

        {/* Media */}

        {/* Image(s) */}
        {images.length > 0 && (
          <>
            {images.length === 1 ? (
              <div className="relative overflow-hidden rounded-lg w-full flex items-center justify-center">
                <img
                  src={images[0].mediaUrl || "/placeholder.svg"}
                  alt={images[0].caption || "Post image"}
                  className="w-full h-[80%] max-h-96 object-contain"
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
                          alt={img.caption || "Post image"}
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
            {/* Audio (chỉ 1) */}
            {audio && (
              <div className="mb-4">
                <VoicePlayer className="w-full" audioUrl={audio.mediaUrl} />
              </div>
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
          onClick={() => handleComment(story.slug)}
        >
          <MessageCircle className="h-5 w-5" />
          <span>{story.commentCount}</span>
        </Button>
      </div>
    </Card>
  );
}
