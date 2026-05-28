# GitHub Profile Analyzer API

REST API that fetches GitHub profiles, calculates insights, and stores them in MySQL.

## Tech Stack

Node.js + Express.js + MySQL + axios + Swagger UI

## Quick Setup

**1. Install**
```bash
git clone <repo-url>
cd github-analyzer
npm install
```

**2. Configure**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

**3. Run**
```bash
npm run dev  # Development with auto-reload
npm start    # Production
```

Server runs at `http://localhost:3000`

## Environment Variables (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=github_analyzer
GITHUB_TOKEN=ghp_yourtoken  # Optional: increases rate limit to 5000/hr
```

## API Endpoints

Base URL: `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/profiles/analyze` | Analyze GitHub profile and store |
| GET | `/profiles` | List all profiles (paginated) |
| GET | `/profiles/:username` | Get single profile |
| DELETE | `/profiles/:username` | Delete profile |
| PUT | `/profiles/:username/refresh` | Refresh profile data |
| GET | `/health` | Health check |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/v1/profiles/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

**Swagger UI:** `http://localhost:3000/api-docs` (dev only)

## Features

- Fetches GitHub profile + repositories
- Calculates: most used language, avg stars, account age, activity score
- MySQL storage with auto table creation
- Caching (10 min), rate limiting, validation
- Postman collection included

## Deployment

See `DEPLOYMENT.md` for Render deployment guide.

## Files

- `README.md` - This file
- `QUICKSTART.md` - Quick setup guide
- `DEPLOYMENT.md` - Deployment instructions
- `database-schema.sql` - Database schema
- `GitHub-Analyzer-API.postman_collection.json` - Postman collection
