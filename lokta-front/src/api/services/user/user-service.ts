import { useAuthStore } from "@/zustand-stores/auth.store";
import { UpdateProfileRequest, UpdateProfileResponse } from "./types";
import axios from "axios";
import { API_URL } from "@/api/constants";
import { resolveError } from "../helpers/error-resolver";

class UserService {
  updateProfileApi = async (req: UpdateProfileRequest) => {
    try {
      const token = useAuthStore.getState().accessToken;
      const { data } = await axios.put<UpdateProfileResponse>(
        `${API_URL}/api/user`,
        req,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { updateProfileApi } = new UserService();
