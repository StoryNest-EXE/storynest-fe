"use client";
import React from "react";

export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-gray-900 dark:text-gray-100">
      <header className="mb-10">
        <div className="inline-block border rounded-full px-3 py-1 text-sm border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
          Áp dụng cho người dùng tại Việt Nam
        </div>
        <h1 className="text-4xl font-bold mt-4">Điều khoản dịch vụ</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cập nhật gần nhất: {new Date().toLocaleDateString("vi-VN")}
        </p>
      </header>

      <section className="space-y-6 leading-relaxed">
        <p>
          Bằng việc sử dụng StoryNest, bạn đồng ý với các điều khoản dịch vụ sau
          đây. Mục tiêu của chúng tôi là tạo môi trường sáng tạo, an toàn và
          mang tính học thuật cho người dùng Việt Nam.
        </p>

        <h2 className="text-2xl font-semibold">1. Mô tả dịch vụ</h2>
        <p>
          StoryNest là nền tảng chia sẻ truyện và nội dung sáng tạo, có tích hợp
          công nghệ AI để hỗ trợ sáng tạo và kiểm duyệt nội dung tự động.
        </p>

        <h2 className="text-2xl font-semibold">2. Tài khoản người dùng</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Người dùng phải từ 13 tuổi trở lên để sử dụng dịch vụ.</li>
          <li>
            Đăng ký bằng email hoặc tài khoản Google; mật khẩu được mã hóa an
            toàn (BCrypt).
          </li>
          <li>
            Bạn chịu trách nhiệm bảo mật tài khoản và thông tin đăng nhập của
            mình.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">3. Nội dung người dùng (UGC)</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Người dùng giữ bản quyền nội dung đăng tải, nhưng cấp cho StoryNest
            quyền hiển thị, lưu trữ và chia sẻ nội dung để vận hành hệ thống.
          </li>
          <li>
            Nội dung vi phạm (bạo lực, khiêu dâm, kích động thù ghét, spam, gian
            lận) sẽ bị xóa hoặc ẩn mà không cần thông báo.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">
          4. Trách nhiệm và hành vi bị cấm
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Không tấn công, khai thác lỗ hổng hoặc phá hoại hệ thống.</li>
          <li>
            Không sử dụng bot, scraping, hoặc công cụ tự động hóa trái phép.
          </li>
          <li>
            Không đăng tải nội dung vi phạm pháp luật Việt Nam hoặc đạo đức xã
            hội.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold">5. Gói trả phí & Hoàn tiền</h2>
        <p>
          Một số tính năng nâng cao yêu cầu gói trả phí hoặc credit. Mọi yêu cầu
          hoàn tiền gửi về{" "}
          <a
            href="mailto:support@storynest.io.vn"
            className="text-violet-600 hover:underline"
          >
            support@storynest.io.vn
          </a>{" "}
          sẽ được xem xét trong 7 ngày làm việc.
        </p>

        <h2 className="text-2xl font-semibold">6. Giới hạn trách nhiệm</h2>
        <p>
          StoryNest không chịu trách nhiệm cho thiệt hại gián tiếp, mất dữ liệu
          hay lợi nhuận. Tổng trách nhiệm tối đa không vượt quá phí bạn đã trả
          trong 6 tháng gần nhất.
        </p>

        <h2 className="text-2xl font-semibold">7. Luật áp dụng</h2>
        <p>
          Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp
          sẽ được giải quyết tại Tòa án TP.HCM.
        </p>

        <footer className="pt-6 border-t text-sm text-gray-500 dark:text-gray-400">
          © StoryNest – Dự án khởi nghiệp học phần. Mọi quyền được bảo lưu.
        </footer>
      </section>
    </main>
  );
}
