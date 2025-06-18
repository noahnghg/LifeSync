from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from bson.objectid import ObjectId
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
client = MongoClient('mongodb://localhost:27017/')
db = client['mindful_living']

# Collections
users_collection = db['users']
life_blocks_collection = db['life_blocks']

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

@app.route('/')
def index():
    return "Flask server is running!"

@app.route('/life_blocks', methods=['GET'])
def get_life_blocks():
    life_blocks = list(life_blocks_collection.find())
    life_blocks = convert_objectid_to_string(life_blocks)
    return jsonify(life_blocks)

@app.route('/life_blocks', methods=['POST'])
def create_life_block():
    data = request.get_json()
    
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
def update_life_block(id):
    data = request.get_json()
    data['updatedAt'] = datetime.utcnow()
    
    life_blocks_collection.update_one({'_id': ObjectId(id)}, {'$set': data})
    updated_block = life_blocks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(convert_objectid_to_string(updated_block))

@app.route('/life_blocks/<id>', methods=['DELETE'])
def delete_life_block(id):
    result = life_blocks_collection.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Life block deleted successfully', 'deleted': result.deleted_count > 0})

@app.route('/life_blocks/<id>/contents', methods=['POST'])
def add_content_to_life_block(id):
    data = request.get_json()
    
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
def update_content_in_life_block(id, content_id):
    data = request.get_json()
    
    now = datetime.utcnow()
    life_blocks_collection.update_one(
        {'_id': ObjectId(id), 'contents.id': content_id},
        {'$set': {
            'contents.$.data': data.get('data', {}),
            'contents.$.updatedAt': now,
            'updatedAt': now
        }}
    )
    
    updated_block = life_blocks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(convert_objectid_to_string(updated_block))

@app.route('/life_blocks/<id>/contents/<content_id>', methods=['DELETE'])
def delete_content_from_life_block(id, content_id):
    now = datetime.utcnow()
    life_blocks_collection.update_one(
        {'_id': ObjectId(id)},
        {'$pull': {'contents': {'id': content_id}}, '$set': {'updatedAt': now}}
    )
    
    updated_block = life_blocks_collection.find_one({'_id': ObjectId(id)})
    return jsonify(convert_objectid_to_string(updated_block))

if __name__ == '__main__':
    app.run(debug=True)
