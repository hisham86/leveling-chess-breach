
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setProfile(data);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-solo-purple/30">
          <Avatar className="h-8 w-8">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-solo-purple/40 text-white">
                {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-white text-sm hidden md:inline">
            {profile?.username || user.email?.split('@')[0] || 'User'}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="bg-solo-dark border-solo-accent/50 text-white">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-solo-accent/20" />
        <DropdownMenuItem
          className="hover:bg-solo-purple/30 focus:bg-solo-purple/30"
          onClick={() => {
            toast({
              title: "Profile",
              description: "Profile settings coming soon",
            });
          }}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-solo-purple/30 focus:bg-solo-purple/30"
          onClick={() => {
            toast({
              title: "Saved Games",
              description: "Saved games view coming soon",
            });
          }}
        >
          Saved Games
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-solo-accent/20" />
        <DropdownMenuItem 
          className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 focus:text-red-400"
          onClick={handleSignOut}
        >
          <LogOut size={16} className="mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
