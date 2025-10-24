"use client";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-gray-900 dark:text-gray-100">
      <header className="mb-10">
        <div className="inline-block border rounded-full px-3 py-1 text-sm border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
          Áp dụng cho người dùng tại Việt Nam
        </div>
        <h1 className="text-4xl font-bold mt-4">Chính sách bảo mật</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cập nhật gần nhất: {new Date().toLocaleDateString("vi-VN")}
        </p>
      </header>

      <section className="space-y-6 leading-relaxed">
        <p>
          <strong>StoryNest</strong> là một nền tảng khởi nghiệp do sinh viên
          phát triển với mục tiêu mang đến không gian sáng tạo nội dung và chia
          sẻ truyện số. Chúng tôi cam kết tôn trọng quyền riêng tư của người
          dùng và tuân thủ các quy định của pháp luật Việt Nam, bao gồm Nghị
          định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.
        </p>

        <p>
          <strong>Thông tin liên hệ:</strong> Lot E2a-7, D1 Street, Saigon
          Hi-Tech Park, Tang Nhon Phu Ward, TP.HCM. <br />
          <strong>Email:</strong>{" "}
          <a
            href="mailto:privacy@storynest.io.vn"
            className="text-violet-600 hover:underline"
          >
            privacy@storynest.io.vn
          </a>
        </p>

        <h2 className="text-2xl font-semibold">1. Phạm vi áp dụng</h2>
        <p>
          Chính sách này áp dụng cho tất cả người dùng tại Việt Nam truy cập và
          sử dụng dịch vụ StoryNest. Chúng tôi không chủ đích cung cấp dịch vụ
          cho người dùng ngoài lãnh thổ Việt Nam.
        </p>

        <h2 className="text-2xl font-semibold">2. Dữ liệu cá nhân thu thập</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Thông tin tài khoản:</strong> email, tên người dùng, mật
            khẩu (được mã hóa bằng BCrypt), avatar (nếu có).
          </li>
          <li>
            <strong>Thông tin kỹ thuật:</strong> IP, user-agent, loại thiết bị,
            nhật ký hoạt động.
          </li>
          <li>
            <strong>Hành vi sử dụng:</strong> lượt xem, lượt thích, bình luận,
            tìm kiếm.
          </li>
          <li>
            <strong>Dữ liệu AI:</strong> nội dung gửi lên OpenAI và Google Cloud
            AI để xử lý ngôn ngữ và tạo nội dung, chỉ giới hạn trong phạm vi kỹ
            thuật.
          </li>
          <li>
            Chúng tôi <strong>không thu thập dữ liệu nhạy cảm</strong> (CMND,
            tài chính, sinh trắc học,...).
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Mục đích xử lý</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Vận hành và duy trì hệ thống dịch vụ.</li>
          <li>Phân tích và cải thiện trải nghiệm người dùng.</li>
          <li>Phát hiện, ngăn chặn hành vi gian lận hoặc vi phạm.</li>
          <li>
            Gửi thông báo, phản hồi và hỗ trợ người dùng qua email hoặc hệ
            thống.
          </li>
          <li>
            Tuân thủ yêu cầu pháp lý khi có cơ quan nhà nước có thẩm quyền.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">4. Chia sẻ dữ liệu</h2>
        <p>
          StoryNest <strong>không bán</strong> dữ liệu người dùng. Dữ liệu chỉ
          được chia sẻ với các bên thứ ba phục vụ vận hành hệ thống:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Cloudflare – CDN & bảo mật.</li>
          <li>AWS S3 – lưu trữ tệp và nội dung.</li>
          <li>Resend & Zoho – gửi email hệ thống.</li>
          <li>DigitalOcean – máy chủ vận hành và cơ sở dữ liệu.</li>
        </ul>

        <h2 className="text-2xl font-semibold">5. Lưu trữ và bảo mật</h2>
        <p>
          Dữ liệu được lưu trữ đến khi bạn xóa tài khoản. Chúng tôi sử dụng
          HTTPS/TLS, xác thực bảo mật, và kiểm soát truy cập nội bộ chặt chẽ.
        </p>

        <h2 className="text-2xl font-semibold">6. Quyền của người dùng</h2>
        <p>
          Người dùng có quyền truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân. Gửi
          yêu cầu tới{" "}
          <a
            href="mailto:privacy@storynest.io.vn"
            className="text-violet-600 hover:underline"
          >
            privacy@storynest.io.vn
          </a>{" "}
          – chúng tôi sẽ phản hồi trong vòng 2 ngày làm việc.
        </p>

        <h2 className="text-2xl font-semibold">7. Cập nhật chính sách</h2>
        <p>
          Chính sách này có thể được điều chỉnh để phù hợp với yêu cầu pháp luật
          và hoạt động thực tế. Phiên bản mới sẽ công bố công khai tại trang
          này.
        </p>

        <footer className="pt-6 border-t text-sm text-gray-500 dark:text-gray-400">
          © StoryNest – Dự án khởi nghiệp học phần. Chính sách này tuân thủ pháp
          luật Việt Nam.
        </footer>
      </section>
    </main>
  );
}
