import { Observable, of, OperatorFunction, Subject } from "rxjs";
import { toArray } from "rxjs/operators";
import { StubbedSubscriber } from "./stubbed-subscriber";

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

// export function testUserFunctionError(
//   buildOperator: (userFn: () => never) => OperatorFunction<any, any>,
// ) {
//   const ex = new Error();
//   const thrower = () => {
//     throw ex;
//   };
//   const source = new Subject();
//   const next1 = jasmine.createSpy();
//   const next2 = jasmine.createSpy();
//   const next3 = jasmine.createSpy();
//   const error1 = jasmine.createSpy();
//   const error2 = jasmine.createSpy();
//   const error3 = jasmine.createSpy();
//   source.pipe(buildOperator(thrower)).subscribe(next1, error1);
//   source.pipe(buildOperator(thrower)).subscribe(next2, error2);
//   source
//     .pipe(
//       buildOperator(thrower),
//       catchError(() => of(1)),
//     )
//     .subscribe(next3, error3);
//
//   expect(source.observers.length).toBe(3);
//   expect(next1).not.toHaveBeenCalled();
//   expect(next2).not.toHaveBeenCalled();
//   expect(next3).not.toHaveBeenCalled();
//   expect(error1).not.toHaveBeenCalled();
//   expect(error2).not.toHaveBeenCalled();
//   expect(error3).not.toHaveBeenCalled();
//
//   source.next(1);
//
//   expect(source.observers.length).toBe(0);
//   expect(next1).not.toHaveBeenCalled();
//   expect(next2).not.toHaveBeenCalled();
//   expectSingleCallAndReset(next3, 1);
//   expectSingleCallAndReset(error1, ex);
//   expectSingleCallAndReset(error2, ex);
//   expect(error3).not.toHaveBeenCalled();
// }

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
  const sub1 = subscribeWithStubs(source.pipe(buildOperator()));
  const sub2 = subscribeWithStubs(source.pipe(buildOperator()));

  expect(source.observers.length).toBe(2);
  sub1.expectNoCalls();
  sub2.expectNoCalls();

  source.error("the error");

  expect(source.observers.length).toBe(0);
  sub1.expectReceivedOnlyError("the error");
  sub2.expectReceivedOnlyError("the error");
}

export function testCompletionPropagation(
  buildOperator: () => OperatorFunction<any, any>,
) {
  const source = new Subject();
  const sub1 = subscribeWithStubs(source.pipe(buildOperator()));
  const sub2 = subscribeWithStubs(source.pipe(buildOperator()));

  expect(source.observers.length).toBe(2);
  sub1.expectNoCalls();
  sub2.expectNoCalls();

  source.complete();

  expect(source.observers.length).toBe(0);
  sub1.expectReceivedOnlyCompletion();
  sub2.expectReceivedOnlyCompletion();
}

export function subscribeWithStubs(observable: Observable<any>) {
  const subscriber = new StubbedSubscriber();
  observable.subscribe(subscriber);
  return subscriber;
}
