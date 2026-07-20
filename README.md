# Blog Platform

A full-stack blogging platform built as an internship project.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React (Vite), Tailwind CSS, React Router, Axios |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB with Mongoose                   |
| Auth       | JWT (access token) + bcrypt             |
| State      | React Context API                       |

## Features

- Register, log in, log out
- Create, edit, delete your own blog posts
- Posts support title, content, cover image URL, tags, and timestamps
- All visitors can read posts; only logged-in users can create/edit/delete
- Logged-in users can comment on posts
- Comment authors can edit and delete their own comments
- Post authors can delete any comment on their post
- Paginated post feed with "My Posts" filter
- Toast notifications for all actions
- Global error boundary and 404 page

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone and install

```bash
git clone <your-repo-url>
cd blog-platform

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
# Edit .env and fill in your values
```

### 3. Run both servers

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- Health check: http://localhost:5000/api/health

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint        | Auth     | Description          |
|--------|-----------------|----------|----------------------|
| POST   | `/register`     | Public   | Register new user    |
| POST   | `/login`        | Public   | Login, returns JWT   |
| GET    | `/me`           | Required | Get current user     |

### Posts — `/api/posts`

| Method | Endpoint  | Auth     | Description                        |
|--------|-----------|----------|------------------------------------|
| GET    | `/`       | Public   | List all posts (paginated)         |
| GET    | `/:id`    | Public   | Get single post                    |
| POST   | `/`       | Required | Create post                        |
| PUT    | `/:id`    | Required | Edit post (author only)            |
| DELETE | `/:id`    | Required | Delete post (author only)          |

### Comments — `/api/posts/:postId/comments` and `/api/comments`

| Method | Endpoint                        | Auth     | Description                              |
|--------|---------------------------------|----------|------------------------------------------|
| GET    | `/api/posts/:postId/comments`   | Public   | List comments for a post                 |
| POST   | `/api/posts/:postId/comments`   | Required | Add a comment                            |
| PUT    | `/api/comments/:id`             | Required | Edit comment (comment author only)       |
| DELETE | `/api/comments/:id`             | Required | Delete comment (comment or post author)  |

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Render + Vercel instructions.
