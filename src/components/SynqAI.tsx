import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Send, FileText, Calculator, School, 
  Sparkles, BookOpen, TrendingUp, Download, 
  MessageCircle, Mic, Paperclip, BarChart, Trophy, Users 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useXP } from "@/hooks/useXP";
import CommunitySection from './CommunitySection';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Feature = 'chat' | 'essay' | 'calculator' | 'matcher';

const SynqAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm Synq AI, your personal admissions assistant. I can help you with essay reviews, admission chances, college matching, and general guidance. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [activeFeature, setActiveFeature] = useState<Feature>('chat');
  const [essayText, setEssayText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addXP, userXP, userLevel } = useXP();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      addXP(10, 'Used Synq AI');
    }, 1000);
  };

  const generateAIResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('essay') || lowerQuery.includes('write')) {
      return "I'd be happy to help with your essay! Please use the 'Essay Review' feature to upload or paste your essay. I'll provide detailed feedback on:\n\n✓ Structure and organization\n✓ Content quality and depth\n✓ Grammar and language\n✓ Overall impact and uniqueness\n\nClick the 'Essay Review' button to get started!";
    } else if (lowerQuery.includes('college') || lowerQuery.includes('university') || lowerQuery.includes('school')) {
      return "Looking for the perfect college? I can help! Here's what I can do:\n\n🎯 **College Matcher**: Based on your profile, I'll recommend universities that match your academic goals, location preferences, and budget.\n\n📊 I consider factors like:\n• Your intended major\n• GPA and test scores\n• Location preferences\n• Budget and financial aid needs\n• Campus culture preferences\n\nUse the 'College Matcher' feature to find your perfect fit!";
    } else if (lowerQuery.includes('chance') || lowerQuery.includes('admission') || lowerQuery.includes('accept')) {
      return "Want to know your admission chances? I can calculate that for you!\n\n📈 **Chance Calculator** analyzes:\n• Your GPA (weighted & unweighted)\n• Standardized test scores (SAT/ACT)\n• AP/IB courses taken\n• Extracurricular activities\n• Leadership roles\n• Awards and honors\n\nI'll provide realistic probability estimates for different universities. Click 'Chance Calculator' to begin!";
    } else if (lowerQuery.includes('scholarship') || lowerQuery.includes('financial')) {
      return "Scholarships can significantly reduce your college costs! Here's how I can help:\n\n💰 I can:\n• Identify scholarships matching your profile\n• Review your scholarship essays\n• Suggest strategies to strengthen applications\n• Help track deadlines\n\nAsk me specific questions about scholarships, or use the Campus Synq portal to browse available opportunities!";
    } else if (lowerQuery.includes('deadline') || lowerQuery.includes('timeline')) {
      return "Application timelines are crucial! Here's a general overview:\n\n📅 **Key Deadlines:**\n\n**Early Action/Decision**: November 1-15\n**Regular Decision**: January 1-15\n**Scholarship Applications**: Varies (often December-February)\n**Financial Aid (FAFSA)**: October 1 onwards\n\n⏰ Pro tip: Start your applications at least 2 months before deadlines to allow time for revisions and recommendations.\n\nWant help creating a personalized timeline? Just ask!";
    } else if (lowerQuery.includes('gpa') || lowerQuery.includes('grade')) {
      return "GPA is important, but it's not everything! Here's what you should know:\n\n📚 **GPA Considerations:**\n\n• Most competitive colleges look at weighted GPA (includes AP/Honors courses)\n• Course rigor matters as much as grades\n• An upward grade trend shows growth\n• A 3.8+ weighted GPA is competitive for top schools\n\nIf your GPA isn't perfect, focus on:\n✓ Strong test scores\n✓ Compelling essays\n✓ Meaningful extracurriculars\n✓ Outstanding recommendations\n\nWant to calculate your chances with your current GPA? Use the Chance Calculator!";
    } else if (lowerQuery.includes('extracurricular') || lowerQuery.includes('activities')) {
      return "Extracurriculars show who you are beyond grades! Here's what colleges look for:\n\n🎯 **Quality over Quantity:**\n\n✓ **Leadership roles**: Club president, team captain, etc.\n✓ **Depth & commitment**: 2-4 years in activities\n✓ **Impact**: Measurable achievements or change you created\n✓ **Passion**: Activities aligned with your interests/major\n\n**Examples of Strong ECs:**\n• Founded a community service project\n• Led a school club to win competitions\n• Published research or creative work\n• Varsity sports with leadership role\n\nWant help highlighting your activities in essays? I can help with that!";
    } else if (lowerQuery.includes('recommend') || lowerQuery.includes('letter')) {
      return "Recommendation letters can make or break your application! Here's my advice:\n\n📧 **Getting Great Letters:**\n\n**Who to ask:**\n✓ Teachers who know you well (junior/senior year)\n✓ Teachers in subjects related to your intended major\n✓ Counselor who can speak to your overall character\n✓ Optional: Employer, coach, or mentor for supplemental letters\n\n**When to ask:**\n• At least 2 months before deadlines\n• Ideally in spring of junior year\n\n**What to provide:**\n• Resume/activity list\n• Draft essay or personal statement\n• Specific examples of your work/achievements\n• Clear deadline and submission instructions\n\nNeed help preparing your request materials? Just ask!";
    } else if (lowerQuery.includes('sat') || lowerQuery.includes('act') || lowerQuery.includes('test')) {
      return "Test scores can strengthen your application! Here's what you need to know:\n\n📝 **SAT vs ACT:**\n\n**SAT** (out of 1600):\n• More emphasis on reasoning\n• 1400+ is competitive for top schools\n• 1500+ for Ivy League\n\n**ACT** (out of 36):\n• More straightforward questions\n• 32+ is competitive for top schools\n• 34+ for Ivy League\n\n**Test-Optional Policies:**\nMany schools are now test-optional! Submit scores if they strengthen your application, otherwise focus on other areas.\n\n**Super scoring:**\nMost colleges take your best section scores across multiple test dates!\n\nWant to calculate your chances with your test scores? Try the Chance Calculator!";
    } else if (lowerQuery.includes('interview')) {
      return "College interviews are your chance to shine in person! Here's how to prepare:\n\n🎤 **Interview Tips:**\n\n**Before:**\n• Research the college thoroughly\n• Prepare 2-3 questions to ask\n• Review your application and essays\n• Practice with friends or family\n\n**Common Questions:**\n• Why are you interested in this college?\n• Tell me about yourself\n• What's your greatest achievement?\n• What would you contribute to campus?\n• Where do you see yourself in 10 years?\n\n**During:**\n✓ Be authentic and genuine\n✓ Show enthusiasm for the school\n✓ Give specific examples\n✓ Ask thoughtful questions\n✓ Make eye contact and smile\n\n**After:**\n• Send a thank-you email within 24 hours\n\nWant to practice answering specific questions? I can help!";
    } else {
      return "I'm Synq AI, your personal admissions assistant! I'm here to help with all aspects of college applications. Here's what I can do:\n\n🤖 **My Capabilities:**\n\n📝 **Essay Review**: Get detailed feedback on your personal statement and supplemental essays\n\n📊 **Chance Calculator**: Calculate your admission probability based on your academic profile\n\n🎯 **College Matcher**: Find universities that match your preferences and qualifications\n\n💬 **General Advice**: Ask me anything about:\n• Application strategies\n• Essay writing tips\n• Extracurricular activities\n• Recommendation letters\n• Financial aid and scholarships\n• Interview preparation\n• Timeline and deadlines\n\nHow can I help you today? Feel free to ask specific questions or use one of my specialized features!";
    }
  };

  const handleEssayReview = () => {
    if (!essayText.trim()) {
      toast({
        title: "No essay provided",
        description: "Please paste your essay to get feedback.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Essay Analysis Complete!",
        description: "Your essay has been reviewed with detailed feedback.",
      });
      addXP(25, 'Completed Essay Review');
      
      const feedback: Message = {
        id: messages.length + 1,
        role: 'assistant',
        content: `📝 **Essay Feedback:**

**Strengths:**
✓ Clear thesis statement and strong opening
✓ Good use of personal anecdotes
✓ Engaging writing style

**Areas for Improvement:**
• Consider strengthening the conclusion
• Add more specific examples in paragraph 3
• Check for minor grammar improvements

**Overall Score: 8.5/10**

Your essay shows great potential! Focus on adding more vivid details and ensuring your conclusion ties everything together powerfully.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, feedback]);
    }, 2000);
  };

  const quickActions = [
    {
      icon: FileText,
      label: 'Essay Review',
      description: 'Get instant feedback',
      feature: 'essay' as Feature,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calculator,
      label: 'Chance Calculator',
      description: 'Analyze your chances',
      feature: 'calculator' as Feature,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: School,
      label: 'College Matcher',
      description: 'Find your fit',
      feature: 'matcher' as Feature,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="ai" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </TabsTrigger>
        <TabsTrigger value="level" className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline">Level {userLevel}</span>
        </TabsTrigger>
        <TabsTrigger value="community" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Community</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ai">
        <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Chat Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Synq AI</span>
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Your smart admissions buddy</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Interface */}
        {activeFeature === 'chat' && (
          <Card className="glass-card">
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Ask me anything about college admissions..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Essay Review Interface */}
        {activeFeature === 'essay' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Essay Review</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your essay here for detailed feedback..."
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              <div className="flex items-center justify-between">
                <Badge variant="secondary">
                  {essayText.split(' ').filter(w => w).length} words
                </Badge>
                <Button
                  onClick={handleEssayReview}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Review Essay
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calculator Interface */}
        {activeFeature === 'calculator' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-purple-500" />
                <span>Admission Chance Calculator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">GPA (4.0 scale)</label>
                  <Input type="number" placeholder="3.8" step="0.1" max="4.0" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">SAT Score</label>
                  <Input type="number" placeholder="1450" max="1600" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">AP Classes</label>
                  <Input type="number" placeholder="5" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Extracurriculars</label>
                  <Input type="number" placeholder="3" />
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MIT</span>
                  <Badge className="bg-green-500">High Match</Badge>
                </div>
                <Progress value={75} className="h-3" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stanford</span>
                  <Badge className="bg-yellow-500">Target</Badge>
                </div>
                <Progress value={60} className="h-3" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Harvard</span>
                  <Badge className="bg-orange-500">Reach</Badge>
                </div>
                <Progress value={40} className="h-3" />
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                onClick={() => {
                  toast({
                    title: "Analysis Complete!",
                    description: "Your admission chances have been calculated.",
                  });
                  addXP(20, 'Used Chance Calculator');
                }}
              >
                <BarChart className="w-4 h-4 mr-2" />
                Calculate My Chances
              </Button>
            </CardContent>
          </Card>
        )}

        {/* College Matcher Interface */}
        {activeFeature === 'matcher' && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <School className="w-5 h-5 text-orange-500" />
                <span>College Matcher</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Preferred Major</label>
                  <Input placeholder="Computer Science" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Location Preference</label>
                  <Input placeholder="California, USA" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Range</label>
                  <Input placeholder="$40,000 - $60,000/year" />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <h4 className="font-semibold text-sm">Top Matches:</h4>
                {['Stanford University', 'UC Berkeley', 'UCLA'].map((college, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">{college}</span>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      {95 - i * 5}% Match
                    </Badge>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                onClick={() => {
                  toast({
                    title: "Matches Found!",
                    description: "We've found 15 colleges that match your preferences.",
                  });
                  addXP(15, 'Used College Matcher');
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Find More Matches
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.feature}
                variant={activeFeature === action.feature ? "default" : "outline"}
                className={`w-full justify-start ${
                  activeFeature === action.feature 
                    ? `bg-gradient-to-r ${action.color} text-white` 
                    : ''
                }`}
                onClick={() => setActiveFeature(action.feature)}
              >
                <action.icon className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Saved Reports */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Saved Reports</span>
              <Badge variant="secondary">3</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['Essay Feedback - MIT', 'Chance Analysis', 'College Matches'].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm">{report}</span>
                </div>
                <Button size="icon" variant="ghost">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Stats */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Your AI Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Conversations</span>
              <Badge className="bg-blue-500">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Essays Reviewed</span>
              <Badge className="bg-purple-500">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">XP Earned</span>
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                +250 XP
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
      </TabsContent>

      <TabsContent value="level">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-primary" />
                  Level {userLevel} - College Explorer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progress to Level {userLevel + 1}</span>
                    <span className="text-sm text-primary">{userXP % 500} / 500 XP</span>
                  </div>
                  <Progress value={(userXP % 500) / 5} className="h-3 progress-glow" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-card rounded-lg">
                    <p className="text-3xl font-bold text-primary">{userXP}</p>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-card rounded-lg">
                    <p className="text-3xl font-bold text-secondary">{userLevel}</p>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-card rounded-lg">
                    <p className="text-3xl font-bold text-accent">15</p>
                    <p className="text-sm text-muted-foreground">Achievements</p>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="font-semibold mb-4">Recent XP Gains</h4>
                  <div className="space-y-3">
                    {[
                      { action: 'Used Synq AI', xp: 10, time: '2 hours ago' },
                      { action: 'Completed Essay Review', xp: 25, time: '1 day ago' },
                      { action: 'Used College Matcher', xp: 15, time: '2 days ago' },
                      { action: 'Used Chance Calculator', xp: 20, time: '3 days ago' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge className="bg-gradient-primary text-white">
                          +{activity.xp} XP
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: '🎯', name: 'First Steps', desc: 'Created your profile', unlocked: true },
                  { icon: '✍️', name: 'Essay Master', desc: 'Reviewed 5 essays', unlocked: true },
                  { icon: '🎓', name: 'Scholar', desc: 'Applied to 10 colleges', unlocked: false },
                  { icon: '💰', name: 'Fund Hunter', desc: 'Applied to 5 scholarships', unlocked: false },
                ].map((achievement, i) => (
                  <div key={i} className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-gradient-primary/10' : 'bg-muted opacity-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                      </div>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="text-xs">✓</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Level Rewards</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Keep earning XP to unlock premium features and rewards!
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Level 10</Badge>
                    <span className="text-muted-foreground">Premium AI Features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Level 15</Badge>
                    <span className="text-muted-foreground">Priority Mentor Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Level 20</Badge>
                    <span className="text-muted-foreground">Exclusive Scholarships</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="community">
        <CommunitySection />
      </TabsContent>
    </Tabs>
  );
};

export default SynqAI;
