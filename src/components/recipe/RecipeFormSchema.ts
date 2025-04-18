
import * as z from 'zod';

// Ingredient schema
const ingredientSchema = z.object({
  name: z.string().min(1, { message: 'Ingredient cannot be empty' }),
});

// Form schema validation
export const recipeSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  ingredients: z.string().optional(),
  ingredientList: z.array(ingredientSchema),
  instructions: z.string().min(20, { message: 'Instructions should be detailed (minimum 20 characters)' }),
  category: z.string().min(1, { message: 'Please select a category' }),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

// Array of recipe categories
export const recipeCategories = [
  "Vegetarian", 
  "Non-Vegetarian", 
  "Vegan", 
  "Gluten-Free", 
  "Italian", 
  "Chinese", 
  "Mexican",
  "Indian", 
  "Thai", 
  "Japanese", 
  "Mediterranean",
  "South Indian", 
  "North Indian", 
  "Dessert",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack"
];
