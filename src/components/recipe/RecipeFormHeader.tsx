
import React from 'react';
import { Utensils } from 'lucide-react';

const RecipeFormHeader = () => {
  return (
    <div className="text-center mb-8">
      <Utensils className="h-12 w-12 text-spice mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-curry-dark">Add New Recipe</h1>
      <p className="text-gray-600 mt-2">Share your culinary creation with the community</p>
    </div>
  );
};

export default RecipeFormHeader;
