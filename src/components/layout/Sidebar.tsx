'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Phone,
  Calendar,
  Package,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Users / Contacts',
    href: '/users',
    icon: Users,
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: UserCheck,
  },
  {
    name: 'Call History',
    href: '/call-history',
    icon: Phone,
  },
  {
    name: 'Bookings',
    href: '/bookings',
    icon: Calendar,
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-30 flex h-full w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-border-gray p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-orange text-white font-bold">
              T
            </div>
            <span className="text-lg font-semibold text-neutral-black">
              TripongoStays
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User info */}
        <div className="border-b border-neutral-border-gray p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft-orange text-white font-medium">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-black">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-neutral-gray">
                {user?.role || 'admin'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-orange text-white'
                    : 'text-neutral-gray hover:bg-neutral-light-gray hover:text-neutral-black'
                )}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-neutral-border-gray p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-secondary-red hover:bg-red-50 hover:text-secondary-red"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-5 w-5" />}
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;