import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import taskRouter from './routes/tasks.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

const app = express();
 
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Auth routes (public)
app.use('/api', authRouter);

// Task routes (protected — auth middleware applied inside taskRouter)
app.use('/api', taskRouter);

app.use(notFound);
app.use(errorHandler);

export default app;