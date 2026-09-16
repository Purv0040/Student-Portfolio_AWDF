import { lazy } from 'react';

/**
 * Wraps a dynamic import with an artificial minimum delay.
 * Useful to avoid flickering loading states on fast connections
 * or to clearly demonstrate Suspense fallbacks during testing.
 * 
 * @param {Function} importFn - Dynamic import function, e.g. () => import('./Component')
 * @param {number} delayMs - Minimum delay in milliseconds (default: 300ms)
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithDelay(importFn, delayMs = 300) {
  return lazy(() =>
    Promise.all([
      importFn(),
      new Promise((resolve) => setTimeout(resolve, delayMs)),
    ]).then(([moduleExports]) => moduleExports)
  );
}

export default lazyWithDelay;
