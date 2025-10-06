"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, HeartPulse } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  navLinks: Array<{ name: string; href: string }>;
}

export const Header: React.FC<HeaderProps> = ({ navLinks }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <HeartPulse className="w-7 h-7 text-indigo-600" />
            <span>AppealMed</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-indigo-600 transition-colors duration-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block"
              >
                <Button className="px-5 py-2.5 rounded-full text-sm font-semibold">
                  Get Started Free
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-gray-600 hover:text-indigo-600"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={isAuthenticated ? "/user/dashboard/home" : "/login"}
                className="w-full text-center block"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="w-full px-5 py-2.5 rounded-full text-sm font-semibold">
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
