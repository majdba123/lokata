import axios from "axios";
import { resolveError } from "../helpers/error-resolver";
import { Brand } from "./types";
import { API_URL } from "@/api/constants";
import { useAuthStore } from "@/zustand-stores/auth.store";

class BrandService {
  getBrandsApi = async () => {
    try {
      const { data } = await axios.get<{ brands: Brand[] }>(
        `${API_URL}/api/brands`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  createBrandApi = async (name: string) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const { data } = await axios.post<{ brand: Brand }>(
        `${API_URL}/api/brands`,
        {
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { getBrandsApi, createBrandApi } = new BrandService();
