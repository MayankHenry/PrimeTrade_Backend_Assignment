# PrimeTrade Task Manager API

A scalable REST API with JWT authentication, role-based access control, and CRUD operations for task management. Includes a frontend UI for interacting with the API.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Auth:** JWT + bcryptjs
- **Validation:** express-validator
- **Docs:** Swagger (OpenAPI 3.0)
- **Frontend:** Vanilla HTML/CSS/JS

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running
- A database created (e.g. `primetrade_db`)

### Setup

1. Clone the repo:

```bash
git clone https://github.com/your-username/PrimeTrade_BackEnd_Assignment.git
cd PrimeTrade_BackEnd_Assignment/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create your `.env` file:

```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=primetrade_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=some_random_secret_string
JWT_EXPIRE=7d
```

5. Start the server:

```bash
npm run dev
```

The server will auto-create tables on first run via Sequelize sync.

### Access

- **Frontend:** http://localhost:5000
- **API Docs (Swagger):** http://localhost:5000/api-docs
- **Health Check:** http://localhost:5000/api/health

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register a new user |
| POST | `/api/v1/auth/login` | Public | Login and get JWT |
| GET | `/api/v1/auth/me` | Private | Get logged-in user profile |

### Tasks

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/tasks` | Private | Get all tasks (user: own, admin: all) |
| GET | `/api/v1/tasks/:id` | Private | Get a single task |
| POST | `/api/v1/tasks` | Private | Create a task |
| PUT | `/api/v1/tasks/:id` | Private | Update a task |
| DELETE | `/api/v1/tasks/:id` | Private | Delete a task |

### Authentication

All private routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

### Roles

- **user** — can create, read, update, and delete their own tasks
- **admin** — can view and manage all users' tasks

## Project Structure

```
backend/
├── config/         # database connection
├── controllers/    # route handlers
├── docs/           # swagger config
├── middleware/      # auth, role, validation
├── models/         # sequelize models
├── routes/v1/      # versioned API routes
├── utils/          # helper classes
└── server.js       # app entry point

frontend/
├── css/            # styles
├── js/             # client-side logic
├── index.html      # auth page
└── dashboard.html  # task management
```

## Database Schema

### Users

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key, auto-generated |
| name | VARCHAR | Not null |
| email | VARCHAR | Not null, unique |
| password | VARCHAR | Not null, hashed |
| role | ENUM | 'user' or 'admin', default 'user' |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

### Tasks

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key, auto-generated |
| title | VARCHAR | Not null |
| description | TEXT | Nullable |
| status | ENUM | 'pending', 'in-progress', 'completed' |
| priority | ENUM | 'low', 'medium', 'high' |
| userId | UUID | Foreign Key → Users(id) |
| createdAt | TIMESTAMP | Auto |
| updatedAt | TIMESTAMP | Auto |

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiry
- Input validation via express-validator
- Role-based route protection
- XSS prevention on frontend output
- CORS enabled

## License

MIT
