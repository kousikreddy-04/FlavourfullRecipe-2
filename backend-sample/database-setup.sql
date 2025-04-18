
-- Database setup for Recipe Book Website

-- Create database
CREATE DATABASE IF NOT EXISTS recipe_book;
USE recipe_book;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  ingredients TEXT NOT NULL,
  instructions TEXT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Sample data (optional)
-- Insert sample user (password: password123)
INSERT INTO users (name, email, password_hash) VALUES 
('John Doe', 'john@example.com', '$2b$10$XVrIhl.5.9QHjB4XYhDk0ue1uFyXkY8o0MZ1uNsdQ5WM9JhEWvky.');

-- Insert sample recipes
INSERT INTO recipes (title, ingredients, instructions, image_url, created_by) VALUES 
('Butter Chicken', 'Chicken breast: 500g\nYogurt: 1 cup\nButter: 4 tbsp\nTomato paste: 2 tbsp\nHeavy cream: 1/2 cup\nGaram masala: 2 tsp\nTurmeric: 1 tsp\nCumin: 1 tsp\nCoriander: 1 tsp\nSalt and pepper to taste', 'Marinate chicken in yogurt and spices for at least 1 hour.\nCook chicken in a pan until browned.\nAdd butter and tomato paste, cook for 5 minutes.\nAdd cream and simmer for 15 minutes.\nServe with rice or naan.', 'https://example.com/images/butter-chicken.jpg', 1),

('Vegetable Biryani', 'Basmati rice: 2 cups\nMixed vegetables: 2 cups\nYogurt: 1 cup\nOnions: 2 large\nGinger-garlic paste: 2 tbsp\nBiryani masala: 2 tbsp\nTurmeric: 1 tsp\nSaffron: a pinch\nGhee: 3 tbsp\nMint leaves: 1/4 cup\nCilantro: 1/4 cup', 'Soak rice for 30 minutes, then par-boil.\nSauté onions until golden, add ginger-garlic paste.\nAdd vegetables and spices, cook for 5 minutes.\nLayer rice and vegetable mixture in a pot.\nCook on low heat for 20 minutes.\nGarnish with mint and cilantro.', 'https://example.com/images/veg-biryani.jpg', 1);
