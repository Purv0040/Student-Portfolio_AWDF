import mongoose from 'mongoose';
import Task from '../models/task.js';

const createNotFoundError = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

const createInvalidIdError = (id) => {
  const error = new Error(`Task with id ${id} is invalid`);
  error.statusCode = 400;
  return error;
};

export const getAllTasks = async (_req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(createInvalidIdError(id));
    return;
  }

  try {
    const task = await Task.findById(id);

    if (!task) {
      next(createNotFoundError(`Task with id ${id} not found`));
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body ?? {});
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(createInvalidIdError(id));
    return;
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body ?? {}, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    if (!updatedTask) {
      next(createNotFoundError(`Task with id ${id} not found`));
      return;
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const removeTask = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(createInvalidIdError(id));
    return;
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      next(createNotFoundError(`Task with id ${id} not found`));
      return;
    }

    res.status(200).json(deletedTask);
  } catch (error) {
    next(error);
  }
};