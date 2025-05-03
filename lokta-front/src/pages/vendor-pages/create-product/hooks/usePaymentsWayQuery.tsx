import { getAllPaymentWaysApi } from "@/api/services/payment-ways/payment-way.service";
import { useQuery } from "@tanstack/react-query";

function usePaymentsWayQuery() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => getAllPaymentWaysApi(),
    retry: 2,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export default usePaymentsWayQuery;
