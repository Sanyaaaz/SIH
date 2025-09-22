#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React application
echo "Building React application..."
npm run build

# Make the script executable
echo "Setup complete!"
echo ""
echo "To start the server, run: npm run server"
echo "The application will be available at http://localhost:3000"