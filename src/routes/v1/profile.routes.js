const express = require('express');
const { body, param, query } = require('express-validator');
const profileController = require('../../controllers/profile.controller');
const validate = require('../../middleware/validate');
const { globalLimiter, analyzeLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

// Apply global rate limiter to all routes
router.use(globalLimiter);

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: "octocat"
 *         name:
 *           type: string
 *           example: "The Octocat"
 *         bio:
 *           type: string
 *           example: "GitHub mascot"
 *         blog:
 *           type: string
 *           example: "https://github.blog"
 *         company:
 *           type: string
 *           example: "@github"
 *         location:
 *           type: string
 *           example: "San Francisco"
 *         email:
 *           type: string
 *           example: "octocat@github.com"
 *         hireable:
 *           type: boolean
 *           example: true
 *         avatar_url:
 *           type: string
 *           example: "https://avatars.githubusercontent.com/u/583231"
 *         public_repos:
 *           type: integer
 *           example: 8
 *         public_gists:
 *           type: integer
 *           example: 8
 *         followers:
 *           type: integer
 *           example: 9999
 *         following:
 *           type: integer
 *           example: 9
 *         most_used_language:
 *           type: string
 *           example: "JavaScript"
 *         avg_stars_per_repo:
 *           type: number
 *           format: float
 *           example: 125.50
 *         account_age_days:
 *           type: integer
 *           example: 4500
 *         activity_score:
 *           type: integer
 *           example: 20030
 *         analyzed_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Error message"
 */

/**
 * @swagger
 * /api/v1/profiles/analyze:
 *   post:
 *     summary: Analyze a GitHub profile and store insights
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: "octocat"
 *     responses:
 *       201:
 *         description: Profile analyzed and stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *                 message:
 *                   type: string
 *                   example: "Profile analyzed and stored successfully"
 *       404:
 *         description: GitHub user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/analyze',
  analyzeLimiter,
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 1, max: 39 })
      .withMessage('Username must be between 1 and 39 characters')
      .matches(/^[a-zA-Z0-9-]+$/)
      .withMessage('Username can only contain alphanumeric characters and hyphens')
  ],
  validate,
  profileController.analyzeProfile
);

/**
 * @swagger
 * /api/v1/profiles:
 *   get:
 *     summary: Get all analyzed profiles with pagination
 *     tags: [Profiles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Number of profiles per page (max 50)
 *     responses:
 *       200:
 *         description: Profiles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 *                 message:
 *                   type: string
 *                   example: "Profiles retrieved successfully"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50')
  ],
  validate,
  profileController.getAllProfiles
);

/**
 * @swagger
 * /api/v1/profiles/{username}:
 *   get:
 *     summary: Get a single profile by username
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub username
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *                 message:
 *                   type: string
 *                   example: "Profile retrieved successfully"
 *       404:
 *         description: Profile not found in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:username',
  [
    param('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .matches(/^[a-zA-Z0-9-]+$/)
      .withMessage('Invalid username format')
  ],
  validate,
  profileController.getProfileByUsername
);

/**
 * @swagger
 * /api/v1/profiles/{username}:
 *   delete:
 *     summary: Delete a profile from database
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub username
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Profile deleted successfully"
 *       404:
 *         description: Profile not found in database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:username',
  [
    param('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .matches(/^[a-zA-Z0-9-]+$/)
      .withMessage('Invalid username format')
  ],
  validate,
  profileController.deleteProfile
);

/**
 * @swagger
 * /api/v1/profiles/{username}/refresh:
 *   put:
 *     summary: Refresh profile data from GitHub
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: GitHub username
 *     responses:
 *       200:
 *         description: Profile refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *                 message:
 *                   type: string
 *                   example: "Profile refreshed successfully"
 *       404:
 *         description: Profile not found in database or GitHub user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:username/refresh',
  [
    param('username')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .matches(/^[a-zA-Z0-9-]+$/)
      .withMessage('Invalid username format')
  ],
  validate,
  profileController.refreshProfile
);

module.exports = router;
