import ProductCard from "./product-card";
import { Product } from "@/api/services/products/types";
import { IMAGES_API_URL } from "@/api/constants";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div dir="rtl" className="flex flex-wrap gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          originalPrice={product.price}
          imageUrl={`${IMAGES_API_URL}/${product.images[0]}`}
          owner_id={product.owner_id}
          currency={product.currency}
          description={product.description ?? ""}
          id={product.id}
        />
      ))}
    </div>
  );
}
