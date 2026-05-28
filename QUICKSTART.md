# Quick Start

Get running in 3 minutes.

## Setup

```bash
# 1. Install
git clone <repo-url>
cd github-analyzer
npm install

# 2. Configure
cp .env.example .env
# Edit .env with your MySQL credentials

# 3. Create database
mysql -u root -p -e "CREATE DATABASE github_analyzer;"

# 4. Start
npm run dev
```

Visit: `http://localhost:3000/api-docs`

## Test

**Analyze a profile:**
```bash
curl -X POST http://localhost:3000/api/v1/profiles/analyze \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

**Get all profiles:**
```bash
curl http://localhost:3000/api/v1/profiles
```

**Or use Swagger UI:** `http://localhost:3000/api-docs`

**Or import:** `GitHub-Analyzer-API.postman_collection.json` into Postman

## Troubleshooting

**Database connection failed?**
- Check MySQL is running
- Verify `.env` credentials

**Port in use?**
- Change `PORT` in `.env`

**Rate limit hit?**
- Add `GITHUB_TOKEN` in `.env` (increases limit 60→5000/hr)
- Get token: https://github.com/settings/tokens

## Next

- Deploy: See `DEPLOYMENT.md`
- Full docs: See `README.md`
