# 🛍️ ShopEasy Ecommerce

A full-stack Ecommerce web application built using React, Django REST Framework, and PostgreSQL.

## Features:

- User Authentication (Login / Signup)
- JWT Authentication
- Product Listing
- Product Details
- Category-wise Products
- Add to Cart
- Update Product Quantity
- Checkout System
- Order Placement
- Order History
- Responsive UI

## Tech Stack:

### Frontend

- React
- Vite
- Tailwind CSS
- React Router

### Backend

- Django
- Django REST Framework
- JWT Authentication

### Database

- PostgreSQL

## Installation:

### Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure PostgreSQL credentials in a .env file

# Apply database migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Environment Variables

Create a `.env` file inside the `backend` folder and configure your PostgreSQL database credentials:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
```

## Author

Abishek Bhandari

GitHub: https://github.com/abishekbhandari54321
