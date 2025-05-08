import { getBrandsBySubcategoryApi } from "@/api/services/brand/brand-service";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: number;
};
export default function useBrandsQuery({ id }: Props) {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: async () => {
      return await getBrandsBySubcategoryApi(id);
    },
    enabled: id != -1 && Boolean(id),
  });
}
