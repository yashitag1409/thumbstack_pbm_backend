# 📚 Thumbstack PBM Backend

Backend service for the **Thumbstack Personal Book Management (PBM) System**.
This API allows users to **register, authenticate, and manage their personal book collection**, including **categories, authors, and books** with full CRUD functionality.

---

# 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**
- **REST API Architecture**

---

## 📂 Project Structure

```
thumbstack_pbm_backend
│
├── src
│   │
│   ├── controllers                # Handles request logic and responses
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── author.controller.js
│   │   ├── books.controller.js
│   │   ├── category.controller.js
│   │   └── cors.controller.js
│   │
│   ├── database                   # Database related files
│   │   │
│   │   ├── model                  # Mongoose model definitions
│   │   │   ├── author.model.js
│   │   │   ├── book.model.js
│   │   │   ├── category.model.js
│   │   │   ├── cors.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── schema                 # Schema structure for MongoDB collections
│   │   │   ├── author.schema.js
│   │   │   ├── book.schema.js
│   │   │   ├── category.schema.js
│   │   │   ├── cors.schema.js
│   │   │   └── user.schema.js
│   │   │
│   │   └── index.js               # MongoDB connection configuration
│   │
│   ├── routes                     # API route definitions
│   │   ├── auth.route.js
│   │   ├── author.route.js
│   │   ├── book.route.js
│   │   ├── category.route.js
│   │   └── index.route.js         # Combines all routes
│   │
│   ├── utility                    # Helper utilities
│   │   │
│   │   ├── mail                   # Email related utilities
│   │   │   ├── mailMessage.js
│   │   │   └── sendmail.js
│   │   │
│   │   └── middleware             # Application middlewares
│   │       ├── auth.middleware.js
│   │       ├── multer.middleware.js
│   │       └── cloudinary.js
│   │
│   ├── app.js                     # Express app configuration
│   └── index.js                   # Application entry point
│
├── .env                           # Environment variables
├── .gitignore                     # Files ignored by Git
├── package.json                   # Project dependencies
├── package-lock.json
└── README.md                      # Project documentation
```

---

## 🧩 Architecture Overview

The backend follows a **layered architecture**:

**Route → Controller → Model → Schema → Database**

### 1️⃣ Routes

Define API endpoints and map them to controllers.

Example:

```
POST /api/auth/register
GET /api/books
POST /api/category
```

---

### 2️⃣ Controllers

Controllers handle the **business logic** and process incoming requests.

Example:

- User authentication
- Creating books
- Managing authors
- Managing categories

---

### 3️⃣ Models

Models interact with **MongoDB collections** using Mongoose.

They represent database entities such as:

- Users
- Books
- Authors
- Categories

---

### 4️⃣ Schemas

Schemas define the **structure of documents stored in MongoDB**.

Example fields:

- Book title
- Author reference
- Category reference
- User details

---

### 5️⃣ Middleware

Middleware handles reusable logic such as:

- Authentication verification
- File uploads
- Image storage with Cloudinary

---

### 6️⃣ Utilities

Utility functions provide reusable services such as:

- Sending emails
- Mail message templates
- Other helper functions

---

## 🔄 Request Flow

A typical API request flows like this:

```
Client Request
      │
      ▼
Routes
      │
      ▼
Controller
      │
      ▼
Model
      │
      ▼
Schema
      │
      ▼
MongoDB Database
      │
      ▼
Response sent back to Client
```

This structure ensures **clean code separation and maintainability**.

# ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/yashitag1409/thumbstack_pbm_backend.git
cd thumbstack_pbm_backend
```

---

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Create Environment File

Create a `.env` file in the root directory.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Start the Server

```
npm run dev
```

or

```
npm start
```

Server will run on:

```
http://localhost:5000
```

---

# 🔐 Authentication Flow

The backend uses **JWT-based authentication**.

### Step 1 – Register User

```
POST /api/auth/register
```

Request Body

```
{
  "name": "Yashit",
  "email": "yashit@example.com",
  "password": "password123"
}
```

Response

```
User created successfully
```

---

### Step 2 – Login User

```
POST /api/auth/login
```

Request Body

```
{
  "email": "yashit@example.com",
  "password": "password123"
}
```

Response

```
{
  "token": "JWT_TOKEN"
}
```

This token must be used in protected APIs.

Header:

```
Authorization: Bearer JWT_TOKEN
```

---

# 📚 Application Workflow

The typical workflow of the system:

1. User registers an account
2. User logs in and receives a JWT token
3. User creates **categories**
4. User creates **authors**
5. User adds **books**
6. User can update or delete any resource
7. User can fetch lists of categories, authors, and books

---

# 📁 Category APIs

### Create Category

```
POST /api/categories
```

Request

```
{
  "name": "Fiction"
}
```

---

### Get All Categories

```
GET /api/categories
```

---

### Update Category

```
PUT /api/categories/:id
```

---

### Delete Category

```
DELETE /api/categories/:id
```

---

# ✍️ Author APIs

### Create Author

```
POST /api/authors
```

Request

```
{
  "name": "J.K. Rowling"
}
```

---

### Get All Authors

```
GET /api/authors
```

---

### Update Author

```
PUT /api/authors/:id
```

---

### Delete Author

```
DELETE /api/authors/:id
```

---

# 📖 Book APIs

### Add Book

```
POST /api/books
```

Request

```
{
  "title": "Harry Potter",
  "authorId": "AUTHOR_ID",
  "categoryId": "CATEGORY_ID",
  "publishedYear": 2001
}
```

---

### Get All Books

```
GET /api/books
```

---

### Get Book By ID

```
GET /api/books/:id
```

---

### Update Book

```
PUT /api/books/:id
```

---

### Delete Book

```
DELETE /api/books/:id
```

---

# 🔎 Filtering & Searching

Books can be filtered using query parameters.

Example:

```
GET /api/books?author=AUTHOR_ID
```

```
GET /api/books?category=CATEGORY_ID
```

---

# 🛡️ Middleware

### Authentication Middleware

Used to protect routes and verify JWT tokens.

```
Authorization: Bearer TOKEN
```

If token is valid → request proceeds
If invalid → unauthorized response

---

# 🧠 Data Models

### User

```
name
email
password
createdAt
```

---

### Category

```
name
createdBy
createdAt
```

---

### Author

```
name
createdBy
createdAt
```

---

### Book

```
title
author
category
publishedYear
createdBy
createdAt
```

---

# 🔁 CRUD Operations Supported

The backend supports full **CRUD operations** for:

- Users (register/login)
- Categories
- Authors
- Books

Operations include:

- Create
- Read
- Update
- Delete

---

# ❗ Error Handling

Standard API responses:

Success

```
{
  "success": true,
  "data": {}
}
```

Error

```
{
  "success": false,
  "message": "Error message"
}
```

---

# 🧪 API Testing

APIs can be tested using:

- Postman
- Thunder Client
- Insomnia

---

# 📦 Deployment

Example platforms:

- Render
- Railway
- AWS
- DigitalOcean

---

# 👨‍💻 Author

**Yashit Agrawal**

GitHub
https://github.com/yashitag1409

---

# 📜 License

This project is licensed under the MIT License.
