import { Observable } from "rxjs";
import { createPipeable } from "./create-pipeable";

/**
 * Causes the next value in the pipe to be skipped after `skip$` emits a value. For example:
 *
 * ```
 * source: -1-----2-----3-----4-----5-|
 * skip$:  ----0----------0-0----------
 *
 * result: -1-----------3-----------5-|
 * ```
 * ```ts
 * const source = new Subject();
 * const skip$ = new Subject();
 * const result = source.pipe(skipAfter(skip$));
 *
 * source.next(1); // result emits `1`
 *
 * skip$.next();
 * source.next(2); // result does not emit
 * source.next(3); // result emits `3`
 *
 * skip$.next();
 * skip$.next();
 * source.next(4); // result does not emit
 * source.next(5); // result emits `5`
 * ```
 */
export function skipAfter<T>(skip$: Observable<any>) {
  return createPipeable<T>((upstream$, downstream, manager) => {
    let skipNext = false;
    manager.subscribeTo(skip$, () => {
      skipNext = true;
    });
    manager.subscribeTo(
      upstream$,
      (value) => {
        if (skipNext) {
          skipNext = false;
        } else {
          downstream.next(value);
        }
      },
      downstream.error.bind(downstream),
      downstream.complete.bind(downstream),
    );
  });
}
