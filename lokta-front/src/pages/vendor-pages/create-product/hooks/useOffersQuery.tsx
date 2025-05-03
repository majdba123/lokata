import { getAllOffersApi } from "@/api/services/offers/offers.service";
import { useQuery } from "@tanstack/react-query";

function useOffersQuery() {
  return useQuery({
    queryKey: ["offers"],
    queryFn: async () => getAllOffersApi(),
    staleTime: 24 * 60 * 60 * 1000,
    retry: 2,
  });
}

export default useOffersQuery;
