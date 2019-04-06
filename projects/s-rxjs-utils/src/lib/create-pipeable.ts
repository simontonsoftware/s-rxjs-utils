import { Observable, OperatorFunction, Subscriber } from "rxjs";
import { SubscriptionManager } from "./subscription-manager";

/**
 * @deprecated use `createOperatorFunction` instead
 */
export function createPipeable<UpstreamType, DownstreamType = UpstreamType>(
  subscribe: (
    upstream: Observable<UpstreamType>,
    downstream: Subscriber<DownstreamType>,
    subscriptionManager: SubscriptionManager,
  ) => void,
): OperatorFunction<UpstreamType, DownstreamType> {
  return (source: Observable<UpstreamType>) =>
    new Observable<DownstreamType>((subscriber) => {
      const manager = new SubscriptionManager();
      subscribe(source, subscriber, manager);
      return manager;
    });
}
