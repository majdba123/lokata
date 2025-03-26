import { Product } from "../products/types";

export type Subcategory = {
  id: number;
  title: string;
  image: string;
};

export type SubcategoryWithProducts = Subcategory & {
  products: Product[];
};
