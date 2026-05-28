require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Test database connection before starting server
const startServer = async () => {
  try {
    await db.testConnection();
    console.log('✓ Database connection established successfully');
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      if (process.env.NODE_ENV === 'development') {
        console.log(`✓ Swagger UI available at http://localhost:${PORT}/api-docs`);
      }
    });
  } catch (error) {
    console.error('✗ Failed to connect to database:', error.message);
    process.exit(1);
  }
};

startServer();
