# Football Online Manager - README

## Introduction

Welcome to the **Football Online Manager** project! This web application allows users to manage their football teams, participate in a transfer market, and buy players from other teams. Users can register, create a team, and manage their players while adhering to certain rules such as budget limits and player composition restrictions.

### Product Overview

- **Users** can register or log in with their email and password.
- Upon registration, **users receive a football team** with:
  - A starting budget of **$5,000,000** for transfers.
  - A team composition of:
    - 3 Goalkeepers
    - 6 Defenders
    - 6 Midfielders
    - 5 Attackers
- **Transfer Market**:
  - Users can filter available players by **team name, player name, and price**.
  - Users can **buy players** from other teams at **95% of their asking price**.
  - Teams should always have between **15 and 25 players**.

---

## Features

### 1. **User Registration and Login**
- **Single flow** for both registration and login.
- Users can log in or sign up using their **email** and **password**.

### 2. **Team Creation**
- Upon registration, users are automatically assigned a team.
- The team is initialized with:
  - **Budget**: $5,000,000
  - **Players**: 20 players divided by position (3 Goalkeepers, 6 Defenders, 6 Midfielders, 5 Attackers).
- Team creation is a separate process to allow for easier handling of async operations.

### 3. **Transfer Market**
- Users can browse the **transfer market**, where they can:
  - Filter players by **team name**, **player name**, and **price**.
  - **Buy players** from other teams at **95%** of the listed price.
  - **Add/remove players** from their team’s transfer list and set an asking price.
  - Users' teams must always have between **15 and 25 players**.

---

## Technical Specifications

### Backend
- **Node.js**: The backend is built using Node.js, with **Express.js** for routing.
- **Database**: MongoDB is used for storing user data, teams, players, and transactions.
- **Libraries & Tools**:
  - **bcryptjs** for password hashing.
  - **jsonwebtoken** for user authentication via JWT.
  - **express-async-handler** for async error handling.
  - **express-validator** for validating input.
  - **HttpError** middleware for consistent error responses.

### Frontend
- **React.js**: The frontend is built with React, utilizing hooks and context for state management.
- **UI Library**: **Ant Design** is used for UI components such as forms, tables, and modals.
- **React Router** is used for navigation and routing between pages.

---

## Setup Instructions

### Prerequisites
1. **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
2. **MongoDB**: You'll need a MongoDB database. You can either use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud solution or install it locally.

### Steps to Set Up

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/football-online-manager.git
   cd football-online-manager
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file and add the following environment variables:
     ```env
     JWT_SECRET=your_secret_key
     MONGO_URI=mongodb+srv://root:root3124@mongocluster.mqxfd.mongodb.net/FantasyLeaguePro?retryWrites=true&w=majority&appName=MongoCluster 
     URI is for testing purpose only
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm start
     ```

The application should now be running locally at [http://localhost:3000](http://localhost:3000).

---

## Time Report

Here is a breakdown of the time spent on each section:

- **Setup and Initial Configuration**: 2 hours
  - Setting up Node.js, React, and MongoDB.
  - Installing necessary dependencies and configuring environment variables.
  
- **Backend Development**: 6 hours
  - Implementing user authentication (registration and login).
  - Designing the team creation process.
  - Setting up the transfer market (buying and selling players).
  - Ensuring teams maintain player count between 15 and 25.
  
- **Frontend Development**: 7 hours
  - Building the user interface with React.
  - Implementing forms for registration/login and player management.
  - Creating views for team details, transfer market, and player management.
  
- **Testing and Debugging**: 3 hours
  - Testing the API endpoints and frontend components.
  - Debugging and ensuring correct interaction between backend and frontend.

- **Documentation**: 2 hours
  - Writing README and setup instructions.
  - Documenting the time report.


