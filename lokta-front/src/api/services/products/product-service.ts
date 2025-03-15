import axios from "axios";
import { resolveError } from "../helpers/error-resolver";
import { CreateProductRequest, Product, ProductsFilter } from "./types";
import { API_URL } from "@/api/constants";
import { useAuthStore } from "@/zustand-stores/auth.store";

class ProductService {
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

  createProductApi = async (req: CreateProductRequest) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      await axios.post(`${API_URL}/api/products`, req, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const { filterProductsApi, createProductApi } = new ProductService();
