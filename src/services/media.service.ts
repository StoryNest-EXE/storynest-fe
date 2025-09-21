import https from "@/lib/axios";
import {
  ConfirmUploadRequest,
  ConfirmUploadResponse,
  UploadImageRequest,
  UploadImageResponse,
} from "@/types/media.type";

export const postUploadIamge = async (req: UploadImageRequest) => {
  const response = await https.post<UploadImageResponse>(
    "/api/Upload/presign-upload",
    req
  );
  return response.data;
};

export const postConfirmImage = async (req: ConfirmUploadRequest) => {
  const response = await https.post<ConfirmUploadResponse>(
    "/api/Upload/confirm-upload",
    req
  );
  return response.data;
};
