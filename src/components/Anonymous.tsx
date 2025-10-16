"use client";

import React from "react";
import SparkleSwitch from "./custom-ui/SparkleSwitch";
import { Eye, EyeOff } from "lucide-react";

interface AnonymousComponentProps {
  isAnonymous: boolean;
  onToggle: (value: boolean) => void;
}

function AnonymousComponent({
  isAnonymous,
  onToggle,
}: AnonymousComponentProps) {
  return (
    <div className="mb-8 p-5 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-600/30 hover:border-blue-500/30 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full backdrop-blur-sm">
            {isAnonymous ? (
              <EyeOff className="w-4 h-4 text-purple-300" />
            ) : (
              <Eye className="w-4 h-4 text-blue-300" />
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold text-base mb-1">
              {isAnonymous ? "Đăng ẩn danh" : "Đăng công khai"}
            </h3>
            <p className="text-blue-200/70 text-sm">
              {isAnonymous
                ? "Bài đăng sẽ được ẩn danh, người khác không thấy tên bạn."
                : "Bài đăng sẽ công khai với tên và hồ sơ của bạn được hiển thị."}
            </p>
          </div>
        </div>
        <div style={{ transform: "scale(0.6)" }}>
          <SparkleSwitch checked={isAnonymous} onChange={onToggle} />
        </div>
      </div>
    </div>
  );
}

export default AnonymousComponent;
