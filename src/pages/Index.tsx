import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { FilterBar } from "@/components/FilterBar";
import { FoodCard } from "@/components/FoodCard";
import { CreateDonationForm } from "@/components/CreateDonationForm";
import { ImpactDashboard } from "@/components/ImpactDashboard";
import { ProfilePage } from "@/components/ProfilePage";

// Mock data for demonstration
const mockListings = [
  {
    id: "1",
    title: "Fresh Vegetables from Garden",
    description: "Organic tomatoes, lettuce, and carrots from my home garden. All picked this morning!",
    category: "vegetables" as const,
    quantity: "3-5 lbs",
    expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    location: "Green Valley Community Center",
    donor: "Maria Rodriguez",
    distance: "0.8 km"
  },
  {
    id: "2", 
    title: "Homemade Lasagna",
    description: "Made too much for dinner! Family-size vegetarian lasagna with fresh herbs.",
    category: "prepared" as const,
    quantity: "6-8 servings",
    expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    location: "Downtown Main Street",
    donor: "Chef Antonio",
    distance: "1.2 km"
  },
  {
    id: "3",
    title: "Artisan Bread & Pastries", 
    description: "End-of-day fresh bread, croissants, and muffins from our bakery.",
    category: "bread" as const,
    quantity: "10+ items",
    expiryTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    location: "Sunshine Bakery",
    donor: "Sunshine Bakery",
    distance: "2.1 km"
  }
];

const mockImpactStats = {
  personalMealsShared: 7,
  personalMealsClaimed: 12,
  totalFoodSaved: 23.5,
  co2Saved: 47,
  communityRank: 42,
  streakDays: 12
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showHero, setShowHero] = useState(true);
  const [listings, setListings] = useState(mockListings);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedDistance, setSelectedDistance] = useState<string>();
  const { toast } = useToast();

  const handleGetStarted = () => {
    setShowHero(false);
    setActiveTab('home');
  };

  const handleCreateDonation = (donation: any) => {
    setListings(prev => [donation, ...prev]);
    setActiveTab('home');
    toast({
      title: "Food shared successfully! 🎉",
      description: "Your donation is now visible to the community.",
    });
  };

  const handleClaimFood = (id: string) => {
    setListings(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, isClaimed: true }
          : item
      )
    );
    toast({
      title: "Food claimed! 🍽️",
      description: "Please coordinate pickup with the donor.",
    });
  };

  const handleFilterChange = (type: 'category' | 'distance' | 'time', value: string | null) => {
    if (type === 'category') {
      setSelectedCategory(value || undefined);
    } else if (type === 'distance') {
      setSelectedDistance(value || undefined);
    }
  };

  const filteredListings = listings.filter(listing => {
    if (selectedCategory && listing.category !== selectedCategory) return false;
    // Distance filtering would be implemented with actual location data
    return true;
  });

  if (showHero) {
    return (
      <div className="min-h-screen bg-background">
        <Hero onGetStarted={handleGetStarted} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pb-20">
        {activeTab === 'home' && (
          <>
            <FilterBar 
              selectedCategory={selectedCategory}
              selectedDistance={selectedDistance}
              onFilterChange={handleFilterChange}
            />
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Available Food Near You
              </h2>
              {filteredListings.length > 0 ? (
                <div className="grid gap-4">
                  {filteredListings.map((listing) => (
                    <FoodCard
                      key={listing.id}
                      {...listing}
                      onClaim={handleClaimFood}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No food available with current filters.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'create' && (
          <div className="p-4">
            <CreateDonationForm 
              onSubmit={handleCreateDonation}
              onCancel={() => setActiveTab('home')}
            />
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="p-4">
            <ImpactDashboard stats={mockImpactStats} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4">
            <ProfilePage />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
