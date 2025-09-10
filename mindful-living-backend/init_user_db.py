#!/usr/bin/env python3

import requests
import json
import os
from datetime import datetime, timedelta

# Use environment variable for API URL, default to localhost
API_URL = os.environ.get('API_URL', 'http://127.0.0.1:5001')

def create_test_user():
    """Create a test user and return access token"""
    print("Creating test user...")
    
    user_data = {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f'{API_URL}/auth/signup', json=user_data)
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Created test user: {data['user']['firstName']} {data['user']['lastName']}")
            return data['access_token'], data['user']
        else:
            # User might already exist, try to login
            login_data = {
                "email": user_data["email"],
                "password": user_data["password"]
            }
            response = requests.post(f'{API_URL}/auth/login', json=login_data)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Logged in test user: {data['user']['firstName']} {data['user']['lastName']}")
                return data['access_token'], data['user']
            else:
                print(f"❌ Error creating/logging in user: {response.text}")
                return None, None
    except Exception as e:
        print(f"❌ Error creating user: {str(e)}")
        return None, None

def create_sample_life_blocks(auth_token):
    """Create sample life blocks with content"""
    print("Creating sample life blocks...")
    
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    
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
    
    try:
        response = requests.post(f'{API_URL}/life_blocks', json=recipe_block, headers=headers)
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
            content_response = requests.post(f"{API_URL}/life_blocks/{recipe_data['id']}/contents", json=recipe_content, headers=headers)
            if content_response.status_code == 200:
                print("   Added sample recipe")
        else:
            print(f"❌ Error creating recipe block: {response.text}")
    except Exception as e:
        print(f"❌ Error creating recipe block: {str(e)}")

def create_sample_tasks(auth_token):
    """Create sample tasks"""
    print("Creating sample tasks...")
    
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    
    tasks = [
        {
            "title": "Complete project proposal",
            "description": "Draft and finalize the Q4 project proposal",
            "status": "completed",
            "priority": "high",
            "dueDate": (datetime.now() - timedelta(days=2)).isoformat(),
            "category": "Work"
        },
        {
            "title": "Review financial reports",
            "description": "Monthly financial analysis and reporting",
            "status": "in-progress",
            "priority": "medium",
            "dueDate": datetime.now().isoformat(),
            "category": "Finance"
        },
        {
            "title": "Team standup meeting",
            "description": "Daily team sync and progress update",
            "status": "pending",
            "priority": "low",
            "dueDate": (datetime.now() + timedelta(days=1)).isoformat(),
            "category": "Work"
        },
        {
            "title": "Update personal budget",
            "description": "Review and update monthly budget allocations",
            "status": "pending",
            "priority": "high",
            "dueDate": (datetime.now() + timedelta(days=3)).isoformat(),
            "category": "Personal"
        },
        {
            "title": "Book flight for vacation",
            "description": "Research and book flights for summer vacation",
            "status": "pending",
            "priority": "medium",
            "dueDate": (datetime.now() + timedelta(days=7)).isoformat(),
            "category": "Personal"
        }
    ]
    
    for task in tasks:
        try:
            response = requests.post(f'{API_URL}/tasks', json=task, headers=headers)
            if response.status_code == 201:
                print(f"✅ Created task: {task['title']}")
            else:
                print(f"❌ Error creating task: {response.text}")
        except Exception as e:
            print(f"❌ Error creating task: {str(e)}")

