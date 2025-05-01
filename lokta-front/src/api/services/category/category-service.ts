import axios from "axios";
import { resolveError } from "../helpers/error-resolver";
import { Category, Subcategory, SubcategoryWithProducts } from "./types";
import { API_URL } from "@/api/constants";
import { headerGenerator } from "../helpers/header-generator";

class CategoryService {
  subcategorIesWithProductsApi = async () => {
    try {
      const { data } = await axios.get<SubcategoryWithProducts[]>(
        `${API_URL}/api/subcategories-with-products`,
        {
          headers: headerGenerator([]),
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  allSubCategoriesApi = async () => {
    try {
      const { data } = await axios.get<Subcategory[]>(
        `${API_URL}/api/subcategories`
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  getAllCategoriesApi = async () => {
    try {
      const { data } = await axios.get<Category[]>(
        `${API_URL}/api/categories/get_all`,
        {
          headers: headerGenerator([]),
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { subcategorIesWithProductsApi, allSubCategoriesApi, getAllCategoriesApi } =
  new CategoryService();
