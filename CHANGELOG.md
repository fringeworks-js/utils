# Changelog

All notable changes to `@fringeworks/utils` are documented in this file.\
This project follows [Semantic Versioning](https://semver.org/).

## 2.0.0 - 2026-10-31

### Changed

- `limitPositiveNumber` and `limitNaturalNumber` treat an option whose value is `undefined` (`nanValue`, `zeroValue`, and `negativeValue`) as not specified, and return `null` as when the key is absent. Previously, `{ zeroValue: undefined }` returned `undefined`. The types of these options no longer include `undefined` as a value to return.

### Removed

- `filterByKeys` and `filterByValues`, which were deprecated in 1.3.0. Use `searchByKeys` and `searchByValues` of `@fringeworks/debug-tools` instead. In the new functions, a string condition is an exact match by the same rules as `createStringMatcher`; write a partial match as `{ includes: '...' }`. A number condition of `filterByKeys` becomes a string (`0` → `'0'`), and `searchByValues` compares numbers, booleans, and bigints as strings.

## 1.3.0 - 2026-10-31

### Deprecated

- `filterByKeys` and `filterByValues`. They moved to `searchByKeys` and `searchByValues` of `@fringeworks/debug-tools`, which compare string conditions by the same rules as `createStringMatcher` (a string is an exact match; write a partial match as `{ includes: '...' }`). They will be removed in 2.0.0.

## 1.2.0 - 2026-10-31

### Added

- `createStringMatcher`, which creates a function that tests whether a string matches a condition. A string is an exact match, a `RegExp` is a regular expression, `{ includes }`, `{ startsWith }`, `{ endsWith }`, and `{ matches }` (`StringComparison`) are partial, prefix, suffix, and regular expression matches (all of them must match when several are given), a function is a custom test, and an array matches when any of its conditions matches. The `ignoreCase` and `normalize` options are available. Functions that select strings by a condition follow these rules.
- `assignOnly` and `assignOnlyMutable` accept `StringComparison` objects and arrays that mix keys, `RegExp`s, and `StringComparison`s as conditions on keys.

## 1.1.0 - 2026-10-30

### Added

- `assignOnly` and `assignOnlyMutable`, which assign only the values of `values` that match a condition. The condition can be a key, an array of keys, a regular expression matched against keys, or a function that receives the value, the key, and the current value in `target`.
- `createRange`, which creates an array of sequential numbers with optional `start` and `step`.
- `lastItem`, which returns the last element of an array (an alternative to `Array.prototype.at(-1)`, which is ES2022).
- `removeAt` and `removeAtMutable`, which remove elements at an index. The number of elements to remove is given by the `count` option (defaults to 1). Nothing is removed when the index is out of range.
- `truncateArrayMutable`, which truncates an array to a length. Unlike assigning to `length`, it never extends the array.
- `moveToEnd` option for `assignDefined`, `assignDefinedMutable`, `assignPresent`, and `assignPresentMutable`. When `true`, assigned keys are moved to the end of the result's key order, so that `values` take precedence in objects such as styles where later keys win.

## 1.0.0 - 2026-10-29

First stable release.
