import { Edit, MapPin, Star, Award, Calendar, Camera, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalClaims: 0,
    impactScore: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = authUser || user;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser) return;

      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        setProfile(profileData);

        // Fetch user stats
        const { data: donations } = await supabase
          .from('food_listings')
          .select('*')
          .eq('user_id', currentUser.id);

        const { data: claims } = await supabase
          .from('claims')
          .select('*')
          .eq('claimer_id', currentUser.id);

        setStats({
          totalDonations: donations?.length || 0,
          totalClaims: claims?.length || 0,
          impactScore: ((donations?.length || 0) * 10) + ((claims?.length || 0) * 5)
        });

        // Fetch recent activity
        const { data: recentDonations } = await supabase
          .from('food_listings')
          .select('title, created_at, category')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(3);

        const { data: recentClaims } = await supabase
          .from('claims')
          .select('claimed_at, food_listings(title)')
          .eq('claimer_id', currentUser.id)
          .order('claimed_at', { ascending: false })
          .limit(2);

        const activity = [
          ...(recentDonations?.map(d => ({
            action: `Shared ${d.title}`,
            time: d.created_at,
            type: 'donation',
            category: d.category
          })) || []),
          ...(recentClaims?.map(c => ({
            action: `Claimed ${(c as any).food_listings?.title || 'food item'}`,
            time: c.claimed_at,
            type: 'claim'
          })) || [])
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 3);

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);

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

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-2">Loading Profile...</h2>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="space-y-6 pb-20">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-2">Please sign in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <Card className="bg-gradient-card shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || (currentUser as any)?.user_metadata?.avatar_url} alt={profile?.display_name || currentUser.email} />
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {(profile?.display_name || currentUser.email || 'U').charAt(0).toUpperCase()}
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
                <h1 className="text-2xl font-bold text-foreground">
                  {profile?.display_name || currentUser.email?.split('@')[0] || 'User'}
                </h1>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  <Award size={12} className="mr-1" />
                  Verified
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground justify-center">
                <MapPin size={14} />
                <span className="text-sm">{profile?.location || 'Location not set'}</span>
              </div>
              
              <div className="flex items-center gap-1 justify-center">
                <Star size={14} className="text-secondary fill-secondary" />
                <span className="text-sm font-medium text-foreground">4.8</span>
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
            <h3 className="text-xl font-bold text-secondary">{stats.totalDonations}</h3>
            <p className="text-xs text-muted-foreground">Donations</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4 text-center">
            <h3 className="text-xl font-bold text-primary">{stats.totalClaims}</h3>
            <p className="text-xs text-muted-foreground">Claims</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-soft">
          <CardContent className="p-4 text-center">
            <h3 className="text-xl font-bold text-vegetables">{stats.impactScore}</h3>
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
              <p className="text-sm text-muted-foreground">{profile?.email || currentUser.email}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {formatJoinDate(profile?.created_at || (currentUser as any)?.created_at || '2024-01-15')}
              </p>
            </div>
            <Calendar size={16} className="text-muted-foreground" />
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground">Account Type</p>
              <p className="text-sm text-muted-foreground">Community Member</p>
            </div>
            <Badge variant="outline">
              Member
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'donation' ? 'bg-primary' : 'bg-secondary'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No recent activity</p>
                <p className="text-xs text-muted-foreground mt-1">Start sharing or claiming food to see your activity here!</p>
              </div>
            )}
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