"use client";

import {
  useCheckNLPMutation,
  useCreateStoryMutation,
} from "@/queries/story.queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StoryForm from "@/components/StoryForm";
import { StoryFormData } from "@/types/story.type";
import { useState } from "react";

export default function CreateStoryPage() {
  const createStoryMutation = useCreateStoryMutation();
  const checkNLPMutation = useCheckNLPMutation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: StoryFormData) => {
    setIsSubmitting(true);
    try {
      // 🧠 Gọi NLP check trước
      const nlpResponse = await checkNLPMutation.mutateAsync({
        title: data.title,
        content: data.content,
        tags: data.tags,
      });

      // Do dùng try catch nên nếu status là 400 thì sẽ bị catch ở đây thành ra ko chạy if này
      if (nlpResponse.status === 400) {
        const offensiveWords = nlpResponse.data
          .map((item) => item.wordForm)
          .join(", ");
        toast.error(
          `Câu chuyện của bạn chứa từ ngữ nhạy cảm: ${offensiveWords}`
        );
        setIsSubmitting(false);
        return;
      }

      // 🚀 Nếu OK thì tạo bài viết
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
    } catch (error: any) {
      // ⚠️ Nếu checkNLP trả lỗi 400 từ Axios thì nó sẽ bị catch ở đây
      const response = error?.response?.data;
      if (response?.status === 400) {
        const offensiveWords = response.data
          .map((item: any) => item.wordForm)
          .join(", ");
        toast.error(
          `Câu chuyện của bạn chứa từ ngữ nhạy cảm: ${offensiveWords}`
        );
      } else {
        toast.error("Đã có lỗi xảy ra khi tạo bài viết!");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <StoryForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
    </div>
  );
}
