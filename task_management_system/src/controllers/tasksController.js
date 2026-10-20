import mongoose from 'mongoose';
import Task from '../models/task.js';
import cache from '../cache.js';
import { taskEvents } from '../events/taskEvents.js';

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

export const getAllTasks = async (req, res, next) => {
  // Cache key is scoped per user so each user sees only their own tasks
  const cacheKey = `all_tasks_${req.user.id}`;
  const startTime = process.hrtime.bigint(); // nanosecond-precision timer

  try {
    // ── Cache HIT ──────────────────────────────────────────────────────────────
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      const elapsedMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
      console.log(`\x1b[32m[CACHE HIT]\x1b[0m  GET /tasks — ${elapsedMs.toFixed(3)} ms`);
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Response-Time', `${elapsedMs.toFixed(3)}ms`);
      return res.status(200).json(cached);
    }

    // ── Cache MISS — query MongoDB, then store result ───────────────────────
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    cache.set(cacheKey, tasks);
    const elapsedMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
    console.log(`\x1b[33m[CACHE MISS]\x1b[0m GET /tasks — ${elapsedMs.toFixed(3)} ms  (MongoDB queried, result cached)`);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Response-Time', `${elapsedMs.toFixed(3)}ms`);
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
    const task = await Task.findOne({ _id: id, user: req.user.id });

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
    const taskData = {
      ...(req.body ?? {}),
      user: req.user.id,
    };
    const task = await Task.create(taskData);

    // Invalidate cache so next GET /tasks fetches fresh data from MongoDB
    cache.del(`all_tasks_${req.user.id}`);

    taskEvents.emit('task-created', {
      title: task.title,
      timestamp: task.createdAt.toISOString(),
      assignedUser: task.user.toString(),
    });

    res.status(201).json(task);
    console.log(`[API RESPONSE] ${new Date().toISOString()} POST /tasks 201`);
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
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body ?? {},
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );

    if (!updatedTask) {
      next(createNotFoundError(`Task with id ${id} not found`));
      return;
    }

    // Invalidate cache so next GET /tasks fetches fresh data from MongoDB
    cache.del(`all_tasks_${req.user.id}`);

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
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deletedTask) {
      next(createNotFoundError(`Task with id ${id} not found`));
      return;
    }

    // Invalidate cache so next GET /tasks fetches fresh data from MongoDB
    cache.del(`all_tasks_${req.user.id}`);

    res.status(200).json(deletedTask);
  } catch (error) {
    next(error);
  }
};