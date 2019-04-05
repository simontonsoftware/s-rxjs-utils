import { Component } from "@angular/core";
import { noop } from "micro-dash";
import { Subject } from "rxjs";
import {
  cache,
  createPipeable,
  mapAndCacheElements,
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
        createPipeable(noop),
        skipAfter(new Subject()),
        withHistory(3),
        mapAndCacheElements(
          (item: number) => item.toString(),
          (item: number) => item + 1,
        ),
      ),
    );

    this.title = "s-rxjs-utils-platform";
  }
}
