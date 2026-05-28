const mysql = require('mysql2/promise');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('MySQL pool error:', err.message);
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection refused. Check your database configuration.');
  }
});

// Auto-create table on startup
const initDatabase = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Database table initialized');
  } finally {
    connection.release();
  }
};

// Test connection
const testConnection = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    await initDatabase();
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testConnection
};
