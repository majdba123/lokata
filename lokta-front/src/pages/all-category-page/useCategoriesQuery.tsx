import { getAllCategoriesApi } from "@/api/services/category/category-service";
import { FULL_HOUR_TIME_MS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return getAllCategoriesApi();
    },
    staleTime: FULL_HOUR_TIME_MS,
    gcTime: FULL_HOUR_TIME_MS,
  });
}

export default useCategoriesQuery;
