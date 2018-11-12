import { of, OperatorFunction } from "rxjs";
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