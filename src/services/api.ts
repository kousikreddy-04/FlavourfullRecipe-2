
import axios from 'axios';
import { Recipe } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const THEMEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1';

export const RecipeService = {
  // Get all recipes from Supabase
  getAllRecipes: async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  // Get recipe by ID
  getRecipeById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  },

  // Create new recipe
  createRecipe: async (recipeData: FormData) => {
    try {
      // Extract recipe data
      const title = recipeData.get('title') as string;
      const ingredients = recipeData.get('ingredients') as string;
      const instructions = recipeData.get('instructions') as string;
      const category = recipeData.get('category') as string;
      
      console.log("Recipe data being submitted:", { 
        title, 
        ingredients: ingredients.substring(0, 50) + "...", 
        instructions: instructions.substring(0, 50) + "...",
        category
      });
      
      // Handle the image file
      const imageFile = recipeData.get('image') as File;
      let imageUrl = '';
      
      if (!imageFile || imageFile.size === 0) {
        throw new Error('Recipe image is required');
      }
      
      console.log("Uploading image:", imageFile.name, "Size:", imageFile.size);
      
      // Generate a unique filename
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, imageFile);
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);
        
      imageUrl = publicUrl;
      console.log("Image uploaded successfully, URL:", imageUrl);
      
      // Get current user ID or use anonymous if not logged in
      let userId = null;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
        console.log("Authenticated user ID:", userId);
      } catch (authError) {
        console.error("Authentication error:", authError);
        // If not authenticated, try to create the recipe anyway
        // (will succeed if RLS policies allow anonymous inserts)
      }
      
      if (!userId) {
        throw new Error('You must be logged in to add a recipe');
      }
      
      console.log("Creating recipe with user ID:", userId);
      
      // Insert the recipe
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          title,
          ingredients,
          instructions,
          image_url: imageUrl,
          category,
          created_by: userId
        })
        .select();
        
      if (error) {
        console.error("Recipe insert error:", error);
        throw error;
      }
      
      console.log("Recipe created successfully:", data);
      return data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  // Delete recipe
  deleteRecipe: async (id: string) => {
    try {
      // First check if the user is the creator of the recipe
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data: recipe, error: fetchError } = await supabase
        .from('recipes')
        .select('created_by')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Only allow deletion if the user is the creator
      if (recipe.created_by !== user.id) {
        throw new Error('You can only delete recipes that you created');
      }
      
      // Now delete the recipe
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  },

  // Search recipes from TheMealDB API
  searchExternalRecipes: async (query: string) => {
    try {
      // First try searching by name
      const response = await axios.get(`${THEMEALDB_API_URL}/search.php?s=${query}`);
      
      // Check for valid results
      if (response.data && response.data.meals) {
        return response.data.meals.map((meal: any) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          ingredients: formatTheMealDBIngredients(meal),
          instructions: meal.strInstructions,
          image_url: meal.strMealThumb,
          created_at: new Date().toISOString(),
          category: meal.strCategory || 'Other',
        }));
      }
      
      // If no results, try searching by main ingredient
      const ingredientResponse = await axios.get(`${THEMEALDB_API_URL}/filter.php?i=${query}`);
      
      if (ingredientResponse.data && ingredientResponse.data.meals) {
        // For ingredient search, we only get basic info, so get details for each meal
        const detailedMeals = await Promise.all(
          ingredientResponse.data.meals.slice(0, 10).map(async (meal: any) => { // Limit to 10 results for performance
            try {
              const detailResponse = await axios.get(`${THEMEALDB_API_URL}/lookup.php?i=${meal.idMeal}`);
              if (detailResponse.data && detailResponse.data.meals && detailResponse.data.meals.length > 0) {
                const detailedMeal = detailResponse.data.meals[0];
                return {
                  id: detailedMeal.idMeal,
                  title: detailedMeal.strMeal,
                  ingredients: formatTheMealDBIngredients(detailedMeal),
                  instructions: detailedMeal.strInstructions,
                  image_url: detailedMeal.strMealThumb,
                  created_at: new Date().toISOString(),
                  category: detailedMeal.strCategory || 'Other',
                };
              }
              return null;
            } catch (error) {
              console.error('Error fetching meal details:', error);
              return null;
            }
          })
        );
        
        // Filter out any null results from failed requests
        return detailedMeals.filter(meal => meal !== null);
      }
      
      // If we still have no results, check if Supabase has any matching recipes
      const { data: localRecipes, error: localError } = await supabase
        .from('recipes')
        .select('*')
        .or(`title.ilike.%${query}%,ingredients.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false });
        
      if (localError) throw localError;
      
      if (localRecipes && localRecipes.length > 0) {
        return localRecipes;
      }
      
      return [];
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  },
};

// Helper function to format TheMealDB ingredients into our format
function formatTheMealDBIngredients(meal: any): string {
  const ingredients: string[] = [];
  
  // TheMealDB stores ingredients as strIngredient1, strIngredient2, etc.
  // and measurements as strMeasure1, strMeasure2, etc.
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      const formattedIngredient = measure && measure.trim() !== '' 
        ? `${measure} ${ingredient}`
        : ingredient;
        
      ingredients.push(formattedIngredient);
    }
  }
  
  return ingredients.join('\n');
}

export default RecipeService;
