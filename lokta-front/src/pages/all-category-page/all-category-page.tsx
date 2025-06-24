import { CategoryCarousel } from "./category-carousel";
import Loading from "@/components/my-ui/loading";
import Hero from "@/components/my-ui/hero-component";
import useCategoriesQuery from "./useCategoriesQuery";
import AdsBoard from "../ads/ads-board";

const ads = [
  {
    src: `https://picsum.photos/seed/${
      Math.random() * new Date().getTime()
    }/600/300`,
    link: "https://google.com",
  },
  {
    src: `https://picsum.photos/seed/${Math.random()}/600/300`,
    link: "https://google.com",
  },
  {
    src: `https://picsum.photos/seed/${Math.random() * 33}/600/300`,
    link: "https://google.com",
  },
];

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
              <AdsBoard type="fade" ads={ads} />
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

export default AllCategoryPage;
