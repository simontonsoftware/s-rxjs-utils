import { Component } from "@angular/core";
import { noop, identity } from "micro-dash";
import { Subject } from "rxjs";
import {
  cache,
  createOperatorFunction,
  createPipeable,
  filterBehavior,
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
        createPipeable(noop),
        filterBehavior(() => true),
        skipAfter(new Subject()),

        // switch type to number[]
        withHistory(3),
        mapAndCacheArrayElements(identity, identity),
        mapAndCacheObjectElements(identity, identity),
      ),
    );

    this.title = "s-rxjs-utils-platform";
  }
}
