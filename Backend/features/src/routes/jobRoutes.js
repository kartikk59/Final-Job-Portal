import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getSavedJobs,
  applyForJob,
  getMyApplications,
  getJobAlerts,
  createJobAlert,
  deleteJobAlert,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific routes before param routes
router.get('/saved', protect, authorize('candidate'), getSavedJobs);
router.get('/applications', protect, authorize('candidate'), getMyApplications);
router.get('/alerts', protect, authorize('candidate'), getJobAlerts);
router.post('/alerts', protect, authorize('candidate'), createJobAlert);
router.delete('/alerts/:id', protect, authorize('candidate'), deleteJobAlert);

// Public listings
router.get('/', getJobs);
router.get('/:id', getJobById);

// Student actions on individual jobs
router.post('/:id/save', protect, authorize('candidate'), toggleSaveJob);
router.post('/:id/apply', protect, authorize('candidate'), applyForJob);

// Recruiter-only job management
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
