import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Trophy, BookOpen, Users, Calendar, Target, MessageSquare, FileText } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // XP System - Load from localStorage or default
  const [userXP, setUserXP] = useState(() => {
    const savedXP = localStorage.getItem('campusquest_xp');
    return savedXP ? parseInt(savedXP) : 2450;
  });
  
  const [userLevel, setUserLevel] = useState(() => {
    const savedLevel = localStorage.getItem('campusquest_level');
    return savedLevel ? parseInt(savedLevel) : 5;
  });
  
  // Calculate level based on XP (every 500 XP = 1 level)
  useEffect(() => {
    const calculatedLevel = Math.floor(userXP / 500) + 1;
    if (calculatedLevel !== userLevel) {
      setUserLevel(calculatedLevel);
      localStorage.setItem('campusquest_level', calculatedLevel.toString());
    }
    localStorage.setItem('campusquest_xp', userXP.toString());
  }, [userXP]);

  const navItems = [
    { icon: BookOpen, label: "Home", to: "/" },
  ];

  const isActiveRoute = (path: string) => {
    if (path.includes('#')) return false; // Handle anchor links differently
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Synq</h1>
              <p className="text-xs text-muted-foreground">Stay in Sync with Your Future</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isAnchorLink = item.to.includes('#');
              return isAnchorLink ? (
                <a
                  key={item.label}
                  href={item.to}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                >
                  <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`flex items-center space-x-2 transition-colors duration-200 group ${
                    isActiveRoute(item.to) 
                      ? 'text-primary font-semibold' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className={`w-4 h-4 transition-colors ${
                    isActiveRoute(item.to) ? 'text-primary' : 'group-hover:text-primary'
                  }`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gradient-primary text-white">
                Level {userLevel}
              </Badge>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">XP</p>
                <p className="text-sm font-semibold text-gamification-xp">{userXP.toLocaleString()}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button className="bg-gradient-primary hover:opacity-90" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-glass-border">
            <div className="space-y-3">
              {navItems.map((item) => {
                const isAnchorLink = item.to.includes('#');
                return isAnchorLink ? (
                  <a
                    key={item.label}
                    href={item.to}
                    className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center space-x-3 px-2 py-2 rounded-lg transition-colors ${
                      isActiveRoute(item.to) 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className={`w-5 h-5 ${
                      isActiveRoute(item.to) ? 'text-primary' : 'text-primary'
                    }`} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-glass-border">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="bg-gradient-primary text-white">
                    Level {userLevel}
                  </Badge>
                  <span className="text-sm font-semibold text-gamification-xp">{userXP.toLocaleString()} XP</span>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    Sign In
                  </Button>
                  <Button className="w-full bg-gradient-primary hover:opacity-90" size="sm">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;