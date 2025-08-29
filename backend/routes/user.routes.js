import express from 'express';
import {
  updateProfile,
  updateAvatar,
  subscribeNewsletter,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadSingle } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/subscribe', subscribeNewsletter)

router.use(protect); 

router.put('/profile', updateProfile);
router.put('/avatar', uploadSingle, updateAvatar);
export default router;