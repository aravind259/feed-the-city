import { Apple, Cookie, ChefHat, Milk, Carrot } from "lucide-react";

interface FoodCategoryIconProps {
  category: 'vegetables' | 'fruits' | 'bread' | 'prepared' | 'dairy';
  size?: number;
  className?: string;
}

const categoryConfig = {
  vegetables: { icon: Carrot, color: 'text-vegetables' },
  fruits: { icon: Apple, color: 'text-fruits' },
  bread: { icon: Cookie, color: 'text-bread' },
  prepared: { icon: ChefHat, color: 'text-prepared' },
  dairy: { icon: Milk, color: 'text-dairy' }
};

export const FoodCategoryIcon = ({ category, size = 20, className = "" }: FoodCategoryIconProps) => {
  const { icon: Icon, color } = categoryConfig[category];
  
  return (
    <Icon 
      size={size} 
      className={`${color} ${className}`}
    />
  );
};