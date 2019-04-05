import {
  expectPipeResult,
  testCompletionPropagation,
  testErrorPropagation,
  testUnsubscribePropagation,
} from "../test-helpers";
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

  it("passes along unsubscribes", () => {
    testUnsubscribePropagation(() => withHistory(1));
  });

  it("passes along errors", () => {
    testErrorPropagation(() => withHistory(1));
  });

  it("passes along completion", () => {
    testCompletionPropagation(() => withHistory(1));
  });
});
