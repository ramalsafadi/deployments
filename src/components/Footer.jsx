// MADE BY Ram ALSAFADI - Crypto Dashboard Footer Component
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by</span>
            <span className="font-semibold text-foreground">Ram ALSAFADI</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span>© 2025 Crypto Dashboard - Real-time Cryptocurrency Tracker</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            Developed by <span className="font-medium text-foreground">Ram ALSAFADI</span> • 
            Built with React, Tailwind CSS, and shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

