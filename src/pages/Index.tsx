import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import CollegeExplorer from '../components/CollegeExplorer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <CollegeExplorer />
      </main>
    </div>
  );
};

export default Index;
