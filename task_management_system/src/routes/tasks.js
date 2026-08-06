import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  removeTask,
  updateTask,
} from '../controllers/tasksController.js';

const router = Router();

router.get('/tasks', getAllTasks);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', removeTask);

export default router;