import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Category } from "@/api/services/category/types";

const Hero: React.FC = () => {
  const queryClient = useQueryClient();
  const categories = queryClient.getQueryData(["categories"]) as
    | Category[]
    | undefined;

  const [curCategoryIdx, setCurCategoryIdx] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    if (categories) {
      const name = categories[curCategoryIdx].name;
      navigate("/" + name, {
        state: {
          search: searchTerm,
        },
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="bg-gradient-to-r from-[#114CB0] to-[#BA69E1] py-8 sm:py-16"
    >
      <div className="container mx-auto px-4 sm:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
          اشترِ وبع أي شيء - بسرعة وسهولة وأمان
        </h1>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-white">
          اعثر على صفقات رائعة على السيارات والعقارات والإلكترونيات والمزيد
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center bg-white md:rounded-full overflow-hidden p-2 shadow-lg">
            <Select
              value={curCategoryIdx + ""}
              onValueChange={(v) => setCurCategoryIdx(+v)}
            >
              <SelectTrigger className="w-full sm:w-40 border-none focus:ring-0 mb-2 sm:mb-0 sm:mr-2">
                <SelectValue
                  placeholder={categories ? categories[0].name : ""}
                />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category, idx) => (
                  <SelectItem key={category.id} value={String(idx)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-grow flex items-center">
              <Input
                type="text"
                placeholder="ابحث..."
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
