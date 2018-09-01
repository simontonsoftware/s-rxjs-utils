import { Subject } from "rxjs";
import { expectPipeResult } from "../test-helpers";
import { withHistory } from "./with-history";

describe("withHistory()", () => {
  it("emits the last `historyCount` values", async () => {
    await expectPipeResult([1, 2, 3, 4], withHistory(2), [
      [1],
      [2, 1],
      [3, 2, 1],
      [4, 3, 2],
    ]);
    await expectPipeResult([1, 2, 3, 4], withHistory(1), [
      [1],
      [2, 1],
      [3, 2],
      [4, 3],
    ]);
    await expectPipeResult([1, 2, 3, 4], withHistory(0), [[1], [2], [3], [4]]);
  });

  it("handles errors", () => {
    const source$ = new Subject();
    const error = jasmine.createSpy();
    source$.pipe(withHistory(1)).subscribe(undefined, error);

    expect(source$.observers.length).toBe(1);
    expect(error).not.toHaveBeenCalled();

    source$.error("the error");

    expect(source$.observers.length).toBe(0);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith("the error");
  });

  it("handles unsubscribes", () => {
    const source$ = new Subject();

    const subscription1 = source$.pipe(withHistory(1)).subscribe();
    const subscription2 = source$.pipe(withHistory(2)).subscribe();
    expect(source$.observers.length).toBe(2);

    subscription1.unsubscribe();
    expect(source$.observers.length).toBe(1);

    subscription2.unsubscribe();
    expect(source$.observers.length).toBe(0);
  });
});
