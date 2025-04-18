
#!/bin/bash

# Create a clean project export directory
PROJECT_NAME="tasty-indian-kitchen"
EXPORT_DIR="$PROJECT_NAME-export"

# Remove any existing export directory
rm -rf "$EXPORT_DIR"

# Create a new directory
mkdir -p "$EXPORT_DIR"

# Copy entire project, excluding unnecessary files
rsync -av \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='.env' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  --exclude='export-project.sh' \
  . "$EXPORT_DIR"

# Create a default .env file with placeholders
cat > "$EXPORT_DIR/.env" << EOL
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Any other environment-specific configurations
NODE_ENV=development
EOL

# Zip the project
zip -r "$PROJECT_NAME.zip" "$EXPORT_DIR"

# Clean up export directory
rm -rf "$EXPORT_DIR"

echo "Project exported as $PROJECT_NAME.zip"
