import { Pagination, Product } from "@/api/services/products/types";
import PriceRangeSlider from "@/components/my-ui/double-price-range";
import useDebounce from "@/hooks/useDebounce";
import { useCategoryStore } from "@/zustand-stores/category-store";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import useBrandsQuery from "./useBrandsQuery";
import Loading from "@/components/my-ui/loading";
import useFIlterProductsQuery from "./useFIlterProductsQuery";
import useCategoriesQuery from "../all-category-page/useCategoriesQuery";
import useAllBrandsInCategory from "./useAllBrandsInCategory";
import { Brand } from "@/api/services/brand/types";

type Props = {
  onFetchProducts: (args: { data: Product[]; pagination: Pagination }) => void;
  page: number;
};

function FilterSidebar({ onFetchProducts, page }: Props) {
  const location = useLocation();
  const { search } = location.state ? location.state : { search: "" };
  const { categoryName, subCategoryName } = useParams();
  const [searchText, setSearchText] = useState<string>(search ?? "");
  const [curBrandIdx, setCurBrandIdx] = useState(-1);

  const [priceRange, setPriceRange] = useState<[number, undefined | number]>([
    0,
    undefined,
  ]);
  const debouncedSearch = useDebounce(searchText, 500);

  const curSubCategoryId = useCategoryStore((state) => state.curSubCategoryId);
  const setCurSubCategoryId = useCategoryStore(
    (state) => state.setCurSubCategoryId
  );
  const setSubcategories = useCategoryStore((state) => state.setSubcategories);

  const handlePriceChange = (newRange: [number, undefined | number]) => {
    setPriceRange(newRange);
  };

  const categoriesQuery = useCategoriesQuery();
  const categories = categoriesQuery.data ?? [];
  const curCategory = categories?.find((item) => item.name == categoryName);

  useEffect(() => {
    if (categoriesQuery.status === "success" && curCategory) {
      if (subCategoryName) {
        const foundSubCategory = curCategory.sub_category.find(
          (sc) => sc.title === subCategoryName
        );
        setCurSubCategoryId(foundSubCategory?.id ?? -1);
      } else if (categoryName) {
        setCurSubCategoryId(-1);
      }
      setSubcategories(curCategory.sub_category ?? []);
    } else if (
      categoriesQuery.status === "success" &&
      !curCategory &&
      categoryName
    ) {
      setCurSubCategoryId(-1);
      setSubcategories([]);
    }
  }, [
    subCategoryName,
    categoryName,
    curCategory,
    categoriesQuery.status,
    setCurSubCategoryId,
    setSubcategories,
  ]);

  useEffect(() => {
    setCurBrandIdx(-1);
  }, [curSubCategoryId]);

  const brandsBySubCategoryQuery = useBrandsQuery({
    id: curSubCategoryId,
  });

  const allBrandsInCategoryQuery = useAllBrandsInCategory({
    id: curCategory?.id,
    enable: curSubCategoryId === -1 && !!curCategory?.id,
  });

  const isLoadingBrands = useMemo(() => {
    return curSubCategoryId === -1
      ? allBrandsInCategoryQuery.isPending
      : brandsBySubCategoryQuery.isPending;
  }, [
    curSubCategoryId,
    allBrandsInCategoryQuery.isPending,
    brandsBySubCategoryQuery.isPending,
  ]);

  const brandsToDisplay = useMemo<Brand[]>(() => {
    return curSubCategoryId === -1
      ? allBrandsInCategoryQuery.data ?? []
      : brandsBySubCategoryQuery.data ?? [];
  }, [
    curSubCategoryId,
    allBrandsInCategoryQuery.data,
    brandsBySubCategoryQuery.data,
  ]);

  const { isError: productsError } = useFIlterProductsQuery({
    filters: {
      sub_category_id: curSubCategoryId,
      brand_id:
        curBrandIdx !== -1 && brandsToDisplay[curBrandIdx]
          ? brandsToDisplay[curBrandIdx].id
          : undefined,
      search: debouncedSearch.trim() !== "" ? debouncedSearch : undefined,
      min_price: priceRange[0],
      max_price: priceRange[1],
      category_id: curCategory?.id,
      page,
    },
    onFetchProducts,
  });

  if (productsError) {
    toast.error("حدث خطأ أثناء تحميل المنتجات");
  }
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
          <Link to={`/${categoryName}`} onClick={() => setCurSubCategoryId(-1)}>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                className="mr-2"
                name="subcategory"
                value={-1}
                onChange={() => {
                  setCurSubCategoryId(-1);
                }}
                checked={curSubCategoryId === -1}
              />

              <span className="mr-2">الكل</span>
            </label>
          </Link>
          {curCategory?.sub_category.map((sc) => (
            <Link
              to={`/${categoryName}/${sc.title}`}
              key={sc.id}
              onClick={() => setCurSubCategoryId(sc.id)}
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="mr-2"
                  name="subcategory"
                  value={sc.id}
                  onChange={() => {
                    setCurSubCategoryId(sc.id);
                  }}
                  checked={sc.id === curSubCategoryId}
                />

                <span className="mr-2">{sc.title}</span>
              </label>
            </Link>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">العلامة التجارية</h3>
        </div>
        <div className="space-y-1 overflow-y-scroll max-h-60">
          <label
            key="all-brands-radio"
            className="flex items-center cursor-pointer"
          >
            <input
              type="radio"
              className="mr-2"
              name="brand"
              value={-1}
              onChange={() => setCurBrandIdx(-1)}
              checked={curBrandIdx === -1}
            />
            <span className="mr-2">الكل</span>
          </label>
          {isLoadingBrands && <Loading />}
          {!isLoadingBrands &&
            brandsToDisplay.map((item, idx) => (
              <label key={item.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="mr-2"
                  name="brand"
                  value={item.id}
                  onChange={() => setCurBrandIdx(idx)}
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
