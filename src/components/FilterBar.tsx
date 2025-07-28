import { Filter, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FoodCategoryIcon } from "./FoodCategoryIcon";

interface FilterBarProps {
  selectedCategory?: string;
  selectedDistance?: string;
  onFilterChange: (type: 'category' | 'distance' | 'time', value: string | null) => void;
}

const categories = [
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'bread', label: 'Bread & Grains' },
  { id: 'prepared', label: 'Prepared Meals' },
  { id: 'dairy', label: 'Dairy' }
];

const distances = [
  { id: '1km', label: '1km' },
  { id: '5km', label: '5km' },
  { id: '10km', label: '10km' },
  { id: 'any', label: 'Any distance' }
];

export const FilterBar = ({ selectedCategory, selectedDistance, onFilterChange }: FilterBarProps) => {
  return (
    <div className="bg-card border-b border-border p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={18} className="text-muted-foreground" />
        <span className="font-medium text-foreground">Filters</span>
      </div>
      
      {/* Category Filters */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Food Type</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange('category', null)}
            className="whitespace-nowrap"
          >
            All Food
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange('category', category.id)}
              className="whitespace-nowrap flex items-center gap-2"
            >
              <FoodCategoryIcon 
                category={category.id as any} 
                size={16} 
              />
              {category.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Distance Filters */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <MapPin size={14} />
          Distance
        </h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {distances.map((distance) => (
            <Button
              key={distance.id}
              variant={selectedDistance === distance.id ? "secondary" : "outline"}
              size="sm"
              onClick={() => onFilterChange('distance', distance.id)}
              className="whitespace-nowrap"
            >
              {distance.label}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Active Filters */}
      {(selectedCategory || selectedDistance) && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Active:</span>
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <FoodCategoryIcon category={selectedCategory as any} size={12} />
              {categories.find(c => c.id === selectedCategory)?.label}
              <button 
                onClick={() => onFilterChange('category', null)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedDistance && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin size={12} />
              {distances.find(d => d.id === selectedDistance)?.label}
              <button 
                onClick={() => onFilterChange('distance', null)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};