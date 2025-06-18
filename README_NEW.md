# Mindful Living - Life Management Platform

A modern, customizable life management platform built with React, Flask, and MongoDB. Create custom "LifeBlocks" to organize and track different aspects of your life - from reading lists to fitness goals to recipe collections.

## 🚀 Features

- **Custom LifeBlocks**: Create personalized productivity categories
- **Flexible Content Types**: Define custom fields (text, number, date, boolean, select, textarea)
- **Real-time Data**: All data is stored in MongoDB and synced across the app
- **Beautiful UI**: Modern interface built with React, TypeScript, and TailwindCSS
- **Responsive Design**: Works great on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Shadcn/ui** for UI components
- **React Hook Form** with Zod validation
- **Lucide React** for icons

### Backend
- **Flask** (Python web framework)
- **MongoDB** for database
- **PyMongo** for database operations
- **Flask-CORS** for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- MongoDB

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LifeSyncProject
```

### 2. Install MongoDB
```bash
# On macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

### 3. Set Up Backend
```bash
cd mindful-living-backend

# Install Python dependencies
pip3 install -r requirements.txt

# Initialize database with sample data (optional)
python3 init_db.py

# Start the Flask server
python3 app.py
```
The backend will run on `http://127.0.0.1:5000`

### 4. Set Up Frontend
```bash
cd mindful-living-central

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will run on `http://localhost:8080`

## 🎯 Usage

### Creating a LifeBlock
1. Navigate to "Custom LifeBlocks" in the sidebar
2. Click "Create LifeBlock"
3. Define your LifeBlock:
   - Name and description
   - Icon and color
   - Content types with custom fields
4. Start adding content to your new LifeBlock!

### Example LifeBlocks
- **📚 Reading Journey**: Track books with title, author, rating
- **🏃‍♂️ Fitness Goals**: Log workouts with exercise, duration, intensity
- **🍳 Recipe Collection**: Store recipes with ingredients, instructions, difficulty

## 🔧 API Endpoints

### Life Blocks
- `GET /life_blocks` - Get all life blocks
- `POST /life_blocks` - Create a new life block
- `PUT /life_blocks/<id>` - Update a life block
- `DELETE /life_blocks/<id>` - Delete a life block

### Content Management
- `POST /life_blocks/<id>/contents` - Add content to a life block
- `PUT /life_blocks/<id>/contents/<content_id>` - Update content
- `DELETE /life_blocks/<id>/contents/<content_id>` - Delete content

## 🗃️ Database Schema

### LifeBlock Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  icon: String,
  color: String,
  contentTypes: [{
    id: String,
    name: String,
    icon: String,
    fields: [{
      id: String,
      name: String,
      type: String, // 'text', 'number', 'date', 'boolean', 'select', 'textarea'
      required: Boolean,
      options: [String] // for select fields
    }]
  }],
  contents: [{
    id: String,
    contentTypeId: String,
    data: Object, // dynamic based on content type fields
    createdAt: Date,
    updatedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Development

### Running in Development Mode
1. Start MongoDB: `brew services start mongodb/brew/mongodb-community`
2. Start Backend: `cd mindful-living-backend && python3 app.py`
3. Start Frontend: `cd mindful-living-central && npm run dev`

### Building for Production
```bash
cd mindful-living-central
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Lucide](https://lucide.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
