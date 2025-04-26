
import { useState } from "react";
import { categories, Category } from "@/lib/data";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="w-full mb-6">
      <ScrollArea className="whitespace-nowrap">
        <div className="flex space-x-2 pb-3">
          <Button
            onClick={() => onSelectCategory('All')}
            variant={selectedCategory === 'All' ? "default" : "outline"}
            className={selectedCategory === 'All' ? 'bg-whirl-purple hover:bg-whirl-deep-purple' : ''}
          >
            All
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => onSelectCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={selectedCategory === category ? 'bg-whirl-purple hover:bg-whirl-deep-purple' : ''}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
