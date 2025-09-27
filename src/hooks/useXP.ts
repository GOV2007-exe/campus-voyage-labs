import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useXP = () => {
  const [userXP, setUserXP] = useState(() => {
    const savedXP = localStorage.getItem('campusquest_xp');
    return savedXP ? parseInt(savedXP) : 0;
  });
  
  const [userLevel, setUserLevel] = useState(() => {
    const savedLevel = localStorage.getItem('campusquest_level');
    return savedLevel ? parseInt(savedLevel) : 1;
  });
  
  const { toast } = useToast();

  // Calculate level based on XP (every 500 XP = 1 level)
  useEffect(() => {
    const calculatedLevel = Math.floor(userXP / 500) + 1;
    if (calculatedLevel > userLevel) {
      setUserLevel(calculatedLevel);
      localStorage.setItem('campusquest_level', calculatedLevel.toString());
      
      // Show level up notification
      toast({
        title: `🎉 Level Up! You're now Level ${calculatedLevel}!`,
        description: `Keep exploring and earning XP to unlock more rewards!`,
      });
    }
    localStorage.setItem('campusquest_xp', userXP.toString());
  }, [userXP, userLevel, toast]);

  const addXP = (amount: number, reason?: string) => {
    setUserXP(prev => {
      const newXP = prev + amount;
      
      // Show XP gain notification
      if (reason) {
        toast({
          title: `+${amount} XP`,
          description: reason,
        });
      }
      
      return newXP;
    });
  };

  const getXPForNextLevel = () => {
    return (userLevel * 500) - userXP;
  };

  const getProgressToNextLevel = () => {
    const currentLevelXP = (userLevel - 1) * 500;
    const nextLevelXP = userLevel * 500;
    const progressXP = userXP - currentLevelXP;
    return (progressXP / (nextLevelXP - currentLevelXP)) * 100;
  };

  return {
    userXP,
    userLevel,
    addXP,
    getXPForNextLevel,
    getProgressToNextLevel
  };
};

// XP amounts for different actions
export const XP_ACTIONS = {
  COLLEGE_VIEW: 10,
  SCHOLARSHIP_APPLICATION: 50,
  EVENT_RSVP: 25,
  BLOG_READ: 15,
  COMMUNITY_POST: 30,
  MENTOR_SESSION: 100,
  PROFILE_COMPLETE: 75,
  DAILY_LOGIN: 5,
  TASK_COMPLETE: 20
};