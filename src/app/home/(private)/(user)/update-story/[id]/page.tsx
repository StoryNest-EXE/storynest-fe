"use client";

import StoryForm from "@/components/StoryForm";
import { useParams, useRouter } from "next/navigation";
import {
  useMyDetailStoryQuery,
  useUpdateStoryMutation,
} from "@/queries/story.queries";
import type { StoryFormData, UpdateStoryRequest } from "@/types/story.type";
import { toast } from "sonner";
import StoryNestLoader from "@/components/story-nest-loader/StoryNestLoader";

export default function UpdateStoryPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = Number(params.id);

  const { data: storyDetail, isLoading } = useMyDetailStoryQuery(storyId);
  const updateStoryMutation = useUpdateStoryMutation(storyId);

  // Nếu đang load
  if (isLoading) {
    return <StoryNestLoader />;
  }

  function extractKeyFromUrl(url: string) {
    return url.split("https://cdn.storynest.io.vn/")[1] ?? url;
  }

  // Map data từ API → form
  const initialData: StoryFormData = {
    title: storyDetail?.data.title ?? "",
    content: storyDetail?.data.content ?? "",
    tags: storyDetail?.data.tags?.map((t) => t.name) ?? [],
    privacyStatus: storyDetail?.data.privacyStatus ?? 0,
    storyStatus: storyDetail?.data.storyStatus ?? 1,
    isAnonymous: storyDetail?.data.isAnonymous ?? false,
    mediaList:
      storyDetail?.data.media?.map((m) => ({
        key: extractKeyFromUrl(m.mediaUrl), // dùng url làm key “giả”
        url: m.mediaUrl, // url thật để preview
      })) ?? [],
  };
  // Khi bấm submit update
  const handleUpdate = async (data: StoryFormData) => {
    const payload: UpdateStoryRequest = {
      title: data.title,
      content: data.content,
      coverImageUrl: data.mediaList?.[0]?.url || "",
      tags: data.tags,
      privacyStatus: data.privacyStatus,
      storyStatus: data.storyStatus,
      isAnonymous: data.isAnonymous,
      mediaUrls: data.mediaList?.map((m) => m.key) ?? [],
      audioUrls: [],
    };

    try {
      await updateStoryMutation.mutateAsync(payload);
      router.push("/home/profile");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cập nhật câu chuyện</h1>
      <StoryForm onSubmit={handleUpdate} initialData={initialData} />
    </div>
  );
}
