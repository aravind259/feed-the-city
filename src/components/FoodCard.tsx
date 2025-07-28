import { Clock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FoodCategoryIcon } from "./FoodCategoryIcon";

interface FoodCardProps {
  id: string;
  title: string;
  description: string;
  category: 'vegetables' | 'fruits' | 'bread' | 'prepared' | 'dairy';
  quantity: string;
  expiryTime: string;
  location: string;
  donor: string;
  image?: string;
  distance?: string;
  onClaim: (id: string) => void;
  isClaimed?: boolean;
}

export const FoodCard = ({ 
  id, 
  title, 
  description, 
  category, 
  quantity, 
  expiryTime, 
  location, 
  donor, 
  image, 
  distance,
  onClaim,
  isClaimed = false 
}: FoodCardProps) => {
  const isExpiringSoon = new Date(expiryTime).getTime() - Date.now() < 2 * 60 * 60 * 1000; // 2 hours

  return (
    <Card className="overflow-hidden bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]">
      <div className="relative">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <FoodCategoryIcon category={category} size={48} />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="secondary" className="bg-background/90">
            <FoodCategoryIcon category={category} size={16} className="mr-1" />
            {category}
          </Badge>
          {isExpiringSoon && (
            <Badge variant="destructive" className="bg-destructive/90">
              <Clock size={12} className="mr-1" />
              Soon
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <span className="text-sm font-medium text-primary">{quantity}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={16} />
            <span>Until {new Date(expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>{location}</span>
            {distance && <span className="text-xs">• {distance}</span>}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={16} />
            <span>by {donor}</span>
          </div>
        </div>
        
        <Button 
          onClick={() => onClaim(id)}
          variant={isClaimed ? "outline" : "claim"}
          className="w-full"
          disabled={isClaimed}
        >
          {isClaimed ? "Already Claimed" : "Claim Food"}
        </Button>
      </CardContent>
    </Card>
  );
};