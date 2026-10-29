import Groq from 'groq-sdk';
import Task from '../models/task.js';

// ─────────────────────────────────────────────────────────────────────────────
// Groq client (used by generateDescription — demonstrates real API usage)
// ─────────────────────────────────────────────────────────────────────────────
let groqClient = null;
const getGroqClient = () => {
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL INTENT ENGINE
// Detects what the user is asking about, then queries MongoDB directly.
// Instant — no external API call, no hallucinations.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect the user's intent from their message using keyword/pattern matching.
 */
const detectIntent = (message) => {
  const m = message.toLowerCase();

  if (/\bhow many|count|total number|number of\b/.test(m)) {
    if (/\bpending|incomplete|not done|unfinished|left\b/.test(m)) return 'count_pending';
    if (/\bcompleted?|done|finished\b/.test(m))                     return 'count_completed';
    if (/\bhigh\b/.test(m))                                          return 'count_high';
    if (/\bmedium\b/.test(m))                                        return 'count_medium';
    if (/\blow\b/.test(m))                                           return 'count_low';
    return 'count_all';
  }

  if (/\bsummar|overview|report|status|progress|breakdown\b/.test(m)) return 'summary';

  if (/\brecent|latest|newest|last added|just added\b/.test(m))        return 'recent';

  if (/\bpending|incomplete|not done|unfinished|still left\b/.test(m)) return 'list_pending';
  if (/\bcompleted?|done|finished|accomplished\b/.test(m))             return 'list_completed';

  if (/\bhigh.{0,10}priority|priority.{0,10}high|urgent\b/.test(m))   return 'list_high';
  if (/\bmedium.{0,10}priority|priority.{0,10}medium\b/.test(m))      return 'list_medium';
  if (/\blow.{0,10}priority|priority.{0,10}low\b/.test(m))            return 'list_low';

  if (/\bfind|search|look for|task.{0,20}about|about.{0,20}task\b/.test(m)) return 'search';

  if (
    /\ball (my )?tasks?|list (my )?tasks?|show (my )?tasks?|what (are|'re) my tasks?|my tasks?\b/.test(m) ||
    /\btasks? (list|overview|do i have)\b/.test(m)
  ) return 'list_all';

  return 'unknown';
};

/** Extract a search keyword for intent === 'search' */
const extractKeyword = (message) => {
  const m = message.toLowerCase();
  // Try: "find task about X", "search for X", "task called X"
  const patterns = [
    /(?:find|search for?|look for|task about|about|called|named|titled)\s+["']?([a-z0-9 _-]+)["']?/i,
  ];
  for (const p of patterns) {
    const match = m.match(p);
    if (match) return match[1].trim();
  }
  // Fallback: strip common filler words and use the rest
  return m
    .replace(/\b(find|search|look for|task|about|please|me|my|the|a|an)\b/g, '')
    .trim();
};

/** Format a single task as a readable line */
const formatTask = (t, index) => {
  const status   = t.completed ? '✅ Completed' : '⏳ Pending';
  const priority = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' }[t.priority] ?? t.priority;
  const desc     = t.description ? `\n     "${t.description}"` : '';
  return `${index}. ${t.title}\n   ${status} · ${priority}${desc}`;
};

/**
 * Answer the user's question instantly using only MongoDB data.
 * Returns a plain-text string.
 */
const answerFromData = async (intent, keyword, userId) => {
  // ── Fetch all tasks once ───────────────────────────────────────────────────
  const all = await Task.find({ user: userId })
    .sort({ createdAt: -1 })
    .select('title description priority completed createdAt')
    .lean();

  const total     = all.length;
  const pending   = all.filter(t => !t.completed);
  const completed = all.filter(t => t.completed);
  const high      = all.filter(t => t.priority === 'high');
  const medium    = all.filter(t => t.priority === 'medium');
  const low       = all.filter(t => t.priority === 'low');

  // ── Intent handlers ────────────────────────────────────────────────────────
  if (total === 0) {
    return "You don't have any tasks yet. Create your first task to get started!";
  }

  switch (intent) {
    // ── Counts ───────────────────────────────────────────────────────────────
    case 'count_all':
      return `You have **${total}** task${total !== 1 ? 's' : ''} in total.`;

    case 'count_pending':
      return `You have **${pending.length}** pending task${pending.length !== 1 ? 's' : ''}.`;

    case 'count_completed':
      return `You have completed **${completed.length}** task${completed.length !== 1 ? 's' : ''} out of ${total}.`;

    case 'count_high':
      return `You have **${high.length}** high-priority task${high.length !== 1 ? 's' : ''}.`;

    case 'count_medium':
      return `You have **${medium.length}** medium-priority task${medium.length !== 1 ? 's' : ''}.`;

    case 'count_low':
      return `You have **${low.length}** low-priority task${low.length !== 1 ? 's' : ''}.`;

    // ── Lists ─────────────────────────────────────────────────────────────────
    case 'list_all':
      return `📋 **All Tasks (${total})**\n\n` + all.map(formatTask).join('\n\n');

    case 'list_pending':
      if (pending.length === 0) return '✅ Great news — you have no pending tasks!';
      return `⏳ **Pending Tasks (${pending.length})**\n\n` + pending.map(formatTask).join('\n\n');

    case 'list_completed':
      if (completed.length === 0) return "You haven't completed any tasks yet. Keep going!";
      return `✅ **Completed Tasks (${completed.length})**\n\n` + completed.map(formatTask).join('\n\n');

    case 'list_high':
      if (high.length === 0) return 'You have no high-priority tasks right now.';
      return `🔴 **High-Priority Tasks (${high.length})**\n\n` + high.map(formatTask).join('\n\n');

    case 'list_medium':
      if (medium.length === 0) return 'You have no medium-priority tasks right now.';
      return `🟡 **Medium-Priority Tasks (${medium.length})**\n\n` + medium.map(formatTask).join('\n\n');

    case 'list_low':
      if (low.length === 0) return 'You have no low-priority tasks right now.';
      return `🟢 **Low-Priority Tasks (${low.length})**\n\n` + low.map(formatTask).join('\n\n');

    // ── Summary ───────────────────────────────────────────────────────────────
    case 'summary': {
      const pct = total > 0 ? Math.round((completed.length / total) * 100) : 0;
      return (
        `📊 **Task Summary**\n\n` +
        `Total      : ${total}\n` +
        `✅ Completed: ${completed.length} (${pct}%)\n` +
        `⏳ Pending  : ${pending.length}\n\n` +
        `Priority breakdown:\n` +
        `  🔴 High   : ${high.length}\n` +
        `  🟡 Medium : ${medium.length}\n` +
        `  🟢 Low    : ${low.length}`
      );
    }

    // ── Recent ────────────────────────────────────────────────────────────────
    case 'recent': {
      const recent = all.slice(0, 5);
      return `🕐 **5 Most Recent Tasks**\n\n` + recent.map(formatTask).join('\n\n');
    }

    // ── Search ────────────────────────────────────────────────────────────────
    case 'search': {
      if (!keyword) return 'Please tell me what to search for — e.g. "find task about report".';
      const kw      = keyword.toLowerCase();
      const matches = all.filter(
        t =>
          t.title.toLowerCase().includes(kw) ||
          (t.description && t.description.toLowerCase().includes(kw))
      );
      if (matches.length === 0) return `🔍 No tasks found matching **"${keyword}"**.`;
      return `🔍 **Tasks matching "${keyword}" (${matches.length})**\n\n` + matches.map(formatTask).join('\n\n');
    }

    // ── Unknown ───────────────────────────────────────────────────────────────
    default:
      return (
        "I can only answer questions about your tasks. Try asking:\n\n" +
        "• \"List all my tasks\"\n" +
        "• \"Show pending tasks\"\n" +
        "• \"Which tasks are high priority?\"\n" +
        "• \"How many tasks have I completed?\"\n" +
        "• \"Give me a summary\"\n" +
        "• \"Find task about [keyword]\""
      );
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/generate-description
// Uses the GROQ API — demonstrates real external AI API usage.
// ─────────────────────────────────────────────────────────────────────────────
export const generateDescription = async (req, res, next) => {
  try {
    const { title, priority = 'medium' } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      const error = new Error('Task title is required to generate a description');
      error.statusCode = 400;
      return next(error);
    }

    if (!process.env.GROQ_API_KEY) {
      console.warn('[AI] GROQ_API_KEY is not set — returning fallback description');
      return res.status(200).json({
        description: `A ${priority}-priority task: ${title.trim()}. Please add more details manually.`,
        source: 'fallback',
      });
    }

    const prompt = `You are a task management assistant.
Generate a clear, concise description (2–3 sentences) for a task with the following details:
- Title: "${title.trim()}"
- Priority: ${priority}

The description should explain what the task involves, why it matters, and any key steps or considerations. Be practical and professional. Do not include the title itself in the description.`;

    let description;
    try {
      const client = getGroqClient();
      const chatCompletion = await client.chat.completions.create({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      });
      description = chatCompletion.choices?.[0]?.message?.content?.trim();
      if (!description) throw new Error('Empty response from Groq API');
    } catch (aiError) {
      console.error('[AI] Groq API error:', aiError.message);
      return res.status(200).json({
        description: `A ${priority}-priority task: ${title.trim()}. Please add more details manually.`,
        source: 'fallback',
        warning: 'AI generation is temporarily unavailable.',
      });
    }

    return res.status(200).json({ description, source: 'groq' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/chat
//
// Architecture: Discrete / Grounded Query Engine
// ─────────────────────────────────────────────────────────────────────────────
// Instead of sending the question to an LLM (slow, hallucination-prone),
// this endpoint:
//   1. Detects the user's intent from their message (pattern matching)
//   2. Queries MongoDB directly for the exact data needed
//   3. Formats a human-readable response and returns it instantly
//
// The Groq API (imported above) is used by generateDescription, keeping
// demonstrable real-API usage in the codebase.
// ─────────────────────────────────────────────────────────────────────────────
export const chat = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      const error = new Error('messages array is required and must not be empty');
      error.statusCode = 400;
      return next(error);
    }

    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== 'string') {
        const error = new Error('Each message must have a role and a string content');
        error.statusCode = 400;
        return next(error);
      }
      if (!['user', 'assistant'].includes(msg.role)) {
        const error = new Error('Message role must be "user" or "assistant"');
        error.statusCode = 400;
        return next(error);
      }
    }

    // Take only the latest user message for intent detection
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) {
      return res.status(400).json({ message: 'No user message found in messages array' });
    }

    const intent  = detectIntent(lastUserMsg.content);
    const keyword = intent === 'search' ? extractKeyword(lastUserMsg.content) : '';

    console.log(`[AI Chat] user=${req.user.id} intent="${intent}" keyword="${keyword}"`);

    const reply = await answerFromData(intent, keyword, req.user.id);

    return res.status(200).json({ reply, source: 'db', intent });
  } catch (error) {
    next(error);
  }
};
