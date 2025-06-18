#!/usr/bin/env python3

import requests
import json

API_URL = 'http://127.0.0.1:5000'

def create_sample_data():
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
    
    print("\\n🎉 Sample data created successfully!")
    print("Visit http://localhost:8080 to see your life blocks in action!")

if __name__ == "__main__":
    try:
        create_sample_data()
    except requests.exceptions.ConnectionError:
        print("❌ Error: Could not connect to the Flask server.")
        print("Make sure the server is running on http://127.0.0.1:5000")
    except Exception as e:
        print(f"❌ Error: {e}")
