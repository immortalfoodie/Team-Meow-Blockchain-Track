#!/bin/bash

echo ""
echo "====================================="
echo " Evidence Chain - Full Stack Setup"
echo "====================================="
echo ""

echo "Checking if dependencies are installed..."
echo ""

if [ ! -d "meow-backend/backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd meow-backend/backend
    npm install
    cd ../..
    echo ""
fi

if [ ! -d "Team-Meow-Blockchain-Track-frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd Team-Meow-Blockchain-Track-frontend
    npm install
    cd ..
    echo ""
fi

echo "====================================="
echo "Ready to start the application!"
echo "====================================="
echo ""
echo "To start the backend, run:"
echo "  cd meow-backend/backend"
echo "  npm start"
echo ""
echo "To start the frontend, run:"
echo "  cd Team-Meow-Blockchain-Track-frontend"
echo "  npm run dev"
echo ""
echo "Frontend will be available at:"
echo "  http://localhost:5173"
echo ""
echo "Backend will be running on:"
echo "  http://localhost:5000"
echo ""
