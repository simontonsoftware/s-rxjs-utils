import { Subject } from "rxjs";
import { mapArrayWithCaching } from "./map-with-caching";

describe("mapArrayWithCaching()", () => {
  it("maps over the array using the given function", () => {
    const source = new Subject<number[]>();
    let lastEmittedThing: number[] = [];

    source
      .asObservable()
      .pipe(mapArrayWithCaching((item) => item.toString(), (item) => item * 3))
      .subscribe((value) => {
        lastEmittedThing = value;
      });

    const array = [1, 2, 3, 4, 5, 6];
    source.next(array);
    expect(lastEmittedThing).toEqual([3, 6, 9, 12, 15, 18]);

    array.splice(2, 2); // array = [1, 2, 5, 6]
    source.next(array);
    expect(lastEmittedThing).toEqual([3, 6, 15, 18]);

    array.push(10); // array = [1, 2, 5, 6, 10]
    source.next(array);
    expect(lastEmittedThing).toEqual([3, 6, 15, 18, 30]);
  });

  it("emits the same object reference for items that have the same cache key", async () => {
    const source = new Subject<Array<{ index: number }>>();
    let lastEmittedThing: Array<{ index: number }> = [];

    source
      .asObservable()
      .pipe(
        mapArrayWithCaching(
          (item) => item.index.toString(),
          (item) => ({ index: item.index + 1 }),
        ),
      )
      .subscribe((value) => {
        lastEmittedThing = value;
      });

    source.next([{ index: 1 }]);
    expect(lastEmittedThing).toEqual([{ index: 2 }]);
    const mappedItem1 = lastEmittedThing[0];

    source.next([{ index: 1 }, { index: 2 }]);
    expect(lastEmittedThing).toEqual([{ index: 2 }, { index: 3 }]);
    expect(lastEmittedThing[0]).toBe(mappedItem1);
  });

  it("handles the upstream source completing", () => {
    const source = new Subject<number[]>();
    const complete = jasmine.createSpy();

    source
      .pipe(mapArrayWithCaching((item) => item.toString(), (item) => item + 1))
      .subscribe(undefined, undefined, complete);

    source.complete();

    expect(source.observers.length).toBe(0);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("handles errors", () => {
    const source = new Subject<number[]>();
    const error = jasmine.createSpy();

    source
      .pipe(mapArrayWithCaching((item) => item.toString(), (item) => item + 1))
      .subscribe(undefined, error);

    source.error("fire!!");

    expect(source.observers.length).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith("fire!!");
  });

  it("handles unsubscribes", () => {
    const source = new Subject<number[]>();

    const subscription1 = source
      .pipe(mapArrayWithCaching((item) => item.toString(), (item) => item + 1))
      .subscribe();
    const subscription2 = source
      .pipe(mapArrayWithCaching((item) => item.toString(), (item) => item + 1))
      .subscribe();
    expect(source.observers.length).toBe(2);

    subscription1.unsubscribe();
    expect(source.observers.length).toBe(1);

    subscription2.unsubscribe();
    expect(source.observers.length).toBe(0);
  });
});
