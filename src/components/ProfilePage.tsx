import { Edit, MapPin, Star, Award, Calendar, Camera, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

interface ProfilePageProps {
  // Mock user data - will be replaced with real data when Supabase is connected
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    location: string;
    joinDate: string;
    verified: boolean;
    role: 'donor' | 'claimant' | 'both';
    rating: number;
    totalDonations: number;
    totalClaims: number;
    impactScore: number;
  };
}

export const ProfilePage = ({ user }: ProfilePageProps) => {
  const { user: authUser, signOut } = useAuth();
  
  // Use real user data or mock data
  const currentUser = user || {
    id: authUser?.id || '1',
    name: authUser?.user_metadata?.display_name || 'AravindKumar',
    email: authUser?.email || 'user@email.com',
    avatar: authUser?.user_metadata?.avatar_url || '',
    location: 'San Francisco, CA',
    joinDate: authUser?.created_at || '2024-01-15',
    verified: true,
    role: 'both' as const,
    rating: 4.8,
    totalDonations: 23,
    totalClaims: 8,
    impactScore: 156
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/auth';
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <Card className="bg-gradient-card shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera size={14} />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center">
                <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
                {currentUser.verified && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    <Award size={12} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <MapPin size={14} />
                <span className="text-sm">{currentUser.location}</span>
              </div>
              
              <div className="flex items-center gap-1 justify-center">
                <Star size={14} className="text-secondary fill-secondary" />
                <span className="text-sm font-medium text-foreground">{currentUser.rating}</span>
                <span className="text-sm text-muted-foreground">(42 reviews)</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4 text-center">
            <h3 className="text-xl font-bold text-secondary">{currentUser.totalDonations}</h3>
            <p className="text-xs text-muted-foreground">Donations</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4 text-center">
            <h3 className="text-xl font-bold text-primary">{currentUser.totalClaims}</h3>
            <p className="text-xs text-muted-foreground">Claims</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4 text-center">
            <h3 className="text-xl font-bold text-vegetables">{currentUser.impactScore}</h3>
            <p className="text-xs text-muted-foreground">Impact Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">Member Since</p>
              <p className="text-sm text-muted-foreground">{formatJoinDate(currentUser.joinDate)}</p>
            </div>
            <Calendar size={16} className="text-muted-foreground" />
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">Account Type</p>
              <p className="text-sm text-muted-foreground capitalize">{currentUser.role}</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {currentUser.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Shared fresh vegetables</p>
                <p className="text-xs text-muted-foreground">2 hours ago • Claimed by 2 people</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-secondary/5 rounded-lg">
              <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Claimed bakery items</p>
                <p className="text-xs text-muted-foreground">1 day ago • From Downtown Bakery</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-vegetables/5 rounded-lg">
              <div className="w-2 h-2 bg-vegetables rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Received 5-star review</p>
                <p className="text-xs text-muted-foreground">3 days ago • "Great communication!"</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="ghost" className="w-full justify-between">
            <span>Notification Preferences</span>
            <Settings size={16} />
          </Button>
          
          <Button variant="ghost" className="w-full justify-between">
            <span>Privacy Settings</span>
            <Settings size={16} />
          </Button>
          
          <Button variant="ghost" className="w-full justify-between">
            <span>Help & Support</span>
            <Settings size={16} />
          </Button>
          
          <Separator />
          
          <Button variant="ghost" className="w-full text-destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};