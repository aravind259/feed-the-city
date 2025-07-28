import { Heart, Users, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Community food sharing"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90" />
      </div>
      
      <div className="relative px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            FoodShare Connect
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Turn food waste into community care. Connect neighbors to share surplus food and build a more sustainable future together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-4"
            >
              Start Sharing Today
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 text-lg px-8 py-4"
            >
              Learn More
            </Button>
          </div>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Heart className="mx-auto mb-3 text-primary-foreground" size={32} />
                <h3 className="text-2xl font-bold text-primary-foreground mb-1">50K+</h3>
                <p className="text-primary-foreground/80">Meals Shared</p>
              </CardContent>
            </Card>
            
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="mx-auto mb-3 text-primary-foreground" size={32} />
                <h3 className="text-2xl font-bold text-primary-foreground mb-1">5K+</h3>
                <p className="text-primary-foreground/80">Community Members</p>
              </CardContent>
            </Card>
            
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <TreePine className="mx-auto mb-3 text-primary-foreground" size={32} />
                <h3 className="text-2xl font-bold text-primary-foreground mb-1">25 tons</h3>
                <p className="text-primary-foreground/80">CO₂ Saved</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};