"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
  previewClassName?: string;
}

export function ImagePreview({
  src,
  alt,
  className,
  previewClassName,
}: ImagePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={`cursor-pointer ${className ?? ""}`}>
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300 rounded-xl"
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className="max-w-5xl p-0 bg-transparent border-none shadow-none"
        showCloseButton={false}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-auto rounded-xl ${previewClassName ?? ""}`}
        />
      </DialogContent>
    </Dialog>
  );
}
