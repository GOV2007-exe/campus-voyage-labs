import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    type: 'offer',
    category: 'tutoring',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    loadListings();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
    }
  };

  const loadListings = async () => {
    try {
      const { data } = await supabase
        .from('marketplace_listings')
        .select(`
          *,
          profiles (username, full_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const createListing = async () => {
    if (!newListing.title || !newListing.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('marketplace_listings')
        .insert({
          user_id: user.id,
          title: newListing.title,
          description: newListing.description,
          listing_type: newListing.type,
          category: newListing.category,
        });

      if (error) throw error;

      toast({
        title: "Listing created!",
        description: "Your listing is now live.",
      });

      setShowForm(false);
      setNewListing({ title: '', description: '', type: 'offer', category: 'tutoring' });
      loadListings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offerListings = filteredListings.filter(l => l.listing_type === 'offer');
  const needListings = filteredListings.filter(l => l.listing_type === 'need');

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Peer Exchange Marketplace</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            New Listing
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Create Listing Form */}
        {showForm && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Create New Listing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Title (e.g., Python Tutoring Available)"
                value={newListing.title}
                onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newListing.description}
                onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
              />
              <div className="flex gap-2">
                <Button
                  variant={newListing.type === 'offer' ? 'default' : 'outline'}
                  onClick={() => setNewListing({ ...newListing, type: 'offer' })}
                >
                  Offering
                </Button>
                <Button
                  variant={newListing.type === 'need' ? 'default' : 'outline'}
                  onClick={() => setNewListing({ ...newListing, type: 'need' })}
                >
                  Looking For
                </Button>
              </div>
              <Button onClick={createListing} className="w-full">Create Listing</Button>
            </CardContent>
          </Card>
        )}

        {/* Listings */}
        <Tabs defaultValue="offers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="offers">Offers ({offerListings.length})</TabsTrigger>
            <TabsTrigger value="needs">Looking For ({needListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-4 mt-4">
            {offerListings.map((listing) => (
              <Card key={listing.id} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <Badge className="bg-green-500">Offering</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{listing.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>@{listing.profiles?.username}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="needs" className="space-y-4 mt-4">
            {needListings.map((listing) => (
              <Card key={listing.id} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{listing.title}</h3>
                    <Badge className="bg-blue-500">Looking For</Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{listing.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>@{listing.profiles?.username}</span>
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

export default Marketplace;