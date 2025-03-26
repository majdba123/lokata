import { Subcategory } from "@/api/services/category/types";
import { create } from "zustand";

type CategoryState = {
  curSubCategoryId: number;
  setCurSubCategoryId: (id: number | undefined) => void;
  subcategories: Subcategory[];
  setSubcategories: (subcategories: Subcategory[]) => void;
};

export const useCategoryStore = create<CategoryState>()((set) => ({
  curSubCategoryId: -1,
  setCurSubCategoryId: (id: number | undefined) =>
    set({ curSubCategoryId: id }),
  subcategories: [],
  setSubcategories: (subcategories: Subcategory[]) =>
    set({ subcategories: subcategories }),
}));
