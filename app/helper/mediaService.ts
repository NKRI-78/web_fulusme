import axios, { AxiosProgressEvent } from "axios";
import { compressImage } from "./CompressorImage";
import { getAuthUser } from "./getAuthUser";
import { API_BACKEND_MEDIA } from "../utils/constant";

export interface MediaServiceResponse<T extends object> {
  ok: boolean;
  message: string;
  error_code?: "unauthorized";
  data?: T;
}

/// =========[ UPLOAD MEDIA SERVICE ]===========

export async function uploadMediaService(
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<MediaServiceResponse<UploadMediaData>> {
  const isImage = file.type.startsWith("image/");
  const compressedImage = await compressImage(file);
  const compressedFile = isImage ? compressedImage : file;

  const sizeInMB = file.size / (1024 * 1024);
  console.log(`File size: ${sizeInMB.toFixed(2)} MB`);

  const formData = new FormData();
  formData.append("folder", "web");
  formData.append("subfolder", "fulusme");
  formData.append("media", compressedFile);

  const user = getAuthUser();
  if (user) {
    try {
      const res = await axios.post(
        `${API_BACKEND_MEDIA}/api/v1/media/upload-fulusme`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          onUploadProgress: onUploadProgress,
        },
      );

      const mediaResponse: MediaResponse<UploadMediaData> = res.data;

      return {
        ok: true,
        message: "Success",
        data: mediaResponse.data,
      };
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

      return {
        ok: false,
        message,
      };
    }
  } else {
    return {
      ok: false,
      message: "Unauthorized",
      error_code: "unauthorized",
    };
  }
}

/// =========[ GET MEDIA SERVICE ]===========

export async function getMediaService(
  mediaId: string,
): Promise<MediaServiceResponse<GetMediaData>> {
  const user = getAuthUser();
  if (user) {
    try {
      const res = await axios.get(
        `${API_BACKEND_MEDIA}/api/v1/media/${mediaId}/signed`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      const mediaResponse: MediaResponse<GetMediaData> = res.data;

      return {
        ok: true,
        message: "Success",
        data: mediaResponse.data,
      };
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

      return {
        ok: false,
        message,
      };
    }
  } else {
    return {
      ok: false,
      message: "Unauthorized",
      error_code: "unauthorized",
    };
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
