import express from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { authenticateUser, requireCandidate } from '../middleware/auth.js';

const router = express.Router();
router.post('/', authenticateUser, requireCandidate, createBooking);

export default router;
