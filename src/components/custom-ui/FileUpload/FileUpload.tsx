import styles from "./FileUpload.module.css";
import uploadIcon from "../../../../public/assets/UploadIcon.png";
import { useRef, useState, ChangeEvent, DragEvent } from "react";

type FileUploadProps = {
  onUpload: (files: File[]) => void;
  allowMultiple?: boolean;
  accept?: string;
};

function FileUpload({
  onUpload,
  allowMultiple = true,
  accept = "",
}: FileUploadProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [fileList, setFileList] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
    }
  };

  const filterFilesByAccept = (files: File[]) => {
    if (!accept) return files;
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    return files.filter((file) =>
      acceptedTypes.some((type) =>
        type.includes("/")
          ? file.type.startsWith(type.split("/")[0]) || file.type === type
          : file.name.endsWith(type)
      )
    );
  };

  const handleFiles = (files: File[]) => {
    const updatedList = allowMultiple ? [...fileList, ...files] : files;
    setFileList(updatedList);
    setPreviewUrls(updatedList.map((file) => URL.createObjectURL(file)));
    onUpload(updatedList);
  };

  const fileRemove = (file: File) => {
    const updatedList = fileList.filter((item) => item.name !== file.name);
    setFileList(updatedList);
    setPreviewUrls(updatedList.map((file) => URL.createObjectURL(file)));
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.header}>Drop & Drag</h2>
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
          <p className={styles.drop_file_label}>Drag & drop your files here</p>
        </div>
        {fileList.length > 0 && (
          <div className={styles.drop_file_preview}>
            <p className={styles.drop_file_preview_title}>Ready to upload</p>
            {fileList.map((item, index) => (
              <div key={index} className={styles.drop_file_preview_item}>
                <img src={previewUrls[index]} alt={item.name} />
                <div className={styles.drop_file_preview_item_info}>
                  <p className={styles.name}>
                    {item.name.length > 30
                      ? `${item.name.slice(0, 20)}...`
                      : item.name}
                  </p>
                  <p className={styles.size}>
                    {(item.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <span
                  className={styles.drop_file_preview_item_remove}
                  onClick={() => fileRemove(item)}
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
