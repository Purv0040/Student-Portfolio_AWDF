import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management_system';

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`Task Management API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();