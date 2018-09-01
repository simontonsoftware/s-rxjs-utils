import { createPipeable } from './create-pipeable';
import { Observable } from 'rxjs';

/**
 * Causes the next value in the pipe to be skipped after `skip$` emits a value.
 */
export function skipAfter<T>(skip$: Observable<any>) {
  return createPipeable<T>((upstream$, downstream, manager) => {
    let skipNext = false;
    manager.subscribeTo(skip$, () => {
      skipNext = true;
    });
    manager.subscribeTo(upstream$, (value) => {
      if (skipNext) {
        skipNext = false;
      } else {
        downstream.next(value);
      }
    });
  });
}
