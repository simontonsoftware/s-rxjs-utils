import { ObjectWith } from "micro-dash";
import { map } from "rxjs/operators";

/**
 * Applies a given function to each item in the upstream array and emits the result. Each item is then cached using the key generated by `buildCacheKey` so that the next emission contains references to the matching objects from previous emission, without running `buildDownstreamItem` again. The cache is only held between successive emissions.
 *
 * If multiple items in your array have the same cache key, it will only call `buildDownstreamItem` once and will return the same object reference for all items.
 *
 * @param buildCacheKey A function that converts an upstream object into a string to use as the cache key. Needs to return a unique key for each item in the source array.
 * @param buildDownstreamItem
 *
 * ```
 * const mapWithCaching = mapAndCacheElements(
 *   (item) => item.toString(),
 *   (item) => item + 1
 * )
 *
 * source:         -[1, 2]---[1, 2, 3]---[2]--|
 * mapWithCaching: -[2, 3]---[2, 3, 4]---[3]--|
 * ```
 */
export function mapAndCacheElements<
  UpstreamType,
  DownstreamType = UpstreamType
>(
  buildCacheKey: (upstreamItem: UpstreamType) => string,
  buildDownstreamItem: (upstreamItem: UpstreamType) => DownstreamType,
) {
  let cache: ObjectWith<DownstreamType> = {};

  return map((upstreamItems: UpstreamType[]) => {
    const nextCache: ObjectWith<DownstreamType> = {};

    const downstreamItems = upstreamItems.map((upstreamItem) => {
      const cacheKey = buildCacheKey(upstreamItem);

      let downstreamItem: DownstreamType;
      if (cache.hasOwnProperty(cacheKey)) {
        downstreamItem = cache[cacheKey];
      } else if (nextCache.hasOwnProperty(cacheKey)) {
        downstreamItem = nextCache[cacheKey];
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
