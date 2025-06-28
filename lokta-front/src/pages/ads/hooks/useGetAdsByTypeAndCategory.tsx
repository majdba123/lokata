import { getAdsByTypeAndCategoryApi } from "@/api/services/ads/ads.service";
import { AdsType } from "@/api/services/ads/ads.types";
import { useQuery } from "@tanstack/react-query";

type TProps = {
  type: AdsType;
  category: number;
};

function useGetAdsByTypeAndCategory({ category, type }: TProps) {
  return useQuery({
    queryKey: ["ads", type, category],
    queryFn: () => getAdsByTypeAndCategoryApi({ type, category }),
    enabled: !!type && !!category,
  });
}

export default useGetAdsByTypeAndCategory;
