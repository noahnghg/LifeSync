#!/bin/bash

echo "🐳 LifeSync Docker Health Check"
echo "================================"

# Check if containers are running
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🌐 Service Health:"

# Check backend health
echo -n "Backend API: "
if curl -s http://localhost:5001/ > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

# Check frontend
echo -n "Frontend: "
if curl -s http://localhost:8080/ > /dev/null; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

# Check MongoDB
echo -n "MongoDB: "
if docker-compose exec -T mongodb mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not responding"
fi

echo ""
echo "🔗 Access URLs:"
echo "Frontend: http://localhost:8080"
echo "Backend API: http://localhost:5001"
echo ""
echo "👤 Test Account:"
echo "Email: john.doe@example.com"
echo "Password: password123"
