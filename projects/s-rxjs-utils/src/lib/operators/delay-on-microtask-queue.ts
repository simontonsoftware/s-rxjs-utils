import { asapScheduler } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Delays the emission of items from the source Observable using the microtask queue.
 */
export function delayOnMicrotaskQueue<T>() {
  return delay<T>(0, asapScheduler);
}
