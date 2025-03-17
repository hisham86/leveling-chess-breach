
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { Google, Facebook, Twitter } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithFacebook, signInWithTwitter } = useAuth();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    onClose();
  };

  const handleFacebookSignIn = async () => {
    await signInWithFacebook();
    onClose();
  };

  const handleTwitterSignIn = async () => {
    await signInWithTwitter();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-solo-dark border-solo-accent/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-solo-accent">Sign In</DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose a method to sign in to your account
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-4">
          <Button 
            onClick={handleGoogleSignIn}
            className="flex items-center justify-start gap-2 bg-white text-gray-800 hover:bg-gray-100"
          >
            <Google size={18} />
            <span>Continue with Google</span>
          </Button>
          
          <Button 
            onClick={handleFacebookSignIn}
            className="flex items-center justify-start gap-2 bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
          >
            <Facebook size={18} />
            <span>Continue with Facebook</span>
          </Button>
          
          <Button 
            onClick={handleTwitterSignIn}
            className="flex items-center justify-start gap-2 bg-[#1DA1F2] text-white hover:bg-[#1DA1F2]/90"
          >
            <Twitter size={18} />
            <span>Continue with Twitter</span>
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
