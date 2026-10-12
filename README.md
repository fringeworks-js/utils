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

### Data Last

Many functions have a `dataLast` property. `dataLast` takes every argument except the data first and returns a function that receives the data. It is useful in pipelines and as a callback for methods such as `Array.prototype.map`.

```ts
import { clampInRange } from '@fringeworks/utils';

clampInRange(150, 0, 100); // 100

const clamp = clampInRange.dataLast(0, 100);
[150, -10, 50].map(clamp); // [100, 0, 50]
```

Functions that have `dataLast` show it alongside their signatures.

---

## API

### array

| Function                                    | Description                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| `clearArray(data)`                          | Removes all elements from an array and returns the removed elements     |
| `compactMap(data, callback, options?)`      | Maps each element and returns an array without unwanted values          |
| `ensureArray(data, options?)`               | Wraps a non-array value in an array                                     |
| `firstDefined(data)`                        | Returns the first element that is not `undefined`                       |
| `firstPresent(data)`                        | Returns the first element that is neither `null` nor `undefined`        |
| `insertAt(data, index, items)`              | Returns a new array with elements inserted at an index                  |
| `insertAtMutable(data, index, items)`       | Inserts elements at an index (mutating)                                 |
| `nestedGroupBy(data, properties, options?)` | Groups elements under keys taken from property values                   |
| `nestedKeyBy(data, properties, options?)`   | Stores one element per key taken from property values                   |
| `pushAll(data, source)`                     | Returns a new array with all elements of another array appended         |
| `pushAllMutable(data, source)`              | Appends all elements of another array (mutating)                        |
| `pushUnique(data, items, options?)`         | Returns a new array with only elements not yet included appended        |
| `pushUniqueMutable(data, items, options?)`  | Appends only elements not yet included (mutating)                       |
| `repeatToLength(data, length)`              | Returns a new array that repeats the array up to a length               |
| `rotateArray(data, options?)`               | Returns a new array with leading elements moved to the end              |
| `rotateArrayMutable(data, options?)`        | Moves leading elements to the end (mutating)                            |
| `sortDependencies(data, options?)`          | Sorts elements by their dependencies (topological sort)                 |
| `swapPairs(pairs)`                          | Swaps the two elements of each pair in an array of pairs                |
| `toArray(data, options?)`                   | Spreads an iterable into an array and wraps any other value in an array |

#### `clearArray`

```ts
clearArray<T>(data: T[] | null | undefined): T[]
```

Removes all elements from the array (mutating) and returns an array of the removed elements. Returns an empty array when `data` is `null` or `undefined`.

#### `compactMap`

```ts
compactMap<V, R = V>(data: V[] | null | undefined, callback: CompactMapIteratee<V, R>, options?: CompactMapOptions): R[] | null | undefined
compactMap.dataLast<V, R = V>(callback: CompactMapIteratee<V, R>, options?: CompactMapOptions): (data: V[] | null | undefined) => R[]
```

Maps each element with `callback` and returns an array without the values specified by `options.exclude`. Returns `undefined` when `data` is `null` or `undefined`.

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
ensureArray.dataLast(options?: EnsureArrayOptions): <T>(data: T | T[] | null | undefined) => T[]
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
firstDefined<V>(data: V[]): V | undefined
firstDefined.dataLast<V>(): (data: V[]) => V | undefined
```

Returns the first element that is not `undefined`. `null` counts as a match.

#### `firstPresent`

```ts
firstPresent<V>(data: V[]): V | undefined
firstPresent.dataLast<V>(): (data: V[]) => V | undefined
```

Returns the first element that is neither `null` nor `undefined`.

#### `insertAt`

```ts
insertAt<T, U = T>(data: T[], index: number, items: U[]): (T | U)[]
insertAt.dataLast<U>(index: number, items: U[]): <T>(data: T[]) => (T | U)[]
```

Returns a new array with the elements of `items` inserted at `index`. `index` is kept between 0 and the array length (a negative index inserts at the start, and an index beyond the length inserts at the end).

```ts
insertAt([1, 2, 3], 1, ['a', 'b']); // [1, 'a', 'b', 2, 3]
```

#### `insertAtMutable`

```ts
insertAtMutable<T, U = T>(data: T[], index: number, items: U[]): (T | U)[]
insertAtMutable.dataLast<U>(index: number, items: U[]): <T>(data: T[]) => (T | U)[]
```

The mutating version of `insertAt`. Inserts into `data` directly and returns the same array.

#### `nestedGroupBy`

```ts
nestedGroupBy<I extends object>(data: I[], properties: keyof I | (keyof I)[], options?: NestedGroupByOptions): NestedGroupByResult<I>
nestedGroupBy.dataLast<I extends object>(properties: keyof I | (keyof I)[], options?: NestedGroupByOptions): (data: I[]) => NestedGroupByResult<I>
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
nestedKeyBy<I extends object>(data: I[], properties: keyof I | (keyof I)[], options?: NestedKeyByOptions): NestedKeyByResult<I>
nestedKeyBy.dataLast<I extends object>(properties: keyof I | (keyof I)[], options?: NestedKeyByOptions): (data: I[]) => NestedKeyByResult<I>
```

Builds the same shape of object as `nestedGroupBy`, but stores a single element under each key. When several elements share the same keys, the first one is kept by default.

| Option          | Type      | Description                                                                                   |
| --------------- | --------- | --------------------------------------------------------------------------------------------- |
| `flat?`         | `boolean` | Same as `nestedGroupBy`                                                                       |
| `keySeparator?` | `string`  | Same as `nestedGroupBy`                                                                       |
| `overwrite?`    | `boolean` | If `true`, a later element with the same keys overwrites the earlier one. Defaults to `false` |

#### `pushAll`

```ts
pushAll<T>(data: T[], source: T[]): T[]
pushAll.dataLast<T>(source: T[]): (data: T[]) => T[]
```

Returns a new array with all elements of `source` appended to `data`. Returns `data` as is when it is `null` or `undefined`, and returns a copy of `data` when `source` is `null` or `undefined`.

#### `pushAllMutable`

```ts
pushAllMutable<T>(data: T[], source: T[]): T[]
pushAllMutable.dataLast<T>(source: T[]): (data: T[]) => T[]
```

The mutating version of `pushAll`. Appends to `data` directly and returns the same array.

#### `pushUnique`

```ts
pushUnique<T>(data: T[] | null | undefined, items: T[] | null | undefined, options?: PushUniqueOptions<T>): T[]
pushUnique.dataLast<T>(items: T[] | null | undefined, options?: PushUniqueOptions<T>): (data: T[] | null | undefined) => T[]
```

Returns a new array with only the elements of `items` that `data` does not contain yet. Duplicates within `items` are not added either. Returns `data` as is when it is `null` or `undefined`.

```ts
pushUnique([1, 2], [2, 3, 3]); // [1, 2, 3]
```

| Option        | Type                      | Description                                                                                                                       |
| ------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `threshold?`  | `number`                  | Uses a `Set` for the check when the total number of elements is at least this value. Defaults to `100`                            |
| `comparator?` | `(a: T, b: T) => boolean` | How to decide whether two elements are the same. When given, a linear search is used regardless of `threshold`. Defaults to `===` |

#### `pushUniqueMutable`

```ts
pushUniqueMutable<T>(data: T[] | null | undefined, items: T[] | null | undefined, options?: PushUniqueMutableOptions<T>): T[]
pushUniqueMutable.dataLast<T>(items: T[] | null | undefined, options?: PushUniqueMutableOptions<T>): (data: T[] | null | undefined) => T[]
```

The mutating version of `pushUnique`. Appends to `data` directly and returns the same array. The options are the same as `pushUnique`.

#### `repeatToLength`

```ts
repeatToLength<T>(data: T[], length: number): T[]
repeatToLength.dataLast(length: number): <T>(data: T[]) => T[]
```

Returns a new array of length `length` made by repeating the elements of `data`. When `length` is negative, the reversed array is repeated. Returns an empty array when `data` is empty.

```ts
repeatToLength([1, 2, 3], 7); // [1, 2, 3, 1, 2, 3, 1]
repeatToLength([1, 2, 3], -5); // [3, 2, 1, 3, 2]
```

#### `rotateArray`

```ts
rotateArray<I>(data: I[], options?: RotateArrayOptions): I[]
rotateArray.dataLast(options?: RotateArrayOptions): <I>(data: I[]) => I[]
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
rotateArrayMutable.dataLast(options?: RotateArrayMutableOptions): <I>(data: I[]) => I[]
```

The mutating version of `rotateArray`. Modifies `data` directly and returns the same array. The options are the same as `rotateArray`.

#### `sortDependencies`

```ts
sortDependencies<I>(data: I[], options?: SortDependenciesOptions<I>): I[]
sortDependencies.dataLast<I>(options?: SortDependenciesOptions<I>): (data: I[]) => I[]
```

Returns a new array sorted so that each element comes after the elements it depends on (topological sort). Elements with the same ID are merged into one. Throws an `Error` (`Cyclic dependency: <ID>`) when the dependencies form a cycle.

By default, each element is treated as an `[ID, array of dependency elements]` tuple. The ID of a dependency is taken from the dependency element in the same way as `id`. Specify `dependencyId` when dependencies are held as IDs.

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
  { id: 'id', dependencies: 'deps', dependencyId: (dep) => dep },
);
// [{ id: 'b', ... }, { id: 'a', ... }]
```

