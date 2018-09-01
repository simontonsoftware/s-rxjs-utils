import { Subject } from 'rxjs';
import { skipAfter } from './skip-after';

describe('skipAfter()', () => {
  it('causes the next emission to be skipped', () => {
    const skip$ = new Subject();
    const source = new Subject();
    const next = jasmine.createSpy();
    source.pipe(skipAfter(skip$)).subscribe(next);

    source.next(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(1);

    skip$.next();
    source.next(2);
    expect(next).toHaveBeenCalledTimes(1);

    source.next(3);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(3);
  });

  it('only skips one emission even if called multiple times', () => {
    const skip$ = new Subject();
    const source = new Subject();
    const next = jasmine.createSpy();
    source.pipe(skipAfter(skip$)).subscribe(next);

    source.next(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(1);

    skip$.next();
    skip$.next();
    source.next(2);
    expect(next).toHaveBeenCalledTimes(1);

    source.next(3);
    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(3);
  });

  it('cleans up subscriptions to both `upstream$` and `skip$`', () => {
    const skip$ = new Subject();
    const upstream$ = new Subject();
    const next = jasmine.createSpy();

    const subscription1 = upstream$.pipe(skipAfter(skip$)).subscribe(next);
    const subscription2 = upstream$.pipe(skipAfter(skip$)).subscribe(next);
    expect(skip$.observers.length).toBe(2);
    expect(upstream$.observers.length).toBe(2);

    subscription1.unsubscribe();
    expect(skip$.observers.length).toBe(1);
    expect(upstream$.observers.length).toBe(1);

    subscription2.unsubscribe();
    expect(skip$.observers.length).toBe(0);
    expect(upstream$.observers.length).toBe(0);
  });
});
