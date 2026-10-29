import express from 'express';
import cors from 'cors';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import authRouter from './routes/auth.js';
import taskRouter from './routes/tasks.js';
import aiRouter from './routes/ai.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Serve static files from src/public (chat UI, etc.)
app.use(express.static(join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve the AI chat UI at /chat
app.get('/chat', (_req, res) => {
  res.sendFile(join(__dirname, 'public', 'chat.html'));
});

// Auth routes (public)
app.use('/api', authRouter);

// Task routes (protected — auth middleware applied inside taskRouter)
app.use('/api', taskRouter);

// AI routes (protected — auth middleware applied inside aiRouter)
app.use('/api', aiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;