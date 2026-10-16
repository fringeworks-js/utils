# @fringeworks/utils

`@fringeworks/utils` is a library some will find handy, offering general-purpose utility functions covering a wide range of categories including arrays, objects, strings, numbers, dates, timers, and more.

**[日本語のREADMEはこちら](./README.ja.md)**

## Installation

```bash
npm install @fringeworks/utils
# or
pnpm add @fringeworks/utils
```

## Usage

Functions, types, and constants can be imported by the same name from the root, a category, or a per-function path.

```ts
import {
  keepInRange,
  RangeMode,
  type KeepInRangeOptions,
} from '@fringeworks/utils';
import { keepInRange, RangeMode } from '@fringeworks/utils/number';
import { keepInRange, RangeMode } from '@fringeworks/utils/number/keepInRange';
```

A per-function path also provides its main function as the default export.

```ts
import keepInRange from '@fringeworks/utils/number/keepInRange';
```

### Mutating functions

Functions whose names end with `Mutable` (`setMutable`, `pushAllMutable`, and so on) modify the object or array passed to them. Functions without `Mutable` leave their arguments untouched and return a new value.

### Function names

When the verb alone does not tell which type a function works on, the name includes the type name (`rotateArray`, `flattenObject`, `lerpNumber`). When the verb alone makes the type clear, like `push` in `pushAll`, the type name is omitted. Mutating versions append `Mutable` to that name (`rotateArrayMutable`, `clearArrayMutable`).

### Handling null / undefined

The `array` functions handle `null` / `undefined` passed as an array argument as follows.

- Functions that return a new value treat it as an empty array. The return value is never `null` / `undefined` (e.g. `pushAll(null, [1])` returns `[1]`)
- Functions that return a single element (such as `firstDefined`) return `undefined`
- Mutating functions do not accept `null` / `undefined` as the array to modify (`data`). Arrays of elements to add (`source`, `items`) are treated as empty arrays

`null` / `undefined` as array elements are out of scope here (they are handled by `compactMap`'s `exclude`, `firstPresent`, and so on).

---

## API

### array

| Function                                    | Description                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `clearArrayMutable(data)`                   | Removes all elements from an array and returns the removed elements (mutating) |
| `compactMap(data, callback, options?)`      | Maps each element and returns an array without unwanted values                 |
| `ensureArray(data, options?)`               | Wraps a non-array value in an array                                            |
| `firstDefined(data)`                        | Returns the first element that is not `undefined`                              |
| `firstPresent(data)`                        | Returns the first element that is neither `null` nor `undefined`               |
| `insertAt(data, index, items)`              | Returns a new array with elements inserted at an index                         |
| `insertAtMutable(data, index, items)`       | Inserts elements at an index (mutating)                                        |
| `nestedGroupBy(data, properties, options?)` | Groups elements under keys taken from property values                          |
| `nestedKeyBy(data, properties, options?)`   | Stores one element per key taken from property values                          |
| `pushAll(data, source)`                     | Returns a new array with all elements of another array appended                |
| `pushAllMutable(data, source)`              | Appends all elements of another array (mutating)                               |
| `pushUnique(data, items, options?)`         | Returns a new array with only elements not yet included appended               |
| `pushUniqueMutable(data, items, options?)`  | Appends only elements not yet included (mutating)                              |
| `repeatToLength(data, length)`              | Returns a new array that repeats the array up to a length                      |
| `rotateArray(data, options?)`               | Returns a new array with leading elements moved to the end                     |
| `rotateArrayMutable(data, options?)`        | Moves leading elements to the end (mutating)                                   |
| `sortDependencies(data, options?)`          | Sorts elements by their dependencies (topological sort)                        |
| `swapPairs(pairs)`                          | Swaps the two elements of each pair in an array of pairs                       |
| `toArray(data, options?)`                   | Spreads an iterable into an array and wraps any other value in an array        |

#### `clearArrayMutable`

```ts
clearArrayMutable<T>(data: T[]): T[]
```

Removes all elements from the array (mutating) and returns an array of the removed elements.

#### `compactMap`

```ts
compactMap<V, R = V>(data: V[] | null | undefined, callback: CompactMapIteratee<V, R>, options?: CompactMapOptions): R[]
```

Maps each element with `callback` and returns an array without the values specified by `options.exclude`.

```ts
compactMap([1, 2, 3], (v) => (v === 2 ? undefined : v * 10)); // [10, 30]
compactMap(['a', '', null], (v) => v, { exclude: 'empty' }); // ['a']
```

| Option     | Type                | Description                                                                                                                                                                                           |
| ---------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exclude?` | `CompactMapExclude` | Values to exclude. `'undefined'`: `undefined`; `'nullish'`: `null` and `undefined`; `'empty'`: also empty strings; `'falsy'`: every falsy value (`false`, `0`, `NaN`, ...). Defaults to `'undefined'` |

#### `ensureArray`

```ts
ensureArray<T>(data: T | T[] | null | undefined, options?: EnsureArrayOptions): T[]
```

Wraps a non-array value in a single-element array. `null` and `undefined` become an empty array, and an array is returned as a copy. Iterables such as `Set` are not spread (use `toArray` for that).

```ts
ensureArray(1); // [1]
ensureArray([1, 2]); // [1, 2] (a copy)
ensureArray(null); // []
```

| Option | Type      | Description                                                                                    |
| ------ | --------- | ---------------------------------------------------------------------------------------------- |
| `raw?` | `boolean` | If `true`, returns the same array without copying when `data` is an array. Defaults to `false` |

#### `firstDefined`

```ts
firstDefined<V>(data: V[] | null | undefined): V | undefined
```

Returns the first element that is not `undefined`. `null` counts as a match.

#### `firstPresent`

```ts
firstPresent<V>(data: V[] | null | undefined): V | undefined
```

Returns the first element that is neither `null` nor `undefined`.

#### `insertAt`

```ts
insertAt<T, U = T>(data: T[] | null | undefined, index: number, items: U[] | null | undefined): (T | U)[]
```

Returns a new array with the elements of `items` inserted at `index`. `index` is kept between 0 and the array length (a negative index inserts at the start, and an index beyond the length inserts at the end).

```ts
insertAt([1, 2, 3], 1, ['a', 'b']); // [1, 'a', 'b', 2, 3]
```

#### `insertAtMutable`

```ts
insertAtMutable<T, U = T>(data: T[], index: number, items: U[] | null | undefined): (T | U)[]
```

The mutating version of `insertAt`. Inserts into `data` directly and returns the same array.

#### `nestedGroupBy`

```ts
nestedGroupBy<I extends object>(data: I[] | null | undefined, properties: keyof I | (keyof I)[], options?: NestedGroupByOptions): NestedGroupByResult<I>
```

Builds a nested object keyed by the values of `properties` and collects elements with the same keys into arrays. Keys are the property values converted to strings.

```ts
const items = [
  { pref: '01', city: '0101', name: 'a' },
  { pref: '01', city: '0101', name: 'b' },
  { pref: '02', city: '0201', name: 'c' },
];
nestedGroupBy(items, ['pref', 'city']);
// { '01': { '0101': [a, b] }, '02': { '0201': [c] } }
nestedGroupBy(items, ['pref', 'city'], { flat: true });
// { '01.0101': [a, b], '02.0201': [c] }
```

| Option          | Type      | Description                                                                                      |
| --------------- | --------- | ------------------------------------------------------------------------------------------------ |
| `flat?`         | `boolean` | If `true`, builds a single-level object with joined keys instead of nesting. Defaults to `false` |
| `keySeparator?` | `string`  | The separator used to join keys when `flat` is `true`. Defaults to `'.'`                         |

#### `nestedKeyBy`

```ts
nestedKeyBy<I extends object>(data: I[] | null | undefined, properties: keyof I | (keyof I)[], options?: NestedKeyByOptions): NestedKeyByResult<I>
```

Builds the same shape of object as `nestedGroupBy`, but stores a single element under each key. When several elements share the same keys, the first one is kept by default.

| Option          | Type      | Description                                                                                   |
| --------------- | --------- | --------------------------------------------------------------------------------------------- |
| `flat?`         | `boolean` | Same as `nestedGroupBy`                                                                       |
| `keySeparator?` | `string`  | Same as `nestedGroupBy`                                                                       |
| `overwrite?`    | `boolean` | If `true`, a later element with the same keys overwrites the earlier one. Defaults to `false` |

#### `pushAll`

```ts
pushAll<T>(data: T[] | null | undefined, source: T[] | null | undefined): T[]
```

Returns a new array with all elements of `source` appended to `data`.

#### `pushAllMutable`

```ts
pushAllMutable<T>(data: T[], source: T[] | null | undefined): T[]
```

The mutating version of `pushAll`. Appends to `data` directly and returns the same array.

#### `pushUnique`

```ts
pushUnique<T>(data: T[] | null | undefined, items: T[] | null | undefined, options?: PushUniqueOptions<T>): T[]
```

Returns a new array with only the elements of `items` that `data` does not contain yet. Duplicates within `items` are not added either.

```ts
pushUnique([1, 2], [2, 3, 3]); // [1, 2, 3]
```

| Option        | Type                      | Description                                                                                                                       |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `threshold?`  | `number`                  | Uses a `Set` for the check when the total number of elements is at least this value. Defaults to `100`                            |
| `comparator?` | `(a: T, b: T) => boolean` | How to decide whether two elements are the same. When given, a linear search is used regardless of `threshold`. Defaults to `===` |

#### `pushUniqueMutable`

```ts
pushUniqueMutable<T>(data: T[], items: T[] | null | undefined, options?: PushUniqueMutableOptions<T>): T[]
```

The mutating version of `pushUnique`. Appends to `data` directly and returns the same array. The options are the same as `pushUnique`.

#### `repeatToLength`

```ts
repeatToLength<T>(data: T[] | null | undefined, length: number): T[]
```

Returns a new array of length `length` made by repeating the elements of `data`. When `length` is negative, the reversed array is repeated. A fractional `length` is truncated, and `NaN` / `Infinity` are treated as `0`. Returns an empty array when `data` is empty.

```ts
repeatToLength([1, 2, 3], 7); // [1, 2, 3, 1, 2, 3, 1]
repeatToLength([1, 2, 3], -5); // [3, 2, 1, 3, 2]
```

#### `rotateArray`

```ts
rotateArray<I>(data: I[] | null | undefined, options?: RotateArrayOptions): I[]
```

Returns a new array with the first `count` elements moved to the end.

```ts
rotateArray([1, 2, 3, 4, 5], { count: 2 }); // [3, 4, 5, 1, 2]
rotateArray([1, 2, 3, 4, 5], { count: -1 }); // [5, 1, 2, 3, 4]
```

| Option   | Type     | Description                                                                                                      |
| -------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `count?` | `number` | The number of elements to move. A positive number rotates left, a negative number rotates right. Defaults to `1` |

#### `rotateArrayMutable`

```ts
rotateArrayMutable<I>(data: I[], options?: RotateArrayMutableOptions): I[]
```

The mutating version of `rotateArray`. Modifies `data` directly and returns the same array. The options are the same as `rotateArray`.

#### `sortDependencies`

```ts
sortDependencies<I>(data: I[] | null | undefined, options?: SortDependenciesOptions<I>): I[]
```

Returns a new array sorted so that each element comes after the elements it depends on (topological sort). Elements with the same ID are merged into one. Throws an `Error` (`Cyclic dependency: <ID>`) when the dependencies form a cycle.

By default, each element is treated as an `[ID, array of dependencies]` tuple. Dependencies may be held either as elements or as IDs. When a dependency is an object (an element), its ID is taken in the same way as `id`; otherwise the dependency value itself is used as the ID.

```ts
const c = ['c', []];
const b = ['b', [c]];
const a = ['a', [b, c]];
sortDependencies([a, b, c]); // [c, b, a]

// Dependencies held as IDs
sortDependencies(
  [
    { id: 'a', deps: ['b'] },
    { id: 'b', deps: [] },
  ],
  { id: 'id', dependencies: 'deps' },
);
// [{ id: 'b', ... }, { id: 'a', ... }]
```

| Option           | Type                                                     | Description                                                                                                                                                                                         |
| ---------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id?`            | `string \| number \| SortDependenciesGetId<I>`           | The property holding an element's ID, or a function returning it. Defaults to `0`                                                                                                                   |
| `dependencies?`  | `string \| number \| SortDependenciesGetDependencies<I>` | The property holding an element's dependencies, or a function returning them. Defaults to `1`                                                                                                       |
| `dependencyId?`  | `string \| number \| SortDependenciesGetId<I>`           | The property holding a dependency's ID, or a function returning it. By default, an object dependency's ID is taken in the same way as `id`, and any other dependency value is used as the ID itself |
| `tree?`          | `boolean`                                                | If `true`, follows dependencies recursively and also sorts dependency elements that are not in `data` (for tree-shaped data)                                                                        |
| `ignoreMissing?` | `boolean`                                                | If `true`, ignores dependencies not found in `data`. Otherwise throws an `Error` (`No substance: <ID>`). Defaults to `false`                                                                        |
| `reverse?`       | `boolean`                                                | If `true`, reverses the order (dependents first). Defaults to `false`                                                                                                                               |

#### `swapPairs`

```ts
swapPairs<const T extends [unknown, unknown][]>(pairs: T | null | undefined): SwapPairsResult<T>
```

Takes an array of two-element tuples and returns a new array with `[0]` and `[1]` of each tuple swapped. The types are swapped as well.

```ts
swapPairs([
  ['a', 1],
  ['b', 2],
]); // [[1, 'a'], [2, 'b']]
```

#### `toArray`

```ts
toArray<T>(data: unknown, options?: ToArrayOptions): T[]
```

Converts a value to an array. Iterables other than strings (`Set`, `Map`, and so on) are spread, and any other value is wrapped in a single-element array. `null` and `undefined` become an empty array, and an array is returned as a copy.

```ts
toArray(new Set([1, 2])); // [1, 2]
toArray('abc'); // ['abc']
toArray(1); // [1]
```

| Option | Type      | Description           |
| ------ | --------- | --------------------- |
| `raw?` | `boolean` | Same as `ensureArray` |

#### Types

| Type                                 | Description                                                         |
| ------------------------------------ | ------------------------------------------------------------------- |
| `CompactMapOptions`                  | Options for `compactMap`                                            |
| `CompactMapExclude`                  | The kinds of values `compactMap` excludes                           |
| `CompactMapIteratee<V, R>`           | The `compactMap` callback `(value, index, data) => R`               |
| `EnsureArrayOptions`                 | Options for `ensureArray`                                           |
| `NestedGroupByOptions`               | Options for `nestedGroupBy`                                         |
| `NestedGroupByResult<I>`             | The return value of `nestedGroupBy`                                 |
| `NestedKeyByOptions`                 | Options for `nestedKeyBy`                                           |
| `NestedKeyByResult<I>`               | The return value of `nestedKeyBy`                                   |
| `PushUniqueMutableOptions<T>`        | Options for `pushUniqueMutable`                                     |
| `PushUniqueOptions<T>`               | Same as `PushUniqueMutableOptions<T>`                               |
| `RotateArrayMutableOptions`          | Options for `rotateArrayMutable`                                    |
| `RotateArrayOptions`                 | Same as `RotateArrayMutableOptions`                                 |
| `SortDependenciesOptions<I>`         | Options for `sortDependencies`                                      |
| `SortDependenciesGetId<I>`           | A function returning an element's ID `(item) => unknown`            |
| `SortDependenciesGetDependencies<I>` | A function returning an element's dependencies `(item) => I \| I[]` |
| `SwapPairsResult<T>`                 | The return value of `swapPairs` (the type with each pair swapped)   |
| `ToArrayOptions`                     | Options for `toArray`                                               |

### boolean

| Function                        | Description                   |
| ------------------------------- | ----------------------------- |
| `ensureBoolean(data, options?)` | Converts a value to a boolean |

#### `ensureBoolean`

```ts
ensureBoolean(data: unknown, options?: EnsureBooleanOptions): boolean
```

Converts a value to a boolean. Booleans are returned as is, and strings become `true` only when, with surrounding whitespace removed, they are in `trueValues` (by default `'true'`, `'True'`, `'TRUE'`, and `'1'`). Any other value is converted with `!!data`.

```ts
ensureBoolean('true'); // true
ensureBoolean(' 1 '); // true
ensureBoolean('yes'); // false
ensureBoolean('YES', { trueValues: ['yes'], ignoreCase: true }); // true
ensureBoolean(1); // true
```

| Option        | Type                | Description                                                                                         |
| ------------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| `trueValues?` | `readonly string[]` | Strings treated as `true`. Used only for string values. Defaults to `['true', 'True', 'TRUE', '1']` |
| `ignoreCase?` | `boolean`           | If `true`, compares strings case-insensitively                                                      |

#### Types

| Type                   | Description                 |
| ---------------------- | --------------------------- |
| `EnsureBooleanOptions` | Options for `ensureBoolean` |

### compare

| Function                                | Description                                                       |
| --------------------------------------- | ----------------------------------------------------------------- |
| `compare(left, operator, right)`        | Compares two values with an operator                              |
| `isEqual(value1, value2)`               | Checks recursively whether two values have the same structure     |
| `isEqualWith(value, other, customizer)` | Compares two values recursively with a custom comparison function |

#### `compare`

```ts
compare<O extends ComparisonOperator>(left: CompareLeft[O], operator: O, right: CompareRight[O]): boolean
```

Compares `left` and `right` with `operator`. The types of `left` and `right` depend on the operator (`CompareLeft` / `CompareRight`). It is meant for switching comparisons from settings, and the values of `ComparisonOperator` (such as `'>='`) can be passed as is.

Throws an `Error` for an unsupported operator. Returns `false`, even for negated operators, when a value does not have the expected shape (such as a non-array `right` for `'between'`, a non-string value for `'startsWith'`, or an invalid regular expression pattern for `'matches'`).

```ts
compare(5, '>', 3); // true
compare(5, 'between', [1, 10]); // true (inclusive)
compare('a', 'oneOf', ['a', 'b']); // true
compare('hello', 'includes', 'ell'); // true (substring match)
compare(['a', 'b', 'c'], 'includesAll', ['a', 'c']); // true
compare('hello', 'matches', /^h/); // true
```

| Operator                         | `left`          | `right`                         | Meaning                                                                                                                                              |
| -------------------------------- | --------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'==='` / `'!=='`                | Any             | Any                             | Strict equality / inequality                                                                                                                         |
| `'=='` / `'!='`                  | Any             | Any                             | Loose equality / inequality                                                                                                                          |
| `'>'` / `'>='` / `'<'` / `'<='`  | Any             | Any                             | Relational comparison (numbers, strings, `Date`, and so on, following JavaScript's comparison operators)                                             |
| `'deepEqual'` / `'notDeepEqual'` | Any             | Any                             | Whether the structures are equal / not equal (`isEqual`)                                                                                             |
| `'between'` / `'notBetween'`     | Any             | `[min, max]`                    | Whether `left` is inside / outside the range (inclusive)                                                                                             |
| `'oneOf'` / `'notOneOf'`         | Any             | Array                           | Whether `left` equals one / none of `right` (`Array.includes`)                                                                                       |
| `'includes'` / `'notIncludes'`   | String or array | Substring or element            | Whether `left` contains / does not contain `right` (`String.includes` / `Array.includes`)                                                            |
| `'includesAll'`                  | String or array | Array of substrings or elements | Whether `left` contains all of `right` (`true` when `right` is empty)                                                                                |
| `'includesAny'`                  | String or array | Array of substrings or elements | Whether `left` contains any of `right` (`false` when `right` is empty)                                                                               |
| `'startsWith'` / `'endsWith'`    | String          | String                          | Prefix / suffix match                                                                                                                                |
| `'matches'`                      | String          | Regular expression or string    | Whether `left` matches the regular expression. A string is converted to a `RegExp`. The `lastIndex` of `g` or `y` regular expressions is not changed |

#### `isEqual`

```ts
isEqual(value1: unknown, value2: unknown): boolean
```

Checks recursively whether two values have the same structure, using the same criteria as the default comparison of `isEqualWith`.

```ts
isEqual({ a: [1] }, { a: [1] }); // true
isEqual([1], { 0: 1 }); // false
```

#### `isEqualWith`

```ts
isEqualWith(value: unknown, other: unknown, customizer: IsEqualWithCustomizer): boolean
```

Compares two values recursively. `customizer` is called at each step; a returned `boolean` is used as the result, and `undefined` falls back to the default comparison.

`customizer` receives `(value1, value2, indexOrKey, value1Parent, value2Parent)`. `indexOrKey` is the index when the parent is an array, the key when it is an object, and the `Map` key (of any type) when it is a `Map`. It is `undefined` for the top-level values and for `Set` elements.

The default comparison treats objects with different prototypes as unequal (an object with a `null` prototype and a plain object are treated as the same). It compares arrays element by element, `Map` by keys and values, `Set` by whether they hold structurally equal elements, `Date` by time, `RegExp` by pattern and flags, and other objects by their own enumerable properties. `NaN` equals `NaN`, and `0` equals `-0`. Circular references are treated as equal when the same pair is reached again.

```ts
// Compare strings case-insensitively
isEqualWith({ a: 'Hello' }, { a: 'hello' }, (v1, v2) =>
  typeof v1 === 'string' && typeof v2 === 'string'
    ? v1.toLowerCase() === v2.toLowerCase()
    : undefined,
); // true
```

#### Constants

| Constant             | Description                                                                                                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ComparisonOperator` | The operators for `compare`. Symbol operators use short keys (`eq`, `ne`, `looseEq`, `looseNe`, `gt`, `gte`, `lt`, `lte`), and word operators use their value as the key (`deepEqual`, `between`, `oneOf`, `includes`, and so on) |

#### Types

| Type                    | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `ComparisonOperator`    | The operator values for `compare`                          |
| `CompareLeft`           | The type of the left-hand value of `compare` per operator  |
| `CompareRight`          | The type of the right-hand value of `compare` per operator |
| `IsEqualWithCustomizer` | The type of the `customizer` of `isEqualWith`              |

### date

| Function                                  | Description                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `asUtcDate(date)`                         | Returns a `Date` that treats the local date and time as the same UTC values |
| `createUtcDate(year, month?, date?, ...)` | Creates a `Date` from UTC date and time values                              |
| `lerpDate(value, ratio, options?)`        | Interpolates between a base date and a target date by a ratio               |

#### `asUtcDate`

```ts
asUtcDate(date: Date): Date
```

Returns a new `Date` whose UTC year, month, day, hours, minutes, seconds, and milliseconds are the local values of `date`.

```ts
// In a UTC+9 time zone
asUtcDate(new Date(2024, 0, 15, 12, 0)).toISOString(); // '2024-01-15T12:00:00.000Z'
```

#### `createUtcDate`

```ts
createUtcDate(year: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): Date
```

Creates a `Date` from UTC date and time values. As with `Date.UTC`, `month` is 0 to 11, but unlike `Date.UTC`, years 0 to 99 are used as is (not as 1900 to 1999). Omitted arguments default to `0` for `month`, `1` for `date`, and `0` for the rest.

#### `lerpDate`

```ts
lerpDate(value: Date, ratio: number, options?: LerpDateOptions): Date
```

Returns the date linearly interpolated by `ratio` between the base date (`baseValue`) and the target date (`value`). A `ratio` of `0` gives the base date and `1` gives the target date. A `ratio` outside 0 to 1 extrapolates.

| Option       | Type   | Description                                                       |
| ------------ | ------ | ----------------------------------------------------------------- |
| `baseValue?` | `Date` | The base date. Defaults to the current date and time at each call |

#### Types

| Type              | Description            |
| ----------------- | ---------------------- |
| `LerpDateOptions` | Options for `lerpDate` |

### function

| Function                      | Description                      |
| ----------------------------- | -------------------------------- |
| `alwaysFalse(...args)`        | Always returns `false`           |
| `alwaysInput(value, ...args)` | Returns the first argument as is |
| `alwaysTrue(...args)`         | Always returns `true`            |
| `alwaysVoid(...args)`         | Does nothing                     |

#### `alwaysFalse` / `alwaysTrue` / `alwaysInput` / `alwaysVoid`

```ts
alwaysFalse(...args: unknown[]): false
alwaysTrue(...args: unknown[]): true
alwaysInput<T>(value: T, ...args: unknown[]): T
alwaysVoid(...args: unknown[]): void
```

Functions that return a fixed result regardless of their arguments, useful as callbacks or default options. `alwaysInput` returns its first argument as is, and `alwaysVoid` does nothing.

### map

| Function                    | Description                 |
| --------------------------- | --------------------------- |
| `ensureMap(data, options?)` | Converts a value to a `Map` |

#### `ensureMap`

```ts
ensureMap<K, V>(data: Iterable<readonly [K, V]> | null | undefined, options?: EnsureMapOptions): Map<K, V>
ensureMap<V>(data: Record<string, V> | null | undefined, options?: EnsureMapOptions): Map<string, V>
ensureMap<K, V>(data: EnsureMapSource<K, V> | null | undefined, options?: EnsureMapOptions): Map<K | string, V>
```

Converts a value to a `Map`. A `Map` is returned as a copy. Any other iterable (an array of entries, a `Set`, and so on) is treated like the `Map` constructor does, with each element as a `[key, value]` pair. Any other object has its properties turned into entries. `null`, `undefined`, and primitive values become an empty `Map`.

```ts
ensureMap({ a: 1 }); // Map { 'a' => 1 }
ensureMap([['a', 1]]); // Map { 'a' => 1 }
ensureMap(['x', 'y'].entries()); // Map { 0 => 'x', 1 => 'y' }
```

If an iterable has elements that are not entries (such as `[1, 2]`), a `TypeError` is thrown, just like the `Map` constructor.

| Option | Type      | Description                                                                                   |
| ------ | --------- | --------------------------------------------------------------------------------------------- |
| `raw?` | `boolean` | If `true`, returns the same `Map` without copying when `data` is a `Map`. Defaults to `false` |

#### Types

| Type                    | Description                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `EnsureMapOptions`      | Options for `ensureMap`                                                                                            |
| `EnsureMapSource<K, V>` | The values `ensureMap` accepts (an iterable of `[key, value]` pairs, or an object whose properties become entries) |

### measure

| Function                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `comparePerformance(options)`      | Measures and compares the execution time of several functions        |
| `comparePerformanceAsync(options)` | Measures and compares the execution time of several async functions  |
| `measure(fn, options?)`            | Runs a function a number of times and measures the time taken        |
| `measureAsync(fn, options?)`       | Runs an async function a number of times and measures the time taken |

#### `comparePerformance`

```ts
comparePerformance<A extends unknown[] = unknown[], R = unknown>(options: ComparePerformanceOptions<A, R>): ComparePerformanceResult<A, R>
```

Measures and compares the execution time of the functions in `targets`. Each round runs every function `iterations` times and records the time, and this is repeated for `rounds` rounds. The order of the functions changes every round to reduce bias from running order. Within a round, every function receives the same arguments.

An error is thrown if two `targets` share the same `id`.

```ts
const result = comparePerformance({
  targets: [
    { id: 'spread', fn: (a: number[]) => [...a] },
    { id: 'slice', fn: (a: number[]) => a.slice() },
  ],
  args: [Array.from({ length: 1000 }, (_, i) => i)],
  iterations: 100,
  rounds: 10,
});
result.order.map((target) => target.id); // fastest first
```

| Option              | Type                               | Description                                                                                                              |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `targets`           | `ComparePerformanceTarget<A, R>[]` | The functions to measure, as `{ id, fn }`. Each `id` must be unique                                                      |
| `iterations?`       | `number`                           | How many times each function runs per round. Decimals are truncated, and values below 1 become 1. Defaults to `10`       |
| `rounds?`           | `number`                           | How many rounds to measure. Decimals are truncated, and values below 1 become 1. Defaults to `10`                        |
| `args?`             | `A`                                | The arguments passed to the functions                                                                                    |
| `getArgs?`          | `() => A`                          | A function that creates the arguments for each run. Takes precedence over `args`. Same as `measure`                      |
| `warmUpIterations?` | `number`                           | How many times each function runs before measuring. Decimals are truncated, and values below 0 become 0. Defaults to `0` |
| `id?`               | `string`                           | An ID included in the result as is. Defaults to the start time in milliseconds                                           |

| Property       | Type                               | Description                                                         |
| -------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `average`      | `ElapsedTimes`                     | The average time per round for each function (ms)                   |
| `totalAverage` | `number`                           | The average time over all functions (ms). `0` if `targets` is empty |
| `order`        | `ComparePerformanceTarget<A, R>[]` | The targets sorted from the shortest average time                   |
| `results`      | `ElapsedTimes[]`                   | The time of each function in each round                             |
| `returnValues` | `{ [id: string]: R }`              | The last return value of each function                              |
| `start`        | `Date`                             | When the measurement started                                        |
| `end`          | `Date`                             | When the measurement ended                                          |
| `id`           | `string`                           | The measurement ID                                                  |

#### `comparePerformanceAsync`

```ts
comparePerformanceAsync<A extends unknown[] = unknown[], R = unknown>(options: ComparePerformanceAsyncOptions<A, R>): Promise<ComparePerformanceAsyncResult<A, R>>
```

The async-function version of `comparePerformance`. The functions are run one at a time, including the warm-up. The options and the result are the same as `comparePerformance`.

#### `measure`

```ts
measure<R>(fn: () => R, options?: MeasureOptions<[]>): MeasureResult<R>
measure<A extends unknown[], R>(fn: (...args: A) => R, options: MeasureOptions<A>): MeasureResult<R>
```

Runs `fn` `iterations` times and returns the total execution time (ms) and the last return value. The time is measured with `performance.now()`. Because some environments reduce the precision of `performance.now()`, all runs are measured together rather than one by one.

If `fn` has required parameters, either `args` or `getArgs` is required.

```ts
const { time, returnValue } = measure(() => heavyCalc(), { iterations: 100 });
```

| Option        | Type      | Description                                                                                                                                      |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `iterations?` | `number`  | How many times to run. Decimals are truncated, and values below 1 become 1. Defaults to `10`                                                     |
| `args?`       | `A`       | The arguments passed to the function                                                                                                             |
| `getArgs?`    | `() => A` | A function that creates the arguments for each run. Takes precedence over `args`. It is called for all runs before measuring, so it is not timed |

| Property      | Type     | Description                      |
| ------------- | -------- | -------------------------------- |
| `time`        | `number` | The total execution time (ms)    |
| `returnValue` | `R`      | The return value of the last run |

#### `measureAsync`

```ts
measureAsync<R>(fn: () => Promise<R>, options?: MeasureAsyncOptions<[]>): Promise<MeasureAsyncResult<R>>
measureAsync<A extends unknown[], R>(fn: (...args: A) => Promise<R>, options: MeasureAsyncOptions<A>): Promise<MeasureAsyncResult<R>>
```

The async-function version of `measure`. Runs `fn` one call at a time, waiting for each to finish. The options and the result are the same as `measure`.

#### Types

| Type                                   | Description                                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `ComparePerformanceOptions<A, R>`      | Options for `comparePerformance`                                                                                                           |
| `ComparePerformanceResult<A, R>`       | The return value of `comparePerformance`                                                                                                   |
| `ComparePerformanceTarget<A, R>`       | A function to measure `{ id, fn }`                                                                                                         |
| `ComparePerformanceAsyncOptions<A, R>` | Same as `ComparePerformanceOptions<A, Promise<R>>`                                                                                         |
| `ComparePerformanceAsyncResult<A, R>`  | The return value of `comparePerformanceAsync`. Same as `ComparePerformanceResult<A, R>`, except that `order` functions return `Promise<R>` |
| `ElapsedTimes`                         | Times per function ID `{ [id: string]: number }`                                                                                           |
| `MeasureArgsOptions<A>`                | Options for the arguments passed to the function (`args` / `getArgs`)                                                                      |
| `MeasureOptions<A>`                    | Options for `measure`                                                                                                                      |
| `MeasureResult<R>`                     | The return value of `measure`                                                                                                              |
| `MeasureAsyncOptions<A>`               | Same as `MeasureOptions<A>`                                                                                                                |
| `MeasureAsyncResult<R>`                | Same as `MeasureResult<R>`                                                                                                                 |

### number

| Function                                          | Description                                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| `clampInRange(value, min, max)`                   | Keeps a value between a minimum and a maximum                              |
| `ensureNumber(data)`                              | Converts a value to a number                                               |
| `getValidMinMax(min, max, options?)`              | Returns a minimum and a maximum in the correct order                       |
| `getValidNumber(value, options?)`                 | Returns a replacement when a value is not a valid number                   |
| `isStrictlyWithinRange(value, min, max)`          | Checks whether a value is within a range (exclusive)                       |
| `isWithinRange(value, min, max)`                  | Checks whether a value is within a range (inclusive)                       |
| `keepInRange(value, min, max, options?)`          | Keeps a value within a range, choosing how out-of-range values are handled |
| `lerpNumber(value, ratio, options?)`              | Interpolates between a base value and a target value by a ratio            |
| `limitNaturalNumber(value, options?)`             | Limits a value to a natural number (an integer of 1 or more)               |
| `limitPositiveNumber(value, options?)`            | Limits a value to a positive number                                        |
| `loopInRange(value, min, max)`                    | Keeps a value within a range by treating the range as a loop               |
| `pingpongInRange(value, min, max)`                | Keeps a value within a range by bouncing back at the ends                  |
| `replaceOutOfRange(value, min, max, replacement)` | Replaces a value outside a range with a given value                        |
| `roundToStep(data, step)`                         | Rounds a value to the nearest multiple of a step                           |

Functions that take a range (`clampInRange`, `isStrictlyWithinRange`, `isWithinRange`, `keepInRange`, `loopInRange`, `pingpongInRange`, `replaceOutOfRange`) swap `min` and `max` when `min` is greater than `max`.

#### `clampInRange`

```ts
clampInRange(value: number, min: number, max: number): number
```

Returns `min` when `value` is below `min`, `max` when it is above `max`, and `value` otherwise.

```ts
clampInRange(150, 0, 100); // 100
clampInRange(-10, 0, 100); // 0
```

#### `ensureNumber`

```ts
ensureNumber(data: unknown): number
```

Converts a value to a `number`. Numbers are returned as is (`NaN` becomes `0`), and strings are converted with `Number()`. Strings that cannot be converted, `null`, `undefined`, booleans, bigints, objects, and so on become `0`.

`Infinity` and `-Infinity` are returned as is. Use `getValidNumber` to allow only finite numbers.

```ts
ensureNumber('12.5'); // 12.5
ensureNumber('abc'); // 0
ensureNumber(null); // 0
ensureNumber(true); // 0
```

#### `getValidMinMax`

```ts
getValidMinMax(min: number | null | undefined, max: number | null | undefined, options?: GetValidMinMaxOptions): [number, number]
```

Returns `min` and `max` as an array ordered from smaller to larger. Defaults are used for `null`, `undefined`, and `NaN`.

```ts
getValidMinMax(10, 1); // [1, 10]
getValidMinMax(null, 5); // [-Infinity, 5]
getValidMinMax(NaN, 5); // [-Infinity, 5]
```

| Option        | Type     | Description                                                                         |
| ------------- | -------- | ----------------------------------------------------------------------------------- |
| `defaultMin?` | `number` | The value used when `min` is `null`, `undefined`, or `NaN`. Defaults to `-Infinity` |
| `defaultMax?` | `number` | The value used when `max` is `null`, `undefined`, or `NaN`. Defaults to `Infinity`  |

#### `getValidNumber`

```ts
getValidNumber(value: number | null | undefined, options?: GetValidNumberOptions): number
```

Returns `value` when it is a valid number (`isValidNumber` returns `true`), and `invalidValue` otherwise.

```ts
getValidNumber(NaN); // 0
getValidNumber(Infinity, { invalidValue: -1 }); // -1
getValidNumber(Infinity, { allowInfinity: true }); // Infinity
```

| Option           | Type      | Description                                                   |
| ---------------- | --------- | ------------------------------------------------------------- |
| `invalidValue?`  | `number`  | The value returned when `value` is not valid. Defaults to `0` |
| `allowInfinity?` | `boolean` | If `true`, `Infinity` and `-Infinity` are valid numbers       |

#### `isStrictlyWithinRange`

```ts
isStrictlyWithinRange(value: number, min: number, max: number): boolean
```

Returns `true` when `value` is greater than `min` and less than `max`.

#### `isWithinRange`

```ts
isWithinRange(value: number, min: number, max: number): boolean
```

Returns `true` when `value` is at least `min` and at most `max`.

#### `keepInRange`

```ts
keepInRange(value: number, min: number, max: number, options?: KeepInRangeOptions): number
```

Keeps `value` between `min` and `max`. How out-of-range values are handled is set with `mode`, and can be set separately for values below the minimum and above the maximum.

```ts
keepInRange(15, 0, 10); // 10
keepInRange(15, 0, 10, { mode: 'loop' }); // 5
keepInRange(-1, 0, 10, { minMode: 'max' }); // 10
keepInRange(15, 0, 10, { mode: 'replace', outOfRangeValue: -1 }); // -1
```

| Option             | Type        | Description                                                                                                                                                                                                                             |
| ------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode?`            | `RangeMode` | How out-of-range values are handled. `'clamp'`: the nearer end; `'min'`: the minimum; `'max'`: the maximum; `'loop'`: same as `loopInRange`; `'pingpong'`: same as `pingpongInRange`; `'replace'`: a given value. Defaults to `'clamp'` |
| `minMode?`         | `RangeMode` | How values below the minimum are handled. Defaults to `mode`                                                                                                                                                                            |
| `maxMode?`         | `RangeMode` | How values above the maximum are handled. Defaults to `mode`                                                                                                                                                                            |
| `outOfRangeValue?` | `number`    | The value returned with `'replace'`. Defaults to `0`                                                                                                                                                                                    |
| `belowMinValue?`   | `number`    | The value returned below the minimum when `minMode` is `'replace'`. Defaults to `outOfRangeValue`                                                                                                                                       |
| `aboveMaxValue?`   | `number`    | The value returned above the maximum when `maxMode` is `'replace'`. Defaults to `outOfRangeValue`                                                                                                                                       |

#### `lerpNumber`

```ts
lerpNumber(value: number, ratio: number, options?: LerpNumberOptions): number
```

Returns the value linearly interpolated by `ratio` between the base value (`baseValue`) and the target value (`value`). A `ratio` outside 0 to 1 extrapolates.

```ts
lerpNumber(100, 0.5); // 50
lerpNumber(200, 0.25, { baseValue: 100 }); // 125
```

| Option       | Type     | Description                     |
| ------------ | -------- | ------------------------------- |
| `baseValue?` | `number` | The base value. Defaults to `0` |

#### `limitNaturalNumber`

```ts
limitNaturalNumber(value: number | null | undefined, options?: LimitNaturalNumberOptions): number | null | undefined
```

Converts a value to a natural number (an integer of 1 or more). Decimals are truncated, and `zeroValue` is returned when the result is `0`. The other options are the same as `limitPositiveNumber`. Values set in the options are returned as is without truncation.

```ts
limitNaturalNumber(3.7); // 3
limitNaturalNumber(0.5); // null
limitNaturalNumber(0, { zeroValue: 0 }); // 0
limitNaturalNumber(-3.5, { negativeValue: 'abs' }); // 3
```

#### `limitPositiveNumber`

```ts
limitPositiveNumber(value: number | null | undefined, options?: LimitPositiveNumberOptions): number | null | undefined
```

Limits a value to a positive number (greater than 0). Positive numbers are returned as is; otherwise the value set in the options is returned.

```ts
limitPositiveNumber(1.5); // 1.5
limitPositiveNumber(-1); // null
limitPositiveNumber(-1, { negativeValue: 'abs' }); // 1
limitPositiveNumber(0, { zeroValue: 0 }); // 0
```

| Option           | Type                                   | Description                                                                                      |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `negativeValue?` | `number \| null \| undefined \| 'abs'` | The value returned for a negative number. `'abs'` returns the absolute value. Defaults to `null` |
| `zeroValue?`     | `number \| null \| undefined`          | The value returned for `0`. Defaults to `null`                                                   |
| `nanValue?`      | `number \| null \| undefined`          | The value returned for `NaN`. Defaults to `null`                                                 |
| `defaultValue?`  | `number`                               | The value returned for `null` or `undefined`. The value is returned as is by default             |

#### `loopInRange`

```ts
loopInRange(value: number, min: number, max: number): number
```

Brings `value` to at least `min` and less than `max` by treating the range as a loop. `max` is treated as the same position as `min` (the same idea as the remainder operator). Useful for values whose end and start are the same position, such as indexes and angles. Returns `min` when `min` and `max` are equal.

```ts
loopInRange(12, 0, 10); // 2
loopInRange(-1, 0, 10); // 9
loopInRange(10, 0, 10); // 0
```

#### `pingpongInRange`

```ts
pingpongInRange(value: number, min: number, max: number): number
```

Brings an out-of-range `value` back into the range by bouncing back and forth between the ends.

```ts
pingpongInRange(12, 0, 10); // 8
pingpongInRange(-2, 0, 10); // 2
```

#### `replaceOutOfRange`

```ts
replaceOutOfRange(value: number, min: number, max: number, replacement: number): number
```

Returns `value` when it is within the range (at least `min` and at most `max`), and `replacement` otherwise.

#### `roundToStep`

```ts
roundToStep(data: number, step: number): number
```

Rounds `data` to the nearest multiple of `step`. Values exactly halfway are rounded toward positive infinity (the same as `Math.round`, so `-2.5` becomes `-2`). The result is rounded again to the number of decimal places in `step`, so errors like `0.30000000000000004` do not appear. If `step` is `0` or not finite, `data` is returned as is.

Rounding works on the floating-point (double) value. `1.15` is `1.1499…` as a double, so `roundToStep(1.15, 0.1)` returns `1.1`. Use `@fringeworks/numeric-string` to round decimals exactly as written.

```ts
roundToStep(7, 5); // 5
roundToStep(8, 5); // 10
roundToStep(0.3, 0.1); // 0.3
```

#### Constants

| Constant    | Description                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------------- |
| `RangeMode` | How `keepInRange` handles out-of-range values: `clamp`, `min`, `max`, `loop`, `pingpong`, `replace` |

#### Types

| Type                         | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| `GetValidMinMaxOptions`      | Options for `getValidMinMax`                                 |
| `GetValidNumberOptions`      | Options for `getValidNumber`                                 |
| `KeepInRangeOptions`         | Options for `keepInRange`                                    |
| `LerpNumberOptions`          | Options for `lerpNumber`                                     |
| `LimitNaturalNumberOptions`  | Same as `LimitPositiveNumberOptions`                         |
| `LimitPositiveNumberOptions` | Options for `limitPositiveNumber`                            |
| `RangeMode`                  | The values for how `keepInRange` handles out-of-range values |

### object

To prevent prototype pollution, functions that read or write object keys ignore the `__proto__` key. Functions that take a path, such as `set` and `unset`, do nothing when the path contains `__proto__`.

| Function                                               | Description                                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `assignDefined(target, values, options?)`              | Returns a new object with only the values that are not `undefined` assigned      |
| `assignDefinedMutable(target, values, options?)`       | Assigns only the values that are not `undefined` (mutating)                      |
| `cloneDeep(value)`                                     | Makes a deep copy of a value                                                     |
| `cloneShallow(value)`                                  | Makes a shallow copy of a value                                                  |
| `countKeys(obj)`                                       | Returns the number of enumerable properties of an object                         |
| `createOverrideProxy(instance, overrides)`             | Creates a proxy that overrides an instance's properties                          |
| `distribute(data, rules, options?)`                    | Splits properties into several objects according to rules                        |
| `exactKeys<T>()(keys)`                                 | Checks at compile time that an array lists exactly the keys of a type            |
| `exactKeysFromRecord<T>(keys)`                         | Creates an array of keys from an object that has every key of a type             |
| `fillDefaults(target, defaultValues, options?)`        | Returns a new object with missing properties filled with defaults                |
| `fillDefaultsMutable(target, defaultValues, options?)` | Fills missing properties with defaults (mutating)                                |
| `filterByKeys(target, condition, options?)`            | Keeps only the properties whose keys match a condition                           |
| `filterByValues(target, condition, options?)`          | Keeps only the values that match a condition                                     |
| `flattenObject(data, options?)`                        | Flattens a nested object into a single level                                     |
| `forEachValue(target, callback, options?)`             | Runs a callback for the value of each property                                   |
| `get(data, path, options?)`                            | Returns the value of the property at a path                                      |
| `hasOwn(data, key)`                                    | Checks whether an object has an own property (equivalent to `Object.hasOwn`)     |
| `maybeHasOwn(data, key)`                               | Checks whether an object has an own property (safe for `null`)                   |
| `omit(data, keys)`                                     | Returns a new object without the given keys                                      |
| `parsePropertyPath(path)`                              | Converts a property path to an array of keys                                     |
| `set(data, path, value)`                               | Returns a new object with a value set at a path                                  |
| `setMutable(data, path, value)`                        | Sets a value at a path (mutating)                                                |
| `stableStringify(value, space?)`                       | Converts a value to a JSON string with sorted keys                               |
| `transformObject(source, rules, options?)`             | Reshapes an object according to rules                                            |
| `unset(data, path)`                                    | Returns a new object without the property at a path                              |
| `unsetMutable(data, path)`                             | Removes the property at a path (mutating)                                        |
| `update(object, values, options?)`                     | Returns a new object with only the changed properties updated                    |
| `updateMutable(object, values, options?)`              | Updates only the changed properties and returns their previous values (mutating) |

#### `assignDefined`

```ts
assignDefined<T extends object, V extends object>(target: T, values: V, options?: AssignDefinedOptions): AssignDefinedResult<T, V>
```

Returns a new object with only the properties of `values` that are not `undefined` assigned to `target`. Symbol keys are included.

```ts
assignDefined({ a: 1, b: 2 }, { a: undefined, b: null, c: 3 }); // { a: 1, b: null, c: 3 }
assignDefined({ a: 1, b: 2 }, { b: null }, { skipNull: true }); // { a: 1, b: 2 }
```

| Option              | Type      | Description                                                         |
| ------------------- | --------- | ------------------------------------------------------------------- |
| `skipNull?`         | `boolean` | If `true`, properties whose value is `null` are not assigned either |
| `includeInherited?` | `boolean` | If `true`, inherited properties of `values` are assigned too        |

#### `assignDefinedMutable`

```ts
assignDefinedMutable<T extends object, V extends object>(target: T, values: V, options?: AssignDefinedMutableOptions): AssignDefinedResult<T, V>
```

The mutating version of `assignDefined`. Assigns to `target` directly and returns the same object. The options are the same as `assignDefined`.

#### `cloneDeep`

```ts
cloneDeep<T>(value: T): T
```

Makes a deep copy of a value with [klona/full](https://github.com/lukeed/klona), which also copies `Map`, `Set`, `Date`, `RegExp`, typed arrays, property descriptors, and symbol properties.

#### `cloneShallow`

```ts
cloneShallow<T>(value: T): T
```

Makes a shallow copy of a value. Supports objects (keeping their prototype), arrays, `Map`, `Set`, `Date`, `RegExp`, `ArrayBuffer`, typed arrays, and `DataView`, and keeps property descriptors and symbol properties. Primitives and unsupported values are returned as is.

#### `countKeys`

```ts
countKeys(obj: unknown): number
```

Returns the number of own enumerable properties of an object (`Object.keys(obj).length`). Returns `0` for values that are not objects.

#### `createOverrideProxy`

```ts
createOverrideProxy<I extends object, O extends Record<PropertyKey, (target: I, prop: string | symbol, receiver: any) => any>>(instance: I, overrides?: O): I & { [K in keyof O]: ReturnType<O[K]> }
```

Creates a proxy that overrides properties of `instance`, for replacing methods or properties of an instance when subclassing is not possible. `instance` itself is not modified. `overrides` maps property names to functions that return the value read for that property. Methods and getters that are not overridden are called with the original instance as `this`, so it also works with instances that have internal state, such as `Map` or DOM elements. In exchange, properties that the original methods read through `this` do not see the overrides.

```ts
const logger = createOverrideProxy(console, {
  log:
    (target) =>
    (...args: unknown[]) =>
      target.log('[app]', ...args),
});
logger.log('hello'); // [app] hello
```

#### `distribute`

```ts
distribute<T extends object, DR extends DistributeRules<T>>(data: T, rules: DR, options?: DistributeOptions): DistributeResult<T, DR>
```

Splits the top-level properties of `data` into several objects according to `rules`. `rules` maps group names to arrays of property names; a group set to `null` receives the properties that went into no other group. A property listed in several groups goes into each of them. The result type has the specified properties for each group.

```ts
const { identity, rest } = distribute(user, {
  identity: ['id', 'name'],
  rest: null,
});
// identity: { id, name }
// rest: the other properties of user
```

| Option              | Type      | Description                                                                                                                      |
| ------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `includeInherited?` | `boolean` | If `true`, inherited properties are split too                                                                                    |
| `cloneValue?`       | `boolean` | If `true`, values are cloned with `cloneDeep` before being split. Groups set to `null` also receive values cloned for each group |

#### `exactKeys`

```ts
exactKeys<T>(): <const K extends readonly (keyof T)[]>(keys: K) => K
```

Checks at compile time that an array lists every key of type `T` exactly once. At runtime it returns the given array as is. It is called in two steps so that `T` can be specified explicitly while the array of keys is inferred.

```ts
type User = { id: number; name: string; age: number };

const userKeys = exactKeys<User>()(['id', 'name', 'age']); // readonly ['id', 'name', 'age']
exactKeys<User>()(['id', 'name']); // type error: __missingKeys: 'age'
exactKeys<User>()(['id', 'name', 'age', 'id']); // type error: __duplicateKeys: 'id'
```

#### `exactKeysFromRecord`

```ts
exactKeysFromRecord<T>(keys: Record<keyof T, true>): (keyof T)[]
```

Creates an array of keys from an object that has every key of type `T` with the value `true`. Missing, duplicate, and extra keys are reported by TypeScript's usual checks. The order follows the object's key order, so keys treated as integers come first in ascending order. Use `exactKeys` to get the keys as a literal tuple type.

```ts
const userKeys = exactKeysFromRecord<User>({ id: true, name: true, age: true }); // ('id' | 'name' | 'age')[]
```

#### `fillDefaults`

```ts
fillDefaults<T extends object, const V extends object, const O extends FillDefaultsOptions = {}>(target: T, defaultValues: V, options?: O): FillDefaultsResult<T, V, O>
```

Returns a new object with the values of `defaultValues` set on the properties of `target` whose values are `undefined`. Values in `defaultValues` that are `undefined` are not set. Symbol keys are included.

```ts
fillDefaults({ a: undefined, b: null, c: 1 }, { a: 1, b: 2, c: 3, d: 4 }); // { a: 1, b: null, c: 1, d: 4 }
fillDefaults({ b: null }, { b: 2 }, { overwriteNull: true }); // { b: 2 }
```

| Option              | Type      | Description                                                                |
| ------------------- | --------- | -------------------------------------------------------------------------- |
| `overwriteNull?`    | `boolean` | If `true`, properties of `target` whose value is `null` are filled too     |
| `skipNull?`         | `boolean` | If `true`, properties of `defaultValues` whose value is `null` are not set |
| `includeInherited?` | `boolean` | If `true`, inherited properties of `defaultValues` are included            |

#### `fillDefaultsMutable`

```ts
fillDefaultsMutable<T extends object, const V extends object, const O extends FillDefaultsMutableOptions = {}>(target: T, defaultValues: V, options?: O): FillDefaultsResult<T, V, O>
```

The mutating version of `fillDefaults`. Sets the values on `target` directly and returns the same object. The options are the same as `fillDefaults`.

#### `filterByKeys`

```ts
filterByKeys(target: unknown, condition: string | number, options?: FilterByKeysOptions): unknown
```

Walks objects and arrays recursively and returns a new value that keeps only the properties whose keys match the condition. When `condition` is a string, a key matches if it contains `condition` (substring match); when it is a number, the key must equal it (`0` matches `'0'`). A matching property is kept with its whole value, and a non-matching property is searched further. Returns `null` when nothing matches. The remaining structure is only known at runtime, so the return type is `unknown`. Arrays keep their original indexes, leaving holes where nothing matched.

```ts
filterByKeys({ a: { name: 1, x: 2 }, y: [{ name: 3 }] }, 'name');
// { a: { name: 1 }, y: [{ name: 3 }] }
filterByKeys({ UserName: 'A', age: 1 }, 'username', {
  normalize: (value) => value.toLowerCase(),
});
// { UserName: 'A' }
```

| Option       | Type                        | Description                                                                                                         |
| ------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `normalize?` | `(value: string) => string` | A function that normalizes keys and the condition when comparing with a string condition. Not normalized if omitted |

#### `filterByValues`

```ts
filterByValues(target: unknown, condition: unknown, options?: FilterByValuesOptions): unknown
```

Walks objects and arrays recursively and returns a new value that keeps only the values matching the condition. When `condition` is a string, a string value matches if it contains `condition` (substring match); otherwise the value must equal `condition` (`===`). What is kept, when `null` is returned, and how arrays are handled are the same as `filterByKeys`.

```ts
filterByValues({ a: 'Alice', b: 'Bob', c: { d: 'Alan' } }, 'Al');
// { a: 'Alice', c: { d: 'Alan' } }
filterByValues({ a: 1, b: 2, c: 1 }, 1); // { a: 1, c: 1 }
```

| Option       | Type                        | Description                                                                                                           |
| ------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `normalize?` | `(value: string) => string` | A function that normalizes values and the condition when comparing with a string condition. Not normalized if omitted |

#### `flattenObject`

```ts
flattenObject(data: object, options?: FlattenObjectOptions): LooseRecord
```

Flattens nested plain objects and arrays into a single-level object whose keys are the joined paths. Array elements are joined in the `a[0]` form, so keys made with the default separator can be used as paths for `set` and others as is (keys containing `.` or `[` cannot be told apart). Empty objects and arrays are kept as values. When joined keys collide, the value processed later wins.

```ts
flattenObject({ a: { b: [1, { c: 2 }] } }); // { 'a.b[0]': 1, 'a.b[1].c': 2 }
flattenObject({ a: { b: [1] } }, { keepArrays: true }); // { 'a.b': [1] }
```

| Option          | Type      | Description                                                                                                                  |
| --------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `keySeparator?` | `string`  | The separator used to join paths. Array elements are joined in the `[0]` form regardless of the separator. Defaults to `'.'` |
| `keepArrays?`   | `boolean` | If `true`, arrays are kept as values instead of being flattened. Defaults to `false`                                         |
| `leafKeysOnly?` | `boolean` | If `true`, uses only the last key instead of the joined path (same keys overwrite each other). Defaults to `false`           |

#### `forEachValue`

```ts
forEachValue<T extends object>(target: T, callback: (value: T[keyof T], key: string | symbol, obj: T) => void | boolean, options?: ForEachValueOptions): boolean
```

Runs `callback` for each own enumerable property of an object. Like spread syntax and `Object.assign`, symbol keys are included. Stops when `callback` returns `false`. Returns `true` when every property was processed and `false` when it stopped early.

| Option              | Type      | Description                                                                     |
| ------------------- | --------- | ------------------------------------------------------------------------------- |
| `includeInherited?` | `boolean` | If `true`, inherited properties are included. Only own symbol keys are included |

#### `get`

```ts
get(data: unknown, path: PropertyPath, options?: GetOptions): unknown
```

Returns the value of the property at a path. The path is a string such as `'a.b[0]'`, or an array of keys. Array indexes are written as `[0]`. See `parsePropertyPath` for how strings are parsed. A number or symbol is treated as a single key. Returns `undefined` when a property along the path is missing, the path is empty, or `data` is `null` or `undefined`. The value's type cannot be determined from the path, so it returns `unknown`; check the type before using it. By default only own properties are followed; properties on the prototype (such as `toString` or class getters) are treated as missing.

```ts
get({ a: { b: [{ c: 1 }] } }, 'a.b[0].c'); // 1
get({ a: { b: [{ c: 1 }] } }, ['a', 'b', 0, 'c']); // 1
get({}, 'toString'); // undefined
```

| Option              | Type      | Description                                                                                    |
| ------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `includeInherited?` | `boolean` | If `true`, also follows properties on the prototype (but not `__proto__`). Defaults to `false` |

#### `hasOwn`

```ts
hasOwn(data: object, key: PropertyKey): boolean
```

Checks whether `data` has `key` as an own property. Since `Object.hasOwn` requires Safari 15.4 or later, the check is done with `Object.prototype.hasOwnProperty`. It also works for objects that override `hasOwnProperty` and objects whose prototype is `null`.

```ts
hasOwn({ a: 1 }, 'a'); // true
hasOwn(Object.create({ a: 1 }), 'a'); // false
```

#### `maybeHasOwn`

```ts
maybeHasOwn(data: object | null | undefined, key: PropertyKey): boolean
```

Checks whether `data` has `key` as an own property (`hasOwn`). Returns `false` when `data` is `null` or `undefined`.

#### `omit`

```ts
omit<T extends object, K extends PropertyKey>(data: T, keys: K | readonly K[]): Omit<T, K>
omit<T extends object, K extends PropertyKey>(data: T | null | undefined, keys: K | readonly K[]): Omit<T, K> | undefined
```

Returns a new object without the properties in `keys`. Keys are not treated as paths (use `unset` to remove nested properties). Keys that are not in `data` are allowed. The return type is `Omit<T, K>`. Returns `undefined` when `data` is `null` or `undefined`.

```ts
omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { b: 2 }
```

#### `parsePropertyPath`

```ts
parsePropertyPath(path: PropertyPath): readonly PropertyKey[]
```

Converts a property path to an array of keys. `get`, `set`, `unset`, and others interpret paths by these rules. A string is parsed as follows.

- Parts separated by `.` are string keys (`'a.1'` becomes `['a', '1']`)
- A non-negative integer in brackets, such as `[0]`, is an array index (a number)
- Quoting with `["b.c"]` or `['b.c']` allows keys that contain `.` or `[`. The character after `\` is used as is
- Unquoted bracket contents that are not such an integer (`[b]`, `[01]`, `[-1]`) are string keys
- Empty keys (such as between `'a..b'`) are skipped, and an unclosed bracket or quote makes the rest of the string part of the key

Writing array indexes as `[0]` is recommended. `'a.0'` and `'a[0]'` point to the same element when reading or removing, but when `set` creates a missing container, `'a.0'` creates an object and `'a[0]'` creates an array. A number or symbol is treated as a single key, and an array is returned as is.

```ts
parsePropertyPath('a.b[0].c'); // ['a', 'b', 0, 'c']
parsePropertyPath('a.1'); // ['a', '1']
parsePropertyPath('a["b.c"]'); // ['a', 'b.c']
```

#### `set`

```ts
set<T extends object>(data: T, path: PropertyPath, value: unknown): T
```

Returns a new object with `value` set at the path. Objects and arrays along the path are copied, and missing ones are created (an array when the next key is an index such as `[0]`, otherwise an object). An existing object is never turned into an array, even with a number key. An empty path does nothing and returns `data`. Paths are specified the same way as `get`.

```ts
set({ a: { b: 1 } }, 'a.c', 2); // { a: { b: 1, c: 2 } }
set({}, 'a[0].b', 1); // { a: [{ b: 1 }] }
```

#### `setMutable`

```ts
setMutable<T extends object>(data: T, path: PropertyPath, value: unknown): T
```

The mutating version of `set`. Modifies `data` directly and returns the same object.

#### `stableStringify`

```ts
stableStringify(value: unknown, space?: string | number): string
```

Sorts object keys recursively in ascending order and converts the value to a JSON string. Objects with the same content produce the same string regardless of key order, which makes it useful for cache keys. Values with `toJSON` (such as `Date`) and boxed primitives (such as `new Number(1)`) are converted as `JSON.stringify` does, and a circular reference throws a `TypeError` as `JSON.stringify` does. `space` is the same as the `space` of `JSON.stringify`.

```ts
stableStringify({ b: 2, a: { d: 1, c: 2 } }); // '{"a":{"c":2,"d":1},"b":2}'
```

#### `transformObject`

```ts
transformObject<T extends object = LooseRecord, S extends object = LooseRecord>(source: S, rules: readonly (string | TransformObjectRule<S, T>)[], options?: TransformObjectOptions): T
```

Builds a new object by taking values from `source` according to `rules`. A string rule takes and sets the value at the same path. Values that are `undefined` are not set. With `removeFromSource`, `source` is modified directly. Properties are removed after all rules have taken their values, so removing array elements does not shift the indexes used by other rules.

```ts
transformObject({ firstName: 'Alice', age: 30 }, [
  'age',
  { from: 'firstName', to: 'user.name' },
  { from: (source) => source.age * 2, to: 'doubleAge' },
]);
// { age: 30, user: { name: 'Alice' }, doubleAge: 60 }
```

| Rule property       | Type                                                 | Description                                                                                                                             |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `from`              | `PropertyPath \| ((source: S) => unknown)`           | The path to take from, or a function returning the value                                                                                |
| `to?`               | `PropertyPath \| ((target: T, value: unknown) => T)` | The path to set, or a function returning the object with the value set. Defaults to the `from` path. Required when `from` is a function |
| `removeFromSource?` | `boolean`                                            | If `true`, removes the property from `source` after taking it. Follows the option when omitted. Not allowed when `from` is a function   |

| Option              | Type      | Description                                                                          |
| ------------------- | --------- | ------------------------------------------------------------------------------------ |
| `removeFromSource?` | `boolean` | If `true`, removes properties taken by path rules from `source`. Defaults to `false` |

#### `unset`

```ts
unset<T extends object>(data: T, path: PropertyPath): T
```

Returns a new object without the property at the path. Removing an array element shifts the following elements. Returns `data` as is when the path does not exist. Paths are specified the same way as `get`.

```ts
unset({ a: { b: 1, c: 2 } }, 'a.b'); // { a: { c: 2 } }
unset({ a: [1, 2, 3] }, 'a[1]'); // { a: [1, 3] }
```

#### `unsetMutable`

```ts
unsetMutable<T extends object>(data: T, path: PropertyPath): T
```

The mutating version of `unset`. Modifies `data` directly and returns the same object.

#### `update`

```ts
update<T extends object>(object: T, values: Partial<T>, options?: UpdateOptions): T
```

Returns a new object with only the properties of `values` that differ from `object` updated. When nothing changes, `object` itself is returned, so a reference comparison tells whether anything changed. How values are compared is set with the `isEqual` option.

```ts
const state = { a: 1, b: 2 };
update(state, { a: 9 }); // { a: 9, b: 2 } (a new object)
update(state, { a: 1 }) === state; // true
update({ a: { x: 1 } }, { a: { x: 1 } }, { isEqual }); // the original object
```

| Option     | Type                                            | Description                                                                                                                                                                        |
| ---------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isEqual?` | `(value1: unknown, value2: unknown) => boolean` | A function that checks whether a value is unchanged. Defaults to `Object.is` (`NaN` equals `NaN`, and `+0` differs from `-0`). Pass the `isEqual` function to compare by structure |

#### `updateMutable`

```ts
updateMutable<T extends object>(object: T, values: Partial<T>, options?: UpdateMutableOptions): Partial<T>
```

The mutating version of `update`. Updates `object` directly and returns an object with the previous values of the updated properties. The options are the same as `update`.

```ts
const state = { a: 1, b: 2 };
updateMutable(state, { a: 9, b: 2 }); // { a: 1 } (state becomes { a: 9, b: 2 })
```

#### Types

| Type                          | Description                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssignDefinedMutableOptions` | Options for `assignDefinedMutable`                                                                                                                                                                                                                                                                                                                          |
| `AssignDefinedOptions`        | Same as `AssignDefinedMutableOptions`                                                                                                                                                                                                                                                                                                                       |
| `AssignDefinedResult<T, V>`   | The return type of `assignDefined` and `assignDefinedMutable`. Keys whose values in `values` may be skipped as `undefined` (also `null` with `skipNull`) keep the type of the value in `target`                                                                                                                                                             |
| `DistributeOptions`           | Options for `distribute`                                                                                                                                                                                                                                                                                                                                    |
| `DistributeRules<T>`          | The rules of `distribute` `{ [group]: array of property names \| null }`                                                                                                                                                                                                                                                                                    |
| `DistributePropertyList<T>`   | An array of property names in the rules of `distribute`                                                                                                                                                                                                                                                                                                     |
| `DistributeResult<T, R>`      | The return value of `distribute`                                                                                                                                                                                                                                                                                                                            |
| `FillDefaultsMutableOptions`  | Options for `fillDefaultsMutable`                                                                                                                                                                                                                                                                                                                           |
| `FillDefaultsOptions`         | Same as `FillDefaultsMutableOptions`                                                                                                                                                                                                                                                                                                                        |
| `FillDefaultsResult<T, V, O>` | The return type of `fillDefaults` and `fillDefaultsMutable`. Keys whose values in `target` are `undefined` (also `null` when `overwriteNull: true`) have those values removed and the type of the value in `defaultValues` added. Literal types of `defaultValues` are kept. If `overwriteNull` is a `boolean` not known at compile time, `null` may remain |
| `FilterByKeysOptions`         | Options for `filterByKeys`                                                                                                                                                                                                                                                                                                                                  |
| `FilterByValuesOptions`       | Options for `filterByValues`                                                                                                                                                                                                                                                                                                                                |
| `FlattenObjectOptions`        | Options for `flattenObject`                                                                                                                                                                                                                                                                                                                                 |
| `ForEachValueOptions`         | Options for `forEachValue`                                                                                                                                                                                                                                                                                                                                  |
| `GetOptions`                  | Options for `get`                                                                                                                                                                                                                                                                                                                                           |
| `PropertyPath`                | A path for `get`, `set`, `unset`, and others. A string is parsed by the rules of `parsePropertyPath`, a number or symbol is a single key, and an array is a sequence of keys                                                                                                                                                                                |
| `TransformObjectOptions`      | Options for `transformObject`                                                                                                                                                                                                                                                                                                                               |
| `TransformObjectRule<S, T>`   | A rule of `transformObject`                                                                                                                                                                                                                                                                                                                                 |
| `UpdateMutableOptions`        | Options for `updateMutable`                                                                                                                                                                                                                                                                                                                                 |
| `UpdateOptions`               | Same as `UpdateMutableOptions`                                                                                                                                                                                                                                                                                                                              |

### string

| Function                                          | Description                                                  |
| ------------------------------------------------- | ------------------------------------------------------------ |
| `createExtractor(delimiters?)`                    | Creates a function that extracts text enclosed in delimiters |
| `createReplacerByMap(map)`                        | Creates a function that replaces text according to a map     |
| `ensureString(data)`                              | Converts a value to a string                                 |
| `escapeRegExp(target)`                            | Escapes special regular expression characters                |
| `isSurroundedBy(str, prefix, suffix?)`            | Checks whether a string is enclosed by given strings         |
| `lowerFirst(str)`                                 | Converts the first character to lowercase                    |
| `replaceByMap(str, map)`                          | Replaces text according to a map                             |
| `replacePlaceholders(template, values, options?)` | Replaces placeholders in a template with values              |
| `toCamelCase(data)`, ...                          | Converts the case of a string                                |
| `upperFirst(str)`                                 | Converts the first character to uppercase                    |

#### `createExtractor`

```ts
createExtractor(delimiters?: string | readonly [string, string]): Extractor
```

Creates a function that extracts the text enclosed in `delimiters`. A single string is used as both the opening and closing delimiter. Defaults to `['{{', '}}']`, which is also used when a delimiter is empty. The created function returns an array of the extracted strings. Whitespace just inside the delimiters is trimmed, and enclosed text containing a line break is not extracted. An empty string, `null`, or `undefined` gives an empty array.

```ts
const extract = createExtractor();
extract('{{a}} and {{ b }} and {{a}}', { unique: true }); // ['a', 'b']
extract('{{ a }}', { keepWhitespace: true }); // [' a ']
extract('{{ a }}', { keepDelimiters: true }); // ['{{ a }}']
createExtractor('%')('%x% %y%'); // ['x', 'y']
```

The created function has the following options and properties.

| Option            | Type      | Description                                                                                             |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| `keepDelimiters?` | `boolean` | If `true`, returns the original text including the delimiters (whitespace is kept). Defaults to `false` |
| `keepWhitespace?` | `boolean` | If `true`, keeps the whitespace just inside the delimiters. Defaults to `false`                         |
| `unique?`         | `boolean` | If `true`, removes duplicates (compared after trimming). Defaults to `false`                            |

| Property | Type     | Description                       |
| -------- | -------- | --------------------------------- |
| `prefix` | `string` | The opening delimiter (read-only) |
| `suffix` | `string` | The closing delimiter (read-only) |

#### `createReplacerByMap`

```ts
createReplacerByMap(map: ReplacementMap): Replacer
```

Creates a function that replaces text by the same rules as `replaceByMap`. The lookup index is built only once, so it is faster than `replaceByMap` when replacing many strings with the same map. Changes to `map` after creation are not reflected in the created function. The created function returns an empty string, `null`, or `undefined` as is.

```ts
const replace = createReplacerByMap({ hello: 'hi', world: 'earth' });
['hello world', 'hello'].map(replace); // ['hi earth', 'hi']
```

#### `ensureString`

```ts
ensureString(data: unknown): string
```

Converts a value to a string. Strings are returned as is, `null` and `undefined` become an empty string, and other values are converted with `String()`. Values that `String()` cannot convert (such as objects with a `null` prototype) become `'[object Object]'` and similar, as ordinary objects do.

#### `escapeRegExp`

```ts
escapeRegExp(target: string): string
```

Escapes a string so that it matches itself inside a regular expression. Returns the same result as the standard `RegExp.escape`, and uses it when available. The result is treated as the original text even with the `u` and `v` flags and inside character classes. A leading letter or digit is also escaped (as in `\x31`) so that it cannot combine with the preceding text.

```ts
new RegExp(escapeRegExp('1.5*2')); // /\x31\.5\*2/
```

#### `isSurroundedBy`

```ts
isSurroundedBy(str: string, prefix: string, suffix?: string): boolean
```

Checks whether `str` starts with `prefix` and ends with `suffix`. Nothing is required between them, but `false` is returned when `prefix` and `suffix` overlap. `suffix` defaults to `prefix`.

```ts
isSurroundedBy('(a)', '(', ')'); // true
isSurroundedBy('()', '(', ')'); // true
isSurroundedBy('"', '"'); // false
```

#### `lowerFirst` / `upperFirst`

```ts
lowerFirst(str: string): string
upperFirst(str: string): string
```

Converts the first character to lowercase (`lowerFirst`) or uppercase (`upperFirst`). A surrogate pair is treated as one character.

#### `replaceByMap`

```ts
replaceByMap(str: string, map: ReplacementMap): string
```

Replaces the keys of `map` with their values. All replacements happen in one pass, so replaced text is never replaced again. When keys overlap, longer keys win. An empty string, `null`, or `undefined` is returned as is.

```ts
replaceByMap('hello world', { hello: 'hi', world: 'earth' }); // 'hi earth'
replaceByMap('abcab', { ab: 'X', a: 'Y' }); // 'XcX'
```

#### `replacePlaceholders`

```ts
replacePlaceholders(template: string, values: Record<string, unknown> | readonly unknown[], options?: ReplacePlaceholdersOptions): string
```

Replaces the placeholders in `template` (`{{key}}` by default) with values from `values`. Keys are treated as paths as in `get`, and whitespace just inside the delimiters is ignored. Enclosed text containing a line break is not treated as a placeholder.

Placeholders whose value is not found are left as is. A value of `null`, `undefined`, or a function, and an empty key, are handled the same way. Other values are converted with `ensureString`. Properties on the prototype (such as `toString` or class getters) are not used unless `includeInherited` is set.

```ts
replacePlaceholders('Hello, {{ user.name }}! {{greeting}}', {
  user: { name: 'Alice' },
  greeting: 'Welcome',
}); // 'Hello, Alice! Welcome'
replacePlaceholders('{{0}} and {{1}}', ['Alice', 'Bob']); // 'Alice and Bob'
replacePlaceholders('{{toString}}', {}); // '{{toString}}'
```

| Option              | Type                                  | Description                                                                                                                        |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `delimiters?`       | `string \| readonly [string, string]` | The placeholder delimiters. A single string is used for both ends. Defaults to `['{{', '}}']`, which is also used for an empty one |
| `removeUnresolved?` | `boolean`                             | If `true`, removes placeholders whose value is not found                                                                           |
| `flatKeys?`         | `boolean`                             | If `true`, keys are not treated as paths but as property names directly under `values`                                             |
| `includeInherited?` | `boolean`                             | If `true`, properties on the prototype (such as class getters) are also used. Function values are still not used                   |

#### Case conversion

```ts
toCamelCase(data: string): string
toDotCase(data: string): string
toFlatCase(data: string): string
toKebabCase(data: string): string
toLowerCase(data: string): string
toPascalCase(data: string): string
toScreamingSnakeCase(data: string): string
toSentenceCase(data: string): string
toSnakeCase(data: string): string
toTitleCase(data: string): string
toTrainCase(data: string): string
toUpperCase(data: string): string
```

Converts the case of a string. `toLowerCase` and `toUpperCase` convert the whole string without splitting words. The others split the string into words and join them in the form of each case, so any case in the table below except flat case can be used as input. An empty string, `null`, or `undefined` is returned as is.

Words are split by the following rules.

- Any character other than letters and digits (whitespace, `_`, `-`, `.`, `/`, `:`, and so on) is a separator, and leading and trailing separators are removed (`'_private'` becomes `private`)
- Apostrophes (`'` and `’`) are removed without splitting (`"don't"` becomes `dont`)
- A word boundary is placed before an uppercase letter that follows a lowercase letter or a digit (`helloWorld`, `version2Beta`)
- Consecutive uppercase letters (acronyms) form one word, split before the last one when it is followed by a lowercase letter (`XMLParser` becomes `XML` / `Parser`). Acronyms are converted like any other word
- No boundary is placed before a digit that follows a letter (`i18n`, `utf8`, and `base64` are single words)
- Characters without case, such as Japanese, are part of a word

| Function               | Result for `'hello world'` | Result for `'XMLParser'` | Result for `'user/i18n:v2'` |
| ---------------------- | -------------------------- | ------------------------ | --------------------------- |
| `toCamelCase`          | `helloWorld`               | `xmlParser`              | `userI18nV2`                |
| `toPascalCase`         | `HelloWorld`               | `XmlParser`              | `UserI18nV2`                |
| `toSnakeCase`          | `hello_world`              | `xml_parser`             | `user_i18n_v2`              |
| `toScreamingSnakeCase` | `HELLO_WORLD`              | `XML_PARSER`             | `USER_I18N_V2`              |
| `toKebabCase`          | `hello-world`              | `xml-parser`             | `user-i18n-v2`              |
| `toTrainCase`          | `Hello-World`              | `Xml-Parser`             | `User-I18n-V2`              |
| `toDotCase`            | `hello.world`              | `xml.parser`             | `user.i18n.v2`              |
| `toFlatCase`           | `helloworld`               | `xmlparser`              | `useri18nv2`                |
| `toTitleCase`          | `Hello World`              | `Xml Parser`             | `User I18n V2`              |
| `toSentenceCase`       | `Hello world`              | `Xml parser`             | `User i18n v2`              |
| `toLowerCase`          | `hello world`              | `xmlparser`              | `user/i18n:v2`              |
| `toUpperCase`          | `HELLO WORLD`              | `XMLPARSER`              | `USER/I18N:V2`              |

#### Types

| Type                         | Description                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Extractor`                  | The function created by `createExtractor`                                                                              |
| `ExtractorOptions`           | Options for the function created by `createExtractor`                                                                  |
| `ReplacementMap`             | The map for `replaceByMap` and `createReplacerByMap`: a Map, an object whose properties are entries, or an entry array |
| `Replacer`                   | The function created by `createReplacerByMap`                                                                          |
| `ReplacePlaceholdersOptions` | Options for `replacePlaceholders`                                                                                      |

### timer

| Function                                    | Description                                           |
| ------------------------------------------- | ----------------------------------------------------- |
| `debounce(fn, options?)`                    | Creates a function that runs after calls have settled |
| `setLongTimeout(callback, delay, options?)` | Sets a timer longer than the `setTimeout` limit       |
| `sleep(ms, options?)`                       | Returns a `Promise` that resolves after a given time  |
| `throttle(fn, options?)`                    | Creates a function that runs at most once per period  |

#### `debounce`

```ts
debounce<ARGS extends unknown[]>(fn: (...args: ARGS) => void, options?: DebounceOptions): DebounceResult<ARGS>
```

Creates a function that runs `fn` once there have been no calls for `wait` milliseconds since the last call. `fn` receives the arguments of the last call.

```ts
const onInput = debounce((value: string) => search(value), { wait: 300 });
```

| Option       | Type                         | Description                                                                                                 |
| ------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `wait?`      | `number`                     | Milliseconds without calls before running. Defaults to `240`                                                |
| `triggerAt?` | `'end' \| 'start' \| 'both'` | When to run. `'end'`: after calls settle; `'start'`: on the first call; `'both'`: both. Defaults to `'end'` |

The created function has the following methods.

| Method     | Description                           |
| ---------- | ------------------------------------- |
| `cancel()` | Cancels a pending run                 |
| `flush()`  | Runs a pending call immediately       |
| `isIdle()` | Returns `true` when no run is pending |

#### `setLongTimeout`

```ts
setLongTimeout(callback: () => void, delay: number, options?: SetLongTimeoutOptions): () => void
```

Runs `callback` after `delay` milliseconds. `delay` may exceed the `setTimeout` limit (about 24.8 days); in that case the timer is reset based on the remaining time to the target time, so it stays on time even if timers pause while the computer sleeps. As with `setTimeout`, `NaN` and negative values are treated as `0`. With `Infinity`, `callback` never runs. Returns a function that cancels the timer.

| Option    | Type          | Description                    |
| --------- | ------------- | ------------------------------ |
| `signal?` | `AbortSignal` | Cancels the timer when aborted |

#### `sleep`

```ts
sleep(ms: number, options?: SleepOptions): Promise<void>
```

Returns a `Promise` that resolves after `ms` milliseconds. Like `setLongTimeout`, `ms` may exceed the `setTimeout` limit. When aborted, it rejects with `signal.reason` (an `AbortError` if not set).

```ts
await sleep(1000);
```

| Option    | Type          | Description                  |
| --------- | ------------- | ---------------------------- |
| `signal?` | `AbortSignal` | Aborts the wait when aborted |

#### `throttle`

```ts
throttle<ARGS extends unknown[]>(fn: (...args: ARGS) => void, options?: ThrottleOptions): ThrottleResult<ARGS>
```

Creates a function that runs `fn` at most once every `wait` milliseconds. With `'start'` and `'both'`, at least `wait` milliseconds pass between runs. `fn` receives the arguments of the last call. The created function has the same methods as `debounce`.

```ts
const onScroll = throttle(() => updatePosition(), { wait: 100 });
```

| Option       | Type                         | Description                                                                                                    |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `wait?`      | `number`                     | Minimum milliseconds between runs. Defaults to `240`                                                           |
| `triggerAt?` | `'both' \| 'start' \| 'end'` | When to run. `'start'`: at the start of each period; `'end'`: at the end; `'both'`: both. Defaults to `'both'` |

#### Types

| Type                    | Description                        |
| ----------------------- | ---------------------------------- |
| `DebounceOptions`       | Options for `debounce`             |
| `DebounceResult<ARGS>`  | The function created by `debounce` |
| `SetLongTimeoutOptions` | Options for `setLongTimeout`       |
| `SleepOptions`          | Options for `sleep`                |
| `ThrottleOptions`       | Options for `throttle`             |
| `ThrottleResult<ARGS>`  | The function created by `throttle` |

### type

| Function                         | Description                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| `getKind(data)`                  | Returns the kind of a value in more detail than `typeof`                                    |
| `getPriority(data, options?)`    | Returns a priority based on the kind of a value                                             |
| `getRawType(value)`              | Returns the type label from `Object.prototype.toString`                                     |
| `isAsyncIterable(value)`         | Checks whether a value is async iterable                                                    |
| `isBlank(value)`                 | Checks whether a value is `null`, `undefined`, an empty string, or a whitespace-only string |
| `isEmpty(value)`                 | Checks whether a value is `null`, `undefined`, or an empty string                           |
| `isEmptyCollection(value)`       | Checks whether a value is an empty array, `Map`, or `Set`                                   |
| `isInvalidDate(value)`           | Checks whether a value is a `Date` with an invalid date (`Invalid Date`)                    |
| `isIterable(value)`              | Checks whether a value is iterable                                                          |
| `isNonNegativeInteger(value)`    | Checks whether a value is an integer of 0 or more                                           |
| `isNullish(value)`               | Checks whether a value is `null` or `undefined`                                             |
| `isNumberLike(value)`            | Checks whether a value is a number or a decimal number string                               |
| `isPresent(value)`               | Checks whether a value is neither `null` nor `undefined`                                    |
| `isPrimitive(value)`             | Checks whether a value is a primitive                                                       |
| `isRegExp(value)`                | Checks whether a value is a `RegExp`                                                        |
| `isUndefined(value)`             | Checks whether a value is `undefined`                                                       |
| `isValidDate(value)`             | Checks whether a value is a `Date` with a valid date                                        |
| `isValidNumber(value, options?)` | Checks whether a value is a valid number (not `NaN` or `Infinity`)                          |
| `unsafeCast(value)`              | Casts a value to a type, bypassing type checking                                            |

#### `getKind`

```ts
getKind(data: unknown): Kind
```

Returns the kind of a value. Values other than objects return the result of `typeof`. Objects are divided into `null`, `array`, `plainobject` (an object whose prototype is `Object.prototype` or `null`), `date`, `regexp`, `error`, `map`, `set`, `weakmap`, `weakset`, `promise`, `arraybuffer`, and `sharedarraybuffer`. Any other object (class instances, DOM elements, typed arrays, ...) is `instance`.

Built-in objects are checked with `instanceof`, so objects from another realm (such as an iframe) are `instance`.

```ts
getKind([]); // 'array'
getKind({}); // 'plainobject'
getKind(new Date()); // 'date'
getKind(null); // 'null'
getKind(new (class {})()); // 'instance'
```

#### `getPriority`

```ts
getPriority(data: unknown, options?: GetPriorityOptions): number
```

Returns a priority based on the kind of a value from `getKind`, for example to move `null` and `undefined` to the end when sorting. By default `undefined` is `-2`, `null` is `-1`, and everything else is `0`.

```ts
getPriority(undefined); // -2
getPriority([], { priorityMap: { array: 3 } }); // 3
getPriority(null, { priorityMap: { array: 3 } }); // -1 (merged with the default)
```

| Option                 | Type                            | Description                                                                                    |
| ---------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `priorityMap?`         | `Partial<Record<Kind, number>>` | Priorities per kind from `getKind`. Merged with the default `{ undefined: -2, null: -1 }`      |
| `getFallbackPriority?` | `(data: unknown) => number`     | Returns the priority for kinds not in `priorityMap` or the default. Defaults to `0` if omitted |

#### `getRawType`

```ts
getRawType(value: unknown): GetRawTypeReturn
```

Returns the result of `Object.prototype.toString.call(value)`, such as `'[object Array]'`.

#### `isAsyncIterable` / `isIterable`

```ts
isAsyncIterable(value: unknown): value is AsyncIterable<unknown>
isIterable(value: unknown): value is Iterable<unknown>
```

Checks whether a value has a `Symbol.asyncIterator` (`isAsyncIterable`) or `Symbol.iterator` (`isIterable`) method. Strings are iterable.

#### `isBlank` / `isEmpty`

```ts
isBlank(value: unknown): boolean
isEmpty(value: unknown): value is Empty
```

`isEmpty` returns `true` when a value is `null`, `undefined`, or an empty string (the `Empty` type of `@fringeworks/types`). `isBlank` also returns `true` for strings consisting only of whitespace. Whitespace is the same as `\s` in regular expressions (half-width and full-width spaces, tabs, line breaks, ...). Other values return `false`.

```ts
isEmpty(''); // true
isEmpty(' '); // false
isBlank(' \u3000\n'); // true
isBlank(0); // false
```

#### `isEmptyCollection`

```ts
isEmptyCollection(value: unknown): boolean
```

Returns `true` for an empty array, `Map`, or `Set`. Other values, including `null`, `undefined`, and empty objects (`{}`), return `false`. To check both, combine it with `isBlank`, such as `isBlank(value) || isEmptyCollection(value)`.

#### `isInvalidDate` / `isValidDate`

```ts
isInvalidDate(value: unknown): boolean
isValidDate(value: unknown): boolean
```

Checks whether a value is a `Date` with an invalid date (`isInvalidDate`) or a valid date (`isValidDate`). Both return `false` for values that are not `Date`.

#### `isNonNegativeInteger`

```ts
isNonNegativeInteger(value: unknown): boolean
```

Returns `true` when a value is an integer of 0 or more (`0`, `1`, `2`, ...).

#### `isNullish` / `isPresent` / `isUndefined`

```ts
isNullish(value: unknown): value is null | undefined
isPresent<T>(value: T | null | undefined): value is T
isUndefined(value: unknown): value is undefined
```

Checks whether a value is `null` or `undefined` (`isNullish`), neither `null` nor `undefined` (`isPresent`), or `undefined` (`isUndefined`). `isPresent` can also be passed to `Array.prototype.filter` to narrow the type.

#### `isNumberLike`

```ts
isNumberLike(value: unknown): boolean
```

Returns `true` when a value is a finite number or a decimal number string (`'12'`, `'-1.5'`, `'+5'`, `'.5'`, `'5.'`). It is meant to check whether user input is a decimal number, so strings with surrounding whitespace, hexadecimal, exponent notation, and `'Infinity'` return `false`.

#### `isPrimitive`

```ts
isPrimitive(value: unknown): value is Primitive
```

Returns `true` when a value is a primitive (`null`, `undefined`, a boolean, a number, a BigInt, a string, or a symbol).

#### `isRegExp`

```ts
isRegExp(value: unknown): value is RegExp
```

Returns `true` when a value is a `RegExp`. It checks with `instanceof`, so an object pretending to be one with `Symbol.toStringTag` returns `false`, and so does a `RegExp` from another realm (such as an iframe).

#### `isValidNumber`

```ts
isValidNumber(value: unknown, options?: IsValidNumberOptions): boolean
```

Returns `true` when a value is a number other than `NaN`. `Infinity` and `-Infinity` return `false` unless `allowInfinity` is set.

| Option           | Type      | Description                                             |
| ---------------- | --------- | ------------------------------------------------------- |
| `allowInfinity?` | `boolean` | If `true`, `Infinity` and `-Infinity` are valid numbers |

#### `unsafeCast`

```ts
unsafeCast<T>(value: unknown): T
```

Returns a value as the inferred type, bypassing type checking. Use it instead of writing `as any` in many places, so that unsafe casts can be found by searching for `unsafeCast`.

#### Constants

| Constant | Description                               |
| -------- | ----------------------------------------- |
| `Kind`   | The kinds of values returned by `getKind` |

#### Types

| Type                   | Description                           |
| ---------------------- | ------------------------------------- |
| `GetPriorityOptions`   | Options for `getPriority`             |
| `GetRawTypeReturn`     | The return value of `getRawType`      |
| `IsValidNumberOptions` | Options for `isValidNumber`           |
| `Kind`                 | The kind values returned by `getKind` |

## License

MIT
