# GitHub Profile Analyzer API

REST API that fetches GitHub profiles, calculates insights, and stores them in MySQL.

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MySQL (Aiven Cloud)
- **Deployment**: Render
- **HTTP Client**: axios (for GitHub API)
- **Documentation**: Swagger UI
- **Security**: helmet, cors, compression
- **Validation**: express-validator
- **Rate Limiting**: express-rate-limit
- **Caching**: node-cache

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
PORT=3000
NODE_ENV=development
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=22430
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password
DB_NAME=defaultdb
DB_SSL=true
GITHUB_TOKEN=ghp_yourtoken  # Optional: increases rate limit to 5000/hr
CORS_ORIGIN=*
```

**Database**: Using Aiven MySQL (free tier)
**Deployment**: Render (free tier)

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

## Live Deployment

**Live API URL**: https://github-analyzer-1vki.onrender.com

**Swagger UI**: https://github-analyzer-1vki.onrender.com/api-docs

**Database**: Aiven MySQL (Cloud-hosted)

**Hosting**: Render (Free tier)

See `DEPLOYMENT.md` for detailed deployment guide.

## Files

- `README.md` - This file
- `QUICKSTART.md` - Quick setup guide
- `DEPLOYMENT.md` - Deployment instructions
- `database-schema.sql` - Database schema
- `GitHub-Analyzer-API.postman_collection.json` - Postman collection
