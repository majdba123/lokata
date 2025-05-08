import { getBrandsByCategoryApi } from "@/api/services/brand/brand-service";
import { FULL_DAY_TIME_MS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: number | undefined;
  enable: boolean;
};

function useAllBrandsInCategory({ id, enable }: Props) {
  return useQuery({
    queryKey: ["all-brands-in-category", id],
    queryFn: async () => {
      if (id) return await getBrandsByCategoryApi(id);
      return [];
    },
    staleTime: FULL_DAY_TIME_MS,
    gcTime: FULL_DAY_TIME_MS,
    enabled: enable && Boolean(id),
  });
}

export default useAllBrandsInCategory;
