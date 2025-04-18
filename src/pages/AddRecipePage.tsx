
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeService } from '@/services/api';
import Navbar from '@/components/Navbar';
import PageFooter from '@/components/layout/PageFooter';
import RecipeForm from '@/components/recipe/RecipeForm';
import RecipeFormHeader from '@/components/recipe/RecipeFormHeader';

const AddRecipePage = () => {
  const navigate = useNavigate();

  const handleSubmitSuccess = () => {
    // Redirect to home page
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <RecipeFormHeader />
          <RecipeForm 
            onSubmitSuccess={handleSubmitSuccess} 
          />
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default AddRecipePage;
