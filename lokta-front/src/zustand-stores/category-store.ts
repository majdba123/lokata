import { Category } from "@/api/services/category/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CategoryState = {
  currentCategory: Category | null;
  setCurrentCategory: (category: Category) => void;
  curSubCategoryId: number | null;
  setCurSubCategoryId: (id: number | undefined) => void;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      currentCategory: null,
      setCurrentCategory: (category: Category) =>
        set({ currentCategory: category }),
      curSubCategoryId: null,
      setCurSubCategoryId: (id: number | undefined) =>
        set({ curSubCategoryId: id }),
    }),
    { name: "category-storage" }
  )
);
