const analysisService = require('../services/analysis.service');
const githubService = require('../services/github.service');
const ProfileModel = require('../models/profile.model');

class ProfileController {
  // Analyze and store GitHub profile
  async analyzeProfile(req, res, next) {
    try {
      const { username } = req.body;

      // Analyze profile
      const analyzedData = await analysisService.analyzeProfile(username);

      // Upsert to database
      await ProfileModel.upsert(analyzedData);

      // Fetch the stored profile
      const storedProfile = await ProfileModel.findByUsername(username);

      res.status(201).json({
        success: true,
        data: storedProfile,
        message: 'Profile analyzed and stored successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all analyzed profiles
  async getAllProfiles(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await ProfileModel.findAll(page, limit);

      res.status(200).json({
        success: true,
        data: result.profiles,
        message: 'Profiles retrieved successfully',
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single profile by username
  async getProfileByUsername(req, res, next) {
    try {
      const { username } = req.params;

      const profile = await ProfileModel.findByUsername(username);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: `Profile '${username}' not found in database`
        });
      }

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete profile by username
  async deleteProfile(req, res, next) {
    try {
      const { username } = req.params;

      const deleted = await ProfileModel.deleteByUsername(username);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Profile '${username}' not found in database`
        });
      }

      res.status(200).json({
        success: true,
        data: null,
        message: 'Profile deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh profile data from GitHub
  async refreshProfile(req, res, next) {
    try {
      const { username } = req.params;

      // Check if profile exists
      const existingProfile = await ProfileModel.findByUsername(username);

      if (!existingProfile) {
        return res.status(404).json({
          success: false,
          message: `Profile '${username}' not found in database`
        });
      }

      // Clear cache and re-fetch from GitHub
      githubService.clearCache(username);
      const analyzedData = await analysisService.analyzeProfile(username, true);

      // Update in database
      await ProfileModel.upsert(analyzedData);

      // Fetch updated profile
      const updatedProfile = await ProfileModel.findByUsername(username);

      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Profile refreshed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
