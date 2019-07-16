import { Component } from "@angular/core";
import { noop, identity } from "micro-dash";
import { of, Subject } from "rxjs";
import {
  cache,
  createOperatorFunction,
  delayOnMicrotaskQueue,
  distinctUntilKeysChanged,
  filterBehavior,
  logValues,
  mapAndCacheArrayElements,
  mapAndCacheObjectElements,
  mapToLatestFrom,
  skipAfter,
  SubscriptionManager,
  withHistory,
} from "s-rxjs-utils";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "failure";

  constructor() {
    // just use each function once, to prove it can be imported
    new SubscriptionManager().subscribeTo(
      new Subject<number>().pipe(
        cache(),
        createOperatorFunction(noop),
        delayOnMicrotaskQueue(),
        filterBehavior(() => true),
        logValues(),
        mapToLatestFrom(of(1)),
        skipAfter(new Subject()),

        // switch type to number[]
        withHistory(3),
        mapAndCacheArrayElements(identity, identity),
        mapAndCacheObjectElements(identity, identity),
        distinctUntilKeysChanged(),
      ),
    );

    this.title = "s-rxjs-utils-platform";
  }
}
