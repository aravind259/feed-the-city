import { TrendingUp, Heart, Users, TreePine, Award, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ImpactStats {
  personalMealsShared: number;
  personalMealsClaimed: number;
  totalFoodSaved: number;
  co2Saved: number;
  communityRank: number;
  streakDays: number;
}

interface ImpactDashboardProps {
  stats: ImpactStats;
}

export const ImpactDashboard = ({ stats }: ImpactDashboardProps) => {
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