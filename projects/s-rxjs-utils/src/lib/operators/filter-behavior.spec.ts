import { Subject } from "rxjs";
import {
  expectSingleCallAndReset,
  testCompletionPropagation,
  testErrorPropagation,
  testUnsubscribePropagation,
} from "../../test-helpers";
import { filterBehavior } from "./filter-behavior";

describe("filterBehavior()", () => {
  it("filters items based on the supplied predicate", () => {
    const source = new Subject();
    const predicate = jasmine.createSpy();
    const next = jasmine.createSpy();
    source.pipe(filterBehavior(predicate)).subscribe(next);

    source.next(1);
    expectSingleCallAndReset(next, 1);

    predicate.and.returnValue(true);
    source.next(2);
    expectSingleCallAndReset(next, 2);
    source.next(3);
    expectSingleCallAndReset(next, 3);

    predicate.and.returnValue(false);
    source.next(4);
    source.next(5);
    expect(next).not.toHaveBeenCalled();

    predicate.and.returnValue(true);
    source.next(6);
    expectSingleCallAndReset(next, 6);
  });

  it("emits the first value unconditionally for each subscriber", () => {
    const source = new Subject();
    const predicate = jasmine.createSpy().and.returnValue(false);
    const filtered$ = source.pipe(filterBehavior(predicate));

    const next1 = jasmine.createSpy();
    filtered$.subscribe(next1);
    source.next(1);
    source.next(2);
    source.next(3);

    const next2 = jasmine.createSpy();
    filtered$.subscribe(next2);
    source.next(4);
    source.next(5);
    source.next(6);

    const next3 = jasmine.createSpy();
    filtered$.subscribe(next3);
    source.next(7);
    source.next(8);
    source.next(9);

    expectSingleCallAndReset(next1, 1);
    expectSingleCallAndReset(next2, 4);
    expectSingleCallAndReset(next3, 7);
  });

  it("passes along unsubscribes", () => {
    testUnsubscribePropagation(() => filterBehavior(() => true));
  });

  it("passes along errors", () => {
    testErrorPropagation(() => filterBehavior(() => true));
  });

  it("passes along completion", () => {
    testCompletionPropagation(() => filterBehavior(() => true));
  });
});
