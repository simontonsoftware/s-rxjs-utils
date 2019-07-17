# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.0](https://github.com/simontonsoftware/s-rxjs-utils/compare/v2.2.2...v2.3.0) (2019-07-17)

### Bug Fixes

- expose `mapToLatestFrom` over the public API ([89dec5a](https://github.com/simontonsoftware/s-rxjs-utils/commit/89dec5a))

### Features

- add `delayOnMicrotaskQueue()` ([45171c3](https://github.com/simontonsoftware/s-rxjs-utils/commit/45171c3))

### [2.2.2](https://github.com/simontonsoftware/s-rxjs-utils/compare/v2.2.1...v2.2.2) (2019-06-26)

### Bug Fixes

- remove accidental dependency on `s-ng-dev-utils` ([659833c](https://github.com/simontonsoftware/s-rxjs-utils/commit/659833c))

### [2.2.1](https://github.com/simontonsoftware/s-rxjs-utils/compare/v2.2.0...v2.2.1) (2019-06-16)

### Bug Fixes

- `cache()` would replay a stale value after unsubscribing and resubscribing ([acdae87](https://github.com/simontonsoftware/s-rxjs-utils/commit/acdae87))
- `skipAfter()` handles errors from `skip$` ([b3c69ae](https://github.com/simontonsoftware/s-rxjs-utils/commit/b3c69ae))

## [2.2.0](https://github.com/simontonsoftware/s-rxjs-utils/compare/v2.1.0...v2.2.0) (2019-06-15)

### Features

- add `distinctUntilKeysChanged()` ([b5fc14b](https://github.com/simontonsoftware/s-rxjs-utils/commit/b5fc14b))
- add `logValues()` ([d4a2eee](https://github.com/simontonsoftware/s-rxjs-utils/commit/d4a2eee))
- add `mapToLatestFrom()` ([4ccd6aa](https://github.com/simontonsoftware/s-rxjs-utils/commit/4ccd6aa))

## [2.1.0](https://github.com/simontonsoftware/s-rxjs-utils/compare/v2.0.0...v2.1.0) (2019-06-05)

### Features

- improve handling of errors thrown by passed-in functions ([954bf5b](https://github.com/simontonsoftware/s-rxjs-utils/commit/954bf5b))

## [2.0.0](https://github.com/simontonsoftware/s-rxjs-utils/compare/v1.2.0...v2.0.0) (2019-05-30)

### Features

- add `mapAndCacheObjectElements()` ([9769a34](https://github.com/simontonsoftware/s-rxjs-utils/commit/9769a34))
- update dependencies ([3477bd6](https://github.com/simontonsoftware/s-rxjs-utils/commit/3477bd6))

### BREAKING CHANGES

- Uses Typescript 3.4 (up from 3.1)
- Requires Rxjs 6.4 (up from 6.3)
- Requires micro-dash 6.0 (up from 5.0)
- The deprecated `createPipeable()` was removed. Use `createOperatorFunction()` instead.
- `mapAndCacheElements()` is now `mapAndCacheArrayElements()`

<a name="1.2.0"></a>

# [1.2.0](https://github.com/simontonsoftware/s-rxjs-utils/compare/v1.1.0...v1.2.0) (2019-04-06)

### Features

- add `createOperatorFunction()`, deprecating `createPipeable()` ([23e4c56](https://github.com/simontonsoftware/s-rxjs-utils/commit/23e4c56))
- add `filterBehavior()` ([549dc76](https://github.com/simontonsoftware/s-rxjs-utils/commit/549dc76))
- add `mapAndCacheElements` ([ebf81b1](https://github.com/simontonsoftware/s-rxjs-utils/commit/ebf81b1))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/simontonsoftware/s-rxjs-utils/compare/v1.0.0...v1.1.0) (2019-01-08)

### Features

- add `cache()` ([c1fc0e4](https://github.com/simontonsoftware/s-rxjs-utils/commit/c1fc0e4))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/simontonsoftware/s-rxjs-utils/compare/v0.2.0...v1.0.0) (2018-11-12)

### Chores

- upgrade dependencies ([7983212](https://github.com/simontonsoftware/s-rxjs-utils/commit/7983212))

### BREAKING CHANGES

- uses Typescript 3 (up from Typescript 2)
- requires micro-dash 5 (up from micro-dash 4)

<a name="0.2.0"></a>

# [0.2.0](https://github.com/simontonsoftware/s-rxjs-utils/compare/v0.1.0...v0.2.0) (2018-09-03)

### Features

- add `withHistory()` ([931491e](https://github.com/simontonsoftware/s-rxjs-utils/commit/931491e))

<a name="0.1.0"></a>

# 0.1.0 (2018-09-01)

### Features

- add `createPipeable()` ([356a6bc](https://github.com/simontonsoftware/s-rxjs-utils/commit/356a6bc))
- add `skipAfter()` ([7a8ef7b](https://github.com/simontonsoftware/s-rxjs-utils/commit/7a8ef7b))
- add `SubscriptionManager` ([66a6af3](https://github.com/simontonsoftware/s-rxjs-utils/commit/66a6af3))
