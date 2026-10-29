import { Router } from 'express';
import { generateDescription, chat } from '../controllers/aiController.js';
import authMiddleware from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validate.js';

const router = Router();

// All AI routes require authentication
router.use(authMiddleware);

/**
 * POST /api/ai/generate-description
 * Accepts: { title: string, priority?: 'low' | 'medium' | 'high' }
 * Returns: { description: string, source: 'groq' | 'fallback' }
 */
router.post(
  '/ai/generate-description',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title must be 200 characters or fewer'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    handleValidationErrors,
  ],
  generateDescription
);

/**
 * POST /api/ai/chat
 * Accepts: { messages: Array<{ role: 'user'|'assistant', content: string }> }
 * Returns:  SSE stream of { token: string } events, ending with { done: true }
 */
router.post(
  '/ai/chat',
  [
    body('messages')
      .isArray({ min: 1 })
      .withMessage('messages must be a non-empty array'),
    body('messages.*.role')
      .isIn(['user', 'assistant'])
      .withMessage('Each message role must be "user" or "assistant"'),
    body('messages.*.content')
      .isString()
      .notEmpty()
      .withMessage('Each message must have a non-empty string content'),
    handleValidationErrors,
  ],
  chat
);

export default router;
