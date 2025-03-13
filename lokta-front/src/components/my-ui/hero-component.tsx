import React from "react";
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

const Hero: React.FC = () => {
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
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40 border-none focus:ring-0 mb-2 sm:mb-0 sm:mr-2">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="cars">Cars</SelectItem>
                <SelectItem value="properties">Properties</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-grow flex items-center">
              <Input
                type="text"
                placeholder="Search..."
                className="flex-grow border-none focus:ring-0 outline-none px-4"
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 ml-2"
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
