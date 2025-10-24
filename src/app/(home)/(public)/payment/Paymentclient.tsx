"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, CreditCard, QrCode, Clock, Shield } from "lucide-react";
import pricingTiers from "../subcription/data";
import {
  useCancelPaymentMutation,
  useCheckoutQuery,
  useCheckPaymentQuery,
} from "@/queries/payment.queries";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function PaymentCheckoutClient() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const tier = pricingTiers.find((tier) => tier.plainId === plan);
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "bank">("qr");
  const { data: checkout } = useCheckoutQuery(plan as string);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const cancelPaymentMutation = useCancelPaymentMutation();
  const router = useRouter();
  const orderCode = checkout?.orderCode;
  const { data: checkPayment } = useCheckPaymentQuery(orderCode ?? 0);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      queryClient.cancelQueries({ queryKey: ["checkPayment", orderCode] });
    }, 10 * 60 * 1000); // 10 phút
    return () => clearTimeout(timer);
  }, [orderCode, queryClient]);

  useEffect(() => {
    if (checkPayment?.status === 200) {
      toast.success("Thanh toán thành công");
      router.push("/");
    }
  }, [checkPayment, router]);

  useEffect(() => {
    if (!checkout?.expiredAt) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = checkout.expiredAt - now;
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [checkout?.expiredAt]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleCancelPayment = (orderCode: number) => {
    cancelPaymentMutation.mutate(orderCode);
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl gradient-bg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-balance mb-4">
          Hoàn tất thanh toán của bạn
        </h1>
        <p className="text-muted-foreground text-lg">
          Chỉ còn một bước nữa để mở khóa sức mạnh sáng tạo
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Choose Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Chọn phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant={paymentMethod === "qr" ? "default" : "outline"}
                  className="h-auto p-4 justify-start"
                  onClick={() => setPaymentMethod("qr")}
                >
                  <QrCode className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Quét mã QR</div>
                    <div className="text-sm text-muted-foreground">
                      Nhanh chóng và tiện lợi
                    </div>
                  </div>
                </Button>
                <Button
                  variant={paymentMethod === "bank" ? "default" : "outline"}
                  className="h-auto p-4 justify-start"
                  onClick={() => setPaymentMethod("bank")}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Chuyển khoản ngân hàng</div>
                    <div className="text-sm text-muted-foreground">
                      Thông tin chi tiết
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethod === "qr" ? (
                <div className="text-center space-y-4">
                  <div className="bg-white p-6 rounded-lg inline-block">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      {checkout && (
                        <img
                          src={`https://img.vietqr.io/image/${checkout.bin}-${
                            checkout.accountNumber
                          }-vietqr_pro.jpg?addInfo=${
                            checkout.description?.replace(/\s+/g, "+") ?? ""
                          }&amount=${checkout.amount ?? 0}`}
                          alt="VietQR"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quét mã QR bằng ứng dụng ngân hàng của bạn
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleCopy(
                        `https://img.vietqr.io/image/${checkout?.bin}-${
                          checkout?.accountNumber
                        }-vietqr_pro.jpg?addInfo=${
                          checkout?.description?.replace(/\s+/g, "+") ?? ""
                        }&amount=${checkout?.amount ?? 0}`
                      )
                    }
                    className="w-full"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied ? "Đã sao chép!" : "Sao chép mã QR"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bank">Ngân hàng</Label>
                      <div className="mt-1 p-3 bg-muted rounded-md">
                        Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="account">Số tài khoản</Label>
                      <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                        <span className="font-mono">
                          {checkout?.accountNumber}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopy(checkout?.accountNumber ?? "")
                          }
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="receiver">Tên người nhận</Label>
                      <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                        <span className="font-semibold">
                          Nguyen Hien Trung Nam
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy("StoryNest")}
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="amount">Số tiền</Label>
                      <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                        <span className="font-bold text-lg">
                          {formatCurrency(checkout?.amount ?? 0)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopy(checkout?.amount?.toString() ?? "")
                          }
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Nội dung chuyển khoản</Label>
                    <div className="mt-1 p-3 bg-muted rounded-md flex items-center justify-between">
                      <span className="font-mono text-sm">
                        {checkout?.description}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(checkout?.description ?? "")}
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Xác nhận thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {timeLeft > 0 ? (
                    <span>
                      Hết hạn sau:{" "}
                      <span className="text-green-400 text-2xl">
                        {formatCountdown(timeLeft)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Đã hết hạn
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Thanh toán được bảo mật bởi PayOS</span>
                </div>
                {/* <Button className="w-full" size="lg">
                  Tôi đã thanh toán
                </Button> */}
                <Button
                  className="w-full hover:bg-red-500 hover:text-white"
                  size="lg"
                  onClick={() =>
                    handleCancelPayment(checkout?.orderCode as number)
                  }
                >
                  Hủy thanh toán
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Sau khi thanh toán, tài khoản của bạn sẽ được nâng cấp trong
                  vòng 5-10 phút
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-flourish/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{tier?.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{tier?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Hàng tháng
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit">
                  Được khuyến nghị
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Gói {tier?.name}</span>
                  <span>{tier?.price}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Thuế VAT (0%)</span>
                  <span>0₫</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span>{tier?.price}</span>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>Mã đơn hàng: #{checkout?.orderCode}</p>
                {/* <p>ID thanh toán: {checkout?.paymentLinkId.slice(0, 8)}...</p> */}
                <p>ID thanh toán: {checkout?.paymentLinkId}</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Bạn sẽ nhận được:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {tier?.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
