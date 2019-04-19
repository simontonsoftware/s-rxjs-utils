import { Subject } from "rxjs";
import { expectSingleCallAndReset } from "s-ng-test-utils";
import { skipAfter } from "./skip-after";

describe("skipAfter()", () => {
  it("causes the next emission to be skipped", () => {
    const skip$ = new Subject();
    const source = new Subject();
    const next = jasmine.createSpy();
    source.pipe(skipAfter(skip$)).subscribe(next);

    source.next(1);
    expectSingleCallAndReset(next, 1);

    skip$.next();
    source.next(2);
    expect(next).not.toHaveBeenCalled();

    source.next(3);
    expectSingleCallAndReset(next, 3);
  });

  it("only skips one emission even if called multiple times", () => {
    const skip$ = new Subject();
    const source = new Subject();
    const next = jasmine.createSpy();
    source.pipe(skipAfter(skip$)).subscribe(next);

    source.next(1);
    expectSingleCallAndReset(next, 1);

    skip$.next();
    skip$.next();
    source.next(2);
    expect(next).not.toHaveBeenCalled();

    source.next(3);
    expectSingleCallAndReset(next, 3);
  });

  it("passes along unsubscribes", () => {
    const skip$ = new Subject();
    const upstream$ = new Subject();

    const subscription1 = upstream$.pipe(skipAfter(skip$)).subscribe();
    const subscription2 = upstream$.pipe(skipAfter(skip$)).subscribe();
    expect(skip$.observers.length).toBe(2);
    expect(upstream$.observers.length).toBe(2);

    subscription1.unsubscribe();
    expect(skip$.observers.length).toBe(1);
    expect(upstream$.observers.length).toBe(1);

    subscription2.unsubscribe();
    expect(skip$.observers.length).toBe(0);
    expect(upstream$.observers.length).toBe(0);
  });

  it("passes along errors", () => {
    const skip$ = new Subject();
    const upstream$ = new Subject();
    const error = jasmine.createSpy();
    upstream$.pipe(skipAfter(skip$)).subscribe(undefined, error);

    expect(skip$.observers.length).toBe(1);
    expect(upstream$.observers.length).toBe(1);
    expect(error).not.toHaveBeenCalled();

    upstream$.error("the error");

    expect(skip$.observers.length).toBe(0);
    expect(upstream$.observers.length).toBe(0);
    expectSingleCallAndReset(error, "the error");
  });

  it("passes along completion", () => {
    const skip$ = new Subject();
    const upstream$ = new Subject();
    const complete = jasmine.createSpy();
    upstream$.pipe(skipAfter(skip$)).subscribe(undefined, undefined, complete);

    expect(skip$.observers.length).toBe(1);
    expect(upstream$.observers.length).toBe(1);
    expect(complete).not.toHaveBeenCalled();

    upstream$.complete();

    expect(skip$.observers.length).toBe(0);
    expect(upstream$.observers.length).toBe(0);
    expect(complete).toHaveBeenCalledTimes(1);
  });
});
