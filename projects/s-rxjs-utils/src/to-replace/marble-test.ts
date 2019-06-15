import { TestScheduler } from "rxjs/testing";

type Run = Parameters<TestScheduler["run"]>[0];
type Callback<T> = (...args: Parameters<Run>) => T;

export function marbleTest<T>(callback: Callback<T>) {
  return () =>
    new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    }).run(callback);
}
