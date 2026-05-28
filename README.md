# GitHub Profile Analyzer API

A production-ready REST API that fetches GitHub user profile data via the GitHub public API, derives useful insights, stores them in MySQL, and exposes well-designed endpoints with Swagger documentation.

## Features

- **GitHub Profile Analysis**: Fetch public profile data and repositories from GitHub
- **Derived Insights**: Calculate metrics like most used language, average stars, account age, and activity score
- **MySQL Storage**: Store analyzed profiles with automatic table initialization
- **RESTful API**: Clean, versioned endpoints following REST conventions
- **Caching**: 10-minute cache for GitHub API responses using node-cache
- **Rate Limiting**: Global and endpoint-specific rate limits
- **Input Validation**: Comprehensive validation using express-validator
- **Security**: Helmet, CORS, and compression middleware
- **Swagger Documentation**: Interactive API documentation (development only)
- **Error Handling**: Centralized error handling with detailed responses
- **GitHub Token Support**: Optional token for higher rate limits (5000 req/hr vs 60)

## Tech Stack

- **Node.js** (>=18)
- **Express.js** - Web framework
- **MySQL** (mysql2) - Database with connection pooling
- **axios** - HTTP client for GitHub API calls
- **Swagger UI** - API documentation
- **Additional**: dotenv, express-rate-limit, node-cache, express-validator, morgan, helmet, cors, compression

## Project Structure

```
github-analyzer/
├── src/
│   ├── config/
│   │   ├── db.js              # MySQL pool + auto table init
│   │   └── swagger.js         # Swagger configuration
│   ├── controllers/
│   │   └── profile.controller.js
│   ├── services/
│   │   ├── github.service.js  # GitHub API calls
│   │   └── analysis.service.js # Insights calculation
│   ├── routes/
│   │   └── v1/
│   │       └── profile.routes.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   ├── models/
│   │   └── profile.model.js   # SQL query functions
│   └── app.js                 # Express app setup
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js                  # Entry point
```

## Local Setup

### Prerequisites

- Node.js >= 18
- MySQL database
- Git

### Installation Steps

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd github-analyzer
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

4. **Start the server**

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `DB_HOST` | MySQL host | Yes | - |
| `DB_PORT` | MySQL port | No | 3306 |
| `DB_USER` | MySQL username | Yes | - |
| `DB_PASSWORD` | MySQL password | Yes | - |
| `DB_NAME` | MySQL database name | Yes | - |
| `DB_SSL` | Enable SSL for DB (true/false) | No | false |
| `GITHUB_TOKEN` | GitHub personal access token (optional, increases rate limit from 60 to 5000 req/hr) | No | - |
| `RENDER_URL` | Production URL (for Swagger in production) | No | - |
| `CORS_ORIGIN` | CORS allowed origin | No | * (dev only) |

### Example .env file

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=github_analyzer
DB_SSL=false
GITHUB_TOKEN=ghp_yourtoken
RENDER_URL=
CORS_ORIGIN=*
```

## API Endpoints

All endpoints are versioned under `/api/v1/` and follow this response envelope:

```json
{
  "success": true/false,
  "data": {...} or [...],
  "message": "...",
  "meta": { /* pagination if applicable */ }
}
```

### Endpoints Table

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/profiles/analyze` | Fetch from GitHub, analyze, and store profile |
| GET | `/api/v1/profiles` | List all analyzed profiles (paginated) |
| GET | `/api/v1/profiles/:username` | Get single stored profile |
| DELETE | `/api/v1/profiles/:username` | Remove profile from database |
| PUT | `/api/v1/profiles/:username/refresh` | Re-fetch from GitHub and update |
| GET | `/health` | Health check endpoint |

### 1. Analyze Profile

**POST** `/api/v1/profiles/analyze`

Fetch GitHub profile data, calculate insights, and store in database.

**Request Body:**
```json
{
  "username": "octocat"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "octocat",
    "name": "The Octocat",
    "bio": "GitHub mascot",
    "blog": "https://github.blog",
    "company": "@github",
    "location": "San Francisco",
    "email": "octocat@github.com",
    "hireable": true,
    "avatar_url": "https://avatars.githubusercontent.com/u/583231",
    "public_repos": 8,
    "public_gists": 8,
    "followers": 9999,
    "following": 9,
    "most_used_language": "JavaScript",
    "avg_stars_per_repo": 125.50,
    "account_age_days": 4500,
    "activity_score": 20030,
    "analyzed_at": "2026-05-28T10:00:00.000Z",
    "updated_at": "2026-05-28T10:00:00.000Z"
  },
  "message": "Profile analyzed and stored successfully"
}
```

### 2. Get All Profiles

**GET** `/api/v1/profiles?page=1&limit=10`

