
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import RecipeDialog from '@/components/RecipeDialog';
import { RecipeService } from '@/services/api';
import { Recipe } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import PageFooter from '@/components/layout/PageFooter';
import { useAuth } from '@/contexts/AuthContext';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Parse search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');
    
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [location.search]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      setSearched(true);
      
      const searchResults = await RecipeService.searchExternalRecipes(searchTerm);
      setResults(searchResults);
      
    } catch (error) {
      console.error('Error searching recipes:', error);
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "We couldn't find any recipes. Please try again.",
      });
      
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Update URL with search query for shareable links
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    performSearch(query);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDialogOpen(true);
  };

  const closeRecipeDialog = () => {
    setDialogOpen(false);
    setSelectedRecipe(null);
  };

  // Check if a recipe belongs to the current user
  const isUserRecipe = (recipe: Recipe) => {
    return isAuthenticated && user && recipe.created_by === user.id;
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await RecipeService.deleteRecipe(id);
      setResults(results.filter(recipe => recipe.id !== id));
      toast({
        title: "Recipe deleted",
        description: "Your recipe has been successfully deleted.",
      });
    } catch (err: any) {
      console.error('Error deleting recipe:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete recipe. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-curry-dark mb-4">Search Recipes</h1>
            <p className="text-gray-600">
              Discover delicious recipes from our extensive collection
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by dish name, ingredient, or category..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 rounded-md border-gray-300"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-spice hover:bg-spice-dark"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
          </form>
          
          {/* Search Results */}
          {searched && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-spice" />
                </div>
              ) : results.length > 0 ? (
                <>
                  <h2 className="text-xl font-bold text-curry-dark mb-6">
                    Search Results ({results.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((recipe) => (
                      <div 
                        key={recipe.id} 
                        onClick={() => handleRecipeClick(recipe)}
                        className="cursor-pointer transform transition-transform hover:scale-105"
                      >
                        <RecipeCard 
                          recipe={recipe} 
                          isUserRecipe={isUserRecipe(recipe)}
                          onDelete={handleDeleteRecipe}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Results Found</h3>
                  <p className="text-gray-500 mb-6">
                    Try a different search term or browse our recipe collection
                  </p>
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                  >
                    Browse All Recipes
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Recipe Dialog */}
          <RecipeDialog 
            recipe={selectedRecipe} 
            isOpen={dialogOpen} 
            onClose={closeRecipeDialog} 
          />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default SearchPage;
