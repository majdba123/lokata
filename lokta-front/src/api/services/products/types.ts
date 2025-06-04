export type ProductsFilter = {
  search?: string;
  min_price?: number;
  max_price?: number;
  sub_category_id?: number;
  brand_id?: number;
  subcategory_title?: string;
  category_id?: number;
};

export type Product = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  images: string[];
  created_at: Date;
  updated_at: Date;
  sub__category_id: number;
  owner_id: number;
  brand_id: number;
  currency: "sy" | "us";
  status: "rejected" | "completed" | "pending";
  dates: ProductDates;
  city: string | null;
  sub_category : string
  brand : string
};

export type ProductDates = {
  end_date: null | string;
  remaining_days: null | number;
  start_date: null | string;
};

export type CreateProductRequest = {
  title: string;
  description: string;
  price: number;
  sub__category_id: number;
  images: string[];
  brand_id: number;
  currency: "sy" | "us";
};

export type UpdateProductRequest = {
  title?: string;
  description?: string;
  price?: number;
  sub__category_id?: number;
  images?: string[];
  brand_id?: number;
  currency: "sy" | "us";
  city?: string;
};
