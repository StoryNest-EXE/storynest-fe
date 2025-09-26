"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, MoreHorizontal } from "lucide-react";
import clsx from "clsx"; // tiện cho merge class (có thể bỏ nếu không muốn)

interface VoicePlayerProps {
  audioUrl: string;
  className?: string; // 👈 cho phép custom className
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl, className }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className={clsx(
        "mt-6 p-5 bg-gradient-to-br from-slate-700/60 to-slate-800/60 rounded-3xl backdrop-blur-xl border border-slate-500/30 shadow-inner",
        className // 👈 merge class bên ngoài vào
      )}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center justify-between text-white mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlayback}
            className="p-3 bg-gradient-to-br from-blue-500/80 to-purple-600/80 rounded-full hover:from-blue-400/80 hover:to-purple-500/80 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          <div className="text-sm font-medium text-blue-200">
            <span className="text-white">{formatTime(currentTime)}</span>
            <span className="text-slate-400 mx-2">/</span>
            <span className="text-slate-300">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Volume2 className="w-4 h-4 text-slate-300" />
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <MoreHorizontal className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="w-full bg-gradient-to-r from-slate-600/50 to-slate-500/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
          <div
            className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300 shadow-lg"
            style={{
              width: duration ? `${(currentTime / duration) * 100}%` : "0%",
              boxShadow: isPlaying
                ? "0 0 20px rgba(59, 130, 246, 0.5)"
                : "none",
            }}
          ></div>
        </div>

        {isPlaying && (
          <div
            className="absolute top-0 w-4 h-2 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-sm opacity-80 transition-all duration-300"
            style={{
              left: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default VoicePlayer;
