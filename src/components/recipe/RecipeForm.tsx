
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import CameraComponent from '@/components/CameraComponent';
import { useToast } from '@/hooks/use-toast';
import { RecipeService } from '@/services/api';
import { recipeSchema, RecipeFormValues, recipeCategories } from './RecipeFormSchema';

interface RecipeFormProps {
  onSubmitSuccess: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmitSuccess }) => {
  const [recipeImage, setRecipeImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      ingredients: '',
      instructions: '',
      category: '',
      ingredientList: [{ name: '' }],
    },
  });

  // Setup field array for ingredients
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredientList",
  });

  const handleImageCapture = (file: File) => {
    setRecipeImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setRecipeImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: RecipeFormValues) => {
    console.log("Form submitted with data:", data);
    
    try {
      setIsSubmitting(true);
      
      // Format ingredients from array if using ingredientList
      const ingredientsText = data.ingredientList
        .filter(item => item.name.trim() !== '')
        .map(item => item.name.trim())
        .join('\n');
      
      // Create FormData for sending the image
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('ingredients', ingredientsText);
      formData.append('instructions', data.instructions);
      formData.append('category', data.category);
      
      if (recipeImage) {
        formData.append('image', recipeImage);
      } else {
        toast({
          variant: "destructive",
          title: "Image required",
          description: "Please add a photo of your recipe",
        });
        setIsSubmitting(false);
        return;
      }
      
      console.log("Sending form data to API:", {
        title: data.title,
        ingredients: ingredientsText,
        instructions: data.instructions,
        category: data.category,
        image: recipeImage.name
      });
      
      // Send to API
      await RecipeService.createRecipe(formData);
      
      toast({
        title: "Recipe added!",
        description: "Your recipe has been successfully added.",
      });
      
      // Call the onSubmitSuccess callback
      onSubmitSuccess();
      
    } catch (error: any) {
      console.error('Error adding recipe:', error);
      toast({
        variant: "destructive",
        title: "Failed to add recipe",
        description: error.message || "There was a problem adding your recipe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIngredient = () => {
    append({ name: '' });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter recipe name" 
                  {...field} 
                  className="custom-input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="custom-input">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {recipeCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Ingredients</FormLabel>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addIngredient}
              className="flex items-center gap-1 text-spice"
            >
              <Plus className="h-4 w-4" /> Add Ingredient
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`ingredientList.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input 
                        placeholder="e.g. 2 cups flour"
                        {...field} 
                        className="custom-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cooking Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Explain how to prepare the recipe" 
                  {...field} 
                  className="custom-input min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel className="block mb-2">Recipe Photo</FormLabel>
          <CameraComponent 
            onImageCapture={handleImageCapture}
            onClear={clearImage}
            previewUrl={previewUrl || undefined}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-spice hover:bg-spice-dark mt-8" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Recipe...
            </>
          ) : (
            'Add Recipe'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RecipeForm;
