
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import UserProfile from "@/components/UserProfile";
import { useAuth } from "@/context/AuthContext";

interface UserAuthButtonProps {
  onLogin: () => void;
}

const UserAuthButton: React.FC<UserAuthButtonProps> = ({ onLogin }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  return (
    <div className="absolute top-4 right-4 z-20">
      {user ? (
        <UserProfile />
      ) : (
        <Button 
          onClick={onLogin} 
          variant="ghost" 
          className="text-white hover:bg-solo-purple/30 border border-solo-accent/50"
        >
          <User size={18} className="mr-2" />
          Sign In
        </Button>
      )}
    </div>
  );
};

export default UserAuthButton;
