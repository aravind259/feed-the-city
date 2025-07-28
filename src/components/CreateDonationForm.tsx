import { useState } from "react";
import { Camera, Clock, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FoodCategoryIcon } from "./FoodCategoryIcon";

interface CreateDonationFormProps {
  onSubmit: (donation: any) => void;
  onCancel: () => void;
}

const foodCategories = [
  { id: 'vegetables', label: 'Vegetables & Greens' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'bread', label: 'Bread & Grains' },
  { id: 'prepared', label: 'Prepared Meals' },
  { id: 'dairy', label: 'Dairy Products' }
];

const quantities = [
  '1-2 servings',
  '3-5 servings', 
  '6-10 servings',
  '10+ servings',
  '1-2 lbs',
  '3-5 lbs',
  '5+ lbs'
];

export const CreateDonationForm = ({ onSubmit, onCancel }: CreateDonationFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    expiryTime: '',
    location: '',
    pickupInstructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now().toString(),
      donor: 'Current User', // This would come from auth
      createdAt: new Date().toISOString()
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get minimum time (1 hour from now)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <Card className="max-w-2xl mx-auto bg-gradient-card shadow-medium">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-foreground">Share Your Food</CardTitle>
        <p className="text-muted-foreground">Help reduce waste and feed your community</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Placeholder */}
          <div>
            <Label htmlFor="photo" className="text-sm font-medium">Food Photo (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Camera className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-sm text-muted-foreground">Tap to add a photo</p>
              <p className="text-xs text-muted-foreground mt-1">Photos help others see your generous donation</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">What are you sharing?</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Fresh vegetables, Homemade pasta"
              required
              className="mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-medium">Food Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select food type" />
              </SelectTrigger>
              <SelectContent>
                {foodCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <FoodCategoryIcon category={category.id as any} size={16} />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Package size={16} />
              Quantity
            </Label>
            <Select value={formData.quantity} onValueChange={(value) => handleInputChange('quantity', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="How much are you sharing?" />
              </SelectTrigger>
              <SelectContent>
                {quantities.map((quantity) => (
                  <SelectItem key={quantity} value={quantity}>
                    {quantity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell others about the food - ingredients, cooking method, any allergens..."
              className="mt-2 min-h-[80px]"
              required
            />
          </div>

          {/* Expiry Time */}
          <div>
            <Label htmlFor="expiryTime" className="text-sm font-medium flex items-center gap-2">
              <Clock size={16} />
              Available Until
            </Label>
            <Input
              id="expiryTime"
              type="datetime-local"
              value={formData.expiryTime}
              onChange={(e) => handleInputChange('expiryTime', e.target.value)}
              min={getMinDateTime()}
              required
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">When should this be collected by?</p>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin size={16} />
              Pickup Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Downtown Coffee Shop, Near Central Park"
              required
              className="mt-2"
            />
          </div>

          {/* Pickup Instructions */}
          <div>
            <Label htmlFor="pickupInstructions" className="text-sm font-medium">Pickup Instructions</Label>
            <Textarea
              id="pickupInstructions"
              value={formData.pickupInstructions}
              onChange={(e) => handleInputChange('pickupInstructions', e.target.value)}
              placeholder="Any special instructions for pickup? Contact info, access details, etc."
              className="mt-2 min-h-[60px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="hero"
              className="flex-1"
            >
              Share Food
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};