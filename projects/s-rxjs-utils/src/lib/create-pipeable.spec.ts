import { createPipeable } from './create-pipeable';
import { Observable, of, Subscriber } from 'rxjs';
import { SubscriptionManager } from './subscription-manager';

describe('createPipeable()', () => {
  // tested by skipAfter()
  // it('cleans up subscriptions made through the manager');

  it('correctly changes the type of a stream', () => {
    const toString = createPipeable(
      (
        upstream: Observable<any>,
        downstream: Subscriber<string>,
        subscriptionManager: SubscriptionManager
      ) => {
        subscriptionManager.subscribeTo(upstream, value =>
          downstream.next(value.toString())
        );
      }
    );

    // the real test is just that this does not give a type error
    const source: Observable<number> = of(1);
    const stream: Observable<string> = source.pipe(toString);
    expect().nothing();
  });
});