| Option           | Type                                                     | Description                                                                                                                  |
| ---------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `id?`            | `string \| number \| SortDependenciesGetId<I>`           | The property holding an element's ID, or a function returning it. Defaults to `0`                                            |
| `dependencies?`  | `string \| number \| SortDependenciesGetDependencies<I>` | The property holding an element's dependencies, or a function returning them. Defaults to `1`                                |
| `dependencyId?`  | `string \| number \| SortDependenciesGetId<I>`           | The property holding a dependency's ID, or a function returning it. Defaults to the same as `id`                             |
| `tree?`          | `boolean`                                                | If `true`, follows dependencies recursively and also sorts dependency elements that are not in `data` (for tree-shaped data) |
| `ignoreMissing?` | `boolean`                                                | If `true`, ignores dependencies not found in `data`. Otherwise throws an `Error` (`No substance: <ID>`). Defaults to `false` |
| `reverse?`       | `boolean`                                                | If `true`, reverses the order (dependents first). Defaults to `false`                                                        |

#### `swapPairs`

```ts
swapPairs<const T extends [unknown, unknown][]>(pairs: T): SwapPairsResult<T>
swapPairs.dataLast(): <const T extends [unknown, unknown][]>(pairs: T) => SwapPairsResult<T>
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
toArray.dataLast(options?: ToArrayOptions): <T>(data: unknown) => T[]
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
ensureBoolean.dataLast(options?: EnsureBooleanOptions): (data: unknown) => boolean
```

Converts a value to a boolean. Booleans are returned as is, and strings become `true` only when they are in `trueValues` (by default `'true'`, `'True'`, and `'TRUE'`). Any other value is converted with `!!data`.

```ts
ensureBoolean('true'); // true
ensureBoolean('yes'); // false
ensureBoolean('YES', { trueValues: ['yes'], ignoreCase: true }); // true
ensureBoolean(1); // true
```

| Option        | Type       | Description                                                       |
| ------------- | ---------- | ----------------------------------------------------------------- |
| `trueValues?` | `string[]` | Strings treated as `true`. Defaults to `['true', 'True', 'TRUE']` |
| `ignoreCase?` | `boolean`  | If `true`, compares strings case-insensitively                    |

#### Types

| Type                   | Description                 |
| ---------------------- | --------------------------- |
| `EnsureBooleanOptions` | Options for `ensureBoolean` |

### compare

| Function                                | Description                                                        |
| --------------------------------------- | ------------------------------------------------------------------ |
| `compare(left, operator, right)`        | Compares two values with an operator                               |
| `isEqual(value1, value2, options?)`     | Checks whether two values are equal using a chosen comparison mode |
| `isEqualWith(value, other, customizer)` | Compares two values recursively with a custom comparison function  |

#### `compare`

```ts
compare<O extends ComparisonOperator>(left: CompareLeft[O], operator: O, right: CompareRight[O]): boolean
compare.dataLast<O extends ComparisonOperator>(operator: O, right: CompareRight[O]): (left: CompareLeft[O]) => boolean
```

Compares `left` and `right` with `operator`. Throws an `Error` for an unsupported operator.

```ts
compare(5, '>', 3); // true
compare(5, 'between', [1, 10]); // true (inclusive)
compare('a', 'in', ['a', 'b']); // true
compare('hello', 'like', 'ell'); // true (substring match)
```

| Operator                        | Meaning                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| `'==='` / `'!=='`               | Strict equality / inequality                                 |
| `'=='` / `'!='`                 | Loose equality / inequality                                  |
| `'>'` / `'<'` / `'>='` / `'<='` | Relational comparison                                        |
| `'between'`                     | Whether `left` is within `right` as `[min, max]` (inclusive) |
| `'in'`                          | Whether the array `right` contains `left`                    |
| `'like'`                        | Whether the string `left` contains `right`                   |

#### `isEqual`

```ts
isEqual(value1: unknown, value2: unknown, options?: IsEqualOptions): boolean
isEqual.dataLast(value2: unknown, options?: IsEqualOptions): (value1: unknown) => boolean
```

Checks whether two values are equal. The comparison is chosen with `mode`.

```ts
isEqual(1, '1'); // false
isEqual(1, '1', { mode: 'loose' }); // true
isEqual({ a: [1] }, { a: [1] }, { mode: 'deep' }); // true
```

| Option        | Type                                                                                  | Description                                                                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode?`       | `CompareMode`                                                                         | The comparison. `'strict'`: `===`; `'loose'`: `==`; `'deep'`: whether the structures are the same. Defaults to `'strict'`                                                                                       |
| `customizer?` | `(value1, value2, indexOrKey?, value1Parent?, value2Parent?) => boolean \| undefined` | A custom comparison function. With `'deep'`, it is used as the `customizer` of `isEqualWith`. Otherwise it receives only `value1` and `value2`, and returning a non-boolean falls back to the normal comparison |

#### `isEqualWith`

```ts
isEqualWith(value: unknown, other: unknown, customizer: (value1, value2, indexOrKey?, value1Parent?, value2Parent?) => boolean | undefined): boolean
isEqualWith.dataLast(other: unknown, customizer: ...): (value: unknown) => boolean
```

Compares two values recursively. `customizer` is called at each step; a returned `boolean` is used as the result, and `undefined` falls back to the default comparison.

The default comparison compares arrays element by element, plain objects by their own enumerable properties, `Date` by time, `Map` by keys and values, and `Set` by whether they hold the same elements (SameValueZero).

```ts
// Compare strings case-insensitively
isEqualWith({ a: 'Hello' }, { a: 'hello' }, (v1, v2) =>
  typeof v1 === 'string' && typeof v2 === 'string'
    ? v1.toLowerCase() === v2.toLowerCase()
    : undefined,
); // true
```

#### Constants

| Constant             | Description                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `ComparisonOperator` | The operators for `compare`: `EQ`, `NE`, `GT`, `LT`, `GE`, `LE`, `LOOSE_EQ`, `LOOSE_NE`, `BETWEEN`, `IN`, `LIKE` |
| `CompareMode`        | The comparison modes for `isEqual`: `strict`, `loose`, `deep`                                                    |

#### Types

| Type                 | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| `ComparisonOperator` | The operator values for `compare`                          |
| `CompareLeft`        | The type of the left-hand value of `compare` per operator  |
| `CompareRight`       | The type of the right-hand value of `compare` per operator |
| `CompareMode`        | The comparison mode values for `isEqual`                   |
| `IsEqualOptions`     | Options for `isEqual`                                      |

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

Creates a `Date` from UTC date and time values. As with `Date.UTC`, `month` is 0 to 11. Omitted arguments default to `0` for `month`, `1` for `date`, and `0` for the rest.

#### `lerpDate`

```ts
lerpDate(value: Date, ratio: number, options?: LerpDateOptions): Date
lerpDate.dataLast(ratio: number, options?: LerpDateOptions): (value: Date) => Date
```

Returns the date linearly interpolated by `ratio` between the base date (`baseValue`) and the target date (`value`). A `ratio` of `0` gives the base date and `1` gives the target date.

| Option       | Type   | Description                                          |
| ------------ | ------ | ---------------------------------------------------- |
| `baseValue?` | `Date` | The base date. Defaults to the current date and time |

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
alwaysFalse(...args: unknown[]): boolean
alwaysTrue(...args: unknown[]): boolean
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
ensureMap<K, V>(data: EnsureMapSource<K, V> | null | undefined, options?: EnsureMapOptions): Map<K, V>
ensureMap.dataLast(options?: EnsureMapOptions): <K, V>(data: EnsureMapSource<K, V> | null | undefined) => Map<K, V>
```

