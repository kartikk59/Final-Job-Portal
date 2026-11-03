import express from 'express';
import {
  getExperts,
  getExpertById,
  getExpertAvailability,
} from '../controllers/expertController.js';

const router = express.Router();

/**
 * @route   GET /api/experts
 * @desc    Get all active experts with search and filters
 */
router.get('/', getExperts);

/**
 * @route   GET /api/experts/:id
 * @desc    Get single expert details by ID
 */
router.get('/:id', getExpertById);

/**
 * @route   GET /api/experts/:id/availability
 * @desc    Get available booking dates and times for an expert
 */
router.get('/:id/availability', getExpertAvailability);

export default router;
