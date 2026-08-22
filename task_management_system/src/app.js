import express from 'express';
import cors from 'cors';
import taskRouter from './routes/tasks.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(taskRouter);
app.use(notFound);
app.use(errorHandler);

export default app;