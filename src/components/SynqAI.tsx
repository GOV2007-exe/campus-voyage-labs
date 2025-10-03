import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, Send, FileText, Calculator, School, 
  Sparkles, BookOpen, TrendingUp, Download, 
  MessageCircle, Mic, Paperclip, BarChart 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useXP } from "@/hooks/useXP";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { addXP } = useXP();

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
    
    if (lowerQuery.includes('essay')) {
      return "I'd be happy to help with your essay! Please use the 'Essay Review' feature to upload or paste your essay. I'll provide detailed feedback on structure, content, grammar, and overall impact.";
    } else if (lowerQuery.includes('college') || lowerQuery.includes('university')) {
      return "For college recommendations, try the 'College Matcher' feature! I'll ask about your preferences, academic profile, and goals to suggest the best-fit universities for you.";
    } else if (lowerQuery.includes('chance') || lowerQuery.includes('admission')) {
      return "Want to know your admission chances? Use the 'Chance Calculator' feature where you can input your GPA, test scores, and extracurriculars. I'll analyze your profile and provide realistic estimates!";
    } else {
      return "That's a great question! I'm here to help with college admissions. You can ask me about essay writing tips, college selection strategies, application timelines, or use my specialized features for detailed analysis.";
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
  );
};

export default SynqAI;
