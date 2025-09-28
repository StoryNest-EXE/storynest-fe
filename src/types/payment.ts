export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PaymentCheckoutResponse {
  bin: string;
  accountNumber: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: "PENDING" | "PAID" | "FAILED";
  expiredAt: number;
  checkoutUrl: string;
  qrCode: string;
}
