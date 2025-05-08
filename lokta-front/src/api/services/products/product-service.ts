import axios from "axios";
import { resolveError } from "../helpers/error-resolver";
import { CreateProductRequest, Product, ProductsFilter } from "./types";
import { API_URL } from "@/api/constants";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { headerGenerator } from "../helpers/header-generator";

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

  myProductsApi = async () => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const { data } = await axios.get<Product[]>(
        `${API_URL}/api/my-products`,
        {
          headers: headerGenerator([
            { Authorization: `Bearer ${accessToken}` },
          ]),
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  updateProductApi = async (id: number, req: FormData) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      const { data } = await axios.post<Product>(
        `${API_URL}/api/products/${id}`,
        req,
        {
          headers: headerGenerator([
            {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          ]),
        }
      );
      return data;
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  deleteProductApi = async (id: number) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: headerGenerator([
          {
            Authorization: `Bearer ${accessToken}`,
          },
        ]),
      });
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };

  getProductByIdApi = async (id: number) => {
    try {
      const { data } = await axios.get<Product>(
        `${API_URL}/api/products/${id}`,
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

  createProductWithPlanApi = async (formData: FormData) => {
    try {
      const accessToken = useAuthStore.getState().accessToken;
      await axios.post(`${API_URL}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      throw new Error(resolveError(error));
    }
  };
}

export const {
  filterProductsApi,
  myProductsApi,
  updateProductApi,
  deleteProductApi,
  getProductByIdApi,
  createProductWithPlanApi,
} = new ProductService();
