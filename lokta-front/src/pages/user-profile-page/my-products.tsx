import {
  deleteProductApi,
  myProductsApi,
} from "@/api/services/products/product-service";
import { Product } from "@/api/services/products/types";
import Loading from "@/components/my-ui/loading";
import ProductCard from "@/components/my-ui/product-card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UpdateProduct from "./update-product";

function MyProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [updateProductId, setUpdateProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  //  loading delete
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setIsLoading(true);
      const data = await myProductsApi();
      setProducts(data);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const onCancelUpdate = () => {
    setUpdateProductId(null);
  };

  const onUpdate = (newProduct: Product) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === newProduct.id ? newProduct : product
      )
    );
    setUpdateProductId(null);
  };

  const onDelete = async (productId: number) => {
    try {
      setLoadingDelete(true);

      await deleteProductApi(productId);
      setDeleteProductId(null);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      toast.success("تم حذف المنتج بنجاح"); // Product deleted successfully
      setLoadingDelete(false);
    } catch (error: any) {
      toast.error("فشل حذف المنتج" + error.message); // Failed to delete product
      setLoadingDelete(false);
    }
  };
  const onCancelDelete = () => {
    setDeleteProductId(null);
  };

  return (
    <div dir="rtl" className="w-full">
      <div className="w-full flex flex-wrap gap-3 m-x-5">
        {isLoading && (
          <div className="flex items-center justify-center w-full h-fit">
            <Loading />
          </div>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-5 border p-2 rounded-lg"
          >
            <ProductCard
              owner_id={product.owner_id}
              title={product.title}
              originalPrice={product.price}
              imageUrl={`${product.images[0]}`}
              key={product.id}
              currency={product.currency}
              description={product.description ?? ""}
              id={product.id}
            />
            <div className="flex justify-between flex-col">
              {/* status */}
              <p>
                الحالة :{" "}
                <span
                  className={`${
                    product.status == "pending"
                      ? "text-yellow-500"
                      : product.status == "rejected"
                      ? "text-red-600"
                      : "text-green-500"
                  } text-sm`}
                >
                  {product.status == "pending"
                    ? "قيد الانتظار"
                    : product.status == "rejected"
                    ? "مرفوض"
                    : "مقبول"}
                </span>{" "}
              </p>
              {product.status == "completed" && (
                <div>
                  <p className="text-sm text-gray-500">
                    تم النشر فى : {product.dates.start_date}
                  </p>
                  <p className="text-sm text-gray-500">
                    باقى الايام : {product.dates.remaining_days} يوم
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-center space-x-3">
              <AlertDialog
                open={updateProductId === product.id}
                onOpenChange={() => setUpdateProductId(product.id)}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="cursor-pointer">
                    <Pencil color="blue" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className=" py-4 px-1">
                  <UpdateProduct
                    {...product}
                    onCancel={onCancelUpdate}
                    onUpdate={onUpdate}
                  />
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog
                open={deleteProductId === product.id}
                onOpenChange={() => setDeleteProductId(product.id)}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="cursor-pointer">
                    <Trash2 color="red" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف منتجك
                      بشكل دائم.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button onClick={onCancelDelete}>إلغاء</Button>
                    <AlertDialogAction
                      onClick={() => onDelete(product.id)}
                      className="bg-red-500"
                      disabled={loadingDelete}
                    >
                      متابعة {loadingDelete && <Loading />}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyProducts;
