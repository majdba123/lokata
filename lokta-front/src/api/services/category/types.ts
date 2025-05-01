import { Product } from "../products/types";

export type Subcategory = {
  id: number;
  title: string;
  image: string;
};

export type SubcategoryWithProducts = Subcategory & {
  products: Product[];
};

export type Category = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  sub_category: Subcategory[];
};
