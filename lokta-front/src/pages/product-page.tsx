import { getProductByIdApi } from "@/api/services/products/product-service";
import { Product } from "@/api/services/products/types";
import Loading from "@/components/my-ui/loading";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await getProductByIdApi(Number(id));
      setProduct(product);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
      toast.error("المنتج غير موجود");
    }
  };
  return (
    <div className="w-full ">
      {loading ? (
        <Loading />
      ) : (
        <div className=" flex flex-col gap-3" dir="rtl">
          <div className="flex gap-6">
            <div className="text-lg text-right">
              <span className="font-bold mx-2 text-gray-600">اسم المنتج:</span>
              {product?.title}
            </div>
            <div className="text-lg text-right">
              <span className="font-bold mx-2 text-gray-600">التصنيف:</span>
              {product?.sub_category}
            </div>
          </div>
          <div className="text-lg text-right">
            <span className="font-bold mx-2 text-gray-600">الماركة:</span>
            {product?.brand}
          </div>
          <div className="text-lg text-right">
            <span className="font-bold mx-2 text-gray-600">المدينة:</span>
            {product?.city}
          </div>
          <div className="text-lg text-right">
            <span className="font-bold mx-2 text-gray-600">الوصف:</span>
            {product?.description}
          </div>
          <div className="text-lg text-right">
            <span className="font-bold mx-2 text-gray-600">السعر:</span>
            {product?.price} {product?.currency === "sy" ? "ل.س" : "$"}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {product?.images.map((image) => (
              <img
                key={image}
                src={`${image}`}
                alt={product.title}
                className="w-64 h-64 object-contain"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