Converts a value to a `Map`. A `Map` is returned as a copy, and an object's properties become entries. An array is treated as `[key, value]` pairs when its first element is a two-element array; otherwise its indexes become the keys. `null`, `undefined`, and other values become an empty `Map`.

```ts
ensureMap({ a: 1 }); // Map { 'a' => 1 }
ensureMap([['a', 1]]); // Map { 'a' => 1 }
ensureMap(['x', 'y']); // Map { 0 => 'x', 1 => 'y' }
```

| Option | Type      | Description                                                                                   |
| ------ | --------- | --------------------------------------------------------------------------------------------- |
| `raw?` | `boolean` | If `true`, returns the same `Map` without copying when `data` is a `Map`. Defaults to `false` |

#### Types

| Type                    | Description                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| `EnsureMapOptions`      | Options for `ensureMap`                                                           |
| `EnsureMapSource<K, V>` | The values `ensureMap` accepts (`Map`, object, array of entries, array of values) |

### measure

| Function                           | Description                                                          |
| ---------------------------------- | -------------------------------------------------------------------- |
| `comparePerformance(options)`      | Measures and compares the execution time of several functions        |
| `comparePerformanceAsync(options)` | Measures and compares the execution time of several async functions  |
| `measure(fn, options?)`            | Runs a function a number of times and measures the time taken        |
| `measureAsync(fn, options?)`       | Runs an async function a number of times and measures the time taken |

#### `comparePerformance`

```ts
comparePerformance<A extends unknown[] = unknown[], R = unknown>(options: ComparePerformanceOptions<A>): ComparePerformanceResult<A, R>
```

Measures and compares the execution time of the functions in `targets`. Each round runs every function `iterations` times and records the time, and this is repeated for `rounds` rounds. The order of the functions changes every round to reduce bias from running order.

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

| Option        | Type                               | Description                                                                      |
| ------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| `targets`     | `ComparePerformanceTarget<A, R>[]` | The functions to measure, as `{ id, fn }`                                        |
| `iterations?` | `number`                           | How many times each function runs per round. Defaults to `10`                    |
| `rounds?`     | `number`                           | How many rounds to measure. Defaults to `10`                                     |
| `args?`       | `A`                                | The arguments passed to the functions                                            |
| `getArgs?`    | `() => A`                          | A function that creates the arguments for each run. Takes precedence over `args` |
| `warmUp?`     | `boolean`                          | If `true`, runs each function once before measuring                              |
| `id?`         | `string`                           | An ID included in the result as is. Defaults to the start time in milliseconds   |

| Property       | Type                            | Description                                       |
| -------------- | ------------------------------- | ------------------------------------------------- | -------------------------------------- |
| `average`      | `ElapsedTimes`                  | The average time per round for each function (ms) |
| `totalAverage` | `number`                        | The average time over all functions (ms)          |
| `order`        | `ComparePerformanceTarget<A>[]` | The targets sorted from the shortest average time |
| `results`      | `ElapsedTimes[]`                | The time of each function in each round           |
| `returnValues` | `{ [id: string]: R              | undefined }`                                      | The last return value of each function |
| `start`        | `Date`                          | When the measurement started                      |
| `end`          | `Date`                          | When the measurement ended                        |
| `id?`          | `string`                        | The measurement ID                                |

#### `comparePerformanceAsync`

```ts
comparePerformanceAsync<A extends unknown[] = unknown[], R = unknown>(options: ComparePerformanceAsyncOptions<A>): Promise<ComparePerformanceAsyncResult<A, R>>
```

The async-function version of `comparePerformance`. The functions are measured one at a time. The options and the result are the same as `comparePerformance`.

#### `measure`

```ts
measure<A extends unknown[] = unknown[], R = unknown>(fn: (...args: A) => R, options?: MeasureOptions<A>): MeasureResult<R>
```

Runs `fn` `iterations` times and returns the total execution time (ms) and the last return value. The time is measured with `performance.now()`.

```ts
const { time, returnValue } = measure(() => heavyCalc(), { iterations: 100 });
```

| Option        | Type      | Description                                                                      |
| ------------- | --------- | -------------------------------------------------------------------------------- |
| `iterations?` | `number`  | How many times to run. Defaults to `10`                                          |
| `args?`       | `A`       | The arguments passed to the function                                             |
| `getArgs?`    | `() => A` | A function that creates the arguments for each run. Takes precedence over `args` |

| Property      | Type             | Description                      |
| ------------- | ---------------- | -------------------------------- |
| `time`        | `number`         | The total execution time (ms)    |
| `returnValue` | `R \| undefined` | The return value of the last run |

#### `measureAsync`

```ts
measureAsync<A extends unknown[] = unknown[], R = unknown>(fn: (...args: A) => Promise<R>, options?: MeasureAsyncOptions<A>): Promise<MeasureAsyncResult<R>>
```

The async-function version of `measure`. Runs `fn` one call at a time, waiting for each to finish. The options and the result are the same as `measure`.

#### Types

| Type                                   | Description                                        |
| -------------------------------------- | -------------------------------------------------- |
| `ComparePerformanceOptions<A, R>`      | Options for `comparePerformance`                   |
| `ComparePerformanceResult<A, R>`       | The return value of `comparePerformance`           |
| `ComparePerformanceTarget<A, R>`       | A function to measure `{ id, fn }`                 |
| `ComparePerformanceAsyncOptions<A, R>` | Same as `ComparePerformanceOptions<A, Promise<R>>` |
| `ComparePerformanceAsyncResult<A, R>`  | Same as `ComparePerformanceResult<A, R>`           |
| `ElapsedTimes`                         | Times per function ID `{ [id: string]: number }`   |
| `MeasureOptions<A>`                    | Options for `measure`                              |
| `MeasureResult<R>`                     | The return value of `measure`                      |
| `MeasureAsyncOptions<A>`               | Same as `MeasureOptions<A>`                        |
| `MeasureAsyncResult<R>`                | Same as `MeasureResult<R>`                         |

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

#### `clampInRange`

```ts
clampInRange(value: number, min: number, max: number): number
clampInRange.dataLast(min: number, max: number): (value: number) => number
```

Returns `min` when `value` is below `min`, `max` when it is above `max`, and `value` otherwise.

