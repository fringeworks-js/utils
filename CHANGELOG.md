# Changelog

All notable changes to `@fringeworks/utils` are documented in this file.\
This project follows [Semantic Versioning](https://semver.org/).

## 1.2.0 - Unreleased

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
