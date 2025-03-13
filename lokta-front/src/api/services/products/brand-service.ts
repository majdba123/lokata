import axios from "axios";
import { resolveError } from "../helpers/error-resolver";
import { Product, ProductsFilter } from "./types";
import { API_URL } from "@/api/constants";

class BrandService {
  filterProductsApi = async (filter: ProductsFilter) => {
    try {
      const { data } = await axios.get<Product[]>(
        `${API_URL}/api/products/filter`,
        {
          params: filter,
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

export const { filterProductsApi } = new BrandService();
