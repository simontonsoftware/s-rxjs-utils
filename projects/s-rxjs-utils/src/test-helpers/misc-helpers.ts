import {
  BehaviorSubject,
  Observable,
  of,
  OperatorFunction,
  Subject,
} from "rxjs";
import { catchError, toArray } from "rxjs/operators";
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

export function testUserFunctionError(
  buildOperator: (thrower: () => never) => OperatorFunction<any, any>,
  upstreamValue: any = 1,
) {
  const ex = new Error();
  const thrower = () => {
    throw ex;
  };
  const source = new Subject();
  const sub1 = subscribeWithStubs(source.pipe(buildOperator(thrower)));
  const sub2 = subscribeWithStubs(source.pipe(buildOperator(thrower)));
  const sub3 = subscribeWithStubs(
    source.pipe(
      buildOperator(thrower),
      catchError(() => new BehaviorSubject(-1)),
    ),
  );

  expect(source.observers.length).toBe(3);
  sub1.expectNoCalls();
  sub2.expectNoCalls();
  sub3.expectNoCalls();

  source.next(upstreamValue);

  expect(source.observers.length).toBe(0);
  sub1.expectReceivedOnlyError(ex);
  sub2.expectReceivedOnlyError(ex);
  sub3.expectReceivedOnlyValue(-1);
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
