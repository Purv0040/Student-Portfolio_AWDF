import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  removeTask,
  updateTask,
} from '../controllers/tasksController.js';

const router = Router();

router.get('/tasks', getAllTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', removeTask);

export default router;