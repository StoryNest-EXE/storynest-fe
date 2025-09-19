"use client";

import { PostCard } from "@/components/post-card";
import { useStoriesQuery } from "@/queries/story.quries";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useStoriesQuery(5);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver để load thêm khi tới cuối
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  // Flatten data từ các page
  const posts =
    data?.pages.flatMap((page) =>
      page.data.items.map((story) => ({
        id: story.id,
        user: {
          name: story.title, // tạm map sang title làm user name
          avatar: story.coverImageUrl || "/placeholder.svg",
        },
        timestamp: new Date(story.createdAt).toLocaleString(),
        content: story.summary,
        images: story.coverImageUrl ? [story.coverImageUrl] : [],
        likes: Math.floor(Math.random() * 100), // giả likes (nếu API chưa có)
        comments: Math.floor(Math.random() * 10), // giả comments (nếu API chưa có)
      }))
    ) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {data?.pages.flatMap((page) =>
          page.data.items.map((story) => (
            <PostCard key={story.id} story={story} />
          ))
        )}

        <div
          ref={loadMoreRef}
          className="h-12 flex justify-center items-center text-muted-foreground"
        >
          {isFetchingNextPage
            ? "Đang tải thêm..."
            : hasNextPage
            ? "Kéo xuống để tải thêm"
            : "Hết dữ liệu"}
        </div>
      </main>
    </div>
  );
}
