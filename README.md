# 📚 AKSHARVAULT Thumbstack PBM Backend

Backend service for the **AKSHARVAULT: Personal Book Management (PBM) System**.

This API allows users to **register, authenticate, and manage their personal book collection**, including **categories, authors, and books** with full CRUD functionality.

---

# 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT Authentication**
* **REST API Architecture**
* **Cloudinary (Image Upload)**
* **Multer (File Upload)**
* **Nodemailer (Email Service)**

---

# 📂 Project Structure

```
thumbstack_pbm_backend
│
├── src
│   │
│   ├── controllers
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── author.controller.js
│   │   ├── books.controller.js
│   │   ├── category.controller.js
│   │   └── cors.controller.js
│   │
│   ├── database
│   │   │
│   │   ├── model
│   │   │   ├── author.model.js
│   │   │   ├── book.model.js
│   │   │   ├── category.model.js
│   │   │   ├── cors.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── schema
│   │   │   ├── author.schema.js
│   │   │   ├── book.schema.js
│   │   │   ├── category.schema.js
│   │   │   ├── cors.schema.js
│   │   │   └── user.schema.js
│   │   │
│   │   └── index.js
│   │
│   ├── routes
│   │   ├── auth.route.js
│   │   ├── author.route.js
│   │   ├── book.route.js
│   │   ├── category.route.js
│   │   └── index.route.js
│   │
│   ├── utility
│   │   │
│   │   ├── mail
│   │   │   ├── mailMessage.js
│   │   │   └── sendmail.js
│   │   │
│   │   └── middleware
│   │       ├── auth.middleware.js
│   │       ├── multer.middleware.js
│   │       └── cloudinary.js
│   │
│   ├── app.js
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# 🧩 Architecture Overview

The backend follows a **layered architecture**.

```
Route → Controller → Model → Schema → Database
```

### Routes

Define API endpoints and connect them to controllers.

### Controllers

Handle request processing and business logic.

### Models

Interact with MongoDB collections using Mongoose.

### Schemas

Define the structure of documents stored in MongoDB.

### Middleware

Reusable logic such as authentication and file uploads.

### Utilities

Helper services like email sending and template generation.

---

# 🔄 Request Flow

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
Response to Client
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```
git clone https://github.com/yashitag1409/thumbstack_pbm_backend.git
cd thumbstack_pbm_backend
```

---

## 2️⃣ Install Dependencies

```
npm install
```

---

## 3️⃣ Create Environment File

Create a `.env` file in the root directory.

Example:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAIL_USER=your_email
MAIL_PASS=your_email_password
```

---

## 4️⃣ Start the Server

Development:

```
npm run dev
```

Production:

```
npm start
```

Server runs at:

```
http://localhost:5000
```

---

# 🔐 Authentication Flow

JWT is used for authentication.

## Register User

```
POST /api/auth/register
```

### Required Fields

| Field       | Type   | Description                |
| ----------- | ------ | -------------------------- |
| name        | String | User name                  |
| email       | String | Unique email               |
| password    | String | Minimum 6 characters       |
| contact     | String | User contact number        |
| countryCode | String | Country code (default +91) |

### Example Request

```
{
 "name":"Yashit Agrawal",
 "email":"yashit@example.com",
 "password":"password123",
 "contact":"9876543210",
 "countryCode":"+91"
}
```

---

## Login User

```
POST /api/auth/login
```

### Example Request

```
{
 "email":"yashit@example.com",
 "password":"password123"
}
```

### Response

```
{
 "token":"JWT_TOKEN"
}
```

Use token in headers:

```
Authorization: Bearer JWT_TOKEN
```

---

# 📚 Category Management

Categories help organize books.

## Create Category

```
POST /api/categories
```

### Required Fields

| Field | Type     | Description     |
| ----- | -------- | --------------- |
| name  | String   | Category name   |
| user  | ObjectId | Creator user ID |

### Optional Fields

| Field           | Description             |
| --------------- | ----------------------- |
| slug            | URL friendly name       |
| description     | Category description    |
| isSystemDefault | Default system category |

---

# ✍️ Author Management

## Create Author

```
POST /api/authors
```

### Required Fields

| Field | Type     | Description     |
| ----- | -------- | --------------- |
| name  | String   | Author name     |
| user  | ObjectId | Creator user ID |

### Optional Fields

| Field        | Description      |
| ------------ | ---------------- |
| biography    | Author biography |
| website      | Author website   |
| profileImage | Author image     |

---

# 📖 Book Management

Books are the core entity.

## Add Book

```
POST /api/books
```

### Required Fields

| Field       | Type     | Description      |
| ----------- | -------- | ---------------- |
| user        | ObjectId | Owner user ID    |
| title       | String   | Book title       |
| description | String   | Book description |

### Optional Fields

| Field          | Description                        |
| -------------- | ---------------------------------- |
| category       | Reference category                 |
| customCategory | Custom category name               |
| author         | Reference author                   |
| customAuthor   | Custom author                      |
| tags           | Book tags                          |
| numberOfPages  | Total pages                        |
| pages          | Array of pages                     |
| thumbNail      | Book image                         |
| status         | reading / want_to_read / completed |
| isFavorite     | Favorite book                      |

---

# 📄 Book Pages Structure

```
{
 "pages":[
   {
     "page_url":"https://example.com/page1.png",
     "page_no":1
   },
   {
     "page_url":"https://example.com/page2.png",
     "page_no":2
   }
 ]
}
```

---

# ⭐ Book Status

Allowed values:

```
reading
want_to_read
completed
```

Default:

```
want_to_read
```

---

# 🌐 CORS Management

Admin can manage allowed origins.

### Required Fields

| Field   | Type     | Description          |
| ------- | -------- | -------------------- |
| origin  | String   | Allowed frontend URL |
| addedBy | ObjectId | Admin ID             |

### Optional Fields

| Field       | Description       |
| ----------- | ----------------- |
| credentials | Allow cookies     |
| status      | active / inactive |

---

# 🔄 Complete Application Workflow

1. User registers an account
2. User logs in and receives JWT token
3. User creates categories
4. User adds authors
5. User adds books
6. User uploads book pages
7. User updates book status
8. User marks books as favorite
9. User retrieves categories, authors, and books

---

# 🔁 CRUD Operations

| Entity     | Create | Read | Update | Delete |
| ---------- | ------ | ---- | ------ | ------ |
| Users      | ✅      | ✅    | ❌      | ❌      |
| Categories | ✅      | ✅    | ✅      | ✅      |
| Authors    | ✅      | ✅    | ✅      | ✅      |
| Books      | ✅      | ✅    | ✅      | ✅      |

---

# ❗ Error Handling

Standard response format.

### Success

```
{
 "success":true,
 "data":{}
}
```

### Error

```
{
 "success":false,
 "message":"Error message"
}
```

---

# 🧪 API Testing

Test APIs using:

* Postman
* Thunder Client
* Insomnia

---

# 📦 Deployment

You can deploy this backend on:

* Render
* Railway
* AWS
* DigitalOcean
* VPS / Docker

---

# 👨‍💻 Author

**Yashit Agrawal**

GitHub
https://github.com/yashitag1409

---

# 📜 License

This project is licensed under the **MIT License**.