def create_sample_events(auth_token):
    """Create sample schedule events"""
    print("Creating sample schedule events...")
    
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    
    events = [
        {
            "title": "Client Meeting",
            "description": "Quarterly review with major client",
            "startTime": (datetime.now() + timedelta(hours=2)).isoformat(),
            "endTime": (datetime.now() + timedelta(hours=3)).isoformat(),
            "location": "Conference Room A",
            "category": "Work"
        },
        {
            "title": "Project Review",
            "description": "Sprint review and planning session",
            "startTime": (datetime.now() + timedelta(hours=6)).isoformat(),
            "endTime": (datetime.now() + timedelta(hours=7)).isoformat(),
            "location": "Office",
            "category": "Work"
        },
        {
            "title": "Team Planning",
            "description": "Weekly team planning and retrospective",
            "startTime": (datetime.now() + timedelta(days=1, hours=1)).isoformat(),
            "endTime": (datetime.now() + timedelta(days=1, hours=2)).isoformat(),
            "location": "Meeting Room B",
            "category": "Work"
        },
        {
            "title": "Doctor's Appointment",
            "description": "Annual health checkup",
            "startTime": (datetime.now() + timedelta(days=2, hours=3)).isoformat(),
            "endTime": (datetime.now() + timedelta(days=2, hours=4)).isoformat(),
            "location": "Medical Center",
            "category": "Health"
        }
    ]
    
    for event in events:
        try:
            response = requests.post(f'{API_URL}/schedules', json=event, headers=headers)
            if response.status_code == 201:
                print(f"✅ Created event: {event['title']}")
            else:
                print(f"❌ Error creating event: {response.text}")
        except Exception as e:
            print(f"❌ Error creating event: {str(e)}")

def create_sample_finance_data(auth_token):
    """Create sample financial data"""
    print("Creating sample financial data...")
    
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    
    finance_data = {
        "budgets": [
            {"category": "Housing", "budget": 1500, "spent": 1450},
            {"category": "Food", "budget": 600, "spent": 520},
            {"category": "Transportation", "budget": 300, "spent": 280},
            {"category": "Entertainment", "budget": 200, "spent": 150},
            {"category": "Utilities", "budget": 250, "spent": 240}
        ],
        "income": 4500,
        "savings": 850,
        "savingsGoal": 1000,
        "totalExpenses": 2640
    }
    
    try:
        response = requests.post(f'{API_URL}/finances', json=finance_data, headers=headers)
        if response.status_code == 201:
            print("✅ Created financial summary.")
        else:
            print(f"❌ Failed to create financial summary: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error creating financial data: {str(e)}")

def create_sample_analytics_data(auth_token):
    """Create sample analytics data"""
    print("Creating sample analytics data...")
    
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    
    analytics_data = {
        "productivityScore": 87,
        "tasksCompleted": 24,
        "totalTasks": 32,
        "averageTaskTime": 45,
        "weeklyGoal": 30,
        "dailyStreaks": 7,
        "productivityMetrics": [
            {
                "title": "Tasks Completed",
                "value": "24",
                "change": "+12%",
                "trend": "up",
                "icon": "CheckSquare",
                "color": "green"
            },
            {
                "title": "Focus Time",
                "value": "6.5h",
                "change": "+8%", 
                "trend": "up",
                "icon": "Clock",
                "color": "blue"
            },
            {
                "title": "Productivity Score",
                "value": "87%",
                "change": "+5%",
                "trend": "up", 
                "icon": "TrendingUp",
                "color": "purple"
            },
            {
                "title": "Goals Progress",
                "value": "8/10",
                "change": "+2",
                "trend": "up",
                "icon": "Target", 
                "color": "orange"
            }
        ],
        "weeklyData": [
            {"day": "Mon", "tasks": 5, "hours": 7.5, "efficiency": 85},
            {"day": "Tue", "tasks": 3, "hours": 6.2, "efficiency": 72},
            {"day": "Wed", "tasks": 4, "hours": 8.1, "efficiency": 88},
            {"day": "Thu", "tasks": 6, "hours": 7.8, "efficiency": 91},
            {"day": "Fri", "tasks": 4, "hours": 6.5, "efficiency": 79},
            {"day": "Sat", "tasks": 2, "hours": 4.2, "efficiency": 65},
            {"day": "Sun", "tasks": 0, "hours": 2.1, "efficiency": 45}
        ],
        "categories": [
            {"name": "Work", "percentage": 45, "color": "bg-blue-500"},
            {"name": "Personal", "percentage": 25, "color": "bg-green-500"},
            {"name": "Health", "percentage": 15, "color": "bg-purple-500"},
            {"name": "Learning", "percentage": 10, "color": "bg-orange-500"},
            {"name": "Other", "percentage": 5, "color": "bg-gray-500"}
        ],
        "insights": [
            {
                "title": "Peak Performance",
                "description": "You're most productive on Thursday mornings",
                "suggestion": "Schedule important tasks for Thursday AM",
                "impact": "High"
            },
            {
                "title": "Focus Improvement",
                "description": "Your focus time has increased by 15% this week",
                "suggestion": "Continue using time-blocking techniques",
                "impact": "Medium"
            },
            {
                "title": "Goal Tracking",
                "description": "You're on track to meet 80% of your monthly goals",
                "suggestion": "Review pending goals to boost completion rate",
                "impact": "Low"
            }
        ],
        "categories_old": {
            "Work": {"completed": 15, "total": 20},
            "Personal": {"completed": 8, "total": 10},
            "Health": {"completed": 1, "total": 2}
        }
    }
    
    try:
        response = requests.post(f'{API_URL}/analytics', json=analytics_data, headers=headers)
        if response.status_code == 201:
            print("✅ Created analytics data.")
        else:
            print(f"❌ Failed to create analytics data: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error creating analytics data: {str(e)}")

