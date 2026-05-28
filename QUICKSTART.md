# Quick Start

Get running in 3 minutes.

## Tech Stack Used

- **Backend**: Node.js + Express.js
- **Database**: Aiven MySQL (Cloud)
- **Deployment**: Render
- **API Docs**: Swagger UI

## Live Demo

**API**: https://github-analyzer-1vki.onrender.com
**Swagger**: https://github-analyzer-1vki.onrender.com/api-docs

## Local Setup

```bash
# 1. Install
git clone https://github.com/uvenkatateja/github-analyzer.git
cd github-analyzer
npm install

# 2. Configure
cp .env.example .env
# Edit .env with your Aiven MySQL credentials

# 3. Start (database table auto-created)
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

## Database Setup

**Using Aiven MySQL (Free)**:
1. Sign up at https://aiven.io/
2. Create MySQL service (free tier)
3. Copy connection details to `.env`
4. Set `DB_SSL=true`

**Local MySQL** (alternative):
```bash
mysql -u root -p -e "CREATE DATABASE github_analyzer;"
```

## Troubleshooting

**Database connection failed?**
- Check Aiven MySQL is running
- Verify `.env` credentials
- Ensure `DB_SSL=true` for Aiven

**Port in use?**
- Change `PORT` in `.env`

**Rate limit hit?**
- Add `GITHUB_TOKEN` in `.env` (increases limit 60→5000/hr)
- Get token: https://github.com/settings/tokens

## Deployment

**Live on Render**: https://github-analyzer-1vki.onrender.com

See `DEPLOYMENT.md` for deployment guide.
