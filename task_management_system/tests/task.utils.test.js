/**
 * tests/task.utils.test.js
 *
 * Unit tests for pure utility logic used across the Task Management API.
 * These tests run without a database or server — fast, isolated, deterministic.
 */

// ── Helpers under test ────────────────────────────────────────────────────────

/**
 * Normalises a raw task title:
 *  - trims surrounding whitespace
 *  - collapses internal runs of spaces to a single space
 *  - title-cases each word
 */
function normaliseTitle(raw) {
  return raw
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Returns true when a task's dueDate (ISO string or Date) is strictly in the
 * past relative to `now` (defaults to the current moment).
 */
function isOverdue(dueDate, now = new Date()) {
  return new Date(dueDate) < now;
}

/**
 * Builds a cache key for a user's task list.
 */
function buildCacheKey(userId) {
  if (!userId) throw new Error('userId is required');
  return `all_tasks_${userId}`;
}

/**
 * Validates that required task fields are present and non-empty.
 * Returns an array of field-name strings that failed.
 */
function validateTaskFields({ title, status } = {}) {
  const errors = [];
  if (!title || title.trim() === '') errors.push('title');
  const VALID_STATUSES = ['pending', 'in-progress', 'completed'];
  if (!status || !VALID_STATUSES.includes(status)) errors.push('status');
  return errors;
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe('normaliseTitle()', () => {
  test('trims leading and trailing whitespace', () => {
    expect(normaliseTitle('  fix bug  ')).toBe('Fix Bug');
  });

  test('collapses internal multiple spaces', () => {
    expect(normaliseTitle('write   unit   tests')).toBe('Write Unit Tests');
  });

  test('title-cases every word', () => {
    expect(normaliseTitle('deploy to production')).toBe('Deploy To Production');
  });

  test('handles a single word', () => {
    expect(normaliseTitle('refactor')).toBe('Refactor');
  });
});

describe('isOverdue()', () => {
  test('returns true when due date is in the past', () => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    expect(isOverdue(yesterday)).toBe(true);
  });

  test('returns false when due date is in the future', () => {
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString();
    expect(isOverdue(tomorrow)).toBe(false);
  });

  test('accepts a custom "now" reference point', () => {
    const fixedNow = new Date('2025-06-01T00:00:00Z');
    expect(isOverdue('2025-05-31T23:59:59Z', fixedNow)).toBe(true);
    expect(isOverdue('2025-06-02T00:00:00Z', fixedNow)).toBe(false);
  });
});

describe('buildCacheKey()', () => {
  test('returns the correct key format', () => {
    expect(buildCacheKey('user123')).toBe('all_tasks_user123');
  });

  test('throws when userId is empty', () => {
    expect(() => buildCacheKey('')).toThrow('userId is required');
  });

  test('throws when userId is undefined', () => {
    expect(() => buildCacheKey()).toThrow('userId is required');
  });
});

describe('validateTaskFields()', () => {
  test('returns empty array for a valid task', () => {
    expect(validateTaskFields({ title: 'Fix bug', status: 'pending' })).toEqual([]);
  });

  test('flags missing title', () => {
    expect(validateTaskFields({ title: '', status: 'pending' })).toContain('title');
  });

  test('flags whitespace-only title', () => {
    expect(validateTaskFields({ title: '   ', status: 'pending' })).toContain('title');
  });

  test('flags invalid status', () => {
    expect(validateTaskFields({ title: 'Task', status: 'unknown' })).toContain('status');
  });

  test('flags both title and status when both are invalid', () => {
    const errors = validateTaskFields({ title: '', status: 'bad' });
    expect(errors).toContain('title');
    expect(errors).toContain('status');
  });
});

