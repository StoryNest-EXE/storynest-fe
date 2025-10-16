"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import pricingTiers from "./data";
import { useRouter } from "next/navigation";

export default function Subcription() {
  const router = useRouter();
  const handlePayment = (value: string) => {
    router.push(`/payment?plan=${value}`);
  };
  return (
    <div className="container mx-auto px-4 py-16 gradient-bg">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          Mới
          <span>Giới thiệu Định giá theo Tín dụng</span>
          <span className="text-primary/70">Tìm hiểu thêm →</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6">
          Cho câu chuyện của bạn đôi cánh để bay.
        </h1>

        <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
          Nâng cấp để mở khóa tự do sáng tạo.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative p-6 ${tier.className} border-0 hover:scale-105 transition-transform duration-200`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Được đề xuất
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{tier.icon}</span>
                <h3 className="text-xl font-bold text-foreground">
                  {tier.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tier.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-muted-foreground">{tier.period}</span>
                )}
              </div>
            </div>

            <Button
              className={`w-full mb-6 ${
                tier.name === "Mầm Non"
                  ? "bg-transparent border-sprout text-sprout"
                  : tier.name === "Nở Hoa"
                  ? "bg-bloom hover:bg-bloom/90 text-background"
                  : tier.name === "Thịnh Vượng"
                  ? "bg-flourish hover:bg-flourish/90 text-background"
                  : "bg-ensemble hover:bg-ensemble/90 text-background"
              }`}
              variant={tier.buttonVariant}
              disabled={tier.name === "Mầm Non"}
              onClick={() => handlePayment(tier.value)}
            >
              {tier.buttonText}
            </Button>

            <div className="space-y-3">
              {tier.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <p className="text-muted-foreground mb-4">
          Cần thêm gì khác? Liên hệ với chúng tôi để có giải pháp doanh nghiệp.
        </p>
        <Button
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
        >
          Liên Hệ Bán Hàng
        </Button>
      </div>
    </div>
  );
}
