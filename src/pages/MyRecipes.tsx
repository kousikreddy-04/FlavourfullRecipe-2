
import { useQuery } from '@tanstack/react-query';
import RecipeCard from '@/components/RecipeCard';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const MyRecipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: recipes, isLoading, refetch } = useQuery({
    queryKey: ['my-recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching recipes",
          description: error.message
        });
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        .eq('created_by', user?.id);

      if (error) throw error;

      toast({
        title: "Recipe deleted",
        description: "Your recipe has been successfully deleted."
      });

      // Refresh the recipes list
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting recipe",
        description: error.message
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Recipes</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : recipes?.length === 0 ? (
          <div className="text-center text-gray-500">
            You haven't added any recipes yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes?.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isUserRecipe={true}
                showActions={true}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRecipes;
