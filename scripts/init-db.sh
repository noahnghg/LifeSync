#!/bin/bash

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until mongosh --host mongodb:27017 --username admin --password password123 --authenticationDatabase admin --eval "print('MongoDB is ready')" >/dev/null 2>&1; do
  sleep 2
done

echo "MongoDB is ready! Initializing database..."

# Run the initialization script
python3 /app/init_user_db.py

echo "Database initialization completed!"
