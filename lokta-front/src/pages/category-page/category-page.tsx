import {
  Pagination as TPagination,
  Product,
} from "@/api/services/products/types";
import { useCategoryStore } from "@/zustand-stores/category-store";

import { ProductGrid } from "@/components/my-ui/product-grid";
import FilterSidebar from "./filter-sidebar";
import { useState } from "react";
import AdsBoard from "../ads/ads-board";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

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
function CategoryPage() {
  const curSubCategoryId = useCategoryStore((state) => state.curSubCategoryId);
  const subcategories = useCategoryStore((state) => state.subcategories);
  const curSubCategory = subcategories.find((sc) => sc.id === curSubCategoryId);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<TPagination>();
  const [page, setPage] = useState(1);

  const onFetchProducts = ({
    data,
    pagination: newPagination,
  }: {
    data: Product[];
    pagination: TPagination;
  }) => {
    setProducts(data);
    setPagination(newPagination);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.total_pages ?? 1)) {
      setPage(newPage);
    }
  };

  const renderPagination = () => {
    if (!pagination || pagination.total_pages <= 1) return null;

    const pageNumbers: (number | string)[] = [];
    const totalPages = pagination.total_pages;

    // Always show first page
    pageNumbers.push(1);

    // Ellipsis after first page
    if (page > 3) {
      pageNumbers.push("...");
    }

    // Pages around current page
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Ellipsis before last page
    if (page < totalPages - 2) {
      pageNumbers.push("...");
    }

    // Always show last page if it's not 1
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    // Remove duplicates that might be caused by small number of pages
    const uniquePageNumbers = [...new Set(pageNumbers)];

    return uniquePageNumbers;
  };

  return (
    <div dir="rtl">
      <AdsBoard ads={ads} type="slide" />
      <div className="w-full flex flex-col justify-center items-center space-y-2">
        <p className="text-xl ">
          {curSubCategoryId == -1 ? "الكل" : curSubCategory?.title}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <FilterSidebar onFetchProducts={onFetchProducts} page={page} />

        {/* Product Grid */}
        <main className="flex-1 p-4">
          <ProductGrid products={products} />
        </main>
      </div>
      {pagination && pagination.total_pages > 1 && (
        <Pagination >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page - 1);
                }}
                className={cn(
                  page === 1 && "pointer-events-none opacity-50",
                  "cursor-pointer"
                )}
              />
            </PaginationItem>
            {renderPagination()?.map((p, index) => (
              <PaginationItem key={`${p}-${index}`}>
                {typeof p === "string" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(p);
                    }}
                    isActive={page === p}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page + 1);
                }}
                className={cn(
                  page === pagination.total_pages &&
                    "pointer-events-none opacity-50",
                  "cursor-pointer"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default CategoryPage;
