import { CategoryCarousel } from "./category-carousel";
import { useQuery } from "@tanstack/react-query";
import { getAllCategoriesApi } from "@/api/services/category/category-service";
import Loading from "@/components/my-ui/loading";

function AllCategoryPage() {
  const { data, status } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return getAllCategoriesApi();
    },
    staleTime : Infinity,
    gcTime: Infinity
  });
  if (status === "pending") {
    return (
      <div className="min-h-screen bg-background pb-12">
        {" "}
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {data && (
        <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
          {data.map((item) => (
            <section key={item.id} className="mb-12">
              <div className="flex items-center justify-between mb-6" dir="rtl">
                <h2 className="text-2xl md:text-3xl font-bold text-right">{item.name}</h2>
              </div>
              <CategoryCarousel categoryName={item.name} subcategories={item.sub_category} />
            </section>
          ))}
        </main>
      )}
    </div>
  );
}

export default AllCategoryPage;
