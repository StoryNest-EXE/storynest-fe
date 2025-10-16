export interface PricingTier {
  name: string;
  value: string;
  icon: string;
  description: string;
  price: string;
  period?: string;
  buttonText: string;
  buttonVariant: "default" | "outline";
  className: string;
  popular?: boolean;
  features: string[];
}

const pricingTiers: PricingTier[] = [
  {
    name: "Mầm Non",
    value: "1",
    icon: "🌱",
    description: "Gieo mầm cho những câu chuyện đầu tiên của bạn.",
    price: "Miễn phí",
    period: "",
    buttonText: "Bắt Đầu Gieo Mầm",
    buttonVariant: "outline" as const,
    className: "tier-sprout",
    features: [
      "Viết câu chuyện không giới hạn",
      "10 xu/ngày",
      "Có chứa watermark",
      "Có quảng cáo",
      "MP3 128kbps",
      "Tải xuống 720p",
      "Kỷ niệm hàng năm: PDF",
    ],
  },
  {
    name: "Nở Hoa",
    value: "2",
    icon: "🌸",
    description:
      "Giúp câu chuyện của bạn nở hoa và chạm đến nhiều trái tim hơn.",
    price: "79.000đ",
    period: "/tháng",
    buttonText: "Để Nở Hoa",
    buttonVariant: "default" as const,
    className: "tier-bloom",
    features: [
      "Viết câu chuyện không giới hạn",
      "50 xu/ngày",
      "Không có watermark",
      "Không có quảng cáo",
      "Tải xuống nội dung chất lượng cao",
      "Xử lý ưu tiên",
      "Kỷ niệm hàng năm: PDF hoặc video",
    ],
  },
  {
    name: "Thịnh Vượng",
    value: "3",
    icon: "🌺",
    description: "Để sự sáng tạo của bạn phát triển mạnh mẽ không giới hạn.",
    price: "149.000đ",
    period: "/tháng",
    buttonText: "Để Thịnh Vượng",
    buttonVariant: "default" as const,
    className: "tier-flourish",
    popular: true,
    features: [
      "Câu chuyện âm thanh không giới hạn",
      "150 xu/ngày",
      "Không có watermark",
      "Không có quảng cáo",
      "Tải xuống nội dung chất lượng cao",
      "Xử lý ưu tiên",
      "Truy cập sớm các tính năng mới",
      "Truy cập Cộng đồng Kể chuyện Premium",
      "Kỷ niệm hàng năm: PDF và video, full HD một lần mỗi năm, thiết kế cao cấp, không watermark",
    ],
  },
  {
    name: "Đồng Hành",
    value: "4",
    icon: "👥",
    description: "Tạo kỷ niệm cùng nhau với nhóm của bạn.",
    price: "249.000đ",
    period: "/tháng",
    buttonText: "Tạo Cùng Nhau",
    buttonVariant: "default" as const,
    className: "tier-ensemble",
    features: [
      "Dành cho tối đa 7 thành viên",
      "700 xu/ngày",
      "Thành viên bổ sung: +50.000đ mỗi người mỗi tháng",
      "Mỗi thành viên nhận quyền lợi cấp Thịnh Vượng",
      "Quản trị viên nhóm có thể quản lý và thêm/xóa thành viên",
      "Bảng điều khiển quản lý nhóm",
      "Hỗ trợ ưu tiên cho quản trị viên nhóm",
      "Kỷ niệm hàng năm: PDF/video nhóm full HD một lần mỗi năm, tóm tắt nhóm cao cấp",
    ],
  },
];

export default pricingTiers;
