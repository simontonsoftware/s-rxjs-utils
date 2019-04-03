import { ObjectWith } from "micro-dash";
import { map } from "rxjs/operators";

export function mapArrayWithCaching<U, D>(
  buildCacheKey: (upstreamItem: U) => string,
  buildDownstreamItem: (upstreamItem: U) => D,
) {
  let cache: ObjectWith<D> = {};

  return map((upstreamItems: U[]) => {
    const nextCache: ObjectWith<D> = {};

    const downstreamItems = upstreamItems.map((upstreamItem) => {
      const cacheKey = buildCacheKey(upstreamItem);

      let downstreamItem: D;
      if (cache.hasOwnProperty(cacheKey)) {
        downstreamItem = cache[cacheKey];
      } else {
        downstreamItem = buildDownstreamItem(upstreamItem);
      }

      nextCache[cacheKey] = downstreamItem;
      return downstreamItem;
    });

    cache = nextCache;
    return downstreamItems;
  });
}
