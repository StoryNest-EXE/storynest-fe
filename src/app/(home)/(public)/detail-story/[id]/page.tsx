import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ArrowLeft } from "lucide-react";
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
import { StoryDetailClient } from "./story-detail-action";

// Mock function to fetch story data - replace with your actual API call
async function getStoryBySlug(slug: string) {
  // Replace this with your actual API endpoint
  const response = await fetch(`https://your-api.com/stories/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch story");
  }

  const data = await response.json();
  return data.data;
}

export default async function StoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // For demo purposes, using mock data
  // Replace this with: const story = await getStoryBySlug(params.slug);
  const story = {
    isAI: false,
    id: 129,
    title: "Testing new create new update",
    content:
      "<p>lalala</p><p><strong>hahaha</strong></p><p><strong><em>lakakaaka</em></strong></p><p><strong><em><s>hahahaa</s></em></strong></p><p><strong><em><s><u>dasdasdad</u></s></em></strong></p>",
    summary: "<p>lalala</p>",
    slug: "testing-new-create-new-update-895527",
    coverImageUrl:
      "https://cdn.storynest.io.vn/https://cdn.storynest.io.vn/story-assets/content/story_51aa517c628e4e04a68dff408119a9df.webp",
    createdAt: "2025-10-08T04:13:39.804215Z",
    lastUpdatedAt: "2025-10-08T08:39:32.848982Z",
    publishedAt: "2025-10-08T07:00:47.74138Z",
    isLiked: false,
    isAnonymous: true,
    likeCount: 2,
    commentCount: 1,
    privacyStatus: 0,
    storyStatus: 1,
    user: {
      id: 0,
      username: "Hải cẩu thông minh",
      avatarUrl:
        "https://cdn.storynest.io.vn/system-assets/anonymous-avatarV2.webp",
    },
    media: [
      {
        id: 193,
        storyId: 129,
        mediaUrl:
          "https://cdn.storynest.io.vn/story-assets/content/story_51aa517c628e4e04a68dff408119a9df.webp",
        mediaType: "Image" as const,
        caption: "story image",
        mimeType: "image",
        size: 0,
        width: 0,
        height: 0,
        createdAt: "2025-10-08T08:39:32.865942Z",
      },
      {
        id: 194,
        storyId: 129,
        mediaUrl:
          "https://cdn.storynest.io.vn/story-assets/content/story_b58c4e20a8994ac7abd24c8ece4211be.png",
        mediaType: "Image" as const,
        caption: "story image",
        mimeType: "image",
        size: 0,
        width: 0,
        height: 0,
        createdAt: "2025-10-08T08:39:32.878921Z",
      },
    ],
    tags: [
      {
        id: 74,
        name: "create",
        slug: "create",
        description: null,
        color: null,
        iconUrl: null,
        createdAt: "2025-10-08T04:13:40.585706Z",
      },
      {
        id: 42,
        name: "new",
        slug: "new",
        description: null,
        color: null,
        iconUrl: null,
        createdAt: "2025-09-27T07:26:35.066229Z",
      },
      {
        id: 75,
        name: "ewr",
        slug: "ewr",
        description: null,
        color: null,
        iconUrl: null,
        createdAt: "2025-10-08T08:28:27.8325Z",
      },
    ],
    comments: [
      {
        id: 1,
        storyId: 129,
        content: "Bài viết rất hay và ý nghĩa! Cảm ơn tác giả đã chia sẻ.",
        createdAt: "2025-10-08T09:15:22.123456Z",
        user: {
          id: 5,
          username: "Nguyễn Văn A",
          avatarUrl:
            "https://cdn.storynest.io.vn/system-assets/anonymous-avatarV2.webp",
        },
        likeCount: 5,
        isLiked: false,
      },
      {
        id: 2,
        storyId: 129,
        content:
          "Mình cũng có trải nghiệm tương tự. Rất đồng cảm với bài viết này.",
        createdAt: "2025-10-08T10:30:45.789012Z",
        user: {
          id: 8,
          username: "Trần Thị B",
          avatarUrl:
            "https://cdn.storynest.io.vn/system-assets/anonymous-avatarV2.webp",
        },
        likeCount: 3,
        isLiked: true,
      },
    ],
  };

  const audio = story.media.find(
    (m) => (m.mediaType as "Image" | "Audio") === "Audio"
  );
  const images = story.media.filter((m) => m.mediaType === "Image");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        {/* Story Detail Card */}
        <Card className="bg-card border-border p-8 space-y-6">
          {/* User Info */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 border-2 border-border">
                  <AvatarImage
                    src={story.user.avatarUrl || "/placeholder.svg"}
                    alt={story.user.username}
                  />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {story.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg text-card-foreground hover:text-accent cursor-pointer transition-colors">
                    {story.user.username}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.DateTimeFormat("vi-VN", {
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
              <div className="flex flex-wrap gap-2 mt-4">
                {story.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-sm">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          {story.title && (
            <h1 className="text-3xl md:text-4xl font-bold text-card-foreground leading-tight">
              {story.title}
            </h1>
          )}

          {/* Cover Image */}
          {story.coverImageUrl && (
            <div className="relative overflow-hidden rounded-lg w-full">
              <img
                src={story.coverImageUrl || "/placeholder.svg"}
                alt={story.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="text-card-foreground leading-relaxed text-lg prose prose-invert max-w-none prose-p:my-4 prose-strong:text-card-foreground prose-em:text-card-foreground"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />

          {/* Media Gallery */}
          {images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-card-foreground">
                Hình ảnh
              </h3>
              {images.length === 1 ? (
                <div className="relative overflow-hidden rounded-lg w-full flex items-center justify-center">
                  <img
                    src={images[0].mediaUrl || "/placeholder.svg"}
                    alt={images[0].caption || "Story image"}
                    className="w-full h-auto max-h-[600px] object-contain"
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
                            className="w-full max-h-[600px] object-contain"
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
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-card-foreground">
                Audio
              </h3>
              <VoicePlayer className="w-full" audioUrl={audio.mediaUrl} />
            </div>
          )}

          {/* Actions - Client Component */}
          <StoryDetailClient
            storyId={story.id}
            initialIsLiked={story.isLiked}
            initialLikeCount={story.likeCount}
            commentCount={story.commentCount}
          />
        </Card>

        {/* <Card className="bg-card border-border p-8 mt-6">
          <CommentSection storyId={story.id} comments={story.comments} />
        </Card> */}
      </div>
    </div>
  );
}
