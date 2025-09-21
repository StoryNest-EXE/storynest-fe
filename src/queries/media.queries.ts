import { postConfirmImage, postUploadIamge } from "@/services/media.service";
import { ConfirmUploadRequest, UploadImageRequest } from "@/types/media.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useImageUploadMutation = () => {
  return useMutation({
    mutationFn: (data: UploadImageRequest) => postUploadIamge(data),
    onSuccess: (data) => {
      console.log("Upload image success", data);
      toast.success("Đăng Story thành công");
    },
    onError: (error) => {
      console.log("Upload image error", error);
    },
  });
};

export const useConfirmUploadMutation = () => {
  return useMutation({
    mutationFn: (data: ConfirmUploadRequest) => postConfirmImage(data),
    onSuccess: (data) => {
      console.log("Confirm success", data);
    },
    onError: (error) => {
      console.log("Confirm error", error);
    },
  });
};
