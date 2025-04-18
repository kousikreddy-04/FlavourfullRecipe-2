
import React, { useState } from 'react';
import { Recipe } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Trash2, Heart, ChefHat } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RecipeCardProps {
  recipe: Recipe;
  isUserRecipe?: boolean;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  isUserRecipe = false,
  onDelete,
  showActions = false,
  onClick
}) => {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click
    setIsLiked(!isLiked);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click
    if (onDelete && recipe.id) {
      onDelete(recipe.id.toString());  // Ensure we're passing a string
    }
  };

  // Format ingredients to display as list
  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split('\n').filter(i => i.trim().length > 0)
    : [];

  return (
    <Card className="recipe-card h-full flex flex-col">
      <div className="recipe-image-container">
        <img 
          src={recipe.image_url || '/placeholder.svg'} 
          alt={recipe.title} 
          className="recipe-image"
        />
        {isUserRecipe && (
          <div className="absolute top-2 right-2 bg-turmeric rounded-full p-1">
            <ChefHat className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <CardContent className="recipe-card-content flex-grow">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {ingredientsList.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-curry font-medium mb-1">INGREDIENTS:</p>
            <ul className="ingredient-list">
              {ingredientsList.slice(0, 3).map((ingredient, idx) => (
                <li key={idx} className="truncate">{ingredient}</li>
              ))}
              {ingredientsList.length > 3 && (
                <li className="text-curry text-xs">+ {ingredientsList.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-4 px-4">
        <Button 
          variant="ghost" 
          size="sm"
          className="p-0 hover:text-spice"
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-spice text-spice' : ''}`} />
        </Button>
        
        {isAuthenticated && showActions && onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-sm px-2"
                onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  recipe "{recipe.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
