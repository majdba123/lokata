import axios from "axios";
import { resolveError } from "../helpers/error-resolver";
import { API_URL } from "@/api/constants";
import { useAuthStore } from "@/zustand-stores/auth.store";

class FileUploadService {
  uploadFileApi = async (formData: FormData) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const { data } = await axios.post(API_URL + "/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { uploadFileApi } = new FileUploadService();
