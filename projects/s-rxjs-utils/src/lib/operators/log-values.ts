import { tap } from "rxjs/operators";

/**
 * Logs values, errors and completion to the console, and passes them all along unchanged.
 */
export function logValues(
  prefix?: string,
  level: "debug" | "trace" | "info" | "log" | "warn" | "error" = "log",
) {
  return tap(
    makeLogFn("[value]"),
    makeLogFn("[error]"),
    makeLogFn("[complete]"),
  );

  function makeLogFn(...prefixes: string[]) {
    if (prefix !== undefined) {
      prefixes.push(prefix);
    }
    return (...values: any[]) => {
      console[level](...prefixes, ...values);
    };
  }
}
