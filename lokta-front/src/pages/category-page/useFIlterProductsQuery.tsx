import { filterProductsApi } from "@/api/services/products/product-service";
import {
  Pagination,
  Product,
  ProductsFilter,
} from "@/api/services/products/types";
import { useQuery } from "@tanstack/react-query";

type Props = {
  filters: ProductsFilter;
  onFetchProducts: (args: { data: Product[]; pagination: Pagination }) => void;
};

export default function useFIlterProductsQuery({
  filters,
  onFetchProducts,
}: Props) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const finalFilters: ProductsFilter = {};
      if (filters.brand_id && filters.brand_id != -1)
        finalFilters.brand_id = filters.brand_id;
      if (filters.category_id) finalFilters.category_id = filters.category_id;
      if (filters.sub_category_id && filters.sub_category_id != -1)
        finalFilters.sub_category_id = filters.sub_category_id;
      if (filters.subcategory_title)
        finalFilters.subcategory_title = filters.subcategory_title;
      if (filters.search) finalFilters.search = filters.search;
      finalFilters.min_price = filters.min_price;
      if (filters.max_price !== undefined && filters.max_price > 0)
        finalFilters.max_price = filters.max_price;
      if (filters.page) finalFilters.page = filters.page;

      const res = await filterProductsApi(finalFilters);
      onFetchProducts(res);
      return res;
    },
  });
}
