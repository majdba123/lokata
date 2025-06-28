import { CategoryCarousel } from "./category-carousel";
import Loading from "@/components/my-ui/loading";
import Hero from "@/components/my-ui/hero-component";
import useCategoriesQuery from "./useCategoriesQuery";
import AdsBoard from "../ads/ads-board";
import useGetAdsByTypeAndCategory from "../ads/hooks/useGetAdsByTypeAndCategory";

function AllCategoryPage() {
  const { data, status } = useCategoriesQuery();
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
      <Hero />
      {data && (
        <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
          {data.map((item) => (
            <section key={item.id} className="flex flex-col gap-4 mb-12">
              <div className="flex items-center justify-between mb-6" dir="rtl">
                <h2 className="text-2xl md:text-3xl font-bold text-right">
                  {item.name}
                </h2>
              </div>
              <AdsContainer categoryId={item.id} type="fade" />
              <CategoryCarousel
                categoryName={item.name}
                subcategories={item.sub_category}
              />
            </section>
          ))}
        </main>
      )}
    </div>
  );
}

type TAdsProps = {
  categoryId: number;
  type: "slide" | "fade";
};

const AdsContainer = ({ categoryId, type = "slide" }: TAdsProps) => {
  const adsQuery = useGetAdsByTypeAndCategory({
    type: "external",
    category: categoryId,
  });
  return (
    <>
      {adsQuery.status === "pending" && <Loading />}
      {adsQuery.status === "success" && (
        <AdsBoard
          type={type}
          ads={adsQuery.data.map((ad) => ({ src: ad.img, link: ad.link }))}
        />
      )}
    </>
  );
};

export default AllCategoryPage;
