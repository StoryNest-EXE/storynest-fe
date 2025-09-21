"use client";

import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/TagInput";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  ImageIcon,
  Underline as UnderlineIcon,
  Strikethrough,
} from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { usePresignUploadMutation } from "@/queries/media.queries";
import { toast } from "sonner";
import { CreateStoryRequest } from "@/types/story.type";
import { useCreateStoryMutation } from "@/queries/story.queries";
import { PresignUploadRequest } from "@/types/media.type";
import { useRouter } from "next/navigation";

function CreateStory() {
  const [title, setTitle] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); // Mặc định disable
  const fileInputRef = useRef<HTMLInputElement>(null);
  const presignUploadMutation = usePresignUploadMutation();
  const createStoryMutation = useCreateStoryMutation();
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const router = useRouter();

  // init editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Image,
      Placeholder.configure({
        placeholder: "Body text (optional)",
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] outline-none p-3 text-white placeholder:text-slate-400",
      },
    },
    immediatelyRender: false,
    onSelectionUpdate: () => setRefresh((prev) => !prev),
  });

  useEffect(() => {
    if (!editor) return;

    const rerender = () => setRefresh((prev) => !prev);

    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);

    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  // Cập nhật logic khi title thay đổi
  useEffect(() => {
    setIsSubmitDisabled(!title.trim()); // Disable nếu title rỗng
  }, [title]);

  if (!editor) return null;

  // --- Upload ảnh (chèn vào editor hoặc set cover) ---
  const handleUploadImages = async (files: File[]) => {
    const uploadReq: PresignUploadRequest = {
      resourceType: "story",
      files: files.map((f) => ({
        contentType: f.type,
        fileSize: f.size,
      })),
    };

    // call presign
    const uploadRes = await presignUploadMutation.mutateAsync(uploadReq);

    const uploads = uploadRes.data.uploads;

    // B2: upload tất cả file binary song song lên S3
    await Promise.all(
      uploads.map((u, i) =>
        fetch(u.s3Url, {
          method: "PUT",
          body: files[i],
          headers: {
            "Content-Type": files[i].type,
          },
        })
      )
    );

    // B3: Lưu lại mediaUrls vào state để khi submit gửi đi
    setMediaUrls((prev) => [...prev, ...uploads.map((u) => u.mediaUrl)]);

    // B4: chèn ảnh vào editor
    uploads.forEach((u) => {
      editor?.chain().focus().setImage({ src: u.mediaUrl }).run();
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files); // chuyển FileList -> File[]
    handleUploadImages(files);

    e.target.value = ""; // reset input để lần sau chọn lại cùng file vẫn trigger
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title không được để trống");
      return;
    }

    const content = editor.getHTML();
    if (!content || content === "<p></p>") {
      toast.error("Content không được để trống");
      return;
    }

    const storyReq: CreateStoryRequest = {
      title: title,
      content: content,
      coverImageUrl: "",
      tags: tags,
      privacyStatus: 0,
      storyStatus: 1,
      mediaUrls: mediaUrls, // truyền mảng mediaUrls
    };

    try {
      const res = await createStoryMutation.mutateAsync(storyReq);
      console.log("res", res);
      router.push("/");
    } catch (err) {}
  };
  return (
    <div>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-200">Create Story</h1>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            Drafts
          </Button>
        </div>

        {/* Title Input */}
        <div className="space-y-2 ">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">
              Title<span className="text-red-500 ml-1">*</span>
            </label>
            <span className="text-xs text-gray-500">{title.length}/300</span>
          </div>
          <Textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder=""
            spellCheck={false}
            maxLength={300}
            className="!text-lg font-semibold"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2 mt-2">
          <label className="text-sm text-gray-400">Add tags</label>
          <TagInput value={tags} onChange={setTags} />
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-2 mt-5">
          <div className="border border-slate-600 rounded-md bg-slate-800/50">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-3 border-b border-slate-600">
              {/* Bold */}
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 hover:bg-slate-700 ${
                  editor.isActive("bold") ? "bg-slate-700 text-blue-400" : ""
                }`}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <Bold size={16} />
              </Button>

              {/* Italic */}
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 hover:bg-slate-700 ${
                  editor.isActive("italic") ? "bg-slate-700 text-blue-400" : ""
                }`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <Italic size={16} />
              </Button>

              {/* Strike */}
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 hover:bg-slate-700 ${
                  editor.isActive("strike") ? "bg-slate-700 text-blue-400" : ""
                }`}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <Strikethrough size={16} />
              </Button>

              {/* Underline */}
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 hover:bg-slate-700 ${
                  editor.isActive("underline")
                    ? "bg-slate-700 text-blue-400"
                    : ""
                }`}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <UnderlineIcon size={16} />
              </Button>

              {/* nút image */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-slate-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={16} />
              </Button>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={onFileChange}
              />
            </div>

            {/* Editor content */}
            <EditorContent editor={editor} spellCheck={false} className="p-3" />
          </div>
        </div>
        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitDisabled || createStoryMutation.isPending}
          >
            {createStoryMutation.isPending ? "Đang tạo..." : "Create Story"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateStory;
