import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { allSubCategoriesApi } from "@/api/services/category/category-service";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "@/zustand-stores/category-store";

const Hero: React.FC = () => {
  const setSubcategories = useCategoryStore((s) => s.setSubcategories);
  const subcategories = useCategoryStore((s) => s.subcategories);
  const setCurSubCategoryId = useCategoryStore((s) => s.setCurSubCategoryId);
  const curSubCategoryId = useCategoryStore((s) => s.curSubCategoryId);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchSubcategories = async () => {
    try {
      if (subcategories.length > 0) return;
      const response = await allSubCategoriesApi();
      setSubcategories(response);
    } catch (error: any) {
      toast.error("Failed to fetch subcategories" + error.message);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleSearch = () => {
    navigate("/category", {
      state: {
        search: searchTerm,
      },
    });
  };

  return (
    <div className="bg-gradient-to-r from-[#114CB0] to-[#BA69E1] py-8 sm:py-16">
      <div className="container mx-auto px-4 sm:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
          Buy & Sell Anything - Fast, Easy, And Secure
        </h1>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white">
          Find great deals on cars, properties, electronics, and more
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center bg-white md:rounded-full overflow-hidden p-2 shadow-lg">
            <Select
              value={curSubCategoryId + ""}
              onValueChange={(v) => setCurSubCategoryId(+v)}
            >
              <SelectTrigger className="w-full sm:w-40 border-none focus:ring-0 mb-2 sm:mb-0 sm:mr-2">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"-1"}>All Categories</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem
                    key={subcategory.id}
                    value={String(subcategory.id)}
                  >
                    {subcategory.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-grow flex items-center">
              <Input
                type="text"
                placeholder="Search..."
                className="flex-grow border-none focus:ring-0 outline-none px-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 ml-2"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
