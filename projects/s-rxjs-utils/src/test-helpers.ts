import { of, OperatorFunction, Subject } from "rxjs";
import { toArray } from "rxjs/operators";

export async function expectPipeResult<I, O>(
  source: I[],
  operator: OperatorFunction<I, O>,
  result: O[],
) {
  expect(await pipeAndCollect(source, operator)).toEqual(result);
}

export function pipeAndCollect<I, O>(
  source: I[],
  operator: OperatorFunction<I, O>,
): Promise<O[]> {
  return of(...source)
    .pipe(
      operator,
      toArray(),
    )
    .toPromise();
}

// consider for s-js-utils
export function expectSingleCallAndReset(spy: jasmine.Spy, ...params: any[]) {
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(...params);
  spy.calls.reset();
}

export function testUnsubscribePropagation(
  buildOperator: () => OperatorFunction<any, any>,
) {
  const source = new Subject();
  const subscription1 = source.pipe(buildOperator()).subscribe();
  const subscription2 = source.pipe(buildOperator()).subscribe();
  expect(source.observers.length).toBe(2);

  subscription1.unsubscribe();
  expect(source.observers.length).toBe(1);

  subscription2.unsubscribe();
  expect(source.observers.length).toBe(0);
}

export function testErrorPropagation(
  buildOperator: () => OperatorFunction<any, any>,
) {
  const source = new Subject();
  const error1 = jasmine.createSpy();
  const error2 = jasmine.createSpy();
  source.pipe(buildOperator()).subscribe(undefined, error1);
  source.pipe(buildOperator()).subscribe(undefined, error2);

  expect(source.observers.length).toBe(2);
  expect(error1).not.toHaveBeenCalled();
  expect(error2).not.toHaveBeenCalled();

  source.error("the error");

  expect(source.observers.length).toBe(0);
  expectSingleCallAndReset(error1, "the error");
  expectSingleCallAndReset(error2, "the error");
}

export function testCompletionPropagation(
  buildOperator: () => OperatorFunction<any, any>,
) {
  const source = new Subject();
  const complete1 = jasmine.createSpy();
  const complete2 = jasmine.createSpy();
  source.pipe(buildOperator()).subscribe(undefined, undefined, complete1);
  source.pipe(buildOperator()).subscribe(undefined, undefined, complete2);

  expect(source.observers.length).toBe(2);
  expect(complete1).not.toHaveBeenCalled();
  expect(complete2).not.toHaveBeenCalled();

  source.complete();

  expect(source.observers.length).toBe(0);
  expectSingleCallAndReset(complete1);
  expectSingleCallAndReset(complete2);
}
