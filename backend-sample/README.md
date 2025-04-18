
# Recipe Book Website - Backend

This directory contains the backend code and database setup for the Recipe Book Website.

## Setup Instructions

### 1. Database Setup

You need to have MySQL installed on your system. Then, you can set up the database using the provided SQL script:

```bash
mysql -u root -p < database-setup.sql
```

Or you can manually run the commands from `database-setup.sql` in your MySQL client.

### 2. Environment Variables

Create a `.env` file in the backend-sample directory with the following variables:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=recipe_book
JWT_SECRET=your_jwt_secret_key
EDAMAM_APP_ID=af2cfdf7
EDAMAM_APP_KEY=4af72bfd8185c41b364f654af9c1817c
```

Replace `your_mysql_password` with your actual MySQL password and `your_jwt_secret_key` with a secure random string.

### 3. Install Dependencies

Navigate to the backend-sample directory and install the required Node.js packages:

```bash
cd backend-sample
npm install express cors mysql2 bcrypt jsonwebtoken multer dotenv
```

### 4. Start the Server

Run the server:

```bash
node server.js
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get a specific recipe
- `POST /api/recipes` - Add a new recipe (requires authentication)
- `DELETE /api/recipes/:id` - Delete a recipe (requires authentication)

### Edamam API
- `GET /api/edamam/search?query=chicken` - Search recipes via Edamam API

## Notes for Development

- The server uses JWT for authentication
- Images are stored in the 'uploads' directory
- The database has two main tables: 'users' and 'recipes'

## XAMPP / MySQL Server Connection

To connect to a XAMPP MySQL server or standalone MySQL server:

1. Make sure your MySQL server is running
2. Update the `.env` file with your MySQL credentials
3. The backend will automatically create the necessary tables if they don't exist

For any issues with database connection, check:
- MySQL server is running
- Credentials in `.env` file are correct
- Database 'recipe_book' exists (it will be created if using the SQL script)
