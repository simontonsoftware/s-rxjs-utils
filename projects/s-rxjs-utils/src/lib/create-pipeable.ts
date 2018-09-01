import { Observable, Subscriber } from 'rxjs';
import { SubscriptionManager } from './subscription-manager';

export function createPipeable<UpstreamType, DownstreamType = UpstreamType>(
  subscribe: (
    upstream: Observable<UpstreamType>,
    downstream: Subscriber<DownstreamType>,
    subscriptionManager: SubscriptionManager
  ) => void
) {
  return (source: Observable<UpstreamType>) =>
    new Observable<DownstreamType>(subscriber => {
      const manager = new SubscriptionManager();
      subscribe(source, subscriber, manager);
      return manager.unsubscribeFromAll.bind(manager);
    });
}
