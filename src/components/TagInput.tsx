"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({ value, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === " ") && inputValue.trim() !== "") {
      e.preventDefault();
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="p-3 border rounded-md dark:bg-input/30">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-blue-300/20 text-blue-300 rounded-full flex items-center gap-1 text-sm"
          >
            #{tag}
            <X
              size={14}
              className="cursor-pointer hover:text-purple-200"
              onClick={() => removeTag(tag)}
            />
          </span>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập tag và nhấn Enter..."
        className="border-none focus:ring-0 bg-transparent text-white placeholder:text-slate-400"
      />
    </div>
  );
}
