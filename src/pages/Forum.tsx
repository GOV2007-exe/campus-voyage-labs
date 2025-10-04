import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const supportTags = [
  'Exam Stress',
  'Friendship Issues',
  'Motivation',
  'Time Management',
  'College Applications',
  'Mental Health',
  'Study Tips',
  'General Support',
];

const Forum = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTag, setSelectedTag] = useState('General Support');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadPosts();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
    }
  };

  const loadPosts = async () => {
    try {
      const { data } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles (username, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          content: newPost,
          support_tag: selectedTag,
          is_anonymous: isAnonymous,
        });

      if (error) throw error;

      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });

      setNewPost('');
      loadPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const likePost = async (postId: string) => {
    try {
      // Find the post
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const { error } = await supabase
        .from('forum_posts')
        .update({ likes_count: post.likes_count + 1 })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post liked!",
        description: "You showed support for this post.",
      });

      loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Peer Support Forum</h1>
        <p className="text-muted-foreground">
          Share your thoughts, ask questions, and support fellow students. All posts can be anonymous.
        </p>

        {/* Create Post */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Share with the Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share your thoughts, questions, or experiences..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex gap-4">
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={isAnonymous ? 'default' : 'outline'}
                onClick={() => setIsAnonymous(!isAnonymous)}
              >
                {isAnonymous ? 'Anonymous' : 'Show Username'}
              </Button>
            </div>
            <Button onClick={createPost} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Post
            </Button>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="glass-card hover-lift">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">
                      {post.is_anonymous ? 'Anonymous Student' : `@${post.profiles?.username}`}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {post.support_tag}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-sm leading-relaxed">{post.content}</p>

                <div className="flex items-center gap-4 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likePost(post.id)}
                  >
                    ❤️ {post.likes_count}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.replies_count}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;