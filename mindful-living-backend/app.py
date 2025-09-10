from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import uuid
import bcrypt
import os

app = Flask(__name__)
CORS(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')  # Change this!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)  # Token expires in 7 days
jwt = JWTManager(app)

# MongoDB Configuration
MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGODB_URI)
db_name = 'lifesync' if 'mongodb://' in MONGODB_URI and '@' in MONGODB_URI else 'mindful_living'
db = client[db_name]

# Collections
users_collection = db['users']
life_blocks_collection = db['life_blocks']
tasks_collection = db['tasks']
finances_collection = db['finances']
transactions_collection = db['transactions']
schedules_collection = db['schedules']
analytics_collection = db['analytics']

def convert_objectid_to_string(data):
    """Convert MongoDB ObjectId to string for JSON serialization"""
    if isinstance(data, list):
        return [convert_objectid_to_string(item) for item in data]
    elif isinstance(data, dict):
        result = {}
        for key, value in data.items():
            if key == '_id' and isinstance(value, ObjectId):
                result['id'] = str(value)  # Convert _id to id for frontend
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, (dict, list)):
                result[key] = convert_objectid_to_string(value)
            else:
                result[key] = value
        return result
    else:
        return data

def hash_password(password):
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password, hashed):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def validate_user_data(data, is_signup=False):
    """Validate user registration/login data"""
    if not data:
        return False, "No data provided"
    
    if is_signup:
        required_fields = ['email', 'password', 'firstName', 'lastName']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return False, f"{field} is required"
        
        # Validate email format (basic)
        email = data['email'].strip().lower()
        if '@' not in email or '.' not in email:
            return False, "Invalid email format"
        
        # Validate password length
        if len(data['password']) < 6:
            return False, "Password must be at least 6 characters long"
    else:
        required_fields = ['email', 'password']
        for field in required_fields:
            if field not in data or not data[field].strip():
                return False, f"{field} is required"
    
    return True, "Valid"

@app.route('/')
def index():
    return "Flask server is running!"

# --- Authentication Endpoints ---
@app.route('/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate input
        is_valid, message = validate_user_data(data, is_signup=True)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        email = data['email'].strip().lower()
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return jsonify({'error': 'User already exists with this email'}), 400
        
        # Create new user
        new_user = {
            'email': email,
            'firstName': data['firstName'].strip(),
            'lastName': data['lastName'].strip(),
            'password': hash_password(data['password']),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow(),
            'isActive': True,
            'profile': {
                'avatar': None,
                'bio': '',
                'preferences': {
                    'theme': 'light',
                    'notifications': True
                }
            }
        }
        
        result = users_collection.insert_one(new_user)
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        # Return user data without password
        user_data = users_collection.find_one({'_id': result.inserted_id})
        user_data = convert_objectid_to_string(user_data)
        del user_data['password']
        
        return jsonify({
            'message': 'User created successfully',
            'user': user_data,
            'access_token': access_token
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate input
        is_valid, message = validate_user_data(data, is_signup=False)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        email = data['email'].strip().lower()
        password = data['password']
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Check password
        if not verify_password(password, user['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Check if account is active
        if not user.get('isActive', True):
            return jsonify({'error': 'Account is deactivated'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        # Update last login
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {'lastLogin': datetime.utcnow()}}
        )
        
        # Return user data without password
        user_data = convert_objectid_to_string(user)
        del user_data['password']
        
        return jsonify({
            'message': 'Login successful',
            'user': user_data,
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Return user data without password
        user_data = convert_objectid_to_string(user)
        del user_data['password']
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a more complex setup, you might want to blacklist the token
    # For now, we'll just return a success message
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/auth/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        # Validate required fields
        if not data.get('firstName') or not data.get('lastName') or not data.get('email'):
            return jsonify({'error': 'First name, last name, and email are required'}), 400
        
        # Check if email is already taken by another user
        existing_user = users_collection.find_one({'email': data['email'], '_id': {'$ne': ObjectId(current_user_id)}})
        if existing_user:
            return jsonify({'error': 'Email already taken'}), 400
        
        # Update user profile
        update_data = {
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'email': data['email'],
            'updatedAt': datetime.utcnow()
        }
        
        result = users_collection.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$set': update_data}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Failed to update profile'}), 400
        
        # Get updated user data
        updated_user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        user_data = convert_objectid_to_string(updated_user)
        del user_data['password']
        
        return jsonify({'user': user_data, 'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/auth/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        # Validate required fields
        if not data.get('currentPassword') or not data.get('newPassword'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Get current user
        user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify current password
        if not verify_password(data['currentPassword'], user['password']):
            return jsonify({'error': 'Current password is incorrect'}), 400
        
        # Hash new password
        new_password_hash = hash_password(data['newPassword'])
        
        # Update password
        result = users_collection.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$set': {'password': new_password_hash, 'updatedAt': datetime.utcnow()}}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Failed to change password'}), 400
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/life_blocks', methods=['GET'])
@jwt_required()
def get_life_blocks():
    user_id = get_jwt_identity()
    life_blocks = list(life_blocks_collection.find({'userId': user_id}))
    life_blocks = convert_objectid_to_string(life_blocks)
    return jsonify(life_blocks)

@app.route('/life_blocks', methods=['POST'])
@jwt_required()
def create_life_block():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Add user ID to the life block
    data['userId'] = user_id
    
    # Add timestamps and ID if not present
    now = datetime.utcnow()
    if 'createdAt' not in data:
        data['createdAt'] = now
    if 'updatedAt' not in data:
        data['updatedAt'] = now
    if 'contents' not in data:
        data['contents'] = []
    
    # Generate UUIDs for content types and fields
    if 'contentTypes' in data:
        for content_type in data['contentTypes']:
            if 'id' not in content_type:
                content_type['id'] = str(uuid.uuid4())
            if 'fields' in content_type:
                for field in content_type['fields']:
                    if 'id' not in field:
                        field['id'] = str(uuid.uuid4())
    
    result = life_blocks_collection.insert_one(data)
    created_block = life_blocks_collection.find_one({'_id': result.inserted_id})
    return jsonify(convert_objectid_to_string(created_block)), 201

@app.route('/life_blocks/<id>', methods=['PUT'])
@jwt_required()
def update_life_block(id):
    user_id = get_jwt_identity()
    data = request.get_json()
    data['updatedAt'] = datetime.utcnow()
    
    # Only update if the life block belongs to the user
    result = life_blocks_collection.update_one(
        {'_id': ObjectId(id), 'userId': user_id}, 
        {'$set': data}
    )
    
    if result.matched_count == 0:
        return jsonify({'error': 'Life block not found or access denied'}), 404
    
    updated_block = life_blocks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(convert_objectid_to_string(updated_block))

@app.route('/life_blocks/<id>', methods=['DELETE'])
@jwt_required()
def delete_life_block(id):
    user_id = get_jwt_identity()
    
    # Only delete if the life block belongs to the user
    result = life_blocks_collection.delete_one({'_id': ObjectId(id), 'userId': user_id})
    
    if result.deleted_count == 0:
        return jsonify({'error': 'Life block not found or access denied'}), 404
    
    return jsonify({'message': 'Life block deleted successfully', 'deleted': True})

@app.route('/life_blocks/<id>/contents', methods=['POST'])
@jwt_required()
def add_content_to_life_block(id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Verify the life block belongs to the user
    life_block = life_blocks_collection.find_one({'_id': ObjectId(id), 'userId': user_id})
    if not life_block:
        return jsonify({'error': 'Life block not found or access denied'}), 404
    
    # Add timestamps and ID
    now = datetime.utcnow()
    content = {
        'id': str(uuid.uuid4()),
        'contentTypeId': data.get('contentTypeId'),
        'data': data.get('data', {}),
        'createdAt': now,
        'updatedAt': now
    }
    
    life_blocks_collection.update_one(
        {'_id': ObjectId(id)}, 
        {'$push': {'contents': content}, '$set': {'updatedAt': now}}
    )
    
    updated_block = life_blocks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(convert_objectid_to_string(updated_block))

@app.route('/life_blocks/<id>/contents/<content_id>', methods=['PUT'])
@jwt_required()
def update_content_in_life_block(id, content_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Verify the life block belongs to the user
    life_block = life_blocks_collection.find_one({'_id': ObjectId(id), 'userId': user_id})
    if not life_block:
        return jsonify({'error': 'Life block not found or access denied'}), 404
    
    now = datetime.utcnow()
    result = life_blocks_collection.update_one(
        {'_id': ObjectId(id), 'contents.id': content_id},
        {'$set': {
            'contents.$.data': data.get('data', {}),
            'contents.$.updatedAt': now,
            'updatedAt': now
        }}
    )
    
    if result.matched_count == 0:
        return jsonify({'error': 'Content not found'}), 404
    
    updated_block = life_blocks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(convert_objectid_to_string(updated_block))

@app.route('/life_blocks/<id>/contents/<content_id>', methods=['DELETE'])
@jwt_required()
def delete_content_from_life_block(id, content_id):
    user_id = get_jwt_identity()
    
    # Verify the life block belongs to the user
    life_block = life_blocks_collection.find_one({'_id': ObjectId(id), 'userId': user_id})
    if not life_block:
        return jsonify({'error': 'Life block not found or access denied'}), 404
    
    now = datetime.utcnow()
    result = life_blocks_collection.update_one(
        {'_id': ObjectId(id)},
        {'$pull': {'contents': {'id': content_id}}, '$set': {'updatedAt': now}}
    )
    
    updated_block = life_blocks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(convert_objectid_to_string(updated_block))

# --- Tasks Endpoints ---
@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = list(tasks_collection.find({'userId': user_id}))
    return jsonify(convert_objectid_to_string(tasks))

@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['userId'] = user_id
    data['createdAt'] = datetime.utcnow()
    data['updatedAt'] = datetime.utcnow()
    result = tasks_collection.insert_one(data)
    new_task = tasks_collection.find_one({'_id': result.inserted_id})
    return jsonify(convert_objectid_to_string(new_task)), 201

@app.route('/tasks/<id>', methods=['PUT'])
def update_task(id):
    data = request.get_json()
    data['updatedAt'] = datetime.utcnow()
    tasks_collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    updated_task = tasks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(convert_objectid_to_string(updated_task))

@app.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):
    result = tasks_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Task deleted', 'deleted': result.deleted_count > 0})

# --- Finances Endpoints ---
@app.route('/finances', methods=['GET'])
@jwt_required()
def get_finances():
    user_id = get_jwt_identity()
    finances = list(finances_collection.find({'userId': user_id}))
    return jsonify(convert_objectid_to_string(finances))

@app.route('/finances', methods=['POST'])
@jwt_required()
def create_finance():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['userId'] = user_id
    data['createdAt'] = datetime.utcnow()
    result = finances_collection.insert_one(data)
    new_item = finances_collection.find_one({'_id': result.inserted_id})
    return jsonify(convert_objectid_to_string(new_item)), 201

@app.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = list(transactions_collection.find({'userId': user_id}))
    return jsonify(convert_objectid_to_string(transactions))

@app.route('/transactions', methods=['POST'])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['userId'] = user_id
    data['createdAt'] = datetime.utcnow()
    result = transactions_collection.insert_one(data)
    new_transaction = transactions_collection.find_one({'_id': result.inserted_id})
    return jsonify(convert_objectid_to_string(new_transaction)), 201

# --- Schedule Endpoints ---
@app.route('/schedules', methods=['GET'])
@jwt_required()
def get_schedules():
    user_id = get_jwt_identity()
    schedules = list(schedules_collection.find({'userId': user_id}))
    return jsonify(convert_objectid_to_string(schedules))

@app.route('/schedules', methods=['POST'])
@jwt_required()
def create_schedule_item():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['userId'] = user_id
    data['createdAt'] = datetime.utcnow()
    result = schedules_collection.insert_one(data)
    new_item = schedules_collection.find_one({'_id': result.inserted_id})
    return jsonify(convert_objectid_to_string(new_item)), 201

# --- Analytics Endpoints ---
@app.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    user_id = get_jwt_identity()
    analytics = analytics_collection.find_one({'userId': user_id})
    if analytics:
        return jsonify(convert_objectid_to_string(analytics))
    else:
        # Return empty analytics if none exist
        return jsonify({})

@app.route('/analytics', methods=['POST'])
@jwt_required()
def create_analytics():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['userId'] = user_id
    data['createdAt'] = datetime.utcnow()
    result = analytics_collection.insert_one(data)
    new_item = analytics_collection.find_one({'_id': result.inserted_id})
    return jsonify(convert_objectid_to_string(new_item)), 201

# --- Goals Endpoints ---
@app.route('/goals', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = list(db['goals'].find({'userId': user_id}))
    return jsonify(convert_objectid_to_string(goals))

@app.route('/goals', methods=['POST'])
@jwt_required()
def create_goal():
    user_id = get_jwt_identity()
    data = request.get_json()
    data['userId'] = user_id
    data['createdAt'] = datetime.utcnow()
    data['status'] = data.get('status', 'active')
    result = db['goals'].insert_one(data)
    new_goal = db['goals'].find_one({'_id': result.inserted_id})
    return jsonify(convert_objectid_to_string(new_goal)), 201

@app.route('/goals/<id>', methods=['PUT'])
@jwt_required()
def update_goal(id):
    user_id = get_jwt_identity()
    data = request.get_json()
    db['goals'].update_one({'_id': ObjectId(id), 'userId': user_id}, {'$set': data})
    return jsonify({'success': True})

@app.route('/goals/<id>', methods=['DELETE'])
@jwt_required()
def delete_goal(id):
    user_id = get_jwt_identity()
    db['goals'].delete_one({'_id': ObjectId(id), 'userId': user_id})
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
