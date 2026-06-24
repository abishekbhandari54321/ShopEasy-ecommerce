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

## 📸 Project Screenshots

### 🏠 Homepage

![Homepage](screenshots/Homepage.png)
![Homepage_Featured_Products](screenshots/Homepage_Featured_Products.png)
![Homepage_Footer_section](screenshots/Homepage_Footer_section.png)
![After_Login_Homepage](screenshots/After_Login_Homepage.png)

---

### 📜 SignUp

![SignUp Page](screenshots/SignUp.png)

---

### 📜 Login

![Login](screenshots/Login.png)

---

### 📂 Product Categories Page

![Products_Categories_Page](screenshots/Products_Categories.png)

---

### 📦 Product Details

![Product Details](screenshots/Products.png)
![Product Details](screenshots/Products2.png)
![Product Details](screenshots/Products3.png)

---

### 🛒 Cart Page

![Cart Page](screenshots/Cart_Page.png)

---

### 💳 Checkout Page

![Checkout Page](screenshots/Checkout_Page.png)

---

### 📜 Order History

![Order History](screenshots/Order_History.png)

---

### 🛒 Profile Page

![Profile Page](screenshots/Profile.png)
