export type ProductsFilter = {
  search?: string;
  min_price?: number;
  max_price?: number;
  sub_category_id?: number;
  brand_id?: number;
  subcategory_title?: string;
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
};
