import { Observable, of, Subscriber } from "rxjs";
import { toArray } from "rxjs/operators";
import { createPipeable } from "./create-pipeable";
import { SubscriptionManager } from "./subscription-manager";

describe("createPipeable()", () => {
  // tested by skipAfter()
  // it('cleans up subscriptions made through the manager');

  it("correctly changes the type of a stream", () => {
    const toString = createPipeable(
      (
        upstream: Observable<any>,
        downstream: Subscriber<string>,
        subscriptionManager: SubscriptionManager,
      ) => {
        subscriptionManager.subscribeTo(upstream, (value) => {
          downstream.next(value.toString());
        });
      },
    );

    const source: Observable<number> = of(1);
    const stream: Observable<string> = source.pipe(toString);

    // the real test is just that the above does not give a type error
    expect().nothing();
  });

  it("works for the example in the documentation", async () => {
    function map<I, O>(fn: (input: I) => O) {
      return createPipeable(
        (
          upstream: Observable<I>,
          downstream: Subscriber<O>,
          subscriptionManager: SubscriptionManager,
        ) => {
          subscriptionManager.subscribeTo(
            upstream,
            (value) => {
              downstream.next(fn(value));
            },
            downstream.error.bind(downstream),
            downstream.complete.bind(downstream),
          );
        },
      );
    }

    expect(
      await of(1, 2, 3)
        .pipe(
          map((i) => i + 1),
          toArray(),
        )
        .toPromise(),
    ).toEqual([2, 3, 4]);
    expect(
      await of(1, 2, 3)
        .pipe(
          map((i) => i.toString()),
          toArray(),
        )
        .toPromise(),
    ).toEqual(["1", "2", "3"]);
  });
});
