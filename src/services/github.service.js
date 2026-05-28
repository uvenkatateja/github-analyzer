const axios = require('axios');
const NodeCache = require('node-cache');

// Cache with 10-minute TTL
const cache = new NodeCache({ stdTTL: 600 });

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Profile-Analyzer'
    };

    // Add GitHub token if available
    if (process.env.GITHUB_TOKEN) {
      this.headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
  }

  // Fetch user profile from GitHub
  async fetchUserProfile(username, skipCache = false) {
    const cacheKey = `profile_${username}`;

    // Check cache unless skipCache is true
    if (!skipCache) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await axios.get(`${this.baseURL}/users/${username}`, {
        headers: this.headers
      });

      const data = response.data;

      // Cache the result
      cache.set(cacheKey, data);

      return data;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          const err = new Error(`GitHub user '${username}' not found`);
          err.isGitHubNotFound = true;
          err.statusCode = 404;
          throw err;
        }

        if (error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
          const resetTime = error.response.headers['x-ratelimit-reset'];
          const resetDate = new Date(resetTime * 1000);
          const err = new Error('GitHub API rate limit exceeded');
          err.isRateLimitError = true;
          err.statusCode = 429;
          err.details = {
            resetAt: resetDate.toISOString(),
            message: 'Rate limit will reset at ' + resetDate.toLocaleString()
          };
          throw err;
        }
      }

      throw error;
    }
  }

  // Fetch user repositories from GitHub
  async fetchUserRepos(username, skipCache = false) {
    const cacheKey = `repos_${username}`;

    // Check cache unless skipCache is true
    if (!skipCache) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    try {
      // Fetch all repos (up to 100 per page, max 3 pages = 300 repos)
      const repos = [];
      let page = 1;
      const perPage = 100;

      while (page <= 3) {
        const response = await axios.get(`${this.baseURL}/users/${username}/repos`, {
          headers: this.headers,
          params: {
            per_page: perPage,
            page: page,
            sort: 'updated',
            direction: 'desc'
          }
        });

        repos.push(...response.data);

        // Break if we got fewer results than requested (last page)
        if (response.data.length < perPage) {
          break;
        }

        page++;
      }

      // Cache the result
      cache.set(cacheKey, repos);

      return repos;
    } catch (error) {
      if (error.response && error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const resetDate = new Date(resetTime * 1000);
        const err = new Error('GitHub API rate limit exceeded');
        err.isRateLimitError = true;
        err.statusCode = 429;
        err.details = {
          resetAt: resetDate.toISOString(),
          message: 'Rate limit will reset at ' + resetDate.toLocaleString()
        };
        throw err;
      }

      throw error;
    }
  }

  // Clear cache for a specific username
  clearCache(username) {
    cache.del(`profile_${username}`);
    cache.del(`repos_${username}`);
  }
}

module.exports = new GitHubService();
