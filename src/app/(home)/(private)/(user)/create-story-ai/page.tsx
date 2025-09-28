"use client";

import { ImagePreview } from "@/components/ImagePreview";
import { TagInput } from "@/components/TagInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import VoicePlayer from "@/components/VoicePlayer";
import {
  useGenerateAudioMuation,
  useGenerateImageMuation,
} from "@/queries/media.queries";
import { useCreateStoryMutation } from "@/queries/story.queries";
import { CreateStoryRequest, StoryAICard } from "@/types/story.type";
import { Eye, ImageIcon, Mic, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

function CreateStoryAI() {
  // const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [cards, setCards] = useState<StoryAICard[]>([{ id: "1", content: "" }]);
  const [generatingVoices, setGeneratingVoices] = useState<Set<string>>(
    new Set()
  );
  const [generatingImages, setGeneratingImages] = useState<Set<string>>(
    new Set()
  );
  const generateVoiceMutation = useGenerateAudioMuation();
  const generateMediaMutation = useGenerateImageMuation();
  const createStoryMutation = useCreateStoryMutation();

  const handleGenerateVoice = async (id: string, content: string) => {
    setGeneratingVoices((prev) => new Set(prev).add(id));
    try {
      const res = await generateVoiceMutation.mutateAsync(content);
      const audioUrl = res.data;
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, audioUrl } : c))
      );
    } finally {
      setGeneratingVoices((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleGenerateMedia = async (id: string, content: string) => {
    setGeneratingImages((prev) => new Set(prev).add(id));
    try {
      const res = await generateMediaMutation.mutateAsync(content);
      console.log("res", res.data);
      const mediaUrl = res.data;

      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, mediaUrl: mediaUrl } : c))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingImages((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const updateCardContent = (id: string, newContent: string) => {
    setCards((prevCards) =>
      prevCards.map((c) => (c.id === id ? { ...c, content: newContent } : c))
    );
  };

  const addNewCard = () => {
    if (cards.length < 5) {
      const newCard: StoryAICard = {
        id: crypto.randomUUID(),
        content: "",
      };
      setCards([...cards, newCard]);
    }
  };

  const deleteCard = (id: string) => {
    if (cards.length > 1) {
      setCards(cards.filter((card) => card.id !== id));
    }
  };

  const handlePublish = () => {
    const fullContent = cards.map((c) => c.content).join("\n");

    // Gom mediaUrls và audioUrls
    const mediaUrls = cards
      .map((c) => c.mediaUrl)
      .filter((url): url is string => Boolean(url));

    const audioUrls = cards
      .map((c) => c.audioUrl)
      .filter((url): url is string => Boolean(url));

    const request: CreateStoryRequest = {
      title,
      content: fullContent,
      coverImageUrl: "", // lấy ảnh đầu tiên làm cover
      tags: tags,
      privacyStatus: 0,
      storyStatus: 1,
      mediaUrls,
      audioUrls,
    };

    createStoryMutation.mutate(request);
  };

  return (
    <div>
      <div className="min-h-screen ">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Tạo Câu Chuyện Bằng AI
            </h1>
            <p className="text-gray-300 mb-2">
              Mỗi thẻ có thể tạo giọng nói và hình ảnh bằng AI
            </p>
            <p className="text-gray-300 mb-6">
              Xây dựng câu chuyện của bạn với nhiều thẻ
            </p>

            {/* Plan Status */}
            <div className="inline-block bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium">
              Gói Miễn Phí: {cards.length}/5 Thẻ Đã Sử Dụng
            </div>
          </div>

          {/* Anonymous Posting */}
          {/* <Card className="bg-gray-900/50 border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-gray-400" />
          <div>
            <h3 className="text-white font-medium">Đăng Ẩn Danh</h3>
            <p className="text-gray-400 text-sm">Bài đăng sẽ công khai với tên và hồ sơ của bạn được hiển thị.</p>
          </div>
        </div>
        <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} className="data-[state=checked]:bg-white" />
      </div>
    </Card> */}

          {/* Title Field */}
          <div className="mb-2">
            <label className="text-sm text-gray-300">
              Tiêu đề câu chuyện<span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              placeholder="Nhập tiêu đề câu chuyện..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 text-lg py-3"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2 mb-4">
            <label className="text-sm text-gray-400">
              Nhập tags cho câu chuyện
            </label>
            <TagInput value={tags} onChange={setTags} />
          </div>

          {/* Story Cards */}
          <div className="space-y-6 mb-8">
            <label className="text-sm text-gray-300">
              Nội dung của câu chuyện
              <span className="text-red-500 ml-1">*</span>
            </label>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                className="mt-1 w-full bg-slate-800/50 backdrop-blur-lg border border-slate-600/40 rounded-3xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-400/50"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-xl font-semibold tracking-wide">
                    Thẻ {index + 1}
                  </h3>
                  {cards.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCard(card.id)}
                      className="rounded-full p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Textarea */}
                <Textarea
                  placeholder="Viết đoạn câu chuyện của bạn tại đây..."
                  value={card.content}
                  onChange={(e) => updateCardContent(card.id, e.target.value)}
                  className="bg-slate-900/60 border border-slate-700 text-white placeholder:text-slate-400 min-h-[180px] mb-5 resize-none rounded-2xl focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400"
                />

                {/* Buttons */}
                <div className="flex gap-4 mb-6">
                  <Button
                    onClick={() => handleGenerateVoice(card.id, card.content)}
                    disabled={
                      !card.content.trim() || generatingVoices.has(card.id)
                    }
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-md"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {generatingVoices.has(card.id)
                      ? "Đang Tạo..."
                      : "Tạo Giọng Nói"}
                  </Button>

                  <Button
                    onClick={() => handleGenerateMedia(card.id, card.content)}
                    disabled={
                      !card.content.trim() || generatingImages.has(card.id)
                    }
                    className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-400 hover:to-orange-400 shadow-md"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {generatingImages.has(card.id)
                      ? "Đang Tạo..."
                      : "Tạo Hình Ảnh"}
                  </Button>
                </div>

                {/* Preview Zone */}
                <div className="flex flex-col items-center space-y-6">
                  {/* Audio chỉ render khi có audioUrl */}
                  {card.audioUrl && (
                    <VoicePlayer
                      className="w-full"
                      audioUrl={`https://cdn.storynest.io.vn/${card.audioUrl}`}
                    />
                  )}

                  {/* Image chỉ render khi có imageUrl */}
                  {card.mediaUrl && (
                    <div className="w-full overflow-hidden rounded-2xl border border-slate-600/50 shadow-md">
                      <ImagePreview
                        src={`https://cdn.storynest.io.vn/${card.mediaUrl}`}
                        alt="Generated"
                        className="w-full h-72 object-cover object-[50%_30%]"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Add New Card */}
          {cards.length < 5 && (
            <div className="text-center mb-8">
              <Button
                onClick={addNewCard}
                variant="outline"
                className="border-dashed border-2 border-gray-500 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent px-8 py-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm Thẻ Mới ({cards.length}/5)
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pb-8">
            <Button
              variant="outline"
              className="px-8 py-3 border-gray-500 text-gray-300 hover:text-white hover:border-gray-400 bg-transparent"
            >
              Lưu Bản Nháp
            </Button>

            <Button
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handlePublish}
            >
              Xuất Bản Câu Chuyện
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStoryAI;
