export type ProductsFilter = {
  search?: string;
  min_price?: number;
  max_price?: number;
  sub_category_id?: number;
  brand_id?: number;
};

export type Product = {
  id: number;
  title: string;
  descreption: string | null;
  price:number;
  image: string;
  created_at: Date;
  updated_at: Date;
  sub__category_id: number;
  vendor_id: 3;
};
