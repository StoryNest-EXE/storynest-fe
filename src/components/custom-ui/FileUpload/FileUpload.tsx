"use client";

import styles from "./FileUpload.module.css";
import uploadIcon from "../../../../public/assets/UploadIcon.png";
import { useRef, useState, useEffect, ChangeEvent, DragEvent } from "react";

type FileUploadProps = {
  // Gọi khi thêm file: trả về files và temp preview URLs tương ứng (blob:)
  onAdd: (files: File[], tempPreviews: string[]) => void;
  // Gọi khi xóa preview (blob: hoặc remote url)
  onRemove?: (url: string) => void;
  allowMultiple?: boolean;
  accept?: string;
  initialPreviews?: string[]; // remote urls (khi edit hoặc sau upload hoàn tất)
};

function FileUpload({
  onAdd,
  onRemove,
  allowMultiple = true,
  accept = "image/*",
  initialPreviews = [],
}: FileUploadProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // previews hiển thị (có thể là blob: hoặc remote url)
  const [previews, setPreviews] = useState<string[]>(initialPreviews);

  // lưu các blob URLs để revoke khi cần
  const blobUrlsRef = useRef<string[]>([]);

  // sync khi parent truyền initialPreviews (remote urls) -> replace previews, revoke old blob urls
  useEffect(() => {
    if (!initialPreviews || initialPreviews.length === 0) {
      // nếu parent truyền rỗng, ta vẫn giữ previews rỗng
      // revoke blob urls (nếu có)
      blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      blobUrlsRef.current = [];
      setPreviews(initialPreviews);
      return;
    }

    // nếu có initialPreviews, revoke blob URLs và set previews = initialPreviews
    blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    blobUrlsRef.current = [];
    setPreviews(initialPreviews);
  }, [initialPreviews]);

  // cleanup khi unmount
  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      blobUrlsRef.current = [];
    };
  }, []);

  // Drag handlers (giữ nguyên UI)
  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    wrapperRef.current?.classList.add(styles.dragover);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    wrapperRef.current?.classList.remove(styles.dragover);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    wrapperRef.current?.classList.remove(styles.dragover);

    if (e.dataTransfer.files.length > 0) {
      let files = Array.from(e.dataTransfer.files);
      files = filterFilesByAccept(files);
      if (!allowMultiple) files = files.slice(0, 1);
      handleFiles(files);
    }
  };

  const onFileDrop = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let files = Array.from(e.target.files);
      files = filterFilesByAccept(files);
      if (!allowMultiple) files = files.slice(0, 1);
      handleFiles(files);

      // reset input để chọn lại cùng file vẫn trigger
      e.currentTarget.value = "";
    }
  };

  const filterFilesByAccept = (files: File[]) => {
    if (!accept) return files;
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    return files.filter((file) =>
      acceptedTypes.some((type) =>
        type.includes("/")
          ? file.type.startsWith(type.split("/")[0]) || file.type === type
          : file.name.toLowerCase().endsWith(type.toLowerCase())
      )
    );
  };

  // Khi thêm file: tạo blob URLs, append previews, gọi onAdd(files, tempPreviews)
  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const newBlobUrls = files.map((f) => URL.createObjectURL(f));
    // lưu blob urls để revoke sau này
    blobUrlsRef.current.push(...newBlobUrls);
    setPreviews((prev) => [...prev, ...newBlobUrls]);

    // gọi parent, truyền cả files & blob previews để parent có thể map & quản lý pending
    onAdd(files, newBlobUrls);
  };

  // Xóa preview (blob hoặc remote). Gọi onRemove(url)
  const handleRemove = (url: string) => {
    // nếu là blob url, revoke nó + remove khỏi blobUrlsRef
    if (url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // ignore
      }
      blobUrlsRef.current = blobUrlsRef.current.filter((u) => u !== url);
    }

    setPreviews((prev) => prev.filter((p) => p !== url));
    onRemove?.(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.header}>Kéo & Thả</h2>

        <div
          className={styles.drop_file_container}
          ref={wrapperRef}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div>
            <img
              src={uploadIcon.src}
              alt="Upload"
              className={styles.upload_icon}
            />
          </div>
          <input
            type="file"
            multiple={allowMultiple}
            accept={accept}
            onChange={onFileDrop}
          />
          <p className={styles.drop_file_label}>Kéo & Thả ảnh ở đây</p>
        </div>

        {previews.length > 0 && (
          <div className={styles.drop_file_preview}>
            <p className={styles.drop_file_preview_title}>Đã sẵn sàng</p>
            {previews.map((url, index) => (
              <div key={index} className={styles.drop_file_preview_item}>
                <img src={url} alt={`Preview ${index}`} />
                <div className={styles.drop_file_preview_item_info}>
                  <p className={styles.name}>
                    {url.split("/").pop()?.slice(0, 25)}...
                  </p>
                  {/* nếu muốn hiện size hoặc tên file: cần parent truyền info, bỏ qua để giữ UI cũ */}
                </div>
                <span
                  className={styles.drop_file_preview_item_remove}
                  onClick={() => handleRemove(url)}
                >
                  x
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
