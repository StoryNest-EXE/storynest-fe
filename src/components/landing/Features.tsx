"use client";

import { Card } from "@/components/ui/card";
import { Cast as Mask, Sparkles, Volume2, Users } from "lucide-react";

const features = [
  {
    icon: Mask,
    title: "Ẩn Danh Hoặc Công Khai",
    description:
      "Chia sẻ câu chuyện của bạn hoàn toàn ẩn danh hoặc với danh tính thực của bạn. Bạn có toàn quyền kiểm soát quyền riêng tư của mình.",
    color: "text-theme-primary",
  },
  {
    icon: Sparkles,
    title: "Tạo Câu Chuyện Bằng AI",
    description:
      "Biến câu chuyện cá nhân của bạn thành một bộ truyện ngắn tuyệt đẹp. AI của chúng tôi chia nhỏ nó thành các chương với hình ảnh minh họa tuyệt vời.",
    color: "text-theme-secondary",
  },
  {
    icon: Volume2,
    title: "Lời Kể Bằng Giọng Nói",
    description:
      "Thêm lời kể bằng giọng nói cho câu chuyện của bạn. Nghe câu chuyện của bạn trở nên sống động với tổng hợp giọng nói chuyên nghiệp.",
    color: "text-theme-tertiary",
  },
  {
    icon: Users,
    title: "Cộng Đồng Hỗ Trợ",
    description:
      "Kết nối với những người hướng nội và những người yêu thích kể chuyện khác. Đọc, bình luận và hỗ trợ hành trình của nhau.",
    color: "text-theme-primary/70",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Những Tính Năng Mạnh Mẽ
          </h2>
          <p className="text-lg text-muted-foreground">
            Mọi thứ bạn cần để chia sẻ và biến đổi câu chuyện của mình
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 border border-border hover:border-primary/50 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors`}
                >
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
