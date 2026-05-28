const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3000;
const serverUrl = process.env.NODE_ENV === 'production' 
  ? process.env.RENDER_URL 
  : `http://localhost:${PORT}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitHub Profile Analyzer API',
      version: '1.0.0',
      description: 'REST API that fetches GitHub user profile data, derives insights, and stores them in MySQL',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: serverUrl,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    tags: [
      {
        name: 'Profiles',
        description: 'GitHub profile analysis endpoints'
      }
    ]
  },
  apis: ['./src/routes/v1/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
