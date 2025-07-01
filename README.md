# Movie Recommendation Application

A full-stack web application that allows users to discover popular movies, create an account, and manage their personal favorites and watchlist.

## Features

*   Browse popular movies from The Movie Database (TMDb) API.
*   User registration and login with secure authentication.
*   Add or remove movies from a personal "Favorites" list.
*   Add or remove movies from a personal "Watchlist".
*   A personal dashboard to view and manage favorite movies and watchlist.
*   Responsive design for a seamless experience on different devices.

## Tech Stack

*   **Frontend**: React, React Router, Axios, CSS
*   **Backend**: Node.js, Express, MongoDB, Mongoose, JWT for authentication
*   **Database**: MongoDB Atlas

## Prerequisites

*   Node.js and npm installed.
*   A MongoDB Atlas account and a connection string.
*   A TMDb API key.

## Installation and Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Movie-Recommendation-Application
    ```

2.  **Backend Setup**:
    *   Navigate to the `backend` directory:
        ```bash
        cd backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `backend` directory and add the following environment variables:
        ```
        MONGO_URI=<your-mongodb-atlas-connection-string>
        JWT_SECRET=<your-jwt-secret>
        ```

3.  **Frontend Setup**:
    *   Navigate to the `frontend` directory:
        ```bash
        cd ../frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```

## Usage

1.  **Run the Backend Server**:
    *   From the `backend` directory, run:
        ```bash
        npm start
        ```
    *   The server will start on `http://localhost:5000`.

2.  **Run the Frontend Development Server**:
    *   From the `frontend` directory, run:
        ```bash
        npm start
        ```
    *   The application will open in your browser at `http://localhost:3000`.

## API Endpoints

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Log in a user.
*   `POST /api/auth/logout`: Log out a user.
*   `GET /api/movies/popular`: Get a list of popular movies.
*   `GET /api/users/me`: Get the logged-in user's details, including favorites and watchlist.
*   `POST /api/users/favorites`: Add a movie to the user's favorites.
*   `DELETE /api/users/favorites/:movieId`: Remove a movie from the user's favorites.
*   `POST /api/users/watchlists`: Add a movie to the user's watchlist.
*   `DELETE /api/users/watchlists/:movieId`: Remove a movie from the user's watchlist.

## Project Structure

```
Movie-Recommendation-Application/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── styles/
    ├── .gitignore
    ├── package.json
    └── README.md