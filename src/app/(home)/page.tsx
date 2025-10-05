"use client";

import CreateStory from "@/components/home/create-story";
import { PostCard } from "@/components/home/post-card";
import { useStoriesQuery } from "@/queries/story.queries";
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
    console.log("data nè", data);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <CreateStory />
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
            : !data // chưa có data -> đang load lần đầu
            ? "Đang tải..."
            : hasNextPage
            ? "Kéo xuống để tải thêm"
            : "Hết dữ liệu"}
        </div>
      </main>
    </div>
  );
}
