"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";

const slides = [
  {
    animationSrc:
      "https://lottie.host/86302aff-b3d7-4016-9200-42fb8668e109/qJy87G3qKz.lottie",
    title: "Thế giới mở ra từ từng trang sách",
    subtitle: "Mỗi câu chuyện là một phép màu, chỉ chờ được kể lại.",
  },
  {
    animationSrc:
      "https://lottie.host/2297fe7f-7267-4858-bce6-e1332b87b935/nobEBbCVv1.lottie",
    title: "Cuốn sách cũng có hành trình riêng",
    subtitle: "Giống như chúng ta – bước đi, ghi nhớ, và để lại dấu ấn.",
  },
  {
    animationSrc:
      "https://lottie.host/58561e12-da82-40e0-8941-ccfe8c36a5aa/nzclpCwW0g.lottie",
    title: "Nơi ý tưởng hóa thành câu chữ",
    subtitle: "Viết, chia sẻ, và lưu giữ – tất cả trong StoryNest.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dpr, setDpr] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDpr(window.devicePixelRatio || 2);
  }, []);

  return (
    <main className="flex min-h-screen max-w-screen flex-col bg-black text-white md:flex-row">
      {/* Left Section (ẩn trên mobile) */}
      <section className="hidden md:flex md:h-auto md:w-1/2 flex-col items-center justify-center relative">
        <div className="relative h-[500px] w-full">
          {slides.map((slide, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                x: currentSlide === index ? 0 : -50,
              }}
              transition={{ duration: 1 }}
              className={`absolute top-0 left-0 h-full w-full ${
                currentSlide === index
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
            >
              <DotLottieReact
                src={slide.animationSrc}
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
                renderConfig={{ devicePixelRatio: dpr }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          key={currentSlide + "-text"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2 px-4 text-center"
        >
          <h2 className="text-gradient-1 text-3xl font-bold whitespace-pre">
            {slides[currentSlide].title}
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-gray-400">
            {slides[currentSlide].subtitle}
          </p>
        </motion.div>

        <div className="mt-3 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? "scale-125 bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Right Section (full trên mobile) */}
      <section className="flex min-h-screen w-full flex-col items-center space-y-10 overflow-auto bg-neutral-900 p-6 shadow-md md:w-1/2 md:rounded-none md:border-l md:border-neutral-700 md:p-8">
        <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center">
          <Image src="/assets/icon.png" alt="Logo" width={80} height={80} />
          {children}
        </div>
        <div className="mt-auto flex w-full flex-col items-center justify-center gap-2 text-xs text-gray-400 md:flex-row md:justify-between md:text-sm">
          <p>© 2025 - Đồ án môn khởi nghiệp EXE201</p>
          <p className="text-center">
            Chính sách bảo mật • Điều khoản & Điều kiện
          </p>
        </div>
      </section>
    </main>
  );
}
