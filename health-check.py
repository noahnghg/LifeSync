#!/usr/bin/env python3

import requests
import json
import sys
from urllib.parse import urlparse

def check_mongodb():
    """Check if MongoDB is accessible"""
    try:
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000)
        client.server_info()
        return True, "Connected successfully"
    except Exception as e:
        return False, str(e)

def check_flask_api():
    """Check if Flask API is responding"""
    try:
        response = requests.get('http://127.0.0.1:5000/', timeout=5)
        if response.status_code == 200:
            return True, f"Status: {response.status_code}"
        else:
            return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def check_api_endpoints():
    """Check specific API endpoints"""
    endpoints = [
        '/life_blocks',
    ]
    
    results = {}
    for endpoint in endpoints:
        try:
            response = requests.get(f'http://127.0.0.1:5000{endpoint}', timeout=5)
            results[endpoint] = {
                'status': response.status_code,
                'working': response.status_code == 200
            }
        except Exception as e:
            results[endpoint] = {
                'status': 'Error',
                'working': False,
                'error': str(e)
            }
    
    return results

def check_frontend():
    """Check if frontend is accessible"""
    try:
        response = requests.get('http://localhost:8080/', timeout=5)
        if response.status_code == 200:
            return True, f"Status: {response.status_code}"
        else:
            return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def main():
    print("🔍 Mindful Living Platform - Health Check")
    print("=" * 50)
    
    # Check MongoDB
    print("\n📦 MongoDB:")
    mongo_ok, mongo_msg = check_mongodb()
    print(f"   {'✅' if mongo_ok else '❌'} {mongo_msg}")
    
    # Check Flask API
    print("\n🔧 Flask Backend:")
    flask_ok, flask_msg = check_flask_api()
    print(f"   {'✅' if flask_ok else '❌'} {flask_msg}")
    
    # Check API Endpoints
    if flask_ok:
        print("\n🛠️  API Endpoints:")
        endpoints = check_api_endpoints()
        for endpoint, result in endpoints.items():
            status = '✅' if result['working'] else '❌'
            print(f"   {status} {endpoint} - {result['status']}")
    
    # Check Frontend
    print("\n⚡ React Frontend:")
    frontend_ok, frontend_msg = check_frontend()
    print(f"   {'✅' if frontend_ok else '❌'} {frontend_msg}")
    
    # Summary
    print("\n" + "=" * 50)
    all_ok = mongo_ok and flask_ok and frontend_ok
    
    if all_ok:
        print("🎉 All systems are running perfectly!")
        print("\n📍 Access your app at: http://localhost:8080")
        return 0
    else:
        print("⚠️  Some components need attention.")
        print("\nTroubleshooting:")
        if not mongo_ok:
            print("   • Start MongoDB: brew services start mongodb/brew/mongodb-community")
        if not flask_ok:
            print("   • Start Flask: cd mindful-living-backend && python3 app.py")
        if not frontend_ok:
            print("   • Start Frontend: cd mindful-living-central && npm run dev")
        return 1

if __name__ == "__main__":
    sys.exit(main())