```ts
clampInRange(150, 0, 100); // 100
clampInRange(-10, 0, 100); // 0
```

#### `ensureNumber`

```ts
ensureNumber(data: unknown): number
ensureNumber.dataLast(): (data: unknown) => number
```

Converts a value to a number. Numbers are returned as is (`NaN` becomes `0`), and strings are converted with `Number()`. Strings that cannot be converted, `null`, `undefined`, booleans, objects, and so on become `0`.

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

Returns `min` and `max` as an array ordered from smaller to larger. Defaults are used for `null` and `undefined`.

```ts
getValidMinMax(10, 1); // [1, 10]
getValidMinMax(null, 5); // [-Infinity, 5]
```

| Option        | Type     | Description                                                   |
| ------------- | -------- | ------------------------------------------------------------- |
| `defaultMin?` | `number` | The value used when `min` is missing. Defaults to `-Infinity` |
| `defaultMax?` | `number` | The value used when `max` is missing. Defaults to `Infinity`  |

#### `getValidNumber`

```ts
getValidNumber(value: number | null | undefined, options?: GetValidNumberOptions): number
getValidNumber.dataLast(options?: GetValidNumberOptions): (value: number | null | undefined) => number
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
isStrictlyWithinRange.dataLast(min: number, max: number): (value: number) => boolean
```

Returns `true` when `value` is greater than `min` and less than `max`.

#### `isWithinRange`

```ts
isWithinRange(value: number, min: number, max: number): boolean
isWithinRange.dataLast(min: number, max: number): (value: number) => boolean
```

Returns `true` when `value` is at least `min` and at most `max`.

#### `keepInRange`

```ts
keepInRange(value: number, min: number, max: number, options?: KeepInRangeOptions): number
keepInRange.dataLast(min: number, max: number, options?: KeepInRangeOptions): (value: number) => number
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
lerpNumber.dataLast(ratio: number, options?: LerpNumberOptions): (value: number) => number
```

Returns the value linearly interpolated by `ratio` between the base value (`baseValue`) and the target value (`value`).

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
limitPositiveNumber.dataLast(options?: LimitPositiveNumberOptions): (value: number | null | undefined) => number | null | undefined
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
loopInRange.dataLast(min: number, max: number): (value: number) => number
```

Brings an out-of-range `value` back into the range by treating the range as a loop. Values within the range (including `min` and `max`) are returned as is.

```ts
loopInRange(12, 0, 10); // 2
loopInRange(-1, 0, 10); // 9
```

#### `pingpongInRange`

```ts
pingpongInRange(value: number, min: number, max: number): number
pingpongInRange.dataLast(min: number, max: number): (value: number) => number
```

Brings an out-of-range `value` back into the range by bouncing back and forth between the ends.

```ts
pingpongInRange(12, 0, 10); // 8
pingpongInRange(-2, 0, 10); // 2
```

#### `replaceOutOfRange`

```ts
replaceOutOfRange(value: number, min: number, max: number, replacement: number): number
replaceOutOfRange.dataLast(min: number, max: number, replacement: number): (value: number) => number
```

Returns `value` when it is within the range (at least `min` and at most `max`), and `replacement` otherwise.

#### `roundToStep`

```ts
roundToStep(data: number, step: number): number
roundToStep.dataLast(step: number): (data: number) => number
```

Rounds `data` to the nearest multiple of `step`. The calculation uses floating-point numbers, so a fractional `step` may produce rounding errors.

```ts
roundToStep(7, 5); // 5
roundToStep(8, 5); // 10
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

| Function                                               | Description                                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `assignDefined(target, values, options?)`              | Returns a new object with only the values that are not `undefined` assigned      |
| `assignDefinedMutable(target, values, options?)`       | Assigns only the values that are not `undefined` (mutating)                      |
| `cloneDeep(value)`                                     | Makes a deep copy of a value                                                     |
| `cloneShallow(value)`                                  | Makes a shallow copy of a value                                                  |
| `countKeys(obj)`                                       | Returns the number of enumerable properties of an object                         |
| `distribute(data, rules, options?)`                    | Splits properties into several objects according to rules                        |
| `exactKeys<T>()(keys)`                                 | Checks at compile time that an array lists exactly the keys of a type            |
| `exactKeysFromRecord<T>(keys)`                         | Creates an array of keys from an object that has every key of a type             |
| `fillDefaults(target, defaultValues, options?)`        | Returns a new object with missing properties filled with defaults                |
| `fillDefaultsMutable(target, defaultValues, options?)` | Fills missing properties with defaults (mutating)                                |
| `filterByKeys(target, condition, options?)`            | Keeps only the properties whose keys match a condition                           |
| `filterByValues(target, condition, options?)`          | Keeps only the values that match a condition                                     |
| `flattenObject(data, options?)`                        | Flattens a nested object into a single level                                     |
| `forEachValue(target, callback, options?)`             | Runs a callback for the value of each property                                   |
| `get(data, path)`                                      | Returns the value of the property at a path                                      |
| `hasOwn(data, key)`                                    | Checks whether an object has an own property (equivalent to `Object.hasOwn`)     |
| `maybeHasOwn(data, key)`                               | Checks whether an object has an own property (safe for `null`)                   |
| `omit(data, keys)`                                     | Returns a new object without the given keys                                      |
| `overrideInstance(instance, overrides)`                | Creates a proxy that overrides an instance's properties                          |
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
assignDefined<T extends LooseRecord, V extends LooseRecord>(target: T, values: V, options?: AssignDefinedOptions): AssignDefinedResult<T, V>
assignDefined.dataLast<V extends LooseRecord>(values: V, options?: AssignDefinedOptions): <T extends LooseRecord>(target: T) => AssignDefinedResult<T, V>
```

Returns a new object with only the properties of `values` that are not `undefined` assigned to `target`. Returns `target` as is when `target` or `values` is `null` or `undefined`.

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
assignDefinedMutable<T extends LooseRecord, V extends LooseRecord>(target: T, values: V, options?: AssignDefinedMutableOptions): AssignDefinedResult<T, V>
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

#### `distribute`

```ts
distribute<T extends LooseRecord, DR extends DistributeRules<T>>(data: T, rules: DR, options?: DistributeOptions): DistributeResult<T, DR>
distribute.dataLast<T extends LooseRecord, DR extends DistributeRules<T>>(rules: DR, options?: DistributeOptions): (data: T) => DistributeResult<T, DR>
```

Splits the top-level properties of `data` into several objects according to `rules`. `rules` maps group names to arrays of property names; a group set to `null` receives the properties that went into no other group. The result type has the specified properties for each group.

```ts
const { identity, rest } = distribute(user, {
  identity: ['id', 'name'],
  rest: null,
});
// identity: { id, name }
// rest: the other properties of user
```

| Option              | Type      | Description                                     |
| ------------------- | --------- | ----------------------------------------------- |
| `includeInherited?` | `boolean` | If `true`, inherited properties are split too   |
| `cloneValue?`       | `boolean` | If `true`, values are cloned before being split |

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
fillDefaults<T extends LooseRecord, V extends LooseRecord>(target: T, defaultValues: V, options?: FillDefaultsOptions): FillDefaultsResult<T, V>
fillDefaults.dataLast<V extends LooseRecord>(defaultValues: V, options?: FillDefaultsOptions): <T extends LooseRecord>(target: T) => FillDefaultsResult<T, V>
```

