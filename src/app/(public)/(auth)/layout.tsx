"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const slides = [
  {
    animationSrc:
      "https://lottie.host/9dbf53dc-2cb3-41f3-b3c0-9ab8e06fcfe6/Ls9yDx8oSb.lottie",
    title: "All your dev assets, in one place",
    subtitle: "Snippets, API keys, configs – all organized like a second brain",
  },
  {
    animationSrc:
      "https://lottie.host/ba494b30-0f32-41c5-b869-fa3ef21841c2/YYTlG2veGZ.lottie",
    title: "Save It    Find It    Done",
    subtitle:
      'Save it once. Find it fast.\nNo more "Where did I put that key?"',
  },
  {
    animationSrc:
      "https://lottie.host/e03679a1-6baf-4321-a4a6-6082aa1fc3a2/MeFAahqLqW.lottie",
    title: "Your Peace of Mind, Vaulted",
    subtitle:
      "No more clutter. No more chaos.\nJust one vault — for everything that matters.",
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
              transition={{ duration: 0.6 }}
              className={`absolute top-0 left-0 w-full h-full ${
                currentSlide === index
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }`}
            >
              <DotLottieReact
                src={slide.animationSrc}
                loop
                autoplay
                style={{ width: "100%", height: "500px" }}
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
          <img src="/StoryNest_logo.svg" alt="Logo" width="100" height="100" />
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
