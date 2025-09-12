# Referral Platform Project

## Overview
A full-stack referral platform designed to connect job seekers with opportunities through a referral system. It features user authentication, opportunity posting, application tracking, and an admin dashboard.

## Tech Stack

### Frontend
- **React.js:** A JavaScript library for building user interfaces.
- **React Router DOM:** For declarative routing in React applications.
- **CSS Modules/Plain CSS:** For styling components.

**Justification:** React was chosen for its component-based architecture, which promotes reusability and maintainability, making it ideal for building interactive single-page applications. React Router DOM provides a robust solution for navigation within the application.

### Backend
- **FastAPI (Python):** A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **Uvicorn:** An ASGI server for running FastAPI applications.
- **Redis:** An in-memory data structure store, used as a NoSQL database for storing user and opportunity data.
- **Passlib:** A comprehensive password hashing library for Python.

**Justification:** FastAPI was selected for its high performance, automatic interactive API documentation (Swagger UI/ReDoc), and ease of use with Python type hints, which helps in building robust APIs quickly. Redis provides a fast and flexible data storage solution suitable for this application's needs, especially for quick lookups and session management. Passlib ensures secure password hashing.

## Setup Instructions

To get the project up and running on your local machine, follow these steps:

### Prerequisites
- Node.js (LTS version recommended)
- npm (Node Package Manager)
- Python 3.9+
- pip (Python Package Installer)
- Redis Server (running locally or accessible)

### 1. Clone the Repository
```bash
git clone (https://github.com/Benjamin-ngiimei/Referral-Plateform-Project.git)
cd "Referrel platform project"
```

### 2. Backend Setup

Navigate to the `Backend` directory:
```bash
cd Backend
```

Create a Python virtual environment and activate it:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

Install the required Python packages:
```bash
pip install -r Requirements.txt
```

Ensure your Redis server is running. The application expects Redis to be accessible on `localhost:6379` by default (as configured in `Backend/database.py`).

Run the FastAPI backend server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
The backend API will be accessible at `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory from the project root:
```bash
cd ../frontend
```

Install the Node.js dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm start
```
The frontend application will be accessible at `http://localhost:3000`.

## Demo Login

You can use the following credentials to log in as an administrator:

**Admin User:**
- **Email:** `hire-me@anshumat.org`
- **Password:** `HireMe@2025!`

**Candidate user**
-**Email:** `ben@gmail.com`
- **Password:** `123456`
       **or**
-**Register new user**

## Project Approach

The project follows a clear separation of concerns with a distinct frontend and backend.

- **Frontend (React):** Handles the user interface and user interactions. It communicates with the backend API to fetch and send data. State management is primarily handled using React's built-in `useState` and `useEffect` hooks, with `localStorage` used for client-side session persistence (e.g., login status, user roles). React Router DOM manages client-side navigation.
- **Backend (FastAPI):** Provides RESTful API endpoints for all data operations (user registration, login, opportunity management, application tracking). It interacts with Redis for data storage. Password hashing is performed server-side using `passlib` for security.
- **Data Storage (Redis):** Chosen for its speed and flexibility as a key-value store. User data, opportunity details, and application records are stored as JSON strings under unique keys.

This architecture allows for independent development and scaling of the frontend and backend, and provides a robust foundation for future enhancements.
