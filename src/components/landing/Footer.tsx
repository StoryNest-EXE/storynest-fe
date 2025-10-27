"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export function Footer() {
  const router = useRouter();

  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* About StoryNest chiếm 2 cột */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-4">About StoryNest</h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
              StoryNest is a web application that allows users to write, share,
              and explore personal stories. It provides AI-powered tools that
              generate illustrations and voice narration, helping users bring
              their stories to life. Users can publish stories publicly or keep
              them private and enjoy a safe, creative space to express
              themselves.
            </p>
          </div>

          {/* Các cột còn lại */}
          <div>
            <h4 className="font-semibold mb-4">Sản Phẩm</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => router.push("/home/subcription")}
                  className="hover:text-foreground transition-colors"
                >
                  Giá Cả & Gói Đăng Ký
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Công Ty</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <button
                  onClick={() => router.push("/home")}
                  className="hover:text-foreground transition-colors"
                >
                  Các bài viết
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Liên Hệ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Pháp Lý</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => router.push("/privacy-policy")}
                  className="hover:text-foreground transition-colors"
                >
                  Chính sách bảo mật
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/term-of-services")}
                  className="hover:text-foreground transition-colors"
                >
                  Điều khoản & Dịch vụ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground flex items-center gap-2 text-center md:text-left">
            Được tạo với <Heart className="w-4 h-4 fill-primary text-primary" />{" "}
            cho những người kể chuyện
          </p>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © 2025 StoryNest. Viết nên câu chuyện của bạn.
          </p>
        </div>
      </div>
    </footer>
  );
}
