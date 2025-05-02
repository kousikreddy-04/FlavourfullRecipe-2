
import React from 'react';

const PageFooter = () => {
  return (
    <footer className="bg-curry-dark text-white py-8 mt-12">
  <div className="container px-4 mx-auto">
    <div className="flex flex-col items-center text-center space-y-2">
      <img src="https://i.pinimg.com/736x/da/93/2f/da932f71cfaba410f0b646a4b911719e.jpg" className="h-auto w-36 mb-4"/>
      <h3 className="text-xl font-bold">
        Flavourful<span className="font-normal">Recipes</span></h3>
      <p className="text-sm text-gray-300">
        Delicious recipes at your fingertips.</p>
      <p className="text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Flavourful Recipes. All rights reserved.</p>
    </div>
  </div>
</footer>

  );
};

export default PageFooter;
