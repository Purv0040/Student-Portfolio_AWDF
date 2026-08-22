import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  removeTask,
  updateTask, 
} from '../controllers/tasksController.js';
import authMiddleware from '../middleware/auth.js';
import { validateTask, validateTaskUpdate } from '../middleware/validate.js';

const router = Router();

// All task routes are protected
router.use(authMiddleware);

router.get('/tasks', getAllTasks);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', validateTask, createTask);
router.put('/tasks/:id', validateTaskUpdate, updateTask);
router.delete('/tasks/:id', removeTask);

export default router;