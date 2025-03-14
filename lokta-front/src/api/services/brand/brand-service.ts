import axios from "axios";
import { resolveError } from "../helpers/error-resolver";
import { Brand } from "./types";
import { API_URL } from "@/api/constants";

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
}

export const { getBrandsApi } = new BrandService();
