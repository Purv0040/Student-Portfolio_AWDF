import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import {
  validateRegistration,
  validateLogin,
} from '../middleware/validate.js';

const router = Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

export default router;
 