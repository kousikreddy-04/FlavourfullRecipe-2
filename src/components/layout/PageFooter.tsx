
import React from 'react';

const PageFooter = () => {
  return (
    <footer className="bg-curry-dark text-white py-8 mt-12">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Flavourful<span className="font-normal">Recipes</span></h3>
            <p className="text-sm text-gray-300 mt-1">Delicious recipes at your fingertips.</p>
          </div>
          <div className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Flavourful Recipes. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
