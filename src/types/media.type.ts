export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PresignUploadRequest {
  resourceType: string;
  files: {
    contentType: string;
    fileSize: number;
  }[];
}

export type PresignUploadResponse = ApiResponse<{
  uploads: {
    s3Url: string;
    key: string;
    mediaUrl: string;
  }[];
}>;

export interface ConfirmUploadRequest {
  resourceType: string;
  resourceId: number;
  fileKeys: string[];
}

export type ConfirmUploadResponse = ApiResponse<string>;
