import { Component } from "@angular/core";
import { noop, identity } from "micro-dash";
import { Subject } from "rxjs";
import {
  cache,
  createOperatorFunction,
  distinctUntilKeysChanged,
  filterBehavior,
  logValues,
  mapAndCacheArrayElements,
  mapAndCacheObjectElements,
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
        filterBehavior(() => true),
        logValues(),
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
