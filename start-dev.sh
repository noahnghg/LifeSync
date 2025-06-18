#!/bin/bash

# Mindful Living Platform - Development Startup Script

echo "🚀 Starting Mindful Living Platform..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    brew services start mongodb/brew/mongodb-community
    sleep 2
else
    echo "✅ MongoDB already running"
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend
echo "🔧 Starting Flask backend..."
cd mindful-living-backend
python3 app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend
echo "⚡ Starting React frontend..."
cd mindful-living-central
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Servers started successfully!"
echo ""
echo "📍 Frontend: http://localhost:8080"
echo "📍 Backend:  http://127.0.0.1:5000"
echo "📍 MongoDB:  mongodb://localhost:27017"
echo ""
echo "💡 Press Ctrl+C to stop all services"
echo ""

# Wait for services
wait
