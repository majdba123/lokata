import { createProductWithPlanApi } from "@/api/services/products/product-service";
import { useMutation } from "@tanstack/react-query";

function useCreateProductMutation() {
  return useMutation({
    mutationKey: ["createProduct"],
    mutationFn: async (data: FormData) => {
      await createProductWithPlanApi(data);
    },
  });
}

export default useCreateProductMutation;