Retrieve all analyzed profiles with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Response (200):**
```json
{
  "success": true,
  "data": [ /* array of profiles */ ],
  "message": "Profiles retrieved successfully",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 3. Get Single Profile

**GET** `/api/v1/profiles/:username`

Retrieve a specific profile from database.

**Response (200):**
```json
{
  "success": true,
  "data": { /* profile object */ },
  "message": "Profile retrieved successfully"
}
```

### 4. Delete Profile

**DELETE** `/api/v1/profiles/:username`

Remove a profile from the database.

**Response (200):**
```json
{
  "success": true,
  "data": null,
  "message": "Profile deleted successfully"
}
```

### 5. Refresh Profile

**PUT** `/api/v1/profiles/:username/refresh`

Re-fetch data from GitHub and update stored profile.

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated profile object */ },
  "message": "Profile refreshed successfully"
}
```

### 6. Health Check

**GET** `/health`

Check API and database status.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 12345.67,
    "timestamp": "2026-05-28T10:00:00.000Z",
    "database": "connected"
  },
  "message": "Service is running"
}
```

## Swagger Documentation

Interactive API documentation is available at `/api-docs` **only in development mode**.

**Access Swagger UI:**
- Development: `http://localhost:3000/api-docs`
- Production: Returns 404 (documentation not exposed)

The Swagger UI provides:
- Complete API documentation
- Request/response schemas
- Interactive testing interface
- Example requests and responses

## Derived Insights

Beyond raw GitHub data, the API calculates:

1. **Most Used Language**: Analyzes all repositories to find the most frequently used programming language
2. **Average Stars Per Repo**: Calculates mean stargazers across all repositories
3. **Account Age (Days)**: Days since account creation
4. **Activity Score**: Calculated as `(followers × 2) + (public_repos × 3) + public_gists`

## Rate Limiting

- **Global**: 100 requests per 15 minutes per IP
- **Analyze Endpoint**: 10 requests per minute per IP (stricter)

Rate limit headers are included in responses.

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "details": { /* optional additional info */ }
}
```

**Common Status Codes:**
- `404`: GitHub user not found or profile not in database
- `422`: Validation error (invalid input)
- `429`: Rate limit exceeded
- `500`: Internal server error

## Database Schema

The `profiles` table is automatically created on startup:

```sql
CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  bio TEXT,
  blog VARCHAR(500),
  company VARCHAR(255),
  location VARCHAR(255),
  email VARCHAR(255),
  hireable BOOLEAN,
  avatar_url VARCHAR(500),
  public_repos INT DEFAULT 0,
  public_gists INT DEFAULT 0,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  most_used_language VARCHAR(100),
  avg_stars_per_repo DECIMAL(10, 2) DEFAULT 0,
  account_age_days INT DEFAULT 0,
  activity_score INT DEFAULT 0,
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_analyzed_at (analyzed_at)
);
```

## Deployment to Render

### Prerequisites

1. GitHub repository with your code
2. Render account
3. MySQL database (PlanetScale, Railway, or Render MySQL)

### Steps

1. **Push code to GitHub**

```bash
git init
git add .
git commit -m "initial: scaffold github profile analyzer api"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Create Web Service on Render**

- Go to [Render Dashboard](https://dashboard.render.com/)
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Configure:
  - **Name**: github-analyzer
  - **Environment**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Plan**: Free or paid

3. **Add Environment Variables**

In Render dashboard, add all required environment variables from the table above.

4. **Configure Health Check**

- Set Health Check Path: `/health`

5. **Deploy**

Render will automatically deploy your application. The build uses Node 18+ based on the `engines` field in `package.json`.

### Important Render Configuration

- Ensure `DB_SSL=true` if using PlanetScale or Railway MySQL
- Set `NODE_ENV=production`
- Set `RENDER_URL` to your deployed URL (e.g., `https://your-app.onrender.com`)
- Configure `CORS_ORIGIN` appropriately for production

## Testing with Postman

1. Import the API endpoints into Postman
2. Set base URL: `http://localhost:3000` (local) or your deployed URL
3. Test each endpoint with sample data

**Sample Test Flow:**
1. POST `/api/v1/profiles/analyze` with `{"username": "octocat"}`
2. GET `/api/v1/profiles` to list all profiles
3. GET `/api/v1/profiles/octocat` to get specific profile
4. PUT `/api/v1/profiles/octocat/refresh` to update data
5. DELETE `/api/v1/profiles/octocat` to remove profile

Export your Postman collection and include it in your submission.

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Code Quality

- All async operations use async/await
- Database queries isolated in models
- GitHub API logic in services
- Controllers stay thin
- Centralized error handling
- No console.log in production (uses morgan)

## License

ISC

## Support

For issues or questions, please open an issue in the GitHub repository.
