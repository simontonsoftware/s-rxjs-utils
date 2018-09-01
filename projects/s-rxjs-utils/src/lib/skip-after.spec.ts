import { Subject } from "rxjs";
import { skipAfter } from "./skip-after";

describe("skipAfter()", () => {
  it("causes the next emission to be skipped", () => {
    const skip$ = new Subject();
    const source = new Subject();
    const next = jasmine.createSpy();
    source.pipe(skipAfter(skip$)).subscribe(next);

    source.next(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(1);

    skip$.next();
    source.next(2);
    expect(next).toHaveBeenCalledTimes(1);

    source.next(3);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(3);
  });

  it("only skips one emission even if called multiple times", () => {
    const skip$ = new Subject();
    const source = new Subject();
    const next = jasmine.createSpy();
    source.pipe(skipAfter(skip$)).subscribe(next);

    source.next(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(1);

    skip$.next();
    skip$.next();
    source.next(2);
    expect(next).toHaveBeenCalledTimes(1);

    source.next(3);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(3);
  });

  it("handles completions", () => {
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

  it("handles errors", () => {
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
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith("the error");
  });

  it("handles unsubscribes", () => {
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
});
