import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { FilterBar } from "@/components/FilterBar";
import { FoodCard } from "@/components/FoodCard";
import { CreateDonationForm } from "@/components/CreateDonationForm";
import { ImpactDashboard } from "@/components/ImpactDashboard";
import { ProfilePage } from "@/components/ProfilePage";
import { Button } from "@/components/ui/button";

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
  const [listings, setListings] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [selectedDistance, setSelectedDistance] = useState<string>();
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Fetch food listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data: foodListings, error } = await supabase
          .from('food_listings')
          .select(`
            *,
            profiles(display_name)
          `)
          .eq('is_claimed', false)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const formattedListings = foodListings?.map((listing: any) => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          category: listing.category,
          quantity: listing.quantity,
          expiryTime: listing.expiry_time,
          location: listing.location,
          donor: listing.profiles?.display_name || 'Anonymous',
          distance: '0.5 km', // Would calculate based on user location
          isClaimed: listing.is_claimed,
          pickupInstructions: listing.pickup_instructions
        })) || [];

        setListings(formattedListings);
      } catch (error: any) {
        toast({
          title: "Error loading listings",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [toast]);

  // Check auth and redirect if needed
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/auth';
    }
  }, [user, authLoading]);

  const handleGetStarted = () => {
    setShowHero(false);
    setActiveTab('home');
  };

  const handleCreateDonation = async (donation: any) => {
    try {
      const { data, error } = await supabase
        .from('food_listings')
        .insert({
          user_id: user?.id,
          title: donation.title,
          description: donation.description,
          category: donation.category,
          quantity: donation.quantity,
          expiry_time: donation.expiryTime,
          location: donation.location,
          pickup_instructions: donation.pickupInstructions
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newListing = {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        quantity: data.quantity,
        expiryTime: data.expiry_time,
        location: data.location,
        donor: user?.user_metadata?.display_name || 'You',
        distance: '0.0 km',
        isClaimed: false,
        pickupInstructions: data.pickup_instructions
      };
      
      setListings(prev => [newListing, ...prev]);
      setActiveTab('home');
      toast({
        title: "Food shared successfully! 🎉",
        description: "Your donation is now visible to the community.",
      });
    } catch (error: any) {
      toast({
        title: "Error sharing food",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleClaimFood = async (id: string) => {
    try {
      const { error } = await supabase.rpc('claim_food', { listing_id: id });
      
      if (error) throw error;

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
    } catch (error: any) {
      toast({
        title: "Error claiming food",
        description: error.message,
        variant: "destructive",
      });
    }
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Welcome to Feed the City</h2>
          <p className="text-muted-foreground">Please sign in to start sharing and claiming food.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

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
