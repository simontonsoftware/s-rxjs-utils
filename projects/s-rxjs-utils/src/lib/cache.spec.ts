import { BehaviorSubject, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { expectSingleCallAndReset } from "../test-helpers";
import { cache } from "./cache";

describe("cache()", () => {
  it("caches the last value emitted to give to new subscribers", () => {
    const value = Symbol();
    const source = new Subject();
    const cached = source.pipe(cache());
    const next1 = jasmine.createSpy();
    const next2 = jasmine.createSpy();

    cached.subscribe();
    source.next(value);

    cached.subscribe(next1);
    cached.subscribe(next2);

    expectSingleCallAndReset(next1, value);
    expectSingleCallAndReset(next2, value);
  });

  it("does not run upstream pipe operators for new subscribers", () => {
    const upstream = jasmine.createSpy();
    const cached = new Subject().pipe(
      tap(upstream),
      cache(),
    );

    cached.subscribe();
    cached.subscribe();
    cached.subscribe();

    expect(upstream).not.toHaveBeenCalled();
  });

  it("only runs upstream operators once for any number of subscribers", () => {
    const upstream = jasmine.createSpy();
    const cached = new BehaviorSubject(1).pipe(
      tap(upstream),
      cache(),
    );

    cached.subscribe();
    cached.subscribe();
    cached.subscribe();

    expectSingleCallAndReset(upstream, 1);
  });

  it("unsubscribes from the upstream observable", () => {
    const source = new Subject();
    const cached$ = source.pipe(cache());

    const sub1 = cached$.subscribe();
    const sub2 = cached$.subscribe();
    expect(source.observers.length).toBe(1);

    sub1.unsubscribe();
    expect(source.observers.length).toBe(1);

    sub2.unsubscribe();
    expect(source.observers.length).toBe(0);
  });

  it("can resubscribe after unsubscribing", () => {
    const source = new BehaviorSubject(1);
    const cached = source.pipe(cache());
    const next1 = jasmine.createSpy();
    const next2 = jasmine.createSpy();

    const sub = cached.subscribe(next1);
    expectSingleCallAndReset(next1, 1);
    sub.unsubscribe();

    expect(source.observers.length).toBe(0);
    source.next(2);

    cached.subscribe(next2);
    expect(next1).not.toHaveBeenCalled();
    expectSingleCallAndReset(next2, 2);

    source.next(3);
    expect(next1).not.toHaveBeenCalled();
    expectSingleCallAndReset(next2, 3);
  });

  it("passes along errors", () => {
    const source = new Subject();
    const cached = source.pipe(cache());
    const error1 = jasmine.createSpy();
    const error2 = jasmine.createSpy();
    const err = Symbol();

    cached.subscribe(undefined, error1);
    cached.subscribe(undefined, error2);
    source.error(err);

    expectSingleCallAndReset(error1, err);
    expectSingleCallAndReset(error2, err);
  });

  it("passes along completion", () => {
    const source = new Subject();
    const cached = source.pipe(cache());
    const complete1 = jasmine.createSpy();
    const complete2 = jasmine.createSpy();

    cached.subscribe(undefined, undefined, complete1);
    cached.subscribe(undefined, undefined, complete2);
    source.complete();

    expectSingleCallAndReset(complete1);
    expectSingleCallAndReset(complete2);
  });
});
