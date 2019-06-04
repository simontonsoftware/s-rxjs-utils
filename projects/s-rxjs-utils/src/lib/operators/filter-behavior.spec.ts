import { Subject } from "rxjs";
import {
  subscribeWithStubs,
  testCompletionPropagation,
  testErrorPropagation,
  testUnsubscribePropagation,
} from "../../test-helpers/misc-helpers";
import { filterBehavior } from "./filter-behavior";

describe("filterBehavior()", () => {
  it("filters items based on the supplied predicate", () => {
    const source = new Subject();
    const predicate = jasmine.createSpy();
    const sub = subscribeWithStubs(source.pipe(filterBehavior(predicate)));

    source.next(1);
    sub.expectReceivedOnlyValue(1);

    predicate.and.returnValue(true);
    source.next(2);
    sub.expectReceivedOnlyValue(2);
    source.next(3);
    sub.expectReceivedOnlyValue(3);

    predicate.and.returnValue(false);
    source.next(4);
    source.next(5);
    sub.expectNoCalls();

    predicate.and.returnValue(true);
    source.next(6);
    sub.expectReceivedOnlyValue(6);
  });

  it("emits the first value unconditionally for each subscriber", () => {
    const source = new Subject();
    const predicate = jasmine.createSpy().and.returnValue(false);
    const filtered$ = source.pipe(filterBehavior(predicate));

    const sub1 = subscribeWithStubs(filtered$);
    source.next(1);
    source.next(2);
    source.next(3);

    const sub2 = subscribeWithStubs(filtered$);
    source.next(4);
    source.next(5);
    source.next(6);

    const sub3 = subscribeWithStubs(filtered$);
    source.next(7);
    source.next(8);
    source.next(9);

    sub1.expectReceivedOnlyValue(1);
    sub2.expectReceivedOnlyValue(4);
    sub3.expectReceivedOnlyValue(7);
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
