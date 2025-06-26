import { getAdsPlansApi } from "@/api/services/ads/ads.service";
import { useQuery } from "@tanstack/react-query";

function useAdsPlansQuery() {
  return useQuery({
    queryFn: getAdsPlansApi,
    queryKey: ["ads-plan"],
  });
}

export default useAdsPlansQuery;
