
import React from 'react';
import { Coffee, Twitter, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <div className="absolute bottom-2 w-full flex flex-col items-center">
      <div className="text-gray-400 text-xs mb-2 font-mono">Created by Hisham</div>
      <div className="flex justify-center items-center space-x-4">
        <a 
          href="https://buymeacoffee.com/hishamcato" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-400 hover:text-solo-accent transition-colors"
        >
          <Coffee size={20} />
        </a>
        <a 
          href="https://x.com/Solo_Level_27" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-400 hover:text-solo-accent transition-colors"
        >
          <Twitter size={20} />
        </a>
        <a 
          href="https://www.linkedin.com/in/hisham86/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-400 hover:text-solo-accent transition-colors"
        >
          <Linkedin size={20} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
