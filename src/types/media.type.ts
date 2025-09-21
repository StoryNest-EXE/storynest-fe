export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface UploadImageRequest {
  resourceType: string;
  resourceId: number;
  files: {
    contentType: string;
    fileSize: number;
  }[];
}

export type UploadImageResponse = ApiResponse<{
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
