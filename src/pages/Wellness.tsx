import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Meh, Frown, Heart, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const moodEmojis = [
  { level: 5, emoji: '😊', label: 'Great', icon: Smile },
  { level: 4, emoji: '🙂', label: 'Good', icon: Smile },
  { level: 3, emoji: '😐', label: 'Okay', icon: Meh },
  { level: 2, emoji: '😔', label: 'Not Great', icon: Frown },
  { level: 1, emoji: '😢', label: 'Struggling', icon: Frown },
];

const mindfulnessExercises = [
  { type: 'breathing', title: '5-Minute Breathing', duration: 5 },
  { type: 'meditation', title: '10-Minute Meditation', duration: 10 },
  { type: 'body_scan', title: 'Body Scan Relaxation', duration: 15 },
  { type: 'gratitude', title: 'Gratitude Practice', duration: 3 },
];

const Wellness = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadMoodHistory();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
    }
  };

  const loadMoodHistory = async () => {
    try {
      const { data } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(7);

      setMoodHistory(data || []);
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };

  const saveMoodEntry = async () => {
    if (selectedMood === null) {
      toast({
        title: "Select a mood",
        description: "Please select how you're feeling",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const moodData = moodEmojis.find(m => m.level === selectedMood);

      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_level: selectedMood,
          mood_emoji: moodData?.emoji,
          note: moodNote,
        });

      if (error) throw error;

      toast({
        title: "Mood saved!",
        description: "Your mood has been recorded.",
      });

      setSelectedMood(null);
      setMoodNote('');
      loadMoodHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startExercise = async (exerciseType: string, duration: number) => {
    setActiveExercise(exerciseType);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save session
      await supabase
        .from('mindfulness_sessions')
        .insert({
          user_id: user.id,
          session_type: exerciseType,
          duration_minutes: duration,
        });

      toast({
        title: "Session started!",
        description: `Enjoy your ${duration}-minute mindfulness practice.`,
      });

      // Simulate completion after duration
      setTimeout(() => {
        setActiveExercise(null);
        toast({
          title: "Well done!",
          description: "You completed your mindfulness session.",
        });
      }, duration * 60 * 1000);
    } catch (error) {
      console.error('Error starting exercise:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Wellness Center</h1>

        <Tabs defaultValue="mood" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
            <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-4 mt-4">
            {/* Mood Check-in */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>How are you feeling today?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  {moodEmojis.map((mood) => (
                    <button
                      key={mood.level}
                      onClick={() => setSelectedMood(mood.level)}
                      className={`p-4 rounded-lg transition-all ${
                        selectedMood === mood.level
                          ? 'bg-primary text-primary-foreground scale-110'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      <div className="text-4xl mb-2">{mood.emoji}</div>
                      <div className="text-xs">{mood.label}</div>
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Any notes? (optional)"
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                />
                <Button onClick={saveMoodEntry} className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Save Mood
                </Button>
              </CardContent>
            </Card>

            {/* Mood History */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Your Mood Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {moodHistory.map((entry) => (
                    <div key={entry.id} className="text-center">
                      <div className="text-2xl">{entry.mood_emoji}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mindfulness" className="space-y-4 mt-4">
            {mindfulnessExercises.map((exercise) => (
              <Card key={exercise.type} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{exercise.title}</h3>
                      <p className="text-muted-foreground">{exercise.duration} minutes</p>
                    </div>
                    <Button
                      onClick={() => startExercise(exercise.type, exercise.duration)}
                      disabled={activeExercise !== null}
                    >
                      {activeExercise === exercise.type ? 'In Progress...' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Wellness;