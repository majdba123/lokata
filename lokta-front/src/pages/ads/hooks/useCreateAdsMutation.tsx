import { createAdsApi } from "@/api/services/ads/ads.service";
import { useMutation } from "@tanstack/react-query";

function useCreateAdsMutation() {
  return useMutation({
    mutationFn: createAdsApi,
  });
}

export default useCreateAdsMutation;
