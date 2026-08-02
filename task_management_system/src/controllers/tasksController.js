import {
  createTaskRecord,
  deleteTaskRecord,
  tasks,
  updateTaskRecord,
} from '../data/tasks.js';

export const getAllTasks = (_req, res) => {
  res.status(200).json(tasks);
};

export const createTask = (req, res) => {
  const task = createTaskRecord(req.body ?? {});
  res.status(201).json(task);
};

export const updateTask = (req, res, next) => {
  const taskId = Number(req.params.id);
  const updatedTask = updateTaskRecord(taskId, req.body ?? {});

  if (!updatedTask) {
    const error = new Error(`Task with id ${taskId} not found`);
    error.statusCode = 404;
    next(error);
    return;
  }

  res.status(200).json(updatedTask);
};

export const removeTask = (req, res, next) => {
  const taskId = Number(req.params.id);
  const deletedTask = deleteTaskRecord(taskId);

  if (!deletedTask) {
    const error = new Error(`Task with id ${taskId} not found`);
    error.statusCode = 404;
    next(error);
    return;
  }

  res.status(200).json(deletedTask);
};