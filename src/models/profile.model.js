const { pool } = require('../config/db');

class ProfileModel {
  // Upsert profile (insert or update if exists)
  static async upsert(profileData) {
    const query = `
      INSERT INTO profiles (
        username, name, bio, blog, company, location, email, hireable,
        avatar_url, public_repos, public_gists, followers, following,
        most_used_language, avg_stars_per_repo, account_age_days, activity_score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        bio = VALUES(bio),
        blog = VALUES(blog),
        company = VALUES(company),
        location = VALUES(location),
        email = VALUES(email),
        hireable = VALUES(hireable),
        avatar_url = VALUES(avatar_url),
        public_repos = VALUES(public_repos),
        public_gists = VALUES(public_gists),
        followers = VALUES(followers),
        following = VALUES(following),
        most_used_language = VALUES(most_used_language),
        avg_stars_per_repo = VALUES(avg_stars_per_repo),
        account_age_days = VALUES(account_age_days),
        activity_score = VALUES(activity_score),
        updated_at = CURRENT_TIMESTAMP
    `;

    const values = [
      profileData.username,
      profileData.name,
      profileData.bio,
      profileData.blog,
      profileData.company,
      profileData.location,
      profileData.email,
      profileData.hireable,
      profileData.avatar_url,
      profileData.public_repos,
      profileData.public_gists,
      profileData.followers,
      profileData.following,
      profileData.most_used_language,
      profileData.avg_stars_per_repo,
      profileData.account_age_days,
      profileData.activity_score
    ];

    const [result] = await pool.query(query, values);
    return result;
  }

  // Get all profiles with pagination
  static async findAll(page = 1, limit = 10) {
    // Cap limit at 50
    const cappedLimit = Math.min(limit, 50);
    const offset = (page - 1) * cappedLimit;

    const [rows] = await pool.query(
      'SELECT * FROM profiles ORDER BY updated_at DESC LIMIT ? OFFSET ?',
      [cappedLimit, offset]
    );

    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM profiles');

    return {
      profiles: rows,
      total,
      page,
      limit: cappedLimit,
      totalPages: Math.ceil(total / cappedLimit)
    };
  }

  // Find profile by username
  static async findByUsername(username) {
    const [rows] = await pool.query(
      'SELECT * FROM profiles WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  }

  // Delete profile by username
  static async deleteByUsername(username) {
    const [result] = await pool.query(
      'DELETE FROM profiles WHERE username = ?',
      [username]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ProfileModel;
