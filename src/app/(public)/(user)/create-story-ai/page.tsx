"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StoryAICard } from "@/types/story.type";
import { Eye, ImageIcon, Mic, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";

function CreateStoryAI() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState<StoryAICard[]>([{ id: "1", content: "" }]);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState<string | null>(
    null
  );
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(
    null
  );

  const updateCardContent = (id: string, newContent: string) => {
    setCards((prevCards) =>
      prevCards.map((c) => (c.id === id ? { ...c, content: newContent } : c))
    );
  };

  const addNewCard = () => {
    if (cards.length < 5) {
      const newCard: StoryAICard = {
        id: (cards.length + 1).toString(),
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
          <div className="mb-6">
            <label className="text-sm text-gray-300">
              Title<span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              placeholder="Nhập tiêu đề câu chuyện..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 text-lg py-3"
            />
          </div>

          {/* Story Cards */}
          <div className="space-y-6 mb-8">
            {cards.map((card, index) => (
              <Card key={card.id} className="w-full bg-neat p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-xl font-semibold">
                    Thẻ {index + 1}
                  </h3>
                  {cards.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCard(card.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Textarea
                  placeholder="Viết đoạn câu chuyện của bạn tại đây..."
                  value={card.content}
                  onChange={(e) => updateCardContent(card.id, e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[200px] mb-4 resize-none"
                />

                <div className="flex gap-4">
                  <Button
                    // onClick={() => handleGenerateVoice(card.id)}
                    disabled={isGeneratingVoice === card.id}
                    className="flex-1 bg-transparent hover:bg-slate-600 border border-amber-50 text-white"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    {isGeneratingVoice === card.id
                      ? "Đang Tạo..."
                      : "Tạo Giọng Nói"}
                  </Button>

                  <Button
                    // onClick={() => handleGenerateImage(card.id)}
                    disabled={isGeneratingImage === card.id}
                    className="flex-1 bg-transparent hover:bg-slate-600 border border-amber-50 text-white"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    {isGeneratingImage === card.id
                      ? "Đang Tạo..."
                      : "Tạo Hình Ảnh"}
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  {/* Preview audio */}
                  {/* {card.audioUrl && ( */}
                  <audio controls className="mt-3 w-full">
                    <source
                      src={
                        "https://cdn.storynest.io.vn/generated-content/audio/aud_4ab4356aad96477eae9969646ddf9232.wav"
                      }
                      type="audio/mpeg"
                    />
                    Trình duyệt không hỗ trợ audio.
                  </audio>
                  {/* )} */}

                  {/* Preview image */}
                  {/* {card.imageUrl && ( */}
                  <img
                    src="https://reactjsexample.com/content/images/2018/03/react-modular-audio-player.jpg"
                    alt="Generated"
                    className="mt-3 w-200 h-100 object-cover rounded-lg"
                  />
                  {/* )} */}
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

            <Button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white">
              Xuất Bản Câu Chuyện
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStoryAI;