def create_sample_goals(auth_token):
    """Create sample goals"""
    print("Creating sample goals...")
    
    headers = {
        'Authorization': f'Bearer {auth_token}',
        'Content-Type': 'application/json'
    }
    
    goals = [
        {
            "title": "Emergency Fund",
            "description": "Build an emergency fund for unexpected expenses",
            "targetValue": 10000,
            "currentValue": 5000,
            "category": "Financial",
            "deadline": (datetime.now() + timedelta(days=365)).isoformat()
        },
        {
            "title": "Learn Python",
            "description": "Complete Python programming course",
            "targetValue": 100,
            "currentValue": 65,
            "category": "Learning",
            "deadline": (datetime.now() + timedelta(days=90)).isoformat()
        },
        {
            "title": "Run 5K",
            "description": "Train to run a 5K marathon",
            "targetValue": 5000,
            "currentValue": 2000,
            "category": "Health",
            "deadline": (datetime.now() + timedelta(days=120)).isoformat()
        },
        {
            "title": "Read 12 Books",
            "description": "Read 12 books this year",
            "targetValue": 12,
            "currentValue": 7,
            "category": "Personal",
            "deadline": (datetime.now() + timedelta(days=180)).isoformat()
        }
    ]
    
    created_goals = []
    for goal_data in goals:
        try:
            response = requests.post(f'{API_URL}/goals', json=goal_data, headers=headers)
            if response.status_code == 201:
                goal = response.json()
                created_goals.append(goal)
                print(f"  ✅ Created goal: {goal['title']}")
            else:
                print(f"  ❌ Error creating goal {goal_data['title']}: {response.text}")
        except Exception as e:
            print(f"  ❌ Error creating goal {goal_data['title']}: {str(e)}")
    
    return created_goals

def main():
    print("🚀 Initializing LifeSync database with sample data...")
    print("")
    
    # Create test user and get auth token
    auth_token, user = create_test_user()
    
    if not auth_token:
        print("❌ Failed to create or login test user. Exiting.")
        return
    
    print("")
    
    # Create sample data for the user
    create_sample_life_blocks(auth_token)
    print("")
    
    create_sample_tasks(auth_token)
    print("")
    
    create_sample_events(auth_token)
    print("")
    
    create_sample_finance_data(auth_token)
    print("")
    
    create_sample_analytics_data(auth_token)
    print("")
    
    create_sample_goals(auth_token)
    print("")
    
    print("🎉 Sample data created successfully!")
    print(f"📧 Test user email: john.doe@example.com")
    print(f"🔑 Test user password: password123")
    print("Visit http://localhost:8080 to see your life blocks in action!")

if __name__ == "__main__":
    main()
