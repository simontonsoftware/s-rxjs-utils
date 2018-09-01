import { Observable, OperatorFunction, Subscriber } from 'rxjs';
import { SubscriptionManager } from './subscription-manager';

/**
 * Use this to create a complex pipeable operator. It is usually better style to compose existing operators than to create a brand new one, but when you need full control this can reduce some boilerplate.
 *
 * A simple example, recreating the "map" operator:
 * ```ts
 * function map<I, O>(fn: (input: I) => O) {
 *   return createPipeable(
 *     (
 *       upstream: Observable<I>,
 *       downstream: Subscriber<O>,
 *       subscriptionManager: SubscriptionManager
 *     ) => {
 *       subscriptionManager.subscribeTo(
 *         upstream,
 *         value => {
 *           downstream.next(fn(value));
 *         },
 *         downstream.error.bind(downstream),
 *         downstream.complete.bind(downstream)
 *       );
 *     }
 *   );
 * }
 * ```
 */
export function createPipeable<UpstreamType, DownstreamType = UpstreamType>(
  subscribe: (
    upstream: Observable<UpstreamType>,
    downstream: Subscriber<DownstreamType>,
    subscriptionManager: SubscriptionManager
  ) => void
): OperatorFunction<UpstreamType, DownstreamType> {
  return (source: Observable<UpstreamType>) =>
    new Observable<DownstreamType>(subscriber => {
      const manager = new SubscriptionManager();
      subscribe(source, subscriber, manager);
      return manager;
    });
}
