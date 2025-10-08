"use client";

import { useCreateStoryMutation } from "@/queries/story.queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StoryForm from "@/components/StoryForm";
import { CreateStoryRequest, StoryFormData } from "@/types/story.type";

export default function CreateStoryPage() {
  const createStoryMutation = useCreateStoryMutation();
  const router = useRouter();

  const handleCreate = async (data: StoryFormData) => {
    try {
      await createStoryMutation.mutateAsync({
        title: data.title,
        content: data.content,
        coverImageUrl: "",
        tags: data.tags,
        privacyStatus: 0,
        storyStatus: 1,
        isAnonymous: data.isAnonymous,
        mediaUrls: data.mediaList?.map((m) => m.key) ?? [],
      });
      toast.success("Tạo bài viết thành công!");
      router.push("/");
    } catch {
      toast.error("Tạo bài viết thất bại!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <StoryForm onSubmit={handleCreate} />
    </div>
  );
}
