import https from "@/lib/axios";
import { ApiResponse, CheckPaymentResponse } from "@/types/payment";

export const getCheckout = async (plan: string) => {
  const response = await https.get(`/api/Payment/checkout?plan=${plan}`);
  return response.data.data;
};

export const getCancelPayment = async (orderCode: number) => {
  const response = await https.get(
    `/api/Payment/cancel?orderCode=${orderCode}`
  );
  return response.data.data;
};

export const getCheckPayment = async (orderCode: number) => {
  const response = await https.get<ApiResponse<CheckPaymentResponse>>(
    `/api/Payment/check-update?orderCode=${orderCode}`
  );
  return response.data;
};
