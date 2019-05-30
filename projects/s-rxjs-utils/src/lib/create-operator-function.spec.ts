import { Subject } from "rxjs";
import { expectSingleCallAndReset } from "s-ng-dev-utils";
import {
  expectPipeResult,
  testCompletionPropagation,
  testErrorPropagation,
  testUnsubscribePropagation,
} from "../test-helpers";
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
    const next = jasmine.createSpy();
    const error = jasmine.createSpy();
    source
      .pipe(
        createOperatorFunction<number>((subscriber, destination) => {
          subscriber.next = (value) => {
            destination.next(value + 1);
          };
          subscriber.error = (value) => {
            destination.error(value - 1);
          };
        }),
      )
      .subscribe(next, error);

    source.next(10);
    source.error(10);

    expectSingleCallAndReset(next, 11);
    expectSingleCallAndReset(error, 9);
  });

  it("allows preventing values, error and completion", () => {
    const source = new Subject<number>();
    const next = jasmine.createSpy();
    const error = jasmine.createSpy();
    const complete = jasmine.createSpy();
    source
      .pipe(
        createOperatorFunction<number>((subscriber) => {
          subscriber.next = () => {};
          subscriber.error = () => {};
          subscriber.complete = () => {};
        }),
      )
      .subscribe(next, error, complete);

    source.next(10);
    source.error(10);
    source.complete();

    expect(next).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    expect(complete).not.toHaveBeenCalled();
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
