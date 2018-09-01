import { Observable, Subscription } from 'rxjs';

/**
 * Tracks all subscriptions to easily unsubscribe from them all during cleanup. Also binds callbacks to `this` for convenient use as a superclass, e.g.:
 *
 * ```ts
 * class EventLogger extends SubscriptionManager {
 *   constructor(private prefix: string, event$: Observable<string>) {
 *     super();
 *
 *     // you can pass in an instance method here and it will be bound to `this`
 *     this.subscribeTo(event$, this.log);
 *   }
 *
 *   log(event: string) {
 *     // even though this is used as a callback, you can still use `this`
 *     console.log(this.prefix + event);
 *   }
 * }
 * ```
 */
export class SubscriptionManager {
  private subscriptions: Subscription[] = [];

  subscribeTo<T>(
    observable: Observable<T>,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void
  ) {
    this.subscriptions.push(
      observable.subscribe(
        this.bind(next),
        this.bind(error),
        this.bind(complete)
      )
    );
  }

  unsubscribeFromAll() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions = [];
  }

  private bind(fn?: (val: any) => void) {
    return fn && fn.bind(this);
  }
}
