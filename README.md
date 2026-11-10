
# DevOps Task Manager

A full-stack task management application built using React,
Node.js, Express.js, and MongoDB.

## Features

- Create tasks
- View all tasks
- Update task status
- Delete tasks
- Persistent database storage
- REST API integration
- Responsive user interface

## Tech Stack

Frontend:
- React.js
- Vite
- CSS

Backend:
- Node.js
- Express.js
- REST API

Database:
- MongoDB Atlas
- Mongoose

## Local Setup

### 1. Clone the repository

git clone YOUR_REPOSITORY_URL

### 2. Start the backend

cd backend
npm install

Create a .env file:

PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

npm run dev

### 3. Start the frontend

Open another terminal:

cd frontend
npm install

Create a .env file:

VITE_API_URL=http://localhost:5000

npm run dev

Frontend: http://localhost:5173

Backend: http://localhost:5000
