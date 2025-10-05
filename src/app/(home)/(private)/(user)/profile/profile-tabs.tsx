"use client";

import { useState, useEffect, useRef } from "react";
import { StoryCardPreview } from "./story-card-preview";
import {
  useMyAIStoriesQuery,
  useMyStoriesQuery,
} from "@/queries/story.queries";

const tabs = ["Story", "Replies", "Media", "Story AI"];

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("Story");

  const myStoriesQuery = useMyStoriesQuery(5);
  const myAIStoriesQuery = useMyAIStoriesQuery(5);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // chọn query theo tab
  const selectedQuery =
    activeTab === "Story"
      ? myStoriesQuery
      : activeTab === "Story AI"
      ? myAIStoriesQuery
      : null;

  const items =
    selectedQuery?.data?.pages?.flatMap((page) => page.data.items) ?? [];

  // observer
  useEffect(() => {
    if (!loadMoreRef.current || !selectedQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && selectedQuery.hasNextPage) {
          selectedQuery.fetchNextPage();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [selectedQuery?.fetchNextPage, selectedQuery?.hasNextPage, activeTab]);

  const renderContent = () => {
    if (!selectedQuery)
      return <p className="text-sm text-muted-foreground">Không có dữ liệu</p>;
    if (selectedQuery.isLoading)
      return <p className="text-sm text-muted-foreground">Đang tải...</p>;
    if (items.length === 0)
      return <p className="text-sm text-muted-foreground">Không có dữ liệu</p>;

    return (
      <>
        {items.map((item) => (
          <StoryCardPreview key={item.id} story={item} />
        ))}
        <div
          ref={loadMoreRef}
          className="h-12 flex justify-center items-center text-muted-foreground"
        >
          {selectedQuery.isFetchingNextPage
            ? "Đang tải thêm..."
            : selectedQuery.hasNextPage
            ? "Kéo xuống để tải thêm"
            : "Hết dữ liệu"}
        </div>
      </>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex items-center justify-between border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}
