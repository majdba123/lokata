import { getBrandsApi } from "@/api/services/brand/brand-service";
import { Brand } from "@/api/services/brand/types";
import { getAllCategoriesApi } from "@/api/services/category/category-service";
import { Category } from "@/api/services/category/types";
import { filterProductsApi } from "@/api/services/products/product-service";
import { Product, ProductsFilter } from "@/api/services/products/types";
import PriceRangeSlider from "@/components/my-ui/double-price-range";
import useDebounce from "@/hooks/useDebounce";
import { useCategoryStore } from "@/zustand-stores/category-store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  onFetchProducts: (products: Product[]) => void;
};

function FilterSidebar({ onFetchProducts }: Props) {
  const location = useLocation();
  const { search } = location.state ? location.state : { search: "" };
  const { categoryName, subCategoryName } = useParams();
  const queryClient = useQueryClient();
  let categories = queryClient.getQueryData(["categories"]) as
    | Category[]
    | undefined;
  if (!categories) {
    queryClient.fetchQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        return getAllCategoriesApi();
      },
    });
    categories = queryClient.getQueryData(["categories"]) as Category[];
  }
  const curCategory = categories?.find((item) => item.name == categoryName);
  const [searchText, setSearchText] = useState<string>(search ?? "");
  const debouncedSearch = useDebounce(searchText, 500);

  const curSubCategoryId = useCategoryStore((state) => state.curSubCategoryId);
  const setCurSubCategoryId = useCategoryStore(
    (state) => state.setCurSubCategoryId
  );
  const setSubcategories = useCategoryStore((state) => state.setSubcategories);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [curBrandIdx, setCurBrandIdx] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange(newRange);
  };

  const fetchProducts = async () => {
    try {
      const filters: ProductsFilter = {};
      if (curSubCategoryId !== -1) filters.sub_category_id = curSubCategoryId;
      if (curBrandIdx !== -1) filters.brand_id = brands[curBrandIdx]?.id;
      if (debouncedSearch.trim() !== "") filters.search = debouncedSearch;
      const data = await filterProductsApi({
        min_price: priceRange[0],
        max_price: priceRange[1],
        ...filters,
      });
      onFetchProducts(data);
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
  }, [curSubCategoryId, curBrandIdx, debouncedSearch, priceRange, subCategoryName]);

  useEffect(() => {
    
    if (subCategoryName) {
      setCurSubCategoryId(
        curCategory?.sub_category.find((sc) => sc.title === subCategoryName)?.id ??
          -1
      )
      setSubcategories(curCategory?.sub_category ?? []);
    } else {
      setCurSubCategoryId(-1);
      setSubcategories([]);
    }
    
  }, [subCategoryName])
  

  return (
    <aside className="lg:w-1/4 p-4 bg-white border-l border-gray-200">
      <div className="relative mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:border-blue-500"
          placeholder="ابحث"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="absolute top-0 left-0 px-4 py-2 bg-blue-500 
          text-white rounded-l-md hover:bg-blue-600"
        >
          ابحث
        </button>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">الفئة الفرعية</h3>
        </div>
        <div className="space-y-1 overflow-y-scroll max-h-60">
          <label key={0} className="flex items-center">
            <input
              type="radio"
              className="mr-2"
              name="subcategory"
              value={-1}
              onClick={() => setCurSubCategoryId(-1)}
              checked={curSubCategoryId === -1}
            />
            <span className="mr-2">الكل</span>
          </label>
          {curCategory?.sub_category.map((sc) => (
            <label key={sc.id} className="flex items-center">
              <input
                type="radio"
                className="mr-2"
                name="subcategory"
                value={sc.id}
                onClick={() => setCurSubCategoryId(sc.id)}
                checked={sc.id === curSubCategoryId}
              />
              <span className="mr-2">{sc.title}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">العلامة التجارية</h3>
        </div>
        <div className="space-y-1 overflow-y-scroll max-h-60">
          <label key={0} className="flex items-center">
            <input
              type="radio"
              className="mr-2"
              name="brand"
              value={-1}
              onClick={() => setCurBrandIdx(-1)}
              checked={curBrandIdx === -1}
            />
            <span className="mr-2">الكل</span>
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
              <span className="mr-2">{item.name}</span>
            </label>
          ))}
        </div>
      </div>
      <PriceRangeSlider
        min={0}
        max={10000}
        step={2}
        currency="$"
        onChange={handlePriceChange}
      />
    </aside>
  );
}

export default FilterSidebar;
