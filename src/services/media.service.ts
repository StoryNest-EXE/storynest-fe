import https from "@/lib/axios";
import {
  ConfirmUploadRequest,
  ConfirmUploadResponse,
  PresignUploadRequest,
  PresignUploadResponse,
} from "@/types/media.type";

export const postPresignUpload = async (req: PresignUploadRequest) => {
  const response = await https.post<PresignUploadResponse>(
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
