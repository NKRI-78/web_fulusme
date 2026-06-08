import axios, { AxiosProgressEvent } from "axios";
import { compressImage } from "@shared/ui/CompressorImage";
import { getUser } from "@/app/lib/auth";
import api_media from "@/utils/axios_media";

export interface MediaServiceResponse<T extends object> {
  ok: boolean;
  message: string;
  error_code?: "unauthorized";
  data?: T;
}

/// =========[ UPLOAD MEDIA SERVICE ]===========

type UploadMediaOptions = {
  timeout?: number;
  onUploadProgress?: (progress: AxiosProgressEvent) => void;
};

export async function uploadMediaService(
  file: File,
  { timeout = 15000, onUploadProgress = () => {} }: UploadMediaOptions = {},
): Promise<MediaServiceResponse<UploadMediaData>> {
  const isImage = file.type.startsWith("image/");
  const compressedImage = await compressImage(file);
  const compressedFile = isImage ? compressedImage : file;

  const formData = new FormData();
  formData.append("folder", "web");
  formData.append("subfolder", "fulusme");
  formData.append("media", compressedFile);

  if (!getUser()) {
    return { ok: false, message: "Unauthorized", error_code: "unauthorized" };
  }

  try {
    const res = await api_media.post(
      `/api/v1/media/upload-fulusme`,
      formData,
      { timeout, onUploadProgress },
    );

    const mediaResponse: MediaResponse<UploadMediaData> = res.data;
    return { ok: true, message: "Success", data: mediaResponse.data };
  } catch (error) {
    let message = "Unexpected error";
    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return { ok: false, message };
  }
}

/// =========[ GET MEDIA SERVICE ]===========

export async function getMediaService(
  mediaId: string,
): Promise<MediaServiceResponse<GetMediaData>> {
  if (!getUser()) {
    return { ok: false, message: "Unauthorized", error_code: "unauthorized" };
  }

  try {
    // api_media interceptor injects Bearer token from httpOnly cookie via tokenCache
    const res = await api_media.get(`/api/v1/media/${mediaId}/signed`);
    const mediaResponse: MediaResponse<GetMediaData> = res.data;
    return { ok: true, message: "Success", data: mediaResponse.data };
  } catch (error) {
    let message = "Unexpected error";
    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return { ok: false, message };
  }
}

/// =========[ MEDIA INTERFACE ]===========

export interface MediaResponse<T extends object> {
  status: number;
  error: boolean;
  message: string;
  data: T;
}

/// =========[ UPLOAD MEDIA INTERFACE ]===========

export interface UploadMediaData {
  id: string;
  owner_user_id: string;
  storage: string;
  object_path: string;
  path: string;
  size_bytes: number;
  size: string;
  mimetype: string;
  ext: string;
  original_name: string;
}

/// =========[ GET MEDIA INTERFACE ]===========

export interface GetMediaData {
  id: string;
  owner_user_id: string;
  folder: string;
  subfolder: string;
  storage: "gcs" | string;
  object_path: string;
  original_name: string;
  mime_type: string;
  ext: string;
  size_bytes: number;
  path: string;
  expires_in_seconds: number;
}
