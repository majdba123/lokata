import SalesBoard from "@/components/my-ui/sales-board";
import car_rect from "@/assets/car-rect.svg";
import { useEffect, useState } from "react";
import PriceRangeSlider from "@/components/my-ui/double-price-range";
import { Product } from "@/api/services/products/types";
import { filterProductsApi } from "@/api/services/products/product-service";
import { toast } from "sonner";
import { tireSize } from "./constant";
import useDebounce from "@/hooks/useDebounce";
import tyreSizeImg from "@/assets/reading-tyre-size-example.jpg";
import { ProductGrid } from "@/components/my-ui/product-grid";

function TyrePage() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [tyreSizeIdx, setTyreSizeIdx] = useState(-1);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce<string>(searchText, 300);

  const fetchProducts = async () => {
    try {
      let search = debouncedSearchText + " ";
      search += tyreSizeIdx == -1 ? "" : tireSize[tyreSizeIdx];
      const data = await filterProductsApi({
        min_price: priceRange[0],
        max_price: priceRange[1],
        subcategory_title: "tyre",
        search: search.trim().length > 0 ? search.trim() : undefined,
      });
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [priceRange, tyreSizeIdx, debouncedSearchText]);

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <div dir="rtl">
      <SalesBoard boardImage={car_rect} />
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 p-4 bg-white border-b lg:border-l border-gray-200">
          {/* search bar */}
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
          {/* tyre size filter */}
          <div className="mb-6">
            <div className="flex flex-col justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">حجم الإطار</h3>
              <img
                src={tyreSizeImg}
                alt="Tyre Size Example"
                className="h-20 w-40"
              />
            </div>
            <div className="space-y-1 max-h-60 lg:h-80 overflow-y-auto">
              <label key={0} className="flex items-center">
                <input
                  type="radio"
                  className="ml-2"
                  name="tyreSize"
                  value={-1}
                  onClick={() => setTyreSizeIdx(-1)}
                  checked={tyreSizeIdx === -1}
                />
                الكل
              </label>
              {tireSize.map((item, index) => (
                <label key={item} className="flex items-center">
                  <input
                    type="radio"
                    className="ml-2"
                    name="tyreSize"
                    value={index}
                    onClick={() => setTyreSizeIdx(index)}
                    checked={index === tyreSizeIdx}
                  />
                  {item}
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
        {/* Main content */}
        <main className="flex-1 p-4">
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}

export default TyrePage;
