import {
  postConfirmImage,
  postGenerateAudio,
  postGenerateIamge,
  postPresignUpload,
} from "@/services/media.service";
import { ConfirmUploadRequest, PresignUploadRequest } from "@/types/media.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePresignUploadMutation = () => {
  return useMutation({
    mutationFn: (data: PresignUploadRequest) => postPresignUpload(data),
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

export const useGenerateImageMuation = () => {
  return useMutation({
    mutationFn: (content: string) => postGenerateIamge(content),
    onSuccess: (data) => {},
    onError: (error) => {
      console.log("Gen img error", error);
    },
  });
};

export const useGenerateAudioMuation = () => {
  return useMutation({
    mutationFn: (content: string) => postGenerateAudio(content),
    onSuccess: (data) => {},
    onError: (error) => {
      console.log("Gen audio error", error);
    },
  });
};
