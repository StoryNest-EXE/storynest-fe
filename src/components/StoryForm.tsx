"use client";

import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/TagInput";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import HardBreak from "@tiptap/extension-hard-break";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Image from "@tiptap/extension-image";
import { PresignUploadRequest } from "@/types/media.type";
import { toast } from "sonner";
import FileUpload from "@/components/custom-ui/FileUpload/FileUpload";
import AnonymousComponent from "@/components/Anonymous";
import { usePresignUploadMutation } from "@/queries/media.queries";
import { PrivacyStatus, StoryFormData, StoryStatus } from "@/types/story.type";

type StoryFormProps = {
  onSubmit: (data: StoryFormData) => Promise<void> | void;
  initialData?: Partial<StoryFormData>; // dùng cho Update
  isSubmitting?: boolean;
};

type PendingUpload = {
  tempPreview: string;
  file: File;
  controller: AbortController;
};

export default function StoryForm({
  onSubmit,
  initialData,
  isSubmitting,
}: StoryFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus>(0);
  const [storyStatus, setStoryStatus] = useState<StoryStatus>(
    StoryStatus.Published
  );
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [isAnonymous, setIsAnonymous] = useState(
    initialData?.isAnonymous ?? false
  );
  const [mediaList, setMediaList] = useState<{ key: string; url: string }[]>(
    initialData?.mediaList || []
  );
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const presignUploadMutation = usePresignUploadMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ hardBreak: false }),
      Underline,
      Strike,
      Image,
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => {
              const { state } = this.editor;
              const { $from } = state.selection;
              let hardBreakCount = 0;
              let pos = $from.pos - 1;

              // Đếm số hardBreak liên tiếp ở cuối
              while (pos >= 0) {
                const nodeBefore = state.doc.nodeAt(pos);
                if (nodeBefore && nodeBefore.type.name === "hardBreak") {
                  hardBreakCount++;
                  pos--;
                } else {
                  break;
                }
              }

              if (hardBreakCount >= 2) {
                // Đã 2 dòng trống => chặn xuống thêm
                return true;
              }

              // Cho phép thêm 1 hardBreak
              return this.editor.commands.setHardBreak();
            },
          };
        },
      }),
      Placeholder.configure({
        placeholder: "Nội dung câu chuyện...",
      }),
    ],
    content: initialData?.content || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] outline-none p-3 text-white placeholder:text-slate-400",
      },
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    immediatelyRender: false,
  });

  useEffect(() => {
    setIsSubmitDisabled(!title.trim());
  }, [title]);

  // ======================= Upload Images =======================
  const handleAddImages = async (files: File[], tempPreviews: string[]) => {
    if (!files.length) return;
    const controllers = files.map(() => new AbortController());
    const newPendings: PendingUpload[] = tempPreviews.map((tp, i) => ({
      tempPreview: tp,
      file: files[i],
      controller: controllers[i],
    }));
    setPendingUploads((prev) => [...prev, ...newPendings]);

    const uploadReq: PresignUploadRequest = {
      resourceType: "story",
      files: files.map((f) => ({
        contentType: f.type,
        fileSize: f.size,
      })),
    };

    let uploadRes;
    try {
      uploadRes = await presignUploadMutation.mutateAsync(uploadReq);
    } catch (err) {
      toast.error("Không thể lấy presign URL");
      setPendingUploads((prev) =>
        prev.filter((p) => !tempPreviews.includes(p.tempPreview))
      );
      return;
    }

    const uploads = uploadRes.data.uploads;

    const uploadResults = await Promise.all(
      uploads.map((u, i) =>
        fetch(u.s3Url, {
          method: "PUT",
          body: files[i],
          headers: { "Content-Type": files[i].type },
          signal: controllers[i].signal,
        })
          .then((res) => ({ ok: res.ok, index: i }))
          .catch(() => ({ ok: false, index: i }))
      )
    );

    const successful = uploadResults.filter((r) => r.ok);
    if (successful.length > 0) {
      setMediaList((prev) => [
        ...prev,
        ...successful.map((r) => ({
          key: uploads[r.index].key,
          url: uploads[r.index].mediaUrl,
        })),
      ]);
      toast.success(`${successful.length} ảnh đã được tải lên`);
    } else {
      toast.error("Không upload được ảnh nào");
    }

    setPendingUploads((prev) =>
      prev.filter((p) => !tempPreviews.includes(p.tempPreview))
    );
  };

  const handleRemoveImage = (url: string) => {
    const pending = pendingUploads.find((p) => p.tempPreview === url);
    if (pending) {
      pending.controller.abort();
      setPendingUploads((prev) => prev.filter((p) => p.tempPreview !== url));
      return;
    }
    setMediaList((prev) => prev.filter((m) => m.url !== url));
  };

  // ======================= Submit =======================
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Title không được để trống");
      return;
    }

    if (pendingUploads.length > 0) {
      toast.error("Vui lòng chờ upload ảnh hoàn tất");
      return;
    }

    setIsSubmitDisabled(true);

    setStoryStatus(StoryStatus.Published);

    const content = editor?.getHTML() || "";
    onSubmit({
      title,
      tags,
      privacyStatus,
      storyStatus,
      content,
      mediaList,
      isAnonymous,
    });

    setIsSubmitDisabled(false);
  };

  if (!editor) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-200">
          Chia sẻ câu chuyện của bạn
        </h1>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-5">
          <AnonymousComponent
            isAnonymous={isAnonymous}
            onToggle={setIsAnonymous}
          />

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Tiêu đề *</label>
            <Textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              spellCheck={false}
              maxLength={300}
              className="!text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Tags</label>
            <TagInput value={tags} onChange={setTags} />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Nội dung</label>
            <div className="border border-slate-600 rounded-md bg-slate-800/50">
              <div className="flex items-center gap-1 p-3 border-b border-slate-600">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("bold") ? "bg-slate-700 text-blue-400" : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  <Bold size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("italic")
                      ? "bg-slate-700 text-blue-400"
                      : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  <Italic size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("strike")
                      ? "bg-slate-700 text-blue-400"
                      : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${
                    editor.isActive("underline")
                      ? "bg-slate-700 text-blue-400"
                      : ""
                  }`}
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <UnderlineIcon size={16} />
                </Button>
              </div>
              <EditorContent
                editor={editor}
                spellCheck={false}
                className="p-3"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitDisabled}
            >
              {isSubmitting ? "Đang đăng..." : "Đăng bài"}
            </Button>
          </div>
        </div>

        <div className="w-72">
          <h2 className="text-sm text-gray-400 mb-2">Đăng ảnh ở đây</h2>
          <FileUpload
            onAdd={handleAddImages}
            onRemove={handleRemoveImage}
            allowMultiple
            initialPreviews={mediaList.map((m) => m.url)}
          />
        </div>
      </div>
    </div>
  );
}
