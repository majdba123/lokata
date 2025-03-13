import axios from "axios";
import { resolveError } from "../helpers/error-resolver";
import { Category } from "./types";
import { API_URL } from "@/api/constants";

class CategoryService {
  allCategoriesApi = async () => {
    try {
      const { data } = await axios.get<Category[]>(`${API_URL}/api/categories`);
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { allCategoriesApi } = new CategoryService();