Returns a new object with the values of `defaultValues` set on the properties of `target` whose values are `undefined`. Values in `defaultValues` that are `undefined` are not set. Returns `target` as is when `target` or `defaultValues` is `null` or `undefined`.

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
fillDefaultsMutable<T extends LooseRecord, V extends LooseRecord>(target: T, defaultValues: V, options?: FillDefaultsMutableOptions): FillDefaultsResult<T, V>
```

The mutating version of `fillDefaults`. Sets the values on `target` directly and returns the same object. The options are the same as `fillDefaults`.

#### `filterByKeys`

```ts
filterByKeys<T = unknown>(target: T, condition: PropertyKey, options?: FilterByKeysOptions): T | null
filterByKeys.dataLast(condition: PropertyKey, options?: FilterByKeysOptions): <T = unknown>(target: T) => T | null
```

Walks objects and arrays recursively and returns a new value that keeps only the properties whose keys match the condition. When `condition` is a string, a key matches if it contains `condition` (substring match); otherwise the key must equal `condition`. A matching property is kept with its whole value, and a non-matching property is searched further. Returns `null` when nothing matches. Arrays keep their original indexes, leaving holes where nothing matched.

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
filterByValues<T = unknown>(target: T, condition: unknown, options?: FilterByValuesOptions): T | null
filterByValues.dataLast(condition: unknown, options?: FilterByValuesOptions): <T = unknown>(target: T) => T | null
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
flattenObject(data: LooseRecord, options?: FlattenObjectOptions): LooseRecord
flattenObject.dataLast(options?: FlattenObjectOptions): (data: LooseRecord) => LooseRecord
```

Flattens nested plain objects and arrays into a single-level object whose keys are the joined paths.

```ts
flattenObject({ a: { b: [1, { c: 2 }] } }); // { 'a.b.0': 1, 'a.b.1.c': 2 }
flattenObject({ a: { b: [1] } }, { keepArrays: true }); // { 'a.b': [1] }
```

| Option          | Type      | Description                                                                                                        |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------ |
| `keySeparator?` | `string`  | The separator used to join paths. Defaults to `'.'`                                                                |
| `keepArrays?`   | `boolean` | If `true`, arrays are kept as values instead of being flattened. Defaults to `false`                               |
| `leafKeysOnly?` | `boolean` | If `true`, uses only the last key instead of the joined path (same keys overwrite each other). Defaults to `false` |

#### `forEachValue`

```ts
forEachValue<T extends LooseRecord>(target: T, callback: (value: unknown, key: PropertyKey, obj: T) => void | boolean, options?: ForEachValueOptions): boolean
forEachValue.dataLast<T extends LooseRecord>(callback: (value: unknown, key: PropertyKey, obj: T) => void | boolean, options?: ForEachValueOptions): (target: T) => boolean
```

Runs `callback` for each own enumerable property of an object. Stops when `callback` returns `false`. Returns `true` when every property was processed and `false` when it stopped early.

| Option              | Type      | Description                                  |
| ------------------- | --------- | -------------------------------------------- |
| `includeInherited?` | `boolean` | If `true`, inherited properties are included |

#### `get`

```ts
get<T, R = unknown>(data: T, path: PropertyKey | PropertyKey[]): R | undefined
get.dataLast<T, R = unknown>(path: PropertyKey | PropertyKey[]): (data: T) => R | undefined
```

Returns the value of the property at a path. The path is a string such as `'a.b[0]'` or `'a.b.0'`, or an array of keys. Returns `undefined` when a property along the path is missing or `data` is `null` or `undefined`.

```ts
get({ a: { b: [{ c: 1 }] } }, 'a.b[0].c'); // 1
get({ a: { b: [{ c: 1 }] } }, ['a', 'b', 0, 'c']); // 1
```

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
omit<T, R = unknown>(data: T, keys: PropertyKey | readonly PropertyKey[]): R | undefined
omit.dataLast<T, R = unknown>(keys: PropertyKey | readonly PropertyKey[]): (data: T) => R | undefined
```

Returns a new object without the properties in `keys`. Keys are not treated as paths (use `unset` to remove nested properties). Returns `undefined` when `data` is `null` or `undefined`.

```ts
omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { b: 2 }
```

#### `overrideInstance`

```ts
overrideInstance<I extends object, O extends Record<PropertyKey, (target: I, prop: string | symbol, receiver: any) => any>>(instance: I, overrides?: O): I & { [K in keyof O]: ReturnType<O[K]> }
```

Creates a proxy that overrides properties of `instance`, for replacing methods or properties of an instance when subclassing is not possible. `overrides` maps property names to functions that return the value read for that property.

```ts
const logger = overrideInstance(console, {
  log:
    (target) =>
    (...args: unknown[]) =>
      target.log('[app]', ...args),
});
logger.log('hello'); // [app] hello
```

#### `set`

```ts
set<T extends object>(data: T, path: string | PropertyKey[], value: unknown): T
set.dataLast(path: string | PropertyKey[], value: unknown): <T extends object>(data: T) => T
```

Returns a new object with `value` set at the path. Objects and arrays along the path are copied, and missing ones are created (an array when the next key is a number). Paths are specified the same way as `get`.

```ts
set({ a: { b: 1 } }, 'a.c', 2); // { a: { b: 1, c: 2 } }
set({}, 'a[0].b', 1); // { a: [{ b: 1 }] }
```

#### `setMutable`

```ts
setMutable<T extends object>(data: T, path: string | PropertyKey[], value: unknown): T
setMutable.dataLast<T extends object>(path: string | PropertyKey[], value: unknown): (data: T) => T
```

The mutating version of `set`. Modifies `data` directly and returns the same object.

#### `stableStringify`

```ts
stableStringify(value: unknown, space?: string | number): string
```

Sorts object keys recursively in ascending order and converts the value to a JSON string. Objects with the same content produce the same string regardless of key order, which makes it useful for cache keys. Values with `toJSON` (such as `Date`) use the result of `toJSON`, as `JSON.stringify` does. `space` is the same as the `space` of `JSON.stringify`.

```ts
stableStringify({ b: 2, a: { d: 1, c: 2 } }); // '{"a":{"c":2,"d":1},"b":2}'
```

#### `transformObject`

```ts
transformObject<T extends LooseRecord = LooseRecord, S extends LooseRecord = LooseRecord>(source: S, rules: (string | TransformObjectRule<S, T>)[], options?: TransformObjectOptions): T
transformObject.dataLast<T extends LooseRecord = LooseRecord, S extends LooseRecord = LooseRecord>(rules: (string | TransformObjectRule<S, T>)[], options?: TransformObjectOptions): (source: S) => T
```

Builds a new object by taking values from `source` according to `rules`. A string rule takes and sets the value at the same path. Values that are `undefined` are not set. With `removeFromSource`, `source` is modified directly.

```ts
transformObject({ firstName: 'Alice', age: 30 }, [
  'age',
  { from: 'firstName', to: 'user.name' },
  { from: (source) => source.age * 2, to: 'doubleAge' },
]);
// { age: 30, user: { name: 'Alice' }, doubleAge: 60 }
```

| Rule property       | Type                                           | Description                                                                                         |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `from`              | `string \| ((source: S) => unknown)`           | The path to take from, or a function returning the value                                            |
| `to?`               | `string \| ((target: T, value: unknown) => T)` | The path to set, or a function returning the object with the value set. Defaults to the `from` path |
| `removeFromSource?` | `boolean`                                      | If `true`, removes the property from `source` after taking it. Follows the option when omitted      |

| Option              | Type      | Description                                                                          |
| ------------------- | --------- | ------------------------------------------------------------------------------------ |
| `removeFromSource?` | `boolean` | If `true`, removes properties taken by path rules from `source`. Defaults to `false` |

#### `unset`

```ts
unset<T extends LooseRecord>(data: T, path: string | PropertyKey[]): T
unset.dataLast<T extends LooseRecord>(path: string | PropertyKey[]): (data: T) => T
```

Returns a new object without the property at the path. Removing an array element shifts the following elements. Returns `data` as is when the path does not exist. Paths are specified the same way as `get`.

```ts
unset({ a: { b: 1, c: 2 } }, 'a.b'); // { a: { c: 2 } }
unset({ a: [1, 2, 3] }, 'a[1]'); // { a: [1, 3] }
```

#### `unsetMutable`

```ts
unsetMutable<T extends LooseRecord>(data: T, path: string | PropertyKey[]): T
unsetMutable.dataLast<T extends LooseRecord>(path: string | PropertyKey[]): (data: T) => T
```

The mutating version of `unset`. Modifies `data` directly and returns the same object.

#### `update`

```ts
update<T extends LooseRecord>(object: T, values: Partial<T>, options?: UpdateOptions): T
update.dataLast(values: LooseRecord, options?: UpdateOptions): <T extends LooseRecord>(object: T) => T
```

Returns a new object with only the properties of `values` that differ from `object` updated. When nothing changes, `object` itself is returned, so a reference comparison tells whether anything changed. How values are compared is set with the options of `isEqual`.

```ts
const state = { a: 1, b: 2 };
update(state, { a: 9 }); // { a: 9, b: 2 } (a new object)
update(state, { a: 1 }) === state; // true
update({ a: { x: 1 } }, { a: { x: 1 } }, { mode: 'deep' }); // the original object
```

| Option        | Type          | Description                                |
| ------------- | ------------- | ------------------------------------------ |
| `mode?`       | `CompareMode` | How values are compared. Same as `isEqual` |
| `customizer?` | `function`    | A custom comparison. Same as `isEqual`     |

#### `updateMutable`

```ts
updateMutable<T extends LooseRecord>(object: T | null | undefined, values: Partial<T> | null | undefined, options?: UpdateMutableOptions): Partial<T>
updateMutable.dataLast<T extends LooseRecord>(values: Partial<T> | null | undefined, options?: UpdateMutableOptions): (object: T | null | undefined) => Partial<T>
```

The mutating version of `update`. Updates `object` directly and returns an object with the previous values of the updated properties. The options are the same as `update`.

```ts
const state = { a: 1, b: 2 };
updateMutable(state, { a: 9, b: 2 }); // { a: 1 } (state becomes { a: 9, b: 2 })
```

#### Types

| Type                          | Description                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AssignDefinedMutableOptions` | Options for `assignDefinedMutable`                                                                                                                                                               |
| `AssignDefinedOptions`        | Same as `AssignDefinedMutableOptions`                                                                                                                                                            |
| `AssignDefinedResult<T, V>`   | The return type of `assignDefined` and `assignDefinedMutable`. Keys whose values in `values` may be skipped as `undefined` (also `null` with `skipNull`) keep the type of the value in `target`  |
| `DistributeOptions`           | Options for `distribute`                                                                                                                                                                         |
| `DistributeRules<T>`          | The rules of `distribute` `{ [group]: array of property names \| null }`                                                                                                                         |
| `DistributePropertyList<T>`   | An array of property names in the rules of `distribute`                                                                                                                                          |
| `DistributeResult<T, R>`      | The return value of `distribute`                                                                                                                                                                 |
| `FillDefaultsMutableOptions`  | Options for `fillDefaultsMutable`                                                                                                                                                                |
| `FillDefaultsOptions`         | Same as `FillDefaultsMutableOptions`                                                                                                                                                             |
| `FillDefaultsResult<T, V>`    | The return type of `fillDefaults` and `fillDefaultsMutable`. Keys whose values in `target` are `undefined` (also `null` with `overwriteNull`) get the type of the value in `defaultValues` added |
| `FilterByKeysOptions`         | Options for `filterByKeys`                                                                                                                                                                       |
| `FilterByValuesOptions`       | Options for `filterByValues`                                                                                                                                                                     |
| `FlattenObjectOptions`        | Options for `flattenObject`                                                                                                                                                                      |
| `ForEachValueOptions`         | Options for `forEachValue`                                                                                                                                                                       |
| `TransformObjectOptions`      | Options for `transformObject`                                                                                                                                                                    |
| `TransformObjectRule<S, T>`   | A rule of `transformObject`                                                                                                                                                                      |
| `UpdateMutableOptions`        | Options for `updateMutable` (same as `IsEqualOptions`)                                                                                                                                           |
| `UpdateOptions`               | Same as `UpdateMutableOptions`                                                                                                                                                                   |

