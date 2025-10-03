import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Building2, Users, Sparkles, ArrowRight, Bot, GraduationCap, MessageCircle } from "lucide-react";
import SynqAI from '../components/SynqAI';
import CollegeExplorer from '../components/CollegeExplorer';
import Mentorship from './Mentorship';

type Portal = 'ai' | 'campus' | 'mentorship' | null;

const Index = () => {
  const [activePortal, setActivePortal] = useState<Portal>(null);

  const portals = [
    {
      id: 'ai' as Portal,
      icon: Brain,
      title: 'Synq AI',
      subtitle: 'Your personal admissions assistant',
      description: 'Get instant feedback on essays, calculate admission chances, and match with colleges using AI',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      features: ['Essay Review', 'Chance Calculator', 'College Matcher', 'Smart Recommendations']
    },
    {
      id: 'campus' as Portal,
      icon: Building2,
      title: 'Campus Synq',
      subtitle: 'Discover your dream college',
      description: 'Explore 200+ colleges worldwide with powerful filters, compare programs, and save your favorites',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      bgGradient: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      features: ['200+ Universities', 'Advanced Filters', 'Detailed Profiles', 'Scholarship Info']
    },
    {
      id: 'mentorship' as Portal,
      icon: Users,
      title: 'Personal Mentorship',
      subtitle: 'Learn from those who\'ve been there',
      description: 'Connect with student mentors from top universities for 1-on-1 guidance on essays, interviews, and applications',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      bgGradient: 'bg-gradient-to-br from-orange-500/10 to-pink-500/10',
      iconBg: 'bg-gradient-to-br from-orange-500 to-pink-500',
      features: ['Expert Mentors', 'Book Sessions', 'Live Chat', 'Flexible Pricing']
    }
  ];

  if (activePortal === 'ai') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button 
            variant="ghost" 
            onClick={() => setActivePortal(null)}
            className="mb-6 hover:bg-primary/10"
          >
            ← Back to Home
          </Button>
          <SynqAI />
        </div>
      </div>
    );
  }

  if (activePortal === 'campus') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button 
            variant="ghost" 
            onClick={() => setActivePortal(null)}
            className="mb-6 hover:bg-secondary/10"
          >
            ← Back to Home
          </Button>
          <CollegeExplorer />
        </div>
      </div>
    );
  }

  if (activePortal === 'mentorship') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <Button 
              variant="ghost" 
              onClick={() => setActivePortal(null)}
              className="mb-6 hover:bg-orange-500/10"
            >
              ← Back to Home
            </Button>
          </div>
          <Mentorship isPortalMode={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 container mx-auto px-4 py-32">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 mb-6 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Welcome to Synq
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              Where every student
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                stays in sync
              </span>
              <span className="block text-4xl md:text-6xl lg:text-7xl mt-2">
                with their future
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Smarter tools, better guidance, and meaningful mentorship — all in one platform
            </p>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white text-lg px-12 py-7 rounded-full hover-lift"
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Portal Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-20">
            {portals.map((portal, index) => (
              <Card 
                key={portal.id}
                onClick={() => setActivePortal(portal.id)}
                className={`group relative overflow-hidden cursor-pointer hover-lift transition-all duration-500 border-2 hover:border-primary/50 ${portal.bgGradient} backdrop-blur-xl animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${portal.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative p-8 space-y-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${portal.iconBg} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <portal.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-sm text-muted-foreground italic">
                      {portal.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {portal.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {portal.features.map((feature) => (
                      <Badge 
                        key={feature}
                        variant="secondary" 
                        className="text-xs bg-background/50 backdrop-blur-sm"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center text-primary group-hover:text-secondary transition-colors">
                    <span className="font-semibold mr-2">Explore Portal</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>

                {/* Floating Icons Animation */}
                <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <portal.icon className="w-32 h-32 transform group-hover:scale-110 transition-transform" />
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-sm text-muted-foreground">Students Helped</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '1s' }}>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                200+
              </div>
              <div className="text-sm text-muted-foreground">Partner Colleges</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-sm text-muted-foreground">Expert Mentors</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
