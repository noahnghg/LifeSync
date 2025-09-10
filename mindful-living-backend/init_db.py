#!/usr/bin/env python3

import requests
import json
from datetime import datetime, timedelta

API_URL = 'http://127.0.0.1:5001'

def create_sample_life_blocks():
    """Create sample life blocks with content"""
    print("Creating sample life blocks...")
    
    # Sample Life Block: Recipe Collection
    recipe_block = {
        "name": "Recipe Collection",
        "description": "Organize favorite recipes and cooking notes",
        "icon": "🍳",
        "color": "bg-orange-500",
        "contentTypes": [
            {
                "name": "Recipe",
                "icon": "🍽️",
                "fields": [
                    {"name": "Recipe Name", "type": "text", "required": True},
                    {"name": "Ingredients", "type": "textarea", "required": True},
                    {"name": "Instructions", "type": "textarea", "required": True},
                    {"name": "Prep Time", "type": "number", "required": False},
                    {"name": "Difficulty", "type": "select", "required": False, "options": ["Easy", "Medium", "Hard"]},
                    {"name": "Tried", "type": "boolean", "required": False}
                ]
            }
        ]
    }
    
    # Create Recipe Collection
    try:
        response = requests.post(f'{API_URL}/life_blocks', json=recipe_block)
        if response.status_code == 201:
            recipe_data = response.json()
            print(f"✅ Created Recipe Collection life block with ID: {recipe_data['id']}")
            
            # Add sample recipe
            recipe_content = {
                "contentTypeId": recipe_data['contentTypes'][0]['id'],
                "data": {
                    "Recipe Name": "Classic Pancakes",
                    "Ingredients": "2 cups flour\\n1 cup milk\\n2 eggs\\n2 tbsp sugar\\n1 tsp baking powder\\nPinch of salt",
                    "Instructions": "1. Mix dry ingredients\\n2. Whisk wet ingredients separately\\n3. Combine and cook on griddle",
                    "Prep Time": 15,
                    "Difficulty": "Easy",
                    "Tried": True
                }
            }
            content_response = requests.post(f"{API_URL}/life_blocks/{recipe_data['id']}/contents", json=recipe_content)
            if content_response.status_code == 200:
                print("   Added sample recipe")
            else:
                print(f"   Failed to add recipe: {content_response.status_code}")
        else:
            print(f"Failed to create recipe block: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error creating recipe block: {e}")

def create_sample_tasks():
    """Create sample tasks"""
    print("\nCreating sample tasks...")
    tasks = [
        {"title": "Complete project proposal", "status": "completed", "priority": "high", "dueDate": (datetime.now() - timedelta(days=1)).isoformat()},
        {"title": "Review financial reports", "status": "in-progress", "priority": "medium", "dueDate": (datetime.now() + timedelta(days=2)).isoformat()},
        {"title": "Team standup meeting", "status": "pending", "priority": "low", "dueDate": datetime.now().isoformat()},
        {"title": "Update personal budget", "status": "pending", "priority": "high", "dueDate": (datetime.now() + timedelta(days=1)).isoformat()},
        {"title": "Book flight for vacation", "status": "pending", "priority": "medium", "dueDate": (datetime.now() + timedelta(days=10)).isoformat()},
    ]
    
    for task in tasks:
        try:
            response = requests.post(f'{API_URL}/tasks', json=task)
            if response.status_code == 201:
                print(f"✅ Created task: {task['title']}")
            else:
                print(f"Failed to create task: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error creating task: {e}")

def create_sample_schedule():
    """Create sample schedule events"""
    print("\nCreating sample schedule events...")
    events = [
        {"title": "Client Meeting", "startTime": (datetime.now().replace(hour=10, minute=0, second=0, microsecond=0)).isoformat(), "endTime": (datetime.now().replace(hour=11, minute=0, second=0, microsecond=0)).isoformat(), "category": "Work"},
        {"title": "Project Review", "startTime": (datetime.now().replace(hour=14, minute=30, second=0, microsecond=0)).isoformat(), "endTime": (datetime.now().replace(hour=15, minute=30, second=0, microsecond=0)).isoformat(), "category": "Work"},
        {"title": "Team Planning", "startTime": (datetime.now() + timedelta(days=1)).replace(hour=9, minute=0, second=0, microsecond=0).isoformat(), "endTime": (datetime.now() + timedelta(days=1)).replace(hour=10, minute=30, second=0, microsecond=0).isoformat(), "category": "Work"},
        {"title": "Doctor's Appointment", "startTime": (datetime.now() + timedelta(days=3)).replace(hour=11, minute=0, second=0, microsecond=0).isoformat(), "endTime": (datetime.now() + timedelta(days=3)).replace(hour=11, minute=45, second=0, microsecond=0).isoformat(), "category": "Personal"},
    ]

    for event in events:
        try:
            response = requests.post(f'{API_URL}/schedules', json=event)
            if response.status_code == 201:
                print(f"✅ Created event: {event['title']}")
            else:
                print(f"Failed to create event: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error creating event: {e}")

def create_sample_finances():
    """Create sample financial data"""
    print("\nCreating sample financial data...")
    finance_summary = {
        "budgets": [
            {"category": "Groceries", "budget": 500, "spent": 350},
            {"category": "Utilities", "budget": 150, "spent": 120},
            {"category": "Entertainment", "budget": 200, "spent": 250},
        ],
        "income": [
            {"source": "Salary", "amount": 5000, "date": datetime.now().isoformat()},
        ],
        "savingsGoals": [
            {"name": "Vacation Fund", "goal": 2000, "current": 800},
            {"name": "New Laptop", "goal": 1500, "current": 1100},
        ]
    }
    try:
        response = requests.post(f'{API_URL}/finances', json=finance_summary)
        if response.status_code == 201:
            print("✅ Created financial summary.")
        else:
            print(f"Failed to create financial summary: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error creating financial summary: {e}")

def create_sample_analytics():
    """Create sample analytics data"""
    print("\nCreating sample analytics data...")
    analytics_data = {
        "tasksCompleted": 24,
        "productivityScore": 87,
        "monthlyBudget": {
            "total": 2450,
            "spent": 1890
        },
        "meetingsToday": 6
    }
    try:
        response = requests.post(f'{API_URL}/analytics', json=analytics_data)
        if response.status_code == 201:
            print("✅ Created analytics data.")
        else:
            print(f"Failed to create analytics data: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error creating analytics data: {e}")


def main():
    """Main function to create all sample data"""
    create_sample_life_blocks()
    create_sample_tasks()
    create_sample_schedule()
    create_sample_finances()
    create_sample_analytics()
    
    print("\n🎉 Sample data created successfully!")
    print("Visit http://localhost:8080 to see your life blocks in action!")

if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the Flask server.")
        print("Make sure the server is running on http://127.0.0.1:5001")
    except Exception as e:
        print(f"❌ Error: {e}")
