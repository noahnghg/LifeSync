# Mindful Living - Life Management Platform

A comprehensive life management platform that helps users organize and track various aspects of their lives through customizable life blocks, task management, financial tracking, scheduling, and analytics.

## Features

### Core Features
- **Life Blocks**: Create and manage different aspects of your life
- **Task Management**: Organize tasks with priorities and deadlines
- **Financial Tracking**: Monitor income, expenses, and financial goals
- **Schedule Management**: Calendar integration and event planning
- **Analytics**: Track progress and insights across life blocks
- **Chat Interface**: Interactive communication system
- **Custom Life Blocks**: Create personalized life management categories

### Technical Features
- Modern React frontend with TypeScript
- Django REST Framework backend
- PostgreSQL database
- Real-time updates
- Responsive design
- Secure authentication
- File upload support
- RESTful API architecture

## Project Structure

```
mindful-living/
├── mindful-living-central/     # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   └── types/            # TypeScript type definitions
│   └── public/               # Static assets
│
└── mindful-living-backend/    # Django backend
    ├── core/                 # Main Django app
    │   ├── models.py        # Database models
    │   ├── views.py         # API views
    │   ├── serializers.py   # Data serializers
    │   └── urls.py          # URL routing
    └── mindful_living/      # Django project settings
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd mindful-living-central
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd mindful-living-backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with the following variables:
```
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=mindful_living
DB_USER=your-postgres-user
DB_PASSWORD=your-postgres-password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

5. Run database migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create a superuser:
```bash
python manage.py createsuperuser
```

7. Start the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`

## API Documentation

The API documentation is available at `/api/docs/` when running the backend server. The API includes the following endpoints:

- `/api/users/`: User management
- `/api/life-blocks/`: Life block management
- `/api/tasks/`: Task management
- `/api/finances/`: Financial tracking
- `/api/schedules/`: Schedule management
- `/api/analytics/`: Analytics data
- `/api/chats/`: Chat functionality
- `/api/custom-life-blocks/`: Custom life block management

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: Custom user model with profile information
- **LifeBlock**: Base model for life blocks
- **Task**: Task management with priorities and status
- **Finance**: Financial transactions with categories
- **Schedule**: Calendar events
- **Analytics**: Data tracking for life blocks
- **Chat**: Chat messages
- **CustomLifeBlock**: User-defined life blocks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React and TypeScript for the frontend framework
- Django and Django REST Framework for the backend
- PostgreSQL for the database
- All other open-source libraries and tools used in this project 