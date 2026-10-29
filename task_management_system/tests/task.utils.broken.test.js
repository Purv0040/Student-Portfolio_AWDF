/**
 * tests/task.utils.broken.test.js
 *
 * ⚠️  INTENTIONALLY BROKEN TEST — used to demonstrate a FAILING CI pipeline.
 *
 * This file contains deliberately incorrect assertions.
 * Purpose: show the red ✗ status on GitHub Actions before the fix is applied.
 *
 * To demonstrate the broken pipeline:
 *   1. Rename this file to task.utils.broken.test.js  → CI fails (red ✗)
 *   2. Delete or fix the assertions            → CI passes (green ✓)
 */

describe('BROKEN — deliberate failures to trigger red CI pipeline', () => {
  test('❌ wrong arithmetic — expects 2 + 2 = 5', () => {
    // BUG: 2 + 2 is 4, not 5 — this assertion will always fail
    expect(2 + 2).toBe(5);
  });

  test('❌ wrong type check — expects string to be a number', () => {
    const value = 'hello';
    // BUG: typeof 'hello' is 'string', not 'number'
    expect(typeof value).toBe('number');
  });

  test('❌ wrong cache key format', () => {
    const userId = 'abc123';
    const key = `all_tasks_${userId}`;
    // BUG: expected value has a typo ('tasks' vs 'taks')
    expect(key).toBe(`all_taks_${userId}`);
  });
});

