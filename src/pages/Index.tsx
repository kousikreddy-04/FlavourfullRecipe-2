
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RecipeCard from '@/components/RecipeCard';
import Navbar from '@/components/Navbar';
import { Recipe } from '@/types';
import { RecipeService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, ChefHat, Loader2 } from 'lucide-react';
import PageFooter from '@/components/layout/PageFooter';
import RecipeDialog from '@/components/RecipeDialog';

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await RecipeService.getAllRecipes();
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
        // Use mock data for development/demo
        setRecipes([
          {
            id: '1',
            title: 'Butter Chicken',
            ingredients: 'Chicken\nButter\nTomato\nCream\nSpices\nGaram Masala',
            instructions: 'Marinate chicken. Cook with spices. Add butter and cream.',
            image_url: 'https://source.unsplash.com/random/300x200/?butter-chicken',
            created_by: '1',
            created_at: '2025-04-13',
            category: 'Non-Vegetarian'
          },
          {
            id: '2',
            title: 'Vegetable Biryani',
            ingredients: 'Basmati Rice\nMixed Vegetables\nYogurt\nBiryani Masala\nSaffron\nGhee',
            instructions: 'Cook rice. Prepare vegetable mixture. Layer and steam together.',
            image_url: 'https://source.unsplash.com/random/300x200/?biryani',
            created_by: '1',
            created_at: '2025-04-13',
            category: 'Vegetarian'
          },
          {
            id: '3',
            title: 'Masala Dosa',
            ingredients: 'Rice\nUrad Dal\nPotatoes\nOnions\nMustard Seeds\nCurry Leaves',
            instructions: 'Ferment batter. Make potato filling. Cook thin crispy dosa.',
            image_url: 'https://source.unsplash.com/random/300x200/?dosa',
            created_by: '2',
            created_at: '2025-04-12',
            category: 'South Indian'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDeleteRecipe = async (id: string) => {
    try {
      await RecipeService.deleteRecipe(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-12 bg-gradient-to-b from-turmeric-light/30 to-gray-50 hero-pattern">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-spice-dark mb-4">
                Flavourful Recipes
              </h1>
              <p className="text-lg text-curry-dark mb-8">
                Explore traditional recipes, create your own culinary masterpieces, and share your favorite dishes with our community.
              </p>
              {isAuthenticated ? (
                <Link to="/add-recipe">
                  <Button className="bg-spice hover:bg-spice-dark">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Your Recipe
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button className="bg-spice hover:bg-spice-dark">
                    Sign In to Add Recipes
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
        
        {/* Recipes Grid */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-curry-dark">Latest Recipes</h2>
              <Link to="/search" className="text-spice hover:text-spice-dark font-medium">
                Browse All
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-spice" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Recipes Yet</h3>
                <p className="text-gray-500 mb-6">Be the first to add a delicious recipe!</p>
                {isAuthenticated ? (
                  <Link to="/add-recipe">
                    <Button className="bg-spice hover:bg-spice-dark">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Add Recipe
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button className="bg-spice hover:bg-spice-dark">
                      Sign In to Add Recipes
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
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
            )}
          </div>
        </section>
        
        {/* Recipe Dialog */}
        <RecipeDialog 
          recipe={selectedRecipe} 
          isOpen={dialogOpen} 
          onClose={closeRecipeDialog} 
        />
      </main>
      
      <PageFooter />
    </div>
  );
};

export default Index;
