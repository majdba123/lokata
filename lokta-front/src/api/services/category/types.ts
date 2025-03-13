export type Subcategory = {
  id: number;
  title: string;
  image: string;
};

export type Category = {
  id: number;
  title: string;
  image: number;
  subCategories: Subcategory[];
  description: string;
};
