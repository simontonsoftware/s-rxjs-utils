export function expectCallsAndReset(spy: jasmine.Spy, ...allArgs: any[][]) {
  expect(spy).toHaveBeenCalledTimes(allArgs.length);
  expect(spy.calls.allArgs()).toEqual(allArgs);
  spy.calls.reset();
}
