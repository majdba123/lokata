import { IMAGES_API_URL } from "@/api/constants";
import { getBrandsApi } from "@/api/services/brand/brand-service";
import { Brand } from "@/api/services/brand/types";
import { Subcategory } from "@/api/services/category/types";
import { filterProductsApi } from "@/api/services/products/product-service";
import { Product } from "@/api/services/products/types";
import PriceRangeSlider from "@/components/my-ui/double-price-range";
import ProductCard from "@/components/my-ui/product-card";
import SalesBoard from "@/components/my-ui/sales-board";
import { useCategoryStore } from "@/zustand-stores/category-store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import categoryBoard from "@/assets/Rectangle5.png";

function CategoryPage() {
  const curCategory = useCategoryStore((state) => state.currentCategory);
  const curSubCategoryId = useCategoryStore((state) => state.curSubCategoryId);
  const setCurSubCategoryId = useCategoryStore(
    (state) => state.setCurSubCategoryId
  );
  const [curSubCategory, setCurSubCategory] = useState<Subcategory | null>(
    null
  );
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [curBrandIdx, setCurBrandIdx] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const data = await filterProductsApi({
        brand_id: curBrandIdx == -1 ? undefined : brands[curBrandIdx]?.id,
        sub_category_id:
          curSubCategoryId! == -1 ? undefined : curSubCategoryId!,
        min_price: priceRange[0],
        max_price: priceRange[1],
      });
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrandsApi();
        setBrands(data.brands);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [curBrandIdx, curSubCategoryId, priceRange[0], priceRange[1]]);

  useEffect(() => {
    if (!curCategory) {
      navigate("/");
    }
  }, [curCategory]);

  useEffect(() => {
    setCurSubCategory(
      curCategory?.subCategories.find(
        (subcategory: any) => subcategory.id === curSubCategoryId
      ) || null
    );
  }, [curSubCategoryId, curCategory?.id]);

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <>
      <SalesBoard boardImage={categoryBoard} />
      <div className="w-full flex flex-col justify-center items-center space-y-2">
        <p className="text-3xl font-semibold"> {curCategory?.title}</p>
        <p className="text-xl ">
          {curSubCategoryId == -1 ? "All" : curSubCategory?.title}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="lg:w-1/4 p-4 bg-white border-r border-gray-200">
          {/* Subcategory Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Subcategory</h3>
            </div>
            <div className="space-y-1">
              <label key={0} className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name="subcategory"
                  value={-1}
                  onClick={() => setCurSubCategoryId(-1)}
                  checked={curSubCategoryId === -1}
                />
                All
              </label>
              {curCategory?.subCategories.map((sc) => (
                <label key={sc.id} className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="subcategory"
                    value={sc.id}
                    onClick={() => setCurSubCategoryId(sc.id)}
                    checked={sc.id === curSubCategoryId}
                  />
                  {sc.title}
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Brand</h3>
            </div>
            <div className="space-y-1">
              <label key={0} className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name="brand"
                  value={-1}
                  onClick={() => setCurBrandIdx(-1)}
                  checked={curBrandIdx === -1}
                />
                All
              </label>
              {brands.map((item, idx) => (
                <label key={item.id} className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="brand"
                    value={item.id}
                    onClick={() => setCurBrandIdx(idx)}
                    checked={idx === curBrandIdx}
                  />
                  {item.name}
                </label>
              ))}
            </div>
          </div>
          <PriceRangeSlider
            min={0}
            max={1000}
            step={2}
            currency="$"
            onChange={handlePriceChange}
          />
        </aside>

        {/* Product Grid */}
        <main className="flex-1 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                hasDiscountLabel={true}
                title={product.title}
                originalPrice={product.price}
                discountPrice={product.price}
                imageUrl={`${IMAGES_API_URL}/${product.images[0]}`}
                discountPercentage={0}
                vendor_id={product.vendor_id}
              />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export default CategoryPage;
