
import React from 'react';
import { Recipe } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Clock, Tag, User } from 'lucide-react';

interface RecipeDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDialog: React.FC<RecipeDialogProps> = ({ recipe, isOpen, onClose }) => {
  if (!recipe) return null;

  // Format ingredients as an array
  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split('\n').filter(i => i.trim().length > 0)
    : [];

  // Format instructions as an array (in case they're separated by new lines)
  const instructionsList = recipe.instructions
    ? recipe.instructions.split('\n').filter(i => i.trim().length > 0)
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl text-curry-dark">{recipe.title}</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Added on {new Date(recipe.created_at || new Date()).toLocaleDateString()}
            </div>
            
            {recipe.category && (
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <span className="px-2 py-0.5 bg-turmeric-light text-curry-dark rounded-full text-xs">
                  {recipe.category}
                </span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-12rem)] pr-4 mt-4">
          <div className="space-y-6">
            {/* Recipe image - constrained height */}
            {recipe.image_url && (
              <div className="rounded-md overflow-hidden max-h-[250px] bg-gray-100">
                <img 
                  src={recipe.image_url || '/placeholder.svg'} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold text-curry-dark mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-spice" />
                Ingredients
              </h3>
              <ul className="space-y-2 pl-2">
                {ingredientsList.map((ingredient, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-turmeric mt-1.5 mr-2"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Instructions - More prominence for readability */}
            <div>
              <h3 className="text-lg font-semibold text-curry-dark mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-spice" />
                Instructions
              </h3>
              <div className="space-y-4 text-base">
                {instructionsList.length > 0 ? (
                  instructionsList.map((instruction, idx) => (
                    <div key={idx} className="instruction-step bg-gray-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-curry-light text-white flex items-center justify-center mr-3 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="flex-1">{instruction}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="bg-gray-50 p-3 rounded-md">{recipe.instructions}</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
