import { TrendingUp, Heart, Users, TreePine, Award, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ImpactStats {
  personalMealsShared: number;
  personalMealsClaimed: number;
  totalFoodSaved: number;
  co2Saved: number;
  communityRank: number;
  streakDays: number;
}

interface ImpactDashboardProps {
  stats?: ImpactStats;
}

export const ImpactDashboard = ({ stats: propStats }: ImpactDashboardProps) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ImpactStats>(propStats || {
    personalMealsShared: 0,
    personalMealsClaimed: 0,
    totalFoodSaved: 0,
    co2Saved: 0,
    communityRank: 1,
    streakDays: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactStats = async () => {
      if (!user) return;

      try {
        // Fetch personal meals shared
        const { data: sharedMeals } = await supabase
          .from('food_listings')
          .select('*')
          .eq('user_id', user.id);

        // Fetch personal meals claimed
        const { data: claimedMeals } = await supabase
          .from('claims')
          .select('*')
          .eq('claimer_id', user.id);

        // Calculate estimated food saved (assuming 0.5kg per meal)
        const totalMeals = (sharedMeals?.length || 0) + (claimedMeals?.length || 0);
        const foodSaved = totalMeals * 0.5;
        
        // Calculate CO2 saved (assuming 2.3kg CO2 per kg food)
        const co2Saved = Math.round(foodSaved * 2.3);

        // Get community rank (simple calculation based on total contributions)
        const { data: allUsers } = await supabase
          .from('food_listings')
          .select('user_id')
          .order('created_at');
        
        const userCounts = allUsers?.reduce((acc: any, listing) => {
          acc[listing.user_id] = (acc[listing.user_id] || 0) + 1;
          return acc;
        }, {}) || {};

        const userRank = Object.values(userCounts)
          .sort((a: any, b: any) => b - a)
          .indexOf(userCounts[user.id] || 0) + 1;

        setStats({
          personalMealsShared: sharedMeals?.length || 0,
          personalMealsClaimed: claimedMeals?.length || 0,
          totalFoodSaved: Math.round(foodSaved),
          co2Saved,
          communityRank: userRank || 1,
          streakDays: Math.floor(Math.random() * 10) + 1, // Placeholder for now
        });
      } catch (error) {
        console.error('Error fetching impact stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactStats();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="text-center bg-gradient-impact rounded-lg p-6 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-2">Loading Your Impact...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center bg-gradient-impact rounded-lg p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold mb-2">Your Impact</h2>
        <p className="text-primary-foreground/90">Making a difference, one meal at a time</p>
      </div>

      {/* Personal Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4 text-center">
            <Heart className="mx-auto mb-2 text-secondary" size={24} />
            <h3 className="text-2xl font-bold text-foreground">{stats.personalMealsShared}</h3>
            <p className="text-sm text-muted-foreground">Meals Shared</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4 text-center">
            <Users className="mx-auto mb-2 text-primary" size={24} />
            <h3 className="text-2xl font-bold text-foreground">{stats.personalMealsClaimed}</h3>
            <p className="text-sm text-muted-foreground">Meals Claimed</p>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TreePine className="text-vegetables" size={20} />
            Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Food Waste Prevented</p>
              <p className="text-xl font-semibold text-foreground">{stats.totalFoodSaved} kg</p>
            </div>
            <Badge variant="secondary" className="bg-vegetables/20 text-vegetables">
              <TrendingUp size={12} className="mr-1" />
              +15% this month
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">CO₂ Emissions Saved</p>
              <p className="text-xl font-semibold text-foreground">{stats.co2Saved} kg</p>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              <TreePine size={12} className="mr-1" />
              5 trees worth
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Community Recognition */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="text-secondary" size={20} />
            Community Recognition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Community Rank</p>
              <p className="text-xl font-semibold text-foreground">#{stats.communityRank}</p>
            </div>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary">
              Top 10%
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Sharing Streak</p>
              <p className="text-xl font-semibold text-foreground">{stats.streakDays} days</p>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              🔥 Hot Streak!
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Goals & Challenges */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="text-primary" size={20} />
            Monthly Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Share 10 meals this month</p>
              <span className="text-sm text-muted-foreground">{stats.personalMealsShared}/10</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-hero h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.personalMealsShared / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.personalMealsShared >= 10 
                ? "🎉 Challenge completed! You're amazing!" 
                : `${10 - stats.personalMealsShared} meals to go!`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
              <div className="text-2xl">🌱</div>
              <div>
                <p className="font-medium text-sm">First Timer</p>
                <p className="text-xs text-muted-foreground">Shared your first meal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl">🤝</div>
              <div>
                <p className="font-medium text-sm">Community Helper</p>
                <p className="text-xs text-muted-foreground">Helped 5 people</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-vegetables/10 rounded-lg">
              <div className="text-2xl">♻️</div>
              <div>
                <p className="font-medium text-sm">Eco Warrior</p>
                <p className="text-xs text-muted-foreground">Saved 10kg of food waste</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};