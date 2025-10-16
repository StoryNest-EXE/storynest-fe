import {
  getCancelPayment,
  getCheckout,
  getCheckPayment,
} from "@/services/payment.service";
import { ApiResponse } from "@/types/media.type";
import { CheckPaymentResponse, PaymentCheckoutResponse } from "@/types/payment";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCheckoutQuery = (plan: string) => {
  return useQuery<PaymentCheckoutResponse>({
    queryKey: ["checkout", [plan]],
    queryFn: () => getCheckout(plan),
  });
};

export const useCancelPaymentMutation = () => {
  return useMutation({
    mutationFn: (orderCode: number) => getCancelPayment(orderCode),
    onSuccess: () => {
      toast.success("Hủy thanh toán thành công");
    },
    onError: () => {
      toast.error("Hủy thanh toán thất bại");
    },
  });
};

export const useCheckPaymentQuery = (orderCode: number) => {
  return useQuery<ApiResponse<CheckPaymentResponse>>({
    queryKey: ["checkPayment", [orderCode]],
    queryFn: () => getCheckPayment(orderCode),
    refetchInterval: 4000,
    enabled: !!orderCode,
  });
};
