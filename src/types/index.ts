
import { Session } from '@supabase/supabase-js';

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string;
  instructions: string;
  image_url: string;
  created_by?: string;
  created_at?: string;
  category?: string; // Added category field
}

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export interface TheMealDBRecipe {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  // and many more properties from the API
}

export interface TheMealDBResponse {
  meals: TheMealDBRecipe[] | null;
}

export interface AuthResponse {
  token: string;
  user: User;
  session: Session;
}