### string

| Function                                            | Description                                                     |
| --------------------------------------------------- | --------------------------------------------------------------- |
| `createExtractor(delimiters?)`                      | Creates a function that extracts text enclosed in delimiters    |
| `ensureString(data)`                                | Converts a value to a string                                    |
| `escapeRegExp(target)`                              | Escapes special regular expression characters                   |
| `isSurroundedBy(str, prefix, suffix?)`              | Checks whether a string is enclosed by given strings            |
| `lowerFirst(str)`                                   | Converts the first character to lowercase                       |
| `maybeMatchAll(str, regexp)`                        | Returns the results of `matchAll` as an array (safe for `null`) |
| `maybeReplace(str, pattern, replacement, options?)` | Replaces text in a string (safe for `null`)                     |
| `recaseCamel(data)`, ...                            | Converts the case of a string                                   |
| `replaceByMap(str, map)`                            | Replaces text according to a map                                |
| `replacePlaceholders(template, values, options?)`   | Replaces placeholders in a template with values                 |
| `upperFirst(str)`                                   | Converts the first character to uppercase                       |

#### `createExtractor`

```ts
createExtractor(delimiters?: string | [string, string]): CreateExtractorResult
```

Creates a function that extracts the text enclosed in `delimiters`. A single string is used as both the opening and closing delimiter. Defaults to `['{{', '}}']`. The created function returns an array of the extracted strings.

```ts
const extract = createExtractor();
extract('{{a}} and {{ b }} and {{a}}', { trim: true, unique: true }); // ['a', 'b']
createExtractor('%')('%x% %y%'); // ['x', 'y']
```

The created function has the following options and properties.

| Option            | Type      | Description                                                            |
| ----------------- | --------- | ---------------------------------------------------------------------- |
| `keepDelimiters?` | `boolean` | If `true`, includes the delimiters in the results. Defaults to `false` |
| `trim?`           | `boolean` | If `true`, trims surrounding whitespace. Defaults to `false`           |
| `unique?`         | `boolean` | If `true`, removes duplicates. Defaults to `false`                     |

| Property | Type     | Description           |
| -------- | -------- | --------------------- |
| `prefix` | `string` | The opening delimiter |
| `suffix` | `string` | The closing delimiter |

#### `ensureString`

```ts
ensureString(data: unknown): string
ensureString.dataLast(): (data: unknown) => string
```

Converts a value to a string. Strings are returned as is, `null` and `undefined` become an empty string, and other values are converted with `String()`.

#### `escapeRegExp`

```ts
escapeRegExp(target: string): string
```

Escapes the special regular expression characters (`- . * + ? ^ $ { } ( ) | [ ]` and the backslash) so that the string can be passed to the `RegExp` constructor. `-` is escaped as `\x2d`, as the standard `RegExp.escape` does, so the result also works with the `u` and `v` flags and inside character classes.

```ts
new RegExp(escapeRegExp('1.5*2')); // /1\.5\*2/
```

#### `isSurroundedBy`

```ts
isSurroundedBy(str: string, prefix: string, suffix?: string): boolean
isSurroundedBy.dataLast(prefix: string, suffix?: string): (str: string) => boolean
```

Checks whether `str` starts with `prefix` and ends with `suffix`. At least one character is required between them. `suffix` defaults to `prefix`.

```ts
isSurroundedBy('(a)', '(', ')'); // true
isSurroundedBy('()', '(', ')'); // false
isSurroundedBy('"text"', '"'); // true
```

#### `lowerFirst` / `upperFirst`

```ts
lowerFirst(str: string): string
lowerFirst.dataLast(): (str: string) => string
upperFirst(str: string): string
upperFirst.dataLast(): (str: string) => string
```

Converts the first character to lowercase (`lowerFirst`) or uppercase (`upperFirst`).

#### `maybeMatchAll`

```ts
maybeMatchAll(str: string | null | undefined, regexp: RegExp): RegExpExecArray[]
```

Returns the results of `str.matchAll(regexp)` as an array. Returns an empty array when `str` is `null`, `undefined`, or empty. As with `String.prototype.matchAll`, `regexp` must have the `g` flag.

#### `maybeReplace`

```ts
maybeReplace(str: string | null | undefined, pattern: MaybeReplacePattern, replacement: string | ((substring: string, ...args: unknown[]) => string), options?: MaybeReplaceOptions): string | null | undefined
maybeReplace.dataLast(pattern: MaybeReplacePattern, replacement: ..., options?: MaybeReplaceOptions): (str: string | null | undefined) => string | null | undefined
```

Replaces text in a string. Returns `str` as is when it is `null` or `undefined`. A string `pattern` replaces every occurrence (`replaceAll`), and a regular expression follows its `g` flag as `String.prototype.replace` does. When `pattern` is a function, it is called with `options` and its result is used as the pattern.

```ts
maybeReplace('a-b-c', '-', '_'); // 'a_b_c'
maybeReplace('a-b-c', /-/, '_'); // 'a_b-c'
maybeReplace(null, '-', '_'); // null
```

#### Case conversion

```ts
recaseCamel(data: string): string
recaseKebab(data: string): string
recaseLower(data: string): string
recasePascal(data: string): string
recaseScreamingSnake(data: string): string
recaseSnake(data: string): string
recaseTitle(data: string): string
recaseUpper(data: string): string
// each also has dataLast(): (data: string) => string
```

Converts the case of a string. `recaseLower` and `recaseUpper` convert the whole string without splitting words; the others detect word boundaries (whitespace, `_`, `-`, uppercase letters, and so on). An empty string, `null`, or `undefined` is returned as is.

| Function               | Result for `'hello world'` |
| ---------------------- | -------------------------- |
| `recaseCamel`          | `helloWorld`               |
| `recasePascal`         | `HelloWorld`               |
| `recaseSnake`          | `hello_world`              |
| `recaseScreamingSnake` | `HELLO_WORLD`              |
| `recaseKebab`          | `hello-world`              |
| `recaseTitle`          | `Hello World`              |
| `recaseLower`          | `hello world`              |
| `recaseUpper`          | `HELLO WORLD`              |

#### `replaceByMap`

```ts
replaceByMap(str: string, map: Map<string, string> | Record<string, string> | [string, string][]): string
replaceByMap.dataLast(map: Map<string, string> | Record<string, string> | [string, string][]): (str: string) => string
```

Replaces the keys of `map` with their values. All replacements happen in one pass, so replaced text is never replaced again. When keys overlap, longer keys win.

```ts
replaceByMap('hello world', { hello: 'hi', world: 'earth' }); // 'hi earth'
replaceByMap('abcab', { ab: 'X', a: 'Y' }); // 'XcX'
```

#### `replacePlaceholders`

```ts
replacePlaceholders(template: string, values: Record<string, unknown> | unknown[], options?: ReplacePlaceholdersOptions): string
replacePlaceholders.dataLast(values: Record<string, unknown> | unknown[], options?: ReplacePlaceholdersOptions): (template: string) => string
```

Replaces the placeholders in `template` (`{{key}}` by default) with values from `values`. Keys are treated as paths as in `get`, and whitespace just inside the delimiters is ignored. Placeholders whose value is `null` or `undefined` are left as is.

```ts
replacePlaceholders('Hello, {{ user.name }}! {{greeting}}', {
  user: { name: 'Alice' },
  greeting: 'Welcome',
}); // 'Hello, Alice! Welcome'
replacePlaceholders('{{0}} and {{1}}', ['Alice', 'Bob']); // 'Alice and Bob'
```

| Option              | Type                         | Description                                                                                   |
| ------------------- | ---------------------------- | --------------------------------------------------------------------------------------------- |
| `delimiters?`       | `string \| [string, string]` | The placeholder delimiters. A single string is used for both ends. Defaults to `['{{', '}}']` |
| `removeUnresolved?` | `boolean`                    | If `true`, removes placeholders that have no value                                            |
| `flatKeys?`         | `boolean`                    | If `true`, keys are not treated as paths but as property names directly under `values`        |

#### Types

| Type                         | Description                                                             |
| ---------------------------- | ----------------------------------------------------------------------- |
| `CreateExtractorResult`      | The function created by `createExtractor`                               |
| `ExtractorOptions`           | Options for the function created by `createExtractor`                   |
| `MaybeReplaceOptions`        | Options passed to the function that builds a `maybeReplace` pattern     |
| `MaybeReplacePattern`        | A `maybeReplace` pattern (a static pattern or a function returning one) |
| `MaybeReplaceStaticPattern`  | A static pattern (`string \| RegExp`)                                   |
| `MaybeReplaceDynamicPattern` | A function returning a pattern                                          |
| `ReplacePlaceholdersOptions` | Options for `replacePlaceholders`                                       |

### timer

| Function                          | Description                                           |
| --------------------------------- | ----------------------------------------------------- |
| `debounce(fn, wait, options?)`    | Creates a function that runs after calls have settled |
| `setLongTimeout(callback, delay)` | Sets a timer longer than the `setTimeout` limit       |
| `sleep(ms)`                       | Returns a `Promise` that resolves after a given time  |
| `throttle(fn, wait, options?)`    | Creates a function that runs at most once per period  |

#### `debounce`

```ts
debounce<ARGS extends unknown[]>(fn: (...args: ARGS) => void, wait: number, options?: DebounceOptions): DebounceResult<ARGS>
```

Creates a function that runs `fn` once there have been no calls for `wait` milliseconds since the last call. `fn` receives the arguments of the last call.

```ts
const onInput = debounce((value: string) => search(value), 300);
```

| Option       | Type                         | Description                                                                                                 |
| ------------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `triggerAt?` | `'end' \| 'start' \| 'both'` | When to run. `'end'`: after calls settle; `'start'`: on the first call; `'both'`: both. Defaults to `'end'` |

The created function has the following methods.

| Method     | Description                           |
| ---------- | ------------------------------------- |
| `cancel()` | Cancels a pending run                 |
| `flush()`  | Runs a pending call immediately       |
| `isIdle()` | Returns `true` when no run is pending |

#### `setLongTimeout`

```ts
setLongTimeout(callback: () => void, delay: number): () => void
```

Runs `callback` after `delay` milliseconds. `delay` may exceed the `setTimeout` limit (about 24.8 days). Returns a function that cancels the timer.

#### `sleep`

```ts
sleep(ms: number): Promise<void>
```

Returns a `Promise` that resolves after `ms` milliseconds.

```ts
await sleep(1000);
```

#### `throttle`

```ts
throttle<ARGS extends unknown[]>(fn: (...args: ARGS) => void, wait: number, options?: ThrottleOptions): ThrottleResult<ARGS>
```

Creates a function that runs `fn` at most once every `wait` milliseconds. `fn` receives the arguments of the last call. The created function has the same methods as `debounce`.

```ts
const onScroll = throttle(() => updatePosition(), 100);
```

| Option       | Type                         | Description                                                                                                    |
| ------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `triggerAt?` | `'both' \| 'start' \| 'end'` | When to run. `'start'`: at the start of each period; `'end'`: at the end; `'both'`: both. Defaults to `'both'` |

#### Types

| Type                   | Description                        |
| ---------------------- | ---------------------------------- |
| `DebounceOptions`      | Options for `debounce`             |
| `DebounceResult<ARGS>` | The function created by `debounce` |
| `ThrottleOptions`      | Options for `throttle`             |
| `ThrottleResult<ARGS>` | The function created by `throttle` |

### type

| Function                           | Description                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| `ensureValidValue(data, options?)` | Returns a replacement when a value is not the expected kind, `null`, or `undefined` |
| `getKind(data)`                    | Returns the kind of a value in more detail than `typeof`                            |
| `getPriority(data, options?)`      | Returns a priority based on the kind of a value                                     |
| `getRawType(value)`                | Returns the type label from `Object.prototype.toString`                             |
| `isAsyncIterable(value)`           | Checks whether a value is async iterable                                            |
| `isBlank(value, options?)`         | Checks whether a value is `null`, `undefined`, or an empty string                   |
| `isEmptyCollection(value)`         | Checks whether a value is an empty array, `Map`, or `Set`                           |
| `isEmptyValue(value, options?)`    | Checks whether `isBlank` or `isEmptyCollection` applies                             |
| `isInvalidDate(value)`             | Checks whether a value is a `Date` with an invalid date (`Invalid Date`)            |
| `isIterable(value)`                | Checks whether a value is iterable                                                  |
| `isNonNegativeInteger(value)`      | Checks whether a value is an integer of 0 or more                                   |
| `isNullish(value)`                 | Checks whether a value is `null` or `undefined`                                     |
| `isNumberLike(value)`              | Checks whether a value is a number or a decimal number string                       |
| `isPresent(value)`                 | Checks whether a value is neither `null` nor `undefined`                            |
| `isPrimitive(value)`               | Checks whether a value is a primitive                                               |
| `isRegExp(value)`                  | Checks whether a value is a `RegExp`                                                |
| `isUndefined(value)`               | Checks whether a value is `undefined`                                               |
| `isValidDate(value)`               | Checks whether a value is a `Date` with a valid date                                |
| `isValidNumber(value, options?)`   | Checks whether a value is a valid number (not `NaN` or `Infinity`)                  |
| `unsafeCast(value)`                | Casts a value to a type, bypassing type checking                                    |

#### `ensureValidValue`

```ts
ensureValidValue<T = unknown>(data: unknown, options?: EnsureValidValueOptions<T>): T
ensureValidValue.dataLast<T = unknown>(options?: EnsureValidValueOptions<T>): (data: unknown) => T
```

Returns the value set in the options when a value is not the expected kind, or is `null` or `undefined`. Returns `data` as is when no matching value is set. Without `validType`, only `null` and `undefined` are replaced.

```ts
ensureValidValue('a', { validType: 'number', invalidValue: 0 }); // 0
ensureValidValue(null, { nullValue: '' }); // ''
```

| Option            | Type   | Description                                                        |
| ----------------- | ------ | ------------------------------------------------------------------ |
| `validType?`      | `Kind` | The expected kind of value (a value of `getKind`)                  |
| `undefinedValue?` | `T`    | The value returned when the value is `undefined`                   |
| `nullValue?`      | `T`    | The value returned when the value is `null`                        |
| `invalidValue?`   | `T`    | The value returned when the kind of value differs from `validType` |

#### `getKind`

```ts
getKind(data: unknown): Kind
getKind.dataLast(): (data: unknown) => Kind
```

Returns the kind of a value. In addition to the results of `typeof`, objects are divided into `null`, `array`, `plainobject` (an object that directly inherits from `Object.prototype`), `date`, `regexp`, `error`, `map`, `set`, `weakmap`, `weakset`, `promise`, `arraybuffer`, and `sharedarraybuffer`. Any other object is `object`.

```ts
getKind([]); // 'array'
getKind({}); // 'plainobject'
getKind(new Date()); // 'date'
getKind(null); // 'null'
```

#### `getPriority`

```ts
getPriority(data: unknown, options?: GetPriorityOptions): number
getPriority.dataLast(options?: GetPriorityOptions): (data: unknown) => number
```

Returns a priority based on the kind of a value, for example to move `null` and `undefined` to the end when sorting. By default `undefined` is `-2`, `null` is `-1`, and everything else is `0`.

```ts
getPriority(undefined); // -2
getPriority([], { useKind: true, priorityMap: { array: 3 } }); // 3
```

| Option                 | Type                                            | Description                                                                                        |
| ---------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `priorityMap?`         | `Partial<Record<Kind \| TypeOfResult, number>>` | Priorities per kind. When given, it replaces the default `{ undefined: -2, null: -1 }`             |
| `useKind?`             | `boolean`                                       | If `true`, looks up priorities by the kind from `getKind` instead of `typeof`. Defaults to `false` |
| `getFallbackPriority?` | `(data: unknown) => number`                     | Returns the priority for kinds not in `priorityMap`. Defaults to `0` if omitted                    |

#### `getRawType`

```ts
getRawType(value: unknown): GetRawTypeReturn
```

Returns the result of `Object.prototype.toString.call(value)`, such as `'[object Array]'`.

#### `isAsyncIterable` / `isIterable`

```ts
isAsyncIterable(value: unknown): value is AsyncIterable<unknown>
isIterable<T>(value: unknown): value is Iterable<T>
```

Checks whether a value has a `Symbol.asyncIterator` (`isAsyncIterable`) or `Symbol.iterator` (`isIterable`) method. Strings are iterable.

#### `isBlank`

```ts
isBlank(value: unknown, options?: IsBlankOptions): boolean
```

Returns `true` when a value is `null`, `undefined`, or an empty string. With `trimType`, strings consisting only of whitespace also return `true`. Values other than strings return `false`.

```ts
isBlank(''); // true
isBlank('  '); // false
isBlank('  ', { trimType: 'half' }); // true
```

| Option      | Type                                            | Description                                                                                                                                                                                                                                |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `trimType?` | `'none' \| 'half' \| 'full' \| 'both' \| 'all'` | Which whitespace counts as empty. `'none'`: none; `'half'`: half-width whitespace (spaces, tabs, line breaks, ...); `'full'`: full-width spaces; `'both'`: half-width and full-width spaces; `'all'`: all whitespace. Defaults to `'none'` |

#### `isEmptyCollection`

```ts
isEmptyCollection(value: unknown): boolean
```

Returns `true` for an empty array, `Map`, or `Set`, and for `null` and `undefined`.

#### `isEmptyValue`

```ts
isEmptyValue(value: unknown, options?: IsEmptyValueOptions): boolean
```

Returns `true` when `isBlank` or `isEmptyCollection` applies. The options are the same as `isBlank`. An empty object (`{}`) returns `false`.

#### `isInvalidDate` / `isValidDate`

```ts
isInvalidDate(value: unknown): boolean
isValidDate(value: unknown): boolean
```

Checks whether a value is a `Date` with an invalid date (`isInvalidDate`) or a valid date (`isValidDate`). Both return `false` for values that are not `Date`.

#### `isNonNegativeInteger`

```ts
isNonNegativeInteger(value: unknown): value is number
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
isPrimitive(value: unknown): boolean
```

Returns `true` when a value is a primitive (`null`, `undefined`, a boolean, a number, a BigInt, a string, or a symbol).

#### `isRegExp`

```ts
isRegExp(value: unknown): value is RegExp
```

Returns `true` when a value is a `RegExp`.

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

| Type                         | Description                           |
| ---------------------------- | ------------------------------------- |
| `EnsureValidValueOptions<V>` | Options for `ensureValidValue`        |
| `GetPriorityOptions`         | Options for `getPriority`             |
| `GetRawTypeReturn`           | The return value of `getRawType`      |
| `IsBlankOptions`             | Options for `isBlank`                 |
| `IsEmptyValueOptions`        | Same as `IsBlankOptions`              |
| `IsValidNumberOptions`       | Options for `isValidNumber`           |
| `Kind`                       | The kind values returned by `getKind` |

## License

MIT
