'use client';

import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="border-b border-neutral-border-gray bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {title && (
            <h1 className="text-xl font-semibold text-neutral-black">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block">
            <Input
              placeholder="Search..."
              className="w-64"
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary-red text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;