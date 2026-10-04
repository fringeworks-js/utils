# @fringeworks/utils

`@fringeworks/utils` is a niche library of general-purpose utility functions covering a wide range of categories including arrays, objects, strings, numbers, dates, timers, and more.

**[日本語の README はこちら](./README.ja.md)**

## Installation

```bash
npm install @fringeworks/utils
# or
pnpm add @fringeworks/utils
```

## Usage

```ts
import { ensureArray, normalizeString, rangeClamp } from '@fringeworks/utils';
```

You can also import by category.

```ts
import { ensureArray } from '@fringeworks/utils/array';
import { normalizeString } from '@fringeworks/utils/string';
```

## Data Last Pattern

Many functions have a `.dataLast` property that returns a curried function receiving data as the last argument. This is useful for pipeline processing.

```ts
import { ensureArray } from '@fringeworks/utils/array';

// data-first (normal call)
const arr = ensureArray('hello'); // ['hello']

// data-last (curried)
const toArray = ensureArray.dataLast();
const arr2 = toArray('hello'); // ['hello']
```

---

## API Reference

### array — Array Operations

#### `asArray(data, options?)` [`*`](#-data-last-support)

Converts any value to an array. Iterables are spread; strings and primitives become single-element arrays.

```ts
asArray([1, 2, 3]); // [1, 2, 3]
asArray('hello'); // ['hello']
asArray(null); // []
asArray(new Set([1, 2])); // [1, 2]
```

| Option | Type      | Description                                                        |
| ------ | --------- | ------------------------------------------------------------------ |
| `raw`  | `boolean` | When `true`, wraps iterables as a single element without spreading |

---

#### `ensureArray(data, options?)` [`*`](#-data-last-support)

Wraps a non-array value in an array. Returns an empty array for `null`/`undefined`.

```ts
ensureArray([1, 2]); // [1, 2]
ensureArray(42); // [42]
ensureArray(null); // []
```

| Option | Type      | Description                                                                        |
| ------ | --------- | ---------------------------------------------------------------------------------- |
| `raw`  | `boolean` | When `true`, wraps the value as a single element without checking if it's an array |

---

#### `cycle(data, size)` [`*`](#-data-last-support)

Generates a new array of the specified size by cycling (looping) through the input array. A negative `size` reverses the direction.

```ts
cycle([1, 2, 3], 7); // [1, 2, 3, 1, 2, 3, 1]
cycle([1, 2, 3], -5); // [3, 2, 1, 3, 2]
```

---

#### `insertAt(data, index, items, options?)` [`*`](#-data-last-support)

Inserts elements at the specified index. The index is clamped to the valid range.

```ts
insertAt([1, 2, 3], 1, [10, 20]); // [1, 10, 20, 2, 3]
```

| Option    | Type      | Description                                       |
| --------- | --------- | ------------------------------------------------- |
| `inplace` | `boolean` | When `true`, directly modifies the original array |

---

#### `pushAll(data, source, options?)` [`*`](#-data-last-support)

Returns a new array with all elements of `source` appended to `data`. Returns `null` if `data` is `null`.

```ts
pushAll([1, 2], [3, 4]); // [1, 2, 3, 4]
```

---

#### `pushAllMutable(data, source)` [`*`](#-data-last-support)

Mutably appends all elements of another array to the array.

```ts
const arr = [1, 2];
pushAllMutable(arr, [3, 4]); // arr => [1, 2, 3, 4]
```

---

#### `pushUnique(data, items, options?)` [`*`](#-data-last-support)

Returns a new array with only non-duplicate elements from `items` appended.

```ts
pushUnique([1, 2], [2, 3, 4]); // [1, 2, 3, 4]
```

---

#### `pushUniqueMutable(data, items, options?)` [`*`](#-data-last-support)

Mutably appends only non-duplicate elements from `items` to the array.

---

#### `rotateArray(data, options?)` [`*`](#-data-last-support)

Rotates the array by taking elements from the front and adding them to the end.

```ts
rotateArray([1, 2, 3, 4, 5], { count: 2 }); // [3, 4, 5, 1, 2]
```

| Option    | Type      | Description                                       |
| --------- | --------- | ------------------------------------------------- |
| `count`   | `number`  | Number of elements to rotate (default: 1)         |
| `inplace` | `boolean` | When `true`, directly modifies the original array |

---

#### `nestedKeyBy(data, properties, options?)` [`*`](#-data-last-support)

Converts an array into a nested object keyed by property values. Each leaf holds a single item.

```ts
const users = [
  { id: 'a', role: 'admin', name: 'Alice' },
  { id: 'b', role: 'user', name: 'Bob' },
];
nestedKeyBy(users, ['role', 'id']);
// { admin: { a: {...} }, user: { b: {...} } }
```

| Option         | Type      | Description                                                                                            |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `overwrite`    | `boolean` | When `true`, later values take precedence for duplicate keys (default: earlier values take precedence) |
| `flat`         | `boolean` | When `true`, produces a flat object with concatenated keys                                             |
| `keySeparator` | `string`  | Key separator for `flat` mode (default: `'.'`)                                                         |

---

#### `nestedGroupBy(data, properties, options?)` [`*`](#-data-last-support)

Converts an array into a nested object keyed by property values. Each leaf holds an array of items.

```ts
nestedGroupBy(users, 'role');
// { admin: [...], user: [...] }
```

---

#### `sortDependencies(data, options?)` [`*`](#-data-last-support)

Topologically sorts an array based on dependencies. Throws if circular dependencies are detected.

```ts
const nodes = [
  { id: 'A', deps: ['B'] },
  { id: 'B', deps: [] },
];
sortDependencies(nodes, {
  idProp: 'id',
  depsProp: 'deps',
  depsIdProp: (dep) => dep,
  ignoreNoSubstance: true,
});
// [{ id: 'B' }, { id: 'A' }]
```

| Option              | Type                  | Description                                               |
| ------------------- | --------------------- | --------------------------------------------------------- |
| `idProp`            | `keyof I \| Function` | Property name or function to get the ID                   |
| `depsProp`          | `keyof I \| Function` | Property name or function to get the dependency list      |
| `depsIdProp`        | `keyof I \| Function` | Property name or function to get the dependency item's ID |
| `isTree`            | `boolean`             | Process tree-structured dependencies                      |
| `ignoreNoSubstance` | `boolean`             | Ignore non-existent dependency targets                    |
| `desc`              | `boolean`             | When `true`, reverses the order                           |

---

#### `swapPairs(data)` [`*`](#-data-last-support)

Swaps elements in adjacent pairs within the array.

```ts
swapPairs([1, 2, 3, 4]); // [2, 1, 4, 3]
```

---

#### `maybeFind(data, predicate)` [`*`](#-data-last-support)

Returns the first element matching the predicate, or `undefined` if none is found.

---

#### `maybeMap(data, mapper, options?)` [`*`](#-data-last-support)

Maps each element and returns a new array with `null`/`undefined` values removed.

---

#### `firstDefined(data)` [`*`](#-data-last-support)

Returns the first non-`undefined` value in the array.

---

#### `firstPresent(data)` [`*`](#-data-last-support)

Returns the first non-`null`/non-`undefined` value in the array.

---

#### `clearArray(data)`

Removes all elements from the array (mutating).

---

### boolean — Boolean

#### `ensureBoolean(value, options?)` [`*`](#-data-last-support)

Converts a value to a boolean. Strings like `'true'`, `'1'`, and `'yes'` can also be converted to `true`.

```ts
ensureBoolean('true'); // true
ensureBoolean(0); // false
ensureBoolean('yes', { trueValues: ['yes'] }); // true
```

---

### compare — Comparison

#### `compare(left, operator, right)` [`*`](#-data-last-support)

Compares two values using an operator and returns a boolean.

```ts
compare(5, '>', 3); // true
compare(5, 'between', [1, 10]); // true
compare('a', 'in', ['a', 'b']); // true
```

Supported operators: `'='` `'!='` `'<'` `'<='` `'>'` `'>='` `'between'` `'in'` `'notIn'`

---

#### `isEqualBy(a, b, options?)` [`*`](#-data-last-support)

Checks equality of two values using the specified comparison mode.

```ts
isEqualBy({ a: 1 }, { a: 1 }, { mode: 'deep' }); // true
```

| Option       | Type                            | Description                           |
| ------------ | ------------------------------- | ------------------------------------- |
| `mode`       | `'strict' \| 'loose' \| 'deep'` | Comparison mode (default: `'strict'`) |
| `customizer` | `Function`                      | Custom comparison function            |

---

#### `isEqualWith(a, b, customizer)` [`*`](#-data-last-support)

Recursively checks equality of two values using a custom comparator function.

---

### date — Date

#### `asUtcDate(date)`

Returns a new `Date` that interprets the local date's year/month/day/hour/minute/second components as UTC values.

```ts
// JST 2024-01-15 12:00:00 → treated as UTC 2024-01-15 12:00:00
asUtcDate(new Date(2024, 0, 15, 12, 0, 0));
```

---

#### `createUtcDate(year, month, day, ...)`

Creates a date in the UTC timezone.

---

#### `interpolateDate(value, ratio, options?)` [`*`](#-data-last-support)

Returns a date interpolated between two dates at the given ratio.

```ts
interpolateDate(targetDate, 0.5, { baseValue: startDate });
// date halfway between startDate and targetDate
```

---

### format — Format

#### `analyzeNumberFormat(format)`

Parses a number format string (e.g. Excel format) and returns information about integer/decimal digit counts, separators, prefix/suffix, etc.

```ts
analyzeNumberFormat('#,##0.00');
// { intNumLength: 1, dp: true, dpLength: 2, ... }
```

---

### function — Function Utilities

#### `withCache(fn, options?)`

Caches the result of an async function to prevent duplicate requests with the same arguments.

```ts
const cachedFetch = withCache(fetchUser, { ttl: 60000 });
await cachedFetch('user-1'); // API call
await cachedFetch('user-1'); // returned from cache
```

| Option     | Type       | Description                  |
| ---------- | ---------- | ---------------------------- |
| `ttl`      | `number`   | Cache time-to-live (ms)      |
| `cacheKey` | `Function` | Cache key generator function |

---

#### `withRetry(fn, maxRetries, options?)`

An async function wrapper that automatically retries on failure.

```ts
const reliableFetch = withRetry(fetchData, 3, {
  delay: 1000,
  exponentialBackoff: true,
});
```

| Option               | Type       | Description                            |
| -------------------- | ---------- | -------------------------------------- |
| `delay`              | `number`   | Wait time before retry (ms)            |
| `exponentialBackoff` | `boolean`  | Use exponential backoff                |
| `shouldRetry`        | `Function` | Function to determine whether to retry |
| `onRetry`            | `Function` | Callback called on retry               |

---

#### `withTimeout(fn, timeout, options?)`

An async function wrapper that throws `TimeoutError` if it doesn't complete within the specified time.

```ts
const timedFetch = withTimeout(fetchData, 5000);
```

---

#### `withFallback(fn, fallback, options?)`

An async function wrapper that returns a fallback value when an error occurs.

```ts
const safeFetch = withFallback(fetchData, null);
```

---

#### `alwaysTrue() / alwaysFalse() / alwaysInput(v) / alwaysVoid()`

Functions that always return a fixed value.

```ts
alwaysTrue(); // true
alwaysFalse(); // false
alwaysInput('hi'); // 'hi'
alwaysVoid(); // undefined
```

---

#### `maybeApply(fn, value)`

Applies the function only if `value` is not `null`/`undefined`.

---

#### `maybeCall(fn, ...args)`

Calls `fn` only if it is a function.

---

#### `ensureAsync(fn)`

Converts a synchronous function into an asynchronous one (returns a Promise).

---

### geometry — Geometry

#### `fitToRatio(value, ratio, options?)` [`*`](#-data-last-support)

Scales a value to fit an aspect ratio.

```ts
fitToRatio(100, 16 / 9, { mode: 'expand' }); // 178
fitToRatio(100, 16 / 9, { mode: 'shrink' }); // 56
```

| Option     | Type                   | Description           |
| ---------- | ---------------------- | --------------------- |
| `mode`     | `'expand' \| 'shrink'` | Expand or shrink mode |
| `decimals` | `number`               | Decimal places        |

Dedicated functions for specific ratios are also provided.

| Function        | Ratio                 | Data Last |
| --------------- | --------------------- | --------- |
| `fitToGolden`   | Golden ratio (1.618…) | ✓         |
| `fitToSilver`   | Silver ratio (2.414…) |           |
| `fitToBronze`   | Bronze ratio (3.303…) |           |
| `fitToDouble`   | 2:1                   |           |
| `fitToYamato`   | Yamato ratio (√2)     |           |
| `fitToSqrt2`    | √2                    |           |
| `fitToSqrt3`    | √3                    |           |
| `fitToSqrt5`    | √5                    |           |
| `fitToHarmonic` | Harmonic ratio        |           |
| `fitToPlatinum` | Platinum ratio        |           |

---

### input — Input Control

#### `limitDecimal(value, options?)`

Validates and formats numeric input. Supports decimal place limits, min/max constraints, and both interactive (typing in progress) and batch processing modes.

```ts
limitDecimal('3.14159', { dp: 2 }); // '3.14'
limitDecimal('999', { max: 100 }); // '100'
limitDecimal('-', { interactive: true, min: -100 }); // '-' (allow while typing)
```

| Option        | Type               | Description                                        |
| ------------- | ------------------ | -------------------------------------------------- |
| `dp`          | `number`           | Maximum decimal places                             |
| `min`         | `number \| string` | Minimum value                                      |
| `max`         | `number \| string` | Maximum value                                      |
| `interactive` | `boolean`          | Allow in-progress states (`-`, trailing `.`, etc.) |

---

#### `limitNaturalNumber(value, options?)`

Converts and limits values to natural numbers (positive integers).

```ts
limitNaturalNumber(3.7); // 3
limitNaturalNumber(0); // null (zero not allowed)
limitNaturalNumber(0, { allowZero: true }); // 0
```

---

#### `limitPositiveNumber(value, options?)` [`*`](#-data-last-support)

Converts and limits values to positive numbers (greater than zero).

---

### map — Map Operations

#### `ensureMap(data, options?)` [`*`](#-data-last-support)

Converts various types of values to a `Map`.

```ts
ensureMap({ a: 1, b: 2 }); // Map { 'a' => 1, 'b' => 2 }
ensureMap([['a', 1]]); // Map { 'a' => 1 }
ensureMap(null); // Map {}
```

---

### measure — Performance Measurement

#### `measure(fn, options?)`

Measures the execution time of a function.

```ts
const result = measure(() => heavyCalc(), { iteration: 100 });
console.log(result.time); // execution time (ms)
```

| Option      | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `iteration` | `number` | Number of executions (default: 10) |

---

#### `measureAsync(fn, options?)`

Measures the execution time of an async function.

---

#### `comparePerformance(fns, options?)`

Compares the execution time of multiple functions.

---

#### `comparePerformanceAsync(fns, options?)`

Compares the execution time of multiple async functions.

---

### number — Number

#### `rangeClamp(value, min, max)` [`*`](#-data-last-support)

Clamps a value to the min-max range.

```ts
rangeClamp(150, 0, 100); // 100
rangeClamp(-10, 0, 100); // 0
```

---

#### `rangeLoop(value, min, max)` [`*`](#-data-last-support)

When out of range, returns the value looped (modulo) back into range.

```ts
rangeLoop(12, 0, 10); // 2
rangeLoop(-1, 0, 10); // 9
```

---

#### `rangeDefault(value, min, max, defaultValue)` [`*`](#-data-last-support)

When out of range, returns the default value.

---

#### `rangeMax(value, max)` [`*`](#-data-last-support)

Returns the maximum value when the value exceeds it.

---

#### `rangeMin(value, min)` [`*`](#-data-last-support)

Returns the minimum value when the value falls below it.

---

#### `rangePingpong(value, min, max)` [`*`](#-data-last-support)

When out of range, returns the value ping-ponged (bounced) back into range.

---

#### `interpolateNumber(value, ratio, options?)` [`*`](#-data-last-support)

Returns a value interpolated between a base value and a target at the given ratio.

```ts
interpolateNumber(100, 0.5, { baseValue: 0 }); // 50
interpolateNumber(200, 0.25, { baseValue: 100 }); // 125
```

---

#### `roundToStep(value, step)` [`*`](#-data-last-support)

Rounds a value to the nearest step.

```ts
roundToStep(7, 5); // 5
roundToStep(8, 5); // 10
```

---

#### `ensureNumber(value, options?)` [`*`](#-data-last-support)

Converts a value to a number.

---

#### `ensureRange(value, options?)` [`*`](#-data-last-support)

Clamps a value to the specified range.

---

#### `getValidMinMax(min, max)`

Gets a valid min/max pair (with automatic ordering correction, etc.).

---

#### `getValidNumber(value, options?)` [`*`](#-data-last-support)

Validates and returns a valid number.

---

#### `isWithinRange(value, min, max)` [`*`](#-data-last-support)

Returns whether the value is ≥ min and ≤ max.

---

#### `isStrictlyWithinRange(value, min, max)` [`*`](#-data-last-support)

Returns whether the value is > min and < max.

---

### object — Object Operations

#### `get(data, path)` [`*`](#-data-last-support)

Gets a nested property using dot or bracket notation.

```ts
get({ a: { b: { c: 42 } } }, 'a.b.c'); // 42
get({ arr: [1, 2, 3] }, 'arr[1]'); // 2
```

---

#### `set(data, path, value)` [`*`](#-data-last-support)

Returns a new object with the nested property set at the given path (immutable).

```ts
set({ a: { b: 1 } }, 'a.b', 99); // { a: { b: 99 } }
```

---

#### `setMutable(data, path, value)` [`*`](#-data-last-support)

Mutably sets the nested property at the given path.

---

#### `unset(data, path)` [`*`](#-data-last-support)

Returns a new object with the property at the given path removed (immutable).

```ts
unset({ a: 1, b: 2 }, 'a'); // { b: 2 }
```

---

#### `unsetMutable(data, path)` [`*`](#-data-last-support)

Mutably removes the property at the given path. Uses `splice` for arrays to compact the array.

---

#### `update(data, values)` [`*`](#-data-last-support)

Returns a new object with existing properties updated to new values (immutable).

---

#### `updateMutable(data, values)` [`*`](#-data-last-support)

Mutably updates existing own properties of an object. Returns the previous values.

---

#### `omit(data, paths)` [`*`](#-data-last-support)

Returns an object with the specified path properties omitted.

```ts
omit({ a: 1, b: 2, c: 3 }, ['b']); // { a: 1, c: 3 }
```

---

#### `filterByKeys(target, condition, options?)` [`*`](#-data-last-support)

Filters an object (recursively) to keep only entries whose keys contain the specified string.

```ts
filterByKeys({ name: 'Alice', age: 30 }, 'na');
// { name: 'Alice' }
```

| Option      | Type      | Description                                  |
| ----------- | --------- | -------------------------------------------- |
| `normalize` | `boolean` | Apply string normalization before comparison |

---

#### `filterByValues(target, condition, options?)` [`*`](#-data-last-support)

Filters an object (recursively) to keep only entries whose values contain the specified value.

```ts
filterByValues({ a: 'Alice', b: 'Bob', c: 1 }, 'Ali');
// { a: 'Alice' }
filterByValues({ a: 1, b: 2, c: 1 }, 1);
// { a: 1, c: 1 }
```

| Option      | Type      | Description                                  |
| ----------- | --------- | -------------------------------------------- |
| `normalize` | `boolean` | Apply normalization before string comparison |

---

#### `transformObject(source, rules, options?)` [`*`](#-data-last-support)

Transforms and extracts object structure according to mapping rules.

```ts
transformObject({ firstName: 'Alice', age: 30 }, [
  { from: 'firstName', to: 'user.name' },
  { from: (s) => s.age * 2, to: 'doubleAge' },
]);
// { user: { name: 'Alice' }, doubleAge: 60 }
```

| Rule Property            | Type                 | Description                                  |
| ------------------------ | -------------------- | -------------------------------------------- |
| `from`                   | `string \| Function` | Path or function to compute the source value |
| `to`                     | `string \| Function` | Path or function to transform the result     |
| `shouldRemoveFromSource` | `boolean`            | When `true`, removes the source property     |

| Option             | Type      | Description                                    |
| ------------------ | --------- | ---------------------------------------------- |
| `deleteSourceKeys` | `boolean` | When `true`, removes source keys for all rules |

---

#### `flattenObject(data, options?)` [`*`](#-data-last-support)

Converts a nested object to a flat key-value pair structure.

```ts
flattenObject({ a: { b: { c: 1 } } });
// { 'a.b.c': 1 }
```

| Option         | Type      | Description                              |
| -------------- | --------- | ---------------------------------------- |
| `keySeparator` | `string`  | Key separator character (default: `'.'`) |
| `ignoreArray`  | `boolean` | When `true`, does not expand arrays      |

---

#### `distribute(data, rules, options?)` [`*`](#-data-last-support)

Distributes object properties into multiple groups according to rules. Each group takes an array of property names; a group set to `null` receives the properties not distributed to any other group.

```ts
const { identity, rest } = distribute(user, {
  identity: ['id', 'name'],
  rest: null,
});
// identity: { id, name }
// rest: all other properties of user
```

---

#### `cloneDeep(data)`

Deep-clones an object.

---

#### `cloneShallow(data)`

Shallow-clones an object. Supports Array, `Map`, `Set`, `ArrayBuffer`, TypedArray, `DataView`, `Date`, and RegExp.

---

#### `createCaseInsensitiveObject(options?)`

Creates a case-insensitive object (Proxy) where key lookups are case-insensitive.

```ts
const obj = createCaseInsensitiveObject({ target: { Name: 'Alice' } });
obj['name']; // 'Alice'
obj['NAME']; // 'Alice'
'name' in obj; // true

// caseSensitive: true makes keys case-sensitive
const sensitive = createCaseInsensitiveObject({
  target: { Name: 'Alice' },
  caseSensitive: true,
});
sensitive['name']; // undefined
sensitive['Name']; // 'Alice'
```

| Option             | Type                          | Description                                             |
| ------------------ | ----------------------------- | ------------------------------------------------------- |
| `target`           | `object`                      | Initial value object                                    |
| `caseSensitive`    | `boolean`                     | When `true`, keys are case-sensitive (default: `false`) |
| `storedKeyType`    | `'transformed' \| 'original'` | Key storage format                                      |
| `isMutable`        | `boolean`                     | When `true`, directly modifies the original object      |
| `includeInherited` | `boolean`                     | When `true`, includes inherited properties              |

---

#### `createKeyTransformObject(transformKey, options?)`

Creates an object (Proxy) that manages keys using a transform function. It is the foundation of `createCaseInsensitiveObject`.

```ts
// Object that stores all keys in uppercase
const obj = createKeyTransformObject((_, key) =>
  typeof key === 'string' ? key.toUpperCase() : key,
);
obj['name'] = 'Alice';
obj['NAME']; // 'Alice'
```

---

#### `countKeys(data)`

Returns the number of own properties of an object.

---

#### `forEachValues(data, callback, options?)` [`*`](#-data-last-support)

Executes a callback for each property value of an object. Stops if the callback returns `false`.

```ts
forEachValues({ a: 1, b: 2 }, (value) => {
  if (value === 2) return false; // stop
});
```

---

#### `getByNormalizedKey(data, key, options?)`

Gets an object value by a normalized key (e.g. ignoring case).

---

#### `setByNormalizedKey(data, key, value, options?)`

Sets a value in an object using a normalized key.

---

#### `maybeAssign(target, source)` [`*`](#-data-last-support)

Returns a new object with each property of `source` set in `target` (immutable).

---

#### `maybeAssignMutable(target, source)`

Mutably sets each property of `source` in `target`.

---

#### `maybeDefault(target, defaults)` [`*`](#-data-last-support)

Returns a new object with default values set for `null`/`undefined` properties in `target`.

---

#### `maybeDefaultMutable(target, defaults, options?)`

Mutably sets default values for `null`/`undefined` properties in `target`.

| Option          | Type      | Description                                             |
| --------------- | --------- | ------------------------------------------------------- |
| `overwriteNull` | `boolean` | When `true`, also overwrites properties that are `null` |

---

#### `maybeHasOwn(data, key)`

Returns whether an object has the specified property as its own. Returns `false` when `data` is `null`.

---

#### `stableStringify(data)`

Returns a JSON string with the object's keys recursively sorted alphabetically.

```ts
stableStringify({ b: 2, a: 1 }); // '{"a":1,"b":2}'
```

---

#### `needsDefineProperty(target, key, descriptor)`

Determines whether a property definition needs to be applied.

---

#### `setProperty(target, key, descriptor)`

Defines a property using `Object.defineProperty`.

---

#### `overrideInstance(target, overrides)`

Overrides methods or properties of an instance.

---

### string — String

#### `normalizeString(value, options?)` [`*`](#-data-last-support)

Normalizes a string to a unified representation. Useful for absorbing variation in search and comparison.

```ts
normalizeString('ＡＢＣ', { ignoreWidth: true }); // 'abc'
normalizeString('アイウ', { ignoreKana: true }); // 'あいう'
normalizeString('Café', { ignoreDakuon: true }); // 'Cafe'
normalizeString('Hello World', { ignoreCase: true }); // 'hello world'
```

| Option                | Type      | Description                                        |
| --------------------- | --------- | -------------------------------------------------- |
| `ignoreCase`          | `boolean` | Ignore case (unify to lowercase)                   |
| `ignoreWidth`         | `boolean` | Ignore full-width/half-width (unify to half-width) |
| `ignoreKana`          | `boolean` | Ignore katakana/hiragana (unify to hiragana)       |
| `ignoreDakuon`        | `boolean` | Ignore voiced/semi-voiced consonant marks          |
| `ignoreSokuon`        | `boolean` | Ignore geminate consonants (っ/ッ → つ/ツ)         |
| `ignoreYouon`         | `boolean` | Ignore contracted sounds (ゃゅょ, etc.)            |
| `ignoreChouon`        | `boolean` | Ignore long vowel marks (ー)                       |
| `ignoreLineFeed`      | `boolean` | Ignore line feeds                                  |
| `ignoreSpace`         | `boolean` | Ignore spaces                                      |
| `ignoreCompatibility` | `boolean` | Normalize Unicode compatibility characters         |
| `ignoreComposition`   | `boolean` | Normalize Unicode composed characters              |

---

#### `replacePlaceholders(template, values, options?)` [`*`](#-data-last-support)

Replaces placeholders in a template string with values.

```ts
replacePlaceholders('Hello {{name}}, {{greeting}}!', {
  name: 'Alice',
  greeting: 'how are you',
});
// 'Hello Alice, how are you!'

replacePlaceholders('{{0}} and {{1}}', ['Alice', 'Bob']);
// 'Alice and Bob'
```

| Option               | Type               | Description                                              |
| -------------------- | ------------------ | -------------------------------------------------------- |
| `bracket`            | `[string, string]` | Placeholder bracket characters (default: `['{{', '}}']`) |
| `removePlaceholders` | `boolean`          | When `true`, removes placeholders with no matching value |
| `flatKeys`           | `boolean`          | When `true`, resolves with flat (non-nested) keys        |

---

#### `interpolateString(value, ratio, options?)`

Interpolates a string animation-style (e.g. typing effect).

```ts
interpolateString('Hello', 0.6); // 'Hel'
interpolateString('World', 0.5, { initialValue: 'Hello' }); // intermediate value like 'HellWorld'
```

---

#### `transformString(str, types, options?)` [`*`](#-data-last-support)

Applies multiple transformation types to a string sequentially. You can combine case conversions and character type conversions.

---

#### `replaceByMap(str, map, options?)` [`*`](#-data-last-support)

Replaces all occurrences in a string according to a map (object or array).

```ts
replaceByMap('hello world', { hello: 'hi', world: 'earth' });
// 'hi earth'
```

---

#### `createExtractor(bracket)`

Creates a function that extracts parts surrounded by the specified bracket characters.

```ts
const extract = createExtractor(['{{', '}}']);
extract('{{name}} here'); // ['name']
```

---

#### Character Type Conversion

| Function                       | Description                               | Data Last |
| ------------------------------ | ----------------------------------------- | --------- |
| `retypeToFullWidth(str)`       | Half-width to full-width                  | ✓         |
| `retypeToHalfWidth(str)`       | Full-width to half-width                  |           |
| `retypeToHiragana(str)`        | Katakana to hiragana                      | ✓         |
| `retypeToKatakana(str)`        | Hiragana to katakana                      |           |
| `retypeToHiraganaSeion(str)`   | Katakana to hiragana (clear sounds only)  |           |
| `retypeToKatakanaSeion(str)`   | Hiragana to katakana (clear sounds only)  |           |
| `retypeToNoChouon(str)`        | Remove long vowel marks                   |           |
| `retypeToNoLineFeed(str)`      | Remove line feeds                         |           |
| `retypeToNoSpace(str)`         | Remove spaces                             |           |
| `retypeToNfc(str)`             | NFC normalization                         | ✓         |
| `retypeToNfd(str)`             | NFD normalization                         | ✓         |
| `retypeToNfkc(str)`            | NFKC normalization                        | ✓         |
| `retypeToNfkd(str)`            | NFKD normalization                        | ✓         |
| `retype(str, types, options?)` | Apply multiple character type conversions |           |

---

#### Case Conversion

| Function                    | Description          | Example       | Data Last |
| --------------------------- | -------------------- | ------------- | --------- |
| `recaseCamel(str)`          | camelCase            | `helloWorld`  | ✓         |
| `recasePascal(str)`         | PascalCase           | `HelloWorld`  | ✓         |
| `recaseSnake(str)`          | snake_case           | `hello_world` | ✓         |
| `recaseScreamingSnake(str)` | SCREAMING_SNAKE_CASE | `HELLO_WORLD` | ✓         |
| `recaseKebab(str)`          | kebab-case           | `hello-world` | ✓         |
| `recaseTitle(str)`          | Title Case           | `Hello World` | ✓         |
| `recaseLower(str)`          | lowercase            | `hello world` | ✓         |
| `recaseUpper(str)`          | UPPERCASE            | `HELLO WORLD` | ✓         |
| `lowerFirst(str)`           | Lowercase first char | `helloWorld`  | ✓         |
| `upperFirst(str)`           | Uppercase first char | `HelloWorld`  | ✓         |

---

#### Other String Utilities

| Function                                  | Description                                    | Data Last |
| ----------------------------------------- | ---------------------------------------------- | --------- |
| `ensureString(value)`                     | Convert to string                              | ✓         |
| `escapeRegExp(str)`                       | Escape special regex characters                |           |
| `isFullWidth(str)`                        | Check if all characters are full-width         |           |
| `isHalfWidth(str)`                        | Check if all characters are half-width         |           |
| `isLooseEqual(a, b, options?)`            | Check equality after normalizing strings       | ✓         |
| `isSurroundedBy(str, prefix, suffix)`     | Check if surrounded by specified prefix/suffix | ✓         |
| `maybeReplace(str, pattern, replacement)` | Replace only if the pattern matches            | ✓         |
| `safeMatchAll(str, pattern)`              | Safely execute `matchAll` and return results   |           |

---

### timer — Timer

#### `debounce(fn, delay, options?)`

Returns a debounce function that executes once after the specified time following the last call.

```ts
const onInput = debounce((value) => search(value), 300);
// .cancel() cancels the pending execution
// .flush()  executes immediately
// .isIdle() checks whether idle
```

---

#### `throttle(fn, delay, options?)`

Returns a throttle function that executes at most once per specified interval.

```ts
const onScroll = throttle((e) => update(e), 100);
```

---

#### `sleep(duration)`

Returns a Promise that waits for the specified number of milliseconds.

```ts
await sleep(1000); // wait 1 second
```

---

### type — Type Checking

| Function                            | Description                                                       | Data Last |
| ----------------------------------- | ----------------------------------------------------------------- | --------- |
| `isBlank(value)`                    | Is `null`/`undefined`/empty string/whitespace-only string         |           |
| `isNullish(value)`                  | Is `null` or `undefined`                                          |           |
| `isPresent(value)`                  | Is not `null`/`undefined`                                         |           |
| `isUndefined(value)`                | Is `undefined`                                                    |           |
| `isEmptyCollection(value)`          | Is empty Array/`Map`/`Set`                                        |           |
| `isEmptyValue(value)`               | Is `null`/`undefined`/empty string/empty array/empty object, etc. |           |
| `isValidDate(value)`                | Is a valid `Date` object                                          |           |
| `isInvalidDate(value)`              | Is an invalid `Date` object (`Invalid Date`)                      |           |
| `isValidNumber(value, options?)`    | Is a valid number (excluding NaN/Infinity)                        |           |
| `isNumberLike(value)`               | Is a number or numeric string                                     |           |
| `isNonNegativeInteger(value)`       | Is a non-negative integer                                         |           |
| `isPrimitive(value)`                | Is a primitive type                                               |           |
| `isRegExp(value)`                   | Is a `RegExp`                                                     |           |
| `isIterable(value)`                 | Is iterable                                                       |           |
| `isAsyncIterable(value)`            | Is async iterable                                                 |           |
| `getRawType(value)`                 | Gets the internal type string from `Object.prototype.toString`    |           |
| `kind(value)`                       | Gets the kind of value as a string                                | ✓         |
| `priority(value)`                   | Gets the priority of the value as a number                        | ✓         |
| `ensureValidValue(value, options?)` | Returns a fallback if the value is not valid                      | ✓         |
| `unsafeCast(value)`                 | Type cast ignoring type checking                                  |           |

---

###### \* Data Last support

## License

MIT
