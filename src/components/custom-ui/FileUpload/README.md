import FileUpload from "@/components/ui/FileUpload/FileUpload";

<FileUpload
        onUpload={handleUpload}
        allowMultiple={true}
        accept="image/*"
      />

-------------------------------------------------- onUpload ----------------------------------------------------------------
const handleUpload = (files: File[]) => {
console.log("Upload nè: ", files);
};

- Viết hàm handleUpload để dispatch dữ liệu đi

-------------------------------------------------- allowMultiple ------------------------------------------------------------

- true
  - Cho phép user chọn đc nhiều file
- false
  - Cho phép user chọn 1 file

-------------------------------------------------- accept -------------------------------------------------------------------
📷 Hình ảnh - accept="image/\*"

Hoặc chỉ định từng loại cụ thể: - accept="image/png, image/jpeg, image/gif, image/svg+xml, image/webp"

🎥 Video - accept="video/\*"

Hoặc chỉ định từng loại: - accept="video/mp4, video/webm, video/ogg, video/x-matroska"
🎵 Audio - accept="audio/\*"

Hoặc chỉ định cụ thể: - accept="audio/mp3, audio/wav, audio/ogg, audio/mpeg, audio/aac"

📄 Tài liệu văn bản (Word, PDF, TXT, ...) - accept=".pdf, .doc, .docx, .txt, .odt, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"

📊 Bảng tính (Excel, CSV, ...) - accept=".xls, .xlsx, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"

📑 Bản trình chiếu (PowerPoint, ...) - accept=".ppt, .pptx, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"

🗜️ File nén (ZIP, RAR, 7z, ...) - accept=".zip, .rar, .7z, application/zip, application/x-rar-compressed, application/x-7z-compressed"

🖥️ Các loại code và script - accept=".html, .css, .js, .json, .xml, .csv, .sql, text/html, text/css, text/javascript, application/json, application/xml, text/csv, text/plain"\

🔄 Tất cả các loại file - accept="\*"

Nếu bạn muốn cho phép nhiều loại file cùng lúc, chỉ cần kết hợp chúng bằng dấu phẩy: - accept="image/png, image/jpeg, .pdf, .docx, .xlsx, .csv"
