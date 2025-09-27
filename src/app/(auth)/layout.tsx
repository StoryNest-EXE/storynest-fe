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
    <main className="flex min-h-screen max-w-screen items-center justify-center bg-black text-white">
      {/* Left Section */}
      <section className="flex h-full w-full flex-col items-center justify-center">
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
              className={`absolute top-0 left-0 w-full h-full ${
                currentSlide === index
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
            >
              {slide.animationSrc.endsWith(".lottie") ||
              slide.animationSrc.endsWith(".json") ? (
                <DotLottieReact
                  src={slide.animationSrc}
                  loop
                  autoplay
                  style={{ width: "100%", height: "500px" }}
                  renderConfig={{ devicePixelRatio: dpr }}
                />
              ) : (
                <img
                  src={slide.animationSrc}
                  alt={slide.title}
                  width={800}
                  height={500}
                  className="h-full w-full object-contain"
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          key={currentSlide + "-text"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2 text-center"
        >
          <h2 className="text-gradient-1 text-3xl font-bold whitespace-pre">
            {slides[currentSlide].title}
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-gray-400">
            {slides[currentSlide].subtitle}
          </p>
        </motion.div>

        <div className="mt-4 flex gap-2">
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

      {/* Right Section */}
      <section className="flex min-h-screen w-full flex-col items-center space-y-10 overflow-auto rounded-2xl border border-neutral-700 bg-neutral-900 p-8 shadow-md">
        <div className="flex w-[360px] flex-1 flex-col items-center justify-center">
          <Image
            src="/svg/StoryNest_logo.svg"
            alt="Logo"
            width="100"
            height="100"
          />
          {children}
        </div>
        <div className="mt-auto flex w-full items-center justify-between text-sm text-gray-400">
          <p>© 2025 - Kusl Vault All Rights Reserved</p>
          <p>Privacy Policy • Term & Condition</p>
        </div>
      </section>
    </main>
  );
}
