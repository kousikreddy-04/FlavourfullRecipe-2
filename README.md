
# Tasty Indian Kitchen
#Website Link https://flovourfull-recipes.netlify.app/
## Prerequisites
- Node.js (v18 or later)
- npm or yarn

## Local Setup

1. Clone the repository
```bash
git clone https://your-repo-url.git
cd tasty-indian-kitchen
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Copy `.env.example` to `.env`
- Fill in your Supabase project URL and anon key

4. Run the development server
```bash
npm run dev
```

5. Open `http://localhost:5173` in your browser

## Deployment Notes
- Ensure Supabase storage bucket 'recipe-images' is created
- Set up authentication and storage policies as per project configuration

## Troubleshooting
- Check console for any error messages
- Verify Supabase credentials
- Ensure all dependencies are installed
