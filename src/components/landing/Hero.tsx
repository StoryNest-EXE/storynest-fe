import { ArrowRight, BookOpen } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import GradientText from "../GradientText";

function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <BookOpen className="w-4 h-4 text-theme" />
            <span className="text-sm font-medium text-theme">
              Chào mừng đến Storynest
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
            Chia Sẻ Câu Chuyện Của Bạn Thông Qua
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
              {" "}
              <GradientText className="text-7xl leading-[1.5]">
                StoryNest
              </GradientText>
            </span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Một nơi an toàn cho những người hướng nội và những người yêu thích
            kể chuyện. Chia sẻ câu chuyện cá nhân của bạn một cách ẩn danh hoặc
            công khai. Biến chúng thành những bộ truyện ngắn tuyệt đẹp với AI,
            hoàn chỉnh với hình ảnh minh họa và lời kể bằng giọng nói.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-theme-primary hover:bg-theme-primary/90 text-primary-foreground gap-2"
            >
              Bắt Đầu Chia Sẻ <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Khám Phá Câu Chuyện
            </Button>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-theme-primary">
                10K+
              </div>
              <p className="text-sm text-muted-foreground">
                Câu Chuyện Được Chia Sẻ
              </p>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-theme-secondary">
                5K+
              </div>
              <p className="text-sm text-muted-foreground">
                Thành Viên Hoạt Động
              </p>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-theme-tertiary">
                100%
              </div>
              <p className="text-sm text-muted-foreground">An Toàn Ẩn Danh</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
