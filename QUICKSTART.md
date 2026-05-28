# Quick Start Guide

Get the GitHub Profile Analyzer API running locally in 5 minutes.

## Prerequisites

- Node.js 18 or higher
- MySQL database running locally or remotely
- Git

## Installation

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd github-analyzer
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=github_analyzer
DB_SSL=false
GITHUB_TOKEN=
RENDER_URL=
CORS_ORIGIN=*
```

### 3. Setup Database

**Option A: Automatic (Recommended)**

The application automatically creates the database table on startup. Just ensure your MySQL server is running and the database exists:

```sql
CREATE DATABASE github_analyzer;
```

**Option B: Manual**

Run the provided schema file:

```bash
mysql -u root -p < database-schema.sql
```

### 4. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

You should see:

```
✓ Database connection established successfully
✓ Database table initialized
✓ Server running on port 3000
✓ Environment: development
✓ Swagger UI available at http://localhost:3000/api-docs
```

## Test the API

### Using cURL

**1. Health Check**

```bash
curl http://localhost:3000/health
```

**2. Analyze a Profile**

```bash
curl -X POST http://localhost:3000/api/v1/profiles/analyze \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"octocat\"}"
```

**3. Get All Profiles**

```bash
curl http://localhost:3000/api/v1/profiles
```

**4. Get Single Profile**

```bash
curl http://localhost:3000/api/v1/profiles/octocat
```

**5. Refresh Profile**

```bash
curl -X PUT http://localhost:3000/api/v1/profiles/octocat/refresh
```

**6. Delete Profile**

```bash
curl -X DELETE http://localhost:3000/api/v1/profiles/octocat
```

### Using Postman

1. Import `GitHub-Analyzer-API.postman_collection.json`
2. Ensure `baseUrl` variable is set to `http://localhost:3000`
3. Run requests in order

### Using Swagger UI

Open browser and navigate to:

```
http://localhost:3000/api-docs
```

Interactive documentation with "Try it out" buttons for each endpoint.

## Common Issues

### Database Connection Failed

**Error**: `Failed to connect to database`

**Solution**:
- Ensure MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Check database exists: `SHOW DATABASES;`

### Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
- Change `PORT` in `.env` to different value (e.g., 3001)
- Or kill process using port 3000

### GitHub API Rate Limit

**Error**: `GitHub API rate limit exceeded`

**Solution**:
- Add GitHub personal access token to `GITHUB_TOKEN` in `.env`
- This increases limit from 60 to 5000 requests/hour
- Get token at: https://github.com/settings/tokens

## Next Steps

1. **Explore Swagger UI**: http://localhost:3000/api-docs
2. **Test with different GitHub users**: Try `torvalds`, `gaearon`, `tj`
3. **Check database**: `SELECT * FROM profiles;`
4. **Review logs**: Watch console output for request logs
5. **Deploy to production**: See `DEPLOYMENT.md`

## Sample Workflow

```bash
# 1. Analyze multiple profiles
curl -X POST http://localhost:3000/api/v1/profiles/analyze \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"octocat\"}"

curl -X POST http://localhost:3000/api/v1/profiles/analyze \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"torvalds\"}"

curl -X POST http://localhost:3000/api/v1/profiles/analyze \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"gaearon\"}"

# 2. List all analyzed profiles
curl http://localhost:3000/api/v1/profiles

# 3. Get specific profile
curl http://localhost:3000/api/v1/profiles/torvalds

# 4. Refresh data (re-fetch from GitHub)
curl -X PUT http://localhost:3000/api/v1/profiles/torvalds/refresh

# 5. Delete a profile
curl -X DELETE http://localhost:3000/api/v1/profiles/octocat
```

## Development Tips

- **Auto-reload**: Use `npm run dev` for automatic server restart on file changes
- **Logs**: All requests logged via morgan in combined format
- **Errors**: Detailed error messages in development mode
- **Cache**: GitHub API responses cached for 10 minutes
- **Validation**: All inputs validated with express-validator

## Project Structure

```
src/
├── config/          # Database and Swagger configuration
├── controllers/     # Request handlers
├── services/        # Business logic (GitHub API, analysis)
├── routes/          # API route definitions
├── middleware/      # Error handling, validation, rate limiting
├── models/          # Database queries
└── app.js           # Express app setup
```

## Need Help?

- Check `README.md` for full documentation
- Review `DEPLOYMENT.md` for production deployment
- Open an issue on GitHub
- Check logs for detailed error messages
