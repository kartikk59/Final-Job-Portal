import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  deleteResource,
  toggleLikeResource,
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/', protect, upload.single('file'), createResource);
router.delete('/:id', protect, deleteResource);
router.post('/:id/like', protect, toggleLikeResource);

export default router;
