import { Subject } from "rxjs";
import {
  expectPipeResult,
  subscribeWithStubs,
  testCompletionPropagation,
  testErrorPropagation,
  testUnsubscribePropagation,
} from "../test-helpers/misc-helpers";
import { createOperatorFunction } from "./create-operator-function";

/**
 * This is the example from the documentation. Keep it in sync.
 */
function map<I, O>(fn: (input: I) => O) {
  return createOperatorFunction<I, O>((subscriber, destination) => {
    subscriber.next = (value) => {
      destination.next(fn(value));
    };
  });
}

function noop() {
  return createOperatorFunction(() => {});
}

describe("createOperatorFunction()", () => {
  it("allows modifying values and errors", async () => {
    const source = new Subject<number>();
    const sub = subscribeWithStubs(
      source.pipe(
        createOperatorFunction<number>((subscriber, destination) => {
          subscriber.next = (value) => {
            destination.next(value + 1);
          };
          subscriber.error = (value) => {
            destination.error(value - 1);
          };
        }),
      ),
    );

    source.next(10);
    sub.expectReceivedOnlyValue(11);

    source.error(10);
    sub.expectReceivedOnlyError(9);
  });

  it("allows preventing values, error and completion", () => {
    const source = new Subject<number>();
    const sub = subscribeWithStubs(
      source.pipe(
        createOperatorFunction<number>((subscriber) => {
          subscriber.next = () => {};
          subscriber.error = () => {};
          subscriber.complete = () => {};
        }),
      ),
    );

    source.next(10);
    source.error(10);
    source.complete();

    sub.expectNoCalls();
  });

  it("works for the example in the documentation", async () => {
    await expectPipeResult([1, 2, 3], map((i) => i + 1), [2, 3, 4]);
    await expectPipeResult([1, 2, 3], map((i) => i.toString()), [
      "1",
      "2",
      "3",
    ]);
  });

  it("passes along values by default", async () => {
    await expectPipeResult([1, 2, 3], noop(), [1, 2, 3]);
  });

  it("passes along unsubscribes by default", () => {
    testUnsubscribePropagation(noop);
  });

  it("passes along errors by default", () => {
    testErrorPropagation(noop);
  });

  it("passes along completion by default", () => {
    testCompletionPropagation(noop);
  });
});
