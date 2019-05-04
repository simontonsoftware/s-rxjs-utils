import { map as _map } from "micro-dash";
import { map } from "rxjs/operators";

export function mapAndCacheElements<UpstreamType, DownstreamType>(
  buildCacheKey: (upstreamItem: UpstreamType, key: keyof any) => any,
  buildDownstreamItem: (
    upstreamItem: UpstreamType,
    key: keyof any,
  ) => DownstreamType,
) {
  let cache: Map<any, DownstreamType> = new Map();

  return map((upstreamItems: any) => {
    const nextCache: Map<any, DownstreamType> = new Map();

    const downstreamItems = _map(upstreamItems, (upstreamItem, key) => {
      const cacheKey = buildCacheKey(upstreamItem, key);

      let downstreamItem: DownstreamType;
      if (cache.has(cacheKey)) {
        downstreamItem = cache.get(cacheKey)!;
      } else if (nextCache.has(cacheKey)) {
        downstreamItem = nextCache.get(cacheKey)!;
      } else {
        downstreamItem = buildDownstreamItem(upstreamItem, key);
      }

      nextCache.set(cacheKey, downstreamItem);
      return downstreamItem;
    });

    cache = nextCache;
    return downstreamItems;
  });
}
