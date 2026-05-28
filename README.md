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

### Core Features (Required)
- **GitHub Profile Analysis** - Fetch public profile data using GitHub API
- **Repository Analysis** - Fetch and analyze all user repositories
- **MySQL Storage** - Store analyzed profiles with timestamps
- **List All Profiles** - Paginated endpoint to fetch all stored profiles
- **Single Profile Lookup** - Get specific profile by username
- **RESTful API** - Clean, versioned endpoints under `/api/v1`

### Advanced Insights (Bonus)
- **Most Used Language** - Analyzes all repos to find primary language
- **Average Stars** - Calculates mean stars across repositories
- **Account Age** - Days since GitHub account creation
- **Activity Score** - Custom formula: `(followers × 2) + (repos × 3) + gists`
- **Profile Metadata** - Bio, blog, company, location, hireable status

### Additional Endpoints (Bonus)
- **Refresh Profile** - Re-fetch and update existing profile data
- **Delete Profile** - Remove profile from database
- **Health Check** - Monitor API and database status

### Performance & Optimization
- **Caching** - 10-minute cache for GitHub API responses (node-cache)
- **Rate Limiting** - Global (100/15min) + Analyze endpoint (10/min)
- **Upsert Logic** - Updates existing profiles instead of duplicating
- **Pagination** - Max 50 items per page with metadata

### Security & Validation
- **Helmet** - Security headers
- **CORS** - Configurable cross-origin requests
- **Input Validation** - express-validator with field-level errors
- **SQL Injection Prevention** - Parameterized queries
- **Compression** - Response compression for production

### Developer Experience
- **Swagger UI** - Interactive API documentation
- **Request Logging** - Morgan in combined format
- **Centralized Error Handling** - Proper HTTP status codes
- **Auto Database Setup** - Creates tables on startup
- **GitHub Token Support** - Optional token for 5000 req/hr (vs 60)
- **Postman Collection** - Ready-to-import API tests

### Production Ready
- **Deployed on Render** - Live API with auto-deploy from GitHub
- **Cloud Database** - Aiven MySQL with SSL
- **Connection Pooling** - Efficient database connections
- **Timestamps** - `analyzed_at` and `updated_at` tracking
- **Environment Aware** - Different configs for dev/production

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
