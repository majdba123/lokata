import { allSubCategoriesApi } from "@/api/services/category/category-service";
import { FULL_HOUR_TIME_MS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

function useAllSubcategoriesQuery() {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      return await allSubCategoriesApi();
    },
    staleTime: FULL_HOUR_TIME_MS,
    gcTime: FULL_HOUR_TIME_MS,
  });
}

export default useAllSubcategoriesQuery;
