-- GitHub Profile Analyzer Database Schema
-- This schema is automatically created by the application on startup
-- This file is provided for reference and manual setup if needed

CREATE DATABASE IF NOT EXISTS github_analyzer
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE github_analyzer;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample query to view all profiles
-- SELECT * FROM profiles ORDER BY updated_at DESC;

-- Sample query to get profile statistics
-- SELECT 
--   COUNT(*) as total_profiles,
--   AVG(followers) as avg_followers,
--   AVG(public_repos) as avg_repos,
--   AVG(activity_score) as avg_activity_score
-- FROM profiles;

-- Sample query to find most popular language
-- SELECT 
--   most_used_language,
--   COUNT(*) as user_count
-- FROM profiles
-- WHERE most_used_language IS NOT NULL
-- GROUP BY most_used_language
-- ORDER BY user_count DESC
-- LIMIT 10;
