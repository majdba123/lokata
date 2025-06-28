import { getMyAdsApi } from "@/api/services/ads/ads.service";
import { useQuery } from "@tanstack/react-query";

function useGetMyAdsQuey() {
  return useQuery({
    queryKey: ["getMyAds"],
    queryFn: getMyAdsApi,
  });
}

export default useGetMyAdsQuey;
