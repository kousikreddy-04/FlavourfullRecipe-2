
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, LogIn, PlusCircle, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-bold text-xl text-spice">Flavourful</span>
            <span className="font-medium text-curry-dark">Recipes</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 focus-visible:ring-spice-light"
                />
                <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="sm"
                  className="absolute right-1"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" className={location.pathname === '/' ? 'text-spice' : ''}>
                  <Home className="h-4 w-4 mr-1" /> Home
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/add-recipe">
                    <Button variant="ghost" className={location.pathname === '/add-recipe' ? 'text-spice' : ''}>
                      <PlusCircle className="h-4 w-4 mr-1" /> Add Recipe
                    </Button>
                  </Link>
                  <UserMenu />
                </>
              ) : (
                <Link to="/login">
                  <Button variant="default" className="bg-spice hover:bg-spice-dark">
                    <LogIn className="h-4 w-4 mr-1" /> Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              variant="ghost" 
              size="sm"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-3 px-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm"
              className="absolute right-1 top-0.5"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={`block p-2 rounded-md ${location.pathname === '/' ? 'bg-secondary text-spice' : ''}`}
            >
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Home
              </div>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/add-recipe" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block p-2 rounded-md ${location.pathname === '/add-recipe' ? 'bg-secondary text-spice' : ''}`}
                >
                  <div className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Recipe
                  </div>
                </Link>
                <Button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }} 
                  variant="ghost"
                  className="w-full justify-start p-2"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="block"
              >
                <Button 
                  variant="default" 
                  className="w-full justify-start bg-spice hover:bg-spice-dark"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
