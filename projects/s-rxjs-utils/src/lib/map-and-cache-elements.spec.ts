import { Subject } from "rxjs";
import { expectPipeResult, expectSingleCallAndReset } from "../test-helpers";
import { mapAndCacheElements } from "./map-and-cache-elements";

describe("mapAndCacheElements()", () => {
  it("maps over the array using the given function", async () => {
    await expectPipeResult(
      [[1, 2, 3, 4, 5, 6], [1, 2, 5, 6], [1, 2, 5, 6, 10]],
      mapAndCacheElements((item) => item.toString(), (item) => item * 3),
      [[3, 6, 9, 12, 15, 18], [3, 6, 15, 18], [3, 6, 15, 18, 30]],
    );
  });

  it("emits the same object reference for items that have the same cache key", () => {
    const source = new Subject<Array<{ index: number }>>();
    const next = jasmine.createSpy();

    source
      .pipe(
        mapAndCacheElements(
          (item) => item.index.toString(),
          (item) => ({ index: item.index + 1 }),
        ),
      )
      .subscribe(next);

    source.next([{ index: 1 }]);
    const emission1 = next.calls.mostRecent().args[0];

    source.next([{ index: 1 }, { index: 2 }]);
    const emission2 = next.calls.mostRecent().args[0];

    expect(next).toHaveBeenCalledTimes(2);
    expect(emission1).toEqual([{ index: 2 }]);
    expect(emission2).toEqual([{ index: 2 }, { index: 3 }]);
    expect(emission1[0]).toBe(emission2[0]);
  });

  it("does not call `buildDownstreamItem` if there is a match in the cache", () => {
    const source = new Subject<number[]>();
    const buildDownstreamItem = jasmine.createSpy();

    source
      .pipe(mapAndCacheElements((item) => item.toString(), buildDownstreamItem))
      .subscribe();

    source.next([10]);
    expectSingleCallAndReset(buildDownstreamItem, 10);

    source.next([10, 15]);
    expectSingleCallAndReset(buildDownstreamItem, 15);
  });

  it("only calls `buildDownstreamItem` once for a given cache key", () => {
    const source = new Subject<number[]>();
    const buildDownstreamItem = jasmine.createSpy();

    source
      .pipe(mapAndCacheElements((item) => item.toString(), buildDownstreamItem))
      .subscribe();

    source.next([5, 5, 5, 20]);
    expect(buildDownstreamItem).toHaveBeenCalledTimes(2);
    expect(buildDownstreamItem).toHaveBeenCalledWith(5);
    expect(buildDownstreamItem).toHaveBeenCalledWith(20);

    buildDownstreamItem.calls.reset();
    source.next([5, 5, 5, 20, 25, 25]);
    expect(buildDownstreamItem).toHaveBeenCalledTimes(1);
    expect(buildDownstreamItem).toHaveBeenCalledWith(25);
  });

  it("always returns the same object reference for a given cache key", () => {
    const source = new Subject<Array<{ index: number }>>();
    const next = jasmine.createSpy();

    source
      .pipe(
        mapAndCacheElements(
          (item) => item.index.toString(),
          (item) => ({ index: item.index + 1 }),
        ),
      )
      .subscribe(next);

    source.next([{ index: 1 }, { index: 1 }]);
    const emission1 = next.calls.mostRecent().args[0];

    source.next([{ index: 1 }, { index: 1 }, { index: 1 }]);
    const emission2 = next.calls.mostRecent().args[0];

    expect(next).toHaveBeenCalledTimes(2);
    for (const value of [...emission1, ...emission2]) {
      expect(value).toBe(emission1[0]);
    }
  });

  it("handles the upstream source completing", () => {
    const source = new Subject<number[]>();
    const complete = jasmine.createSpy();

    source
      .pipe(mapAndCacheElements((item) => item.toString(), (item) => item + 1))
      .subscribe(undefined, undefined, complete);

    source.complete();

    expect(source.observers.length).toBe(0);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("handles errors", () => {
    const source = new Subject<number[]>();
    const error = jasmine.createSpy();

    source
      .pipe(mapAndCacheElements((item) => item.toString(), (item) => item + 1))
      .subscribe(undefined, error);

    source.error("fire!!");

    expect(source.observers.length).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith("fire!!");
  });

  it("handles unsubscribes", () => {
    const source = new Subject<number[]>();

    const subscription1 = source
      .pipe(mapAndCacheElements((item) => item.toString(), (item) => item + 1))
      .subscribe();
    const subscription2 = source
      .pipe(mapAndCacheElements((item) => item.toString(), (item) => item + 1))
      .subscribe();
    expect(source.observers.length).toBe(2);

    subscription1.unsubscribe();
    expect(source.observers.length).toBe(1);

    subscription2.unsubscribe();
    expect(source.observers.length).toBe(0);
  });
});
