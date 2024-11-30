# MERN Blog

This is a full-stack web application for a blog built using the MERN stack (MongoDB, Express.js, React.js, Node.js). 
It provides a platform for users to create, read, update, and delete blog posts, as well as interact with the blog through comments and search functionality.

## Live Demo & Repositories
- Demo: [MERN Blog](https://mernblog-5731.onrender.com/) <br />

## Test Account
To explore all features, you can use this test account:
```bash
Username: admin
Password: 123
```

## Features

### User Authentication:
- User registration and login functionality
- JWT-based authentication for secure access to protected routes
- Admin role for privileged users with additional permissions


### Blog Posts:
- Create, read, update, and delete (CRUD) operations for blog posts
- Category for organizing blog posts
- Featured image upload via firebase for each blog post


### Comments:
- Users can leave and like comments on blog posts as well as the ability to edit


### Search:
- Search functionality to find blog posts based on keywords
- Filter blog posts by category
- Sort blog posts


### User Dashboard:
- Dashboard for authenticated users to change profile pictures and update username, email, password
- Display user-specific data and statistics


### Admin Dashboard:
- Special dashboard for admin users
- Manage blog posts, comments, and user accounts


### Responsive Design:
- Mobile-friendly and responsive layout using Tailwind CSS
- Optimized for various screen sizes and devices


## Technologies Used

### Frontend:

- React.js: JavaScript library for building user interfaces
- React Router: Library for handling client-side routing in React applications
- Axios: Promise-based HTTP client for making API requests
- Redux: Predictable state container for managing application state
  - Used for storing and managing user information across components
  - Utilized for handling the theme toggle between dark and light mode
- Tailwind CSS: CSS framework for quickly styling the application
- Flowbite: UI component library built on top of Tailwind CSS
- React Quill: Rich text editor component for React


### Backend:

- Node.js: JavaScript runtime for server-side development
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for storing blog posts, user information, and comments
- Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js
- Firebase Authentication: Service for handling user authentication, including Google login
- Firebase Storage: Cloud storage service for storing uploaded files
- JSON Web Token (JWT): Authentication mechanism for securing API endpoints
- bcrypt: Library for hashing passwords before storing them in the database


### Development Tools:

- Vite: Fast build tool for modern web applications
