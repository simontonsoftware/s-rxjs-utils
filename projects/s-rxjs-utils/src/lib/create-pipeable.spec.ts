import { Observable, of } from "rxjs";
import { expectPipeResult } from "../test-helpers";
import { createPipeable } from "./create-pipeable";

describe("createPipeable()", () => {
  // tested by skipAfter()
  // it('cleans up subscriptions made through the manager');

  it("correctly changes the type of a stream", () => {
    const toString = createPipeable<any, string>(
      (upstream, downstream, subscriptionManager) => {
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
      return createPipeable<I, O>(
        (upstream, downstream, subscriptionManager) => {
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

    await expectPipeResult([1, 2, 3], map((i) => i + 1), [2, 3, 4]);
    await expectPipeResult([1, 2, 3], map((i) => i.toString()), [
      "1",
      "2",
      "3",
    ]);
  });
});
