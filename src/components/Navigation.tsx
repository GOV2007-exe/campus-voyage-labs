import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Trophy, BookOpen, Users, Calendar, Target } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { icon: BookOpen, label: "Explore Colleges", href: "#colleges" },
    { icon: Trophy, label: "Scholarships", href: "#scholarships" },
    { icon: Users, label: "Mentorship", href: "#mentorship" },
    { icon: Calendar, label: "Events", href: "#events" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">CampusQuest</h1>
              <p className="text-xs text-muted-foreground">Level Up Your Future</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-gradient-primary text-white">
                Level 5
              </Badge>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">XP</p>
                <p className="text-sm font-semibold text-gamification-xp">2,450</p>
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
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
              <div className="pt-3 border-t border-glass-border">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="bg-gradient-primary text-white">
                    Level 5
                  </Badge>
                  <span className="text-sm font-semibold text-gamification-xp">2,450 XP</span>
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