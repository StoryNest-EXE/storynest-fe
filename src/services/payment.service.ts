import https from "@/lib/axios";

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
