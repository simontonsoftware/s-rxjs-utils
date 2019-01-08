import { Component } from "@angular/core";
import { noop } from "micro-dash";
import { Subject } from "rxjs";
import {
  cache,
  createPipeable,
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
      new Subject().pipe(
        cache(),
        createPipeable(noop),
        skipAfter(new Subject()),
        withHistory(3),
      ),
    );

    this.title = "s-rxjs-utils-platform";
  }
}
