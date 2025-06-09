# Mindful Living Backend

This is the backend service for the Mindful Living application, built with Django and PostgreSQL.

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/mindful_living
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

## API Documentation

The API documentation is available at `/api/docs/` when running the server.

## Database Schema

The application uses PostgreSQL with the following main models:

- User (extends Django's AbstractUser)
- LifeBlock
- Task
- Finance
- Schedule
- Analytics
- Chat
- CustomLifeBlock

## Features

- RESTful API endpoints for all modules
- WebSocket support for real-time features
- Authentication and authorization
- File upload support
- Analytics data processing
- Task management
- Financial tracking
- Schedule management
- Custom life block creation and management 