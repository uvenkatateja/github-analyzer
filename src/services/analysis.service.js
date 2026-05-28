const githubService = require('./github.service');

class AnalysisService {
  // Analyze GitHub profile and derive insights
  async analyzeProfile(username, skipCache = false) {
    // Fetch user profile
    const profile = await githubService.fetchUserProfile(username, skipCache);

    // Fetch user repositories
    const repos = await githubService.fetchUserRepos(username, skipCache);

    // Calculate most used language
    const mostUsedLanguage = this.calculateMostUsedLanguage(repos);

    // Calculate average stars per repository
    const avgStarsPerRepo = this.calculateAvgStars(repos);

    // Calculate account age in days
    const accountAgeDays = this.calculateAccountAge(profile.created_at);

    // Calculate activity score
    const activityScore = this.calculateActivityScore(
      profile.followers,
      profile.public_repos,
      profile.public_gists
    );

    // Return analyzed data
    return {
      username: profile.login,
      name: profile.name,
      bio: profile.bio,
      blog: profile.blog,
      company: profile.company,
      location: profile.location,
      email: profile.email,
      hireable: profile.hireable,
      avatar_url: profile.avatar_url,
      public_repos: profile.public_repos,
      public_gists: profile.public_gists,
      followers: profile.followers,
      following: profile.following,
      most_used_language: mostUsedLanguage,
      avg_stars_per_repo: avgStarsPerRepo,
      account_age_days: accountAgeDays,
      activity_score: activityScore
    };
  }

  // Calculate most used programming language
  calculateMostUsedLanguage(repos) {
    if (!repos || repos.length === 0) {
      return null;
    }

    const languageCounts = {};

    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    if (Object.keys(languageCounts).length === 0) {
      return null;
    }

    // Find language with highest count
    let mostUsed = null;
    let maxCount = 0;

    for (const [language, count] of Object.entries(languageCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostUsed = language;
      }
    }

    return mostUsed;
  }

  // Calculate average stars per repository
  calculateAvgStars(repos) {
    if (!repos || repos.length === 0) {
      return 0;
    }

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    return parseFloat((totalStars / repos.length).toFixed(2));
  }

  // Calculate account age in days
  calculateAccountAge(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Calculate activity score
  calculateActivityScore(followers, publicRepos, publicGists) {
    return (followers * 2) + (publicRepos * 3) + publicGists;
  }
}

module.exports = new AnalysisService();
