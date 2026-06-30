# Muser Refresh

## Overview

Muser is an application designed to allow users to review music albums and view other users' reviews using the Muser website interface. Muser allows users to create and manage their own accounts and uses authentication functions to allow them to log in. Users can manage their own reviews using update and delete operation buttons, allowing them to curate their collection of album reviews easily.

Muser Refresh extends the original Muser application by introducing a Verified Critics system, allowing certain users to be nominated as "verified critics". Reviews submitted by these users are logged as verified/critic reviews and displayed accordingly on the review card when searching, alongside basic search filtering to allow users to filter for critic reviews specifically.

This application contains the following features:

- Signup
- Login
- Logout
- Update Profile
- Add Reviews
- View Reviews
- Update Reviews
- Delete Reviews
- Search Reviews
- Search Filtering (filter by critic reviews)

The application also contains features for admin accounts, which can be enabled by setting the "Admin" flag on a user's account data to true using MongoDB. Admins have access to an Admin portal which currently allows:

- Deletion of any user's reviews

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Deployment:** AWS EC2
- **CI/CD:** GitHub Actions (self-hosted runner)
- **Version Control:** GitHub

## Public URL

**http://3.107.202.133:5002**

## Example Admin Account

| Field | Details |
|-------|---------|
| User | qut@muser.com |
| Password | admin |

## GitHub Repository

**https://github.com/ninqt/IFQ636-Muser-Refresh**

## Prerequisites

Please install the following software and create accounts in the following web tools:

- Node.js: https://nodejs.org/en
- Git: https://git-scm.com/
- VS Code Editor: https://code.visualstudio.com/
- MongoDB Account: https://account.mongodb.com/account/login
- GitHub Account: https://github.com/signup

## Project Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ninqt/IFQ636-Muser-Refresh.git
cd IFQ636-Muser-Refresh
```

### 2. Install All Project Dependencies

```bash
npm run install-all
```

### 3. Backend Setup

Create a `.env` file in the `backend/` folder with the following content:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5003
```

### 4. Start the Project

```bash
npm start
```

Backend runs on: `http://localhost:5003`
Frontend runs on: `http://localhost:5002`

### 5. Run Tests

```bash
cd backend
npm test
```

## CI/CD Pipeline

This project uses GitHub Actions with a self-hosted runner on AWS EC2 for automated testing and deployment. The pipeline is triggered on every push to the `main` branch and includes:

- Checkout code
- Setup Node.js
- Install backend dependencies
- Run backend tests (Mocha, Chai, Sinon)
- Install frontend dependencies and build
- Create .env file
- Deploy to EC2 using PM2

## Project Structure

```
IFQ636-Muser-Refresh/
├── backend/
│   ├── adapters/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── observers/
│   ├── routes/
│   ├── services/
│   ├── test/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── strategies/
├── postman/
└── .github/
    └── workflows/
        └── ci.yml
```

## Design Patterns

This project implements seven design patterns as part of the Muser Refresh extension:

| Pattern | Location |
|---------|----------|
| Factory | `backend/services/reviewService.js` |
| Builder | `backend/services/reviewService.js` |
| Facade | `backend/services/reviewService.js` |
| Observer | `backend/observers/` |
| Strategy | `frontend/src/strategies/` |
| Middleware (Chain of Responsibility) | `backend/middleware/authMiddleware.js` |
| Adapter | `backend/adapters/UserAdapter.js` |

## References

- diagrams.net. (n.d.). https://app.diagrams.net/
- github. (n.d.). nahaQUT. https://github.com/nahaQUT/sampleapp_IFQ636
- github. (n.d.). nahaQUT. https://github.com/nahaQUT/design_patterns
- Node.js. (n.d.). https://nodejs.org/en
- MongoDB. (n.d.). https://www.mongodb.com/
- React. (n.d.). https://react.dev/
