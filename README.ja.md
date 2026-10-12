# @fringeworks/utils

`@fringeworks/utils` は、配列・オブジェクト・文字列・数値・日付・タイマーなど幅広いカテゴリにわたる汎用ユーティリティ関数を集めた、誰かにとっては便利なライブラリです。

**[English README is available here](./README.md)**

## インストール

```bash
npm install @fringeworks/utils
# または
pnpm add @fringeworks/utils
```

## 使い方

関数・型・定数は、ルート・カテゴリー・関数単位のどのパスからでも同じ名前で import できます。

```ts
import {
  keepInRange,
  RangeMode,
  type KeepInRangeOptions,
} from '@fringeworks/utils';
import { keepInRange, RangeMode } from '@fringeworks/utils/number';
import { keepInRange, RangeMode } from '@fringeworks/utils/number/keepInRange';
```

関数単位のパスでは、その機能の主となる関数を default import することもできます。

```ts
import keepInRange from '@fringeworks/utils/number/keepInRange';
```

### 破壊的な関数

名前が `Mutable` で終わる関数（`setMutable`、`pushAllMutable` など）は、引数のオブジェクトや配列を直接変更します。`Mutable` の付かない関数は引数を変更せず、新しい値を返します。

### Data Last

多くの関数は `dataLast` を持ちます。`dataLast` はデータ以外の引数を先に受け取り、データを受け取る関数を返します。パイプライン処理や、`Array.prototype.map` などのコールバックに渡す場合に使えます。

```ts
import { clampInRange } from '@fringeworks/utils';

clampInRange(150, 0, 100); // 100

const clamp = clampInRange.dataLast(0, 100);
[150, -10, 50].map(clamp); // [100, 0, 50]
```

`dataLast` を持つ関数は、シグネチャに `dataLast` を併記しています。

---

## API

### array

| 関数                                        | 説明                                                     |
| ------------------------------------------- | -------------------------------------------------------- |
| `clearArray(data)`                          | 配列の全要素を削除し、削除した要素を返す                 |
| `compactMap(data, callback, options?)`      | 各要素を変換し、不要な値を除いた配列を返す               |
| `ensureArray(data, options?)`               | 配列でない値を配列で包む                                 |
| `firstDefined(data)`                        | 最初の `undefined` でない要素を返す                      |
| `firstPresent(data)`                        | 最初の `null` / `undefined` でない要素を返す             |
| `insertAt(data, index, items)`              | 指定の位置に要素を挿入した新しい配列を返す               |
| `insertAtMutable(data, index, items)`       | 指定の位置に要素を挿入する（破壊的）                     |
| `nestedGroupBy(data, properties, options?)` | 指定のプロパティの値をキーにして要素をグループ化する     |
| `nestedKeyBy(data, properties, options?)`   | 指定のプロパティの値をキーにして要素を1つずつ格納する    |
| `pushAll(data, source)`                     | 別の配列の全要素を追加した新しい配列を返す               |
| `pushAllMutable(data, source)`              | 別の配列の全要素を追加する（破壊的）                     |
| `pushUnique(data, items, options?)`         | まだ含まれていない要素だけを追加した新しい配列を返す     |
| `pushUniqueMutable(data, items, options?)`  | まだ含まれていない要素だけを追加する（破壊的）           |
| `repeatToLength(data, length)`              | 指定の長さになるまで配列を繰り返した新しい配列を返す     |
| `rotateArray(data, options?)`               | 先頭の要素を末尾に移動した新しい配列を返す               |
| `rotateArrayMutable(data, options?)`        | 先頭の要素を末尾に移動する（破壊的）                     |
| `sortDependencies(data, options?)`          | 依存関係に従って並べ替える（トポロジカルソート）         |
| `swapPairs(pairs)`                          | 2要素のタプルの配列の各タプルの要素を入れ替える          |
| `toArray(data, options?)`                   | イテラブルを展開して配列にする。それ以外の値は配列で包む |

#### `clearArray`

```ts
clearArray<T>(data: T[] | null | undefined): T[]
```

配列の全要素を削除し（破壊的）、削除した要素の配列を返します。`data` が `null` / `undefined` の場合は空配列を返します。

#### `compactMap`

```ts
compactMap<V, R = V>(data: V[] | null | undefined, callback: CompactMapIteratee<V, R>, options?: CompactMapOptions): R[] | null | undefined
compactMap.dataLast<V, R = V>(callback: CompactMapIteratee<V, R>, options?: CompactMapOptions): (data: V[] | null | undefined) => R[]
```

各要素を `callback` で変換し、`options.exclude` で指定した値を除いた配列を返します。`data` が `null` / `undefined` の場合は `undefined` を返します。

```ts
compactMap([1, 2, 3], (v) => (v === 2 ? undefined : v * 10)); // [10, 30]
compactMap(['a', '', null], (v) => v, { exclude: 'empty' }); // ['a']
```

| オプション | 型                  | 説明                                                                                                                                                                                     |
| ---------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exclude?` | `CompactMapExclude` | 除外する値。`'undefined'`: `undefined`、`'nullish'`: `null` と `undefined`、`'empty'`: 加えて空文字、`'falsy'`: falsy な値すべて（`false`、`0`、`NaN` など）。デフォルトは `'undefined'` |

#### `ensureArray`

```ts
ensureArray<T>(data: T | T[] | null | undefined, options?: EnsureArrayOptions): T[]
ensureArray.dataLast(options?: EnsureArrayOptions): <T>(data: T | T[] | null | undefined) => T[]
```

配列でない値を1要素の配列で包みます。`null` / `undefined` は空配列になり、配列はコピーを返します。イテラブル（`Set` など）は展開しません（展開する場合は `toArray` を使います）。

```ts
ensureArray(1); // [1]
ensureArray([1, 2]); // [1, 2]（コピー）
ensureArray(null); // []
```

| オプション | 型        | 説明                                                                                 |
| ---------- | --------- | ------------------------------------------------------------------------------------ |
| `raw?`     | `boolean` | `true` の場合、`data` が配列のときはコピーせずに同じ配列を返す。デフォルトは `false` |

#### `firstDefined`

```ts
firstDefined<V>(data: V[]): V | undefined
firstDefined.dataLast<V>(): (data: V[]) => V | undefined
```

先頭から見て最初の `undefined` でない要素を返します。`null` は対象になります。

#### `firstPresent`

```ts
firstPresent<V>(data: V[]): V | undefined
firstPresent.dataLast<V>(): (data: V[]) => V | undefined
```

先頭から見て最初の `null` / `undefined` でない要素を返します。

#### `insertAt`

```ts
insertAt<T, U = T>(data: T[], index: number, items: U[]): (T | U)[]
insertAt.dataLast<U>(index: number, items: U[]): <T>(data: T[]) => (T | U)[]
```

`index` の位置に `items` の要素を挿入した新しい配列を返します。`index` は 0 〜配列の長さの範囲に収めます（負の数は先頭、長さを超える数は末尾）。

```ts
insertAt([1, 2, 3], 1, ['a', 'b']); // [1, 'a', 'b', 2, 3]
```

#### `insertAtMutable`

```ts
insertAtMutable<T, U = T>(data: T[], index: number, items: U[]): (T | U)[]
insertAtMutable.dataLast<U>(index: number, items: U[]): <T>(data: T[]) => (T | U)[]
```

`insertAt` の破壊的な版です。`data` に直接挿入し、同じ配列を返します。

#### `nestedGroupBy`

```ts
nestedGroupBy<I extends object>(data: I[], properties: keyof I | (keyof I)[], options?: NestedGroupByOptions): NestedGroupByResult<I>
nestedGroupBy.dataLast<I extends object>(properties: keyof I | (keyof I)[], options?: NestedGroupByOptions): (data: I[]) => NestedGroupByResult<I>
```

`properties` に指定したプロパティの値をキーにしてネストしたオブジェクトを作り、同じキーの要素を配列にまとめます。キーはプロパティの値を文字列にしたものです。

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

| オプション      | 型        | 説明                                                                                       |
| --------------- | --------- | ------------------------------------------------------------------------------------------ |
| `flat?`         | `boolean` | `true` の場合、ネストせずに各キーを連結した1階層のオブジェクトにする。デフォルトは `false` |
| `keySeparator?` | `string`  | `flat` が `true` の場合にキーを連結する区切り文字。デフォルトは `'.'`                      |

#### `nestedKeyBy`

```ts
nestedKeyBy<I extends object>(data: I[], properties: keyof I | (keyof I)[], options?: NestedKeyByOptions): NestedKeyByResult<I>
nestedKeyBy.dataLast<I extends object>(properties: keyof I | (keyof I)[], options?: NestedKeyByOptions): (data: I[]) => NestedKeyByResult<I>
```

`nestedGroupBy` と同じ形のオブジェクトを作りますが、各キーには要素を1つだけ格納します。同じキーの要素が複数ある場合は、デフォルトでは先の要素が残ります。

| オプション      | 型        | 説明                                                                      |
| --------------- | --------- | ------------------------------------------------------------------------- |
| `flat?`         | `boolean` | `nestedGroupBy` と同じ                                                    |
| `keySeparator?` | `string`  | `nestedGroupBy` と同じ                                                    |
| `overwrite?`    | `boolean` | `true` の場合、同じキーの要素は後の要素で上書きする。デフォルトは `false` |

#### `pushAll`

```ts
pushAll<T>(data: T[], source: T[]): T[]
pushAll.dataLast<T>(source: T[]): (data: T[]) => T[]
```

`data` の末尾に `source` の全要素を追加した新しい配列を返します。`data` が `null` / `undefined` の場合はそのまま返し、`source` が `null` / `undefined` の場合は `data` のコピーを返します。

#### `pushAllMutable`

```ts
pushAllMutable<T>(data: T[], source: T[]): T[]
pushAllMutable.dataLast<T>(source: T[]): (data: T[]) => T[]
```

`pushAll` の破壊的な版です。`data` に直接追加し、同じ配列を返します。

#### `pushUnique`

```ts
pushUnique<T>(data: T[] | null | undefined, items: T[] | null | undefined, options?: PushUniqueOptions<T>): T[]
pushUnique.dataLast<T>(items: T[] | null | undefined, options?: PushUniqueOptions<T>): (data: T[] | null | undefined) => T[]
```

`items` のうち、`data` にまだ含まれていない要素だけを追加した新しい配列を返します。`items` 内の重複も追加しません。`data` が `null` / `undefined` の場合はそのまま返します。

```ts
pushUnique([1, 2], [2, 3, 3]); // [1, 2, 3]
```

| オプション    | 型                        | 説明                                                                                                       |
| ------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `threshold?`  | `number`                  | 要素数の合計がこの値以上の場合は `Set` を使って判定する。デフォルトは `100`                                |
| `comparator?` | `(a: T, b: T) => boolean` | 同じ要素かどうかの判定方法。指定した場合は `threshold` に関わらず線形探索になる。デフォルトは `===` で判定 |

#### `pushUniqueMutable`

```ts
pushUniqueMutable<T>(data: T[] | null | undefined, items: T[] | null | undefined, options?: PushUniqueMutableOptions<T>): T[]
pushUniqueMutable.dataLast<T>(items: T[] | null | undefined, options?: PushUniqueMutableOptions<T>): (data: T[] | null | undefined) => T[]
```

`pushUnique` の破壊的な版です。`data` に直接追加し、同じ配列を返します。オプションは `pushUnique` と同じです。

#### `repeatToLength`

```ts
repeatToLength<T>(data: T[], length: number): T[]
repeatToLength.dataLast(length: number): <T>(data: T[]) => T[]
```

`data` の要素を繰り返し並べて、長さ `length` の新しい配列を返します。`length` が負の数の場合は、逆順にした配列を繰り返します。`data` が空の場合は空配列を返します。

```ts
repeatToLength([1, 2, 3], 7); // [1, 2, 3, 1, 2, 3, 1]
repeatToLength([1, 2, 3], -5); // [3, 2, 1, 3, 2]
```

#### `rotateArray`

```ts
rotateArray<I>(data: I[], options?: RotateArrayOptions): I[]
rotateArray.dataLast(options?: RotateArrayOptions): <I>(data: I[]) => I[]
```

先頭の `count` 個の要素を末尾に移動した新しい配列を返します。

```ts
rotateArray([1, 2, 3, 4, 5], { count: 2 }); // [3, 4, 5, 1, 2]
rotateArray([1, 2, 3, 4, 5], { count: -1 }); // [5, 1, 2, 3, 4]
```

| オプション | 型       | 説明                                                                         |
| ---------- | -------- | ---------------------------------------------------------------------------- |
| `count?`   | `number` | 移動する要素の数。正の数は左方向、負の数は右方向に回転する。デフォルトは `1` |

#### `rotateArrayMutable`

```ts
rotateArrayMutable<I>(data: I[], options?: RotateArrayMutableOptions): I[]
rotateArrayMutable.dataLast(options?: RotateArrayMutableOptions): <I>(data: I[]) => I[]
```

`rotateArray` の破壊的な版です。`data` を直接変更し、同じ配列を返します。オプションは `rotateArray` と同じです。

#### `sortDependencies`

```ts
sortDependencies<I>(data: I[], options?: SortDependenciesOptions<I>): I[]
sortDependencies.dataLast<I>(options?: SortDependenciesOptions<I>): (data: I[]) => I[]
```

要素の依存関係に従って、依存される側が先に来るように並べ替えた新しい配列を返します（トポロジカルソート）。同じ ID の要素は1つにまとめます。循環した依存関係がある場合は `Error`（`Cyclic dependency: <ID>`）を投げます。

デフォルトでは、各要素を `[ID, 依存先の要素の配列]` のタプルとして扱います。依存先の ID は、依存先の要素から `id` と同じ方法で取得します。依存先を ID で持つ場合は `dependencyId` を指定します。

```ts
const c = ['c', []];
const b = ['b', [c]];
const a = ['a', [b, c]];
sortDependencies([a, b, c]); // [c, b, a]

// 依存先を ID で持つ場合
sortDependencies(
  [
    { id: 'a', deps: ['b'] },
    { id: 'b', deps: [] },
  ],
  { id: 'id', dependencies: 'deps', dependencyId: (dep) => dep },
);
// [{ id: 'b', ... }, { id: 'a', ... }]
```

| オプション       | 型                                                       | 説明                                                                                                                               |
| ---------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `id?`            | `string \| number \| SortDependenciesGetId<I>`           | 要素の ID を持つプロパティ、または ID を返す関数。デフォルトは `0`                                                                 |
| `dependencies?`  | `string \| number \| SortDependenciesGetDependencies<I>` | 依存先を持つプロパティ、または依存先を返す関数。デフォルトは `1`                                                                   |
| `dependencyId?`  | `string \| number \| SortDependenciesGetId<I>`           | 依存先の ID を持つプロパティ、または依存先の ID を返す関数。デフォルトは `id` と同じ                                               |
| `tree?`          | `boolean`                                                | `true` の場合、依存先を再帰的にたどり、`data` に含まれない依存先の要素も並べ替えの対象に加える（ツリー構造のデータ用）             |
| `ignoreMissing?` | `boolean`                                                | `true` の場合、`data` に存在しない依存先を無視する。`false` の場合は `Error`（`No substance: <ID>`）を投げる。デフォルトは `false` |
| `reverse?`       | `boolean`                                                | `true` の場合、並び順を逆にする（依存する側が先）。デフォルトは `false`                                                            |

#### `swapPairs`

```ts
swapPairs<const T extends [unknown, unknown][]>(pairs: T): SwapPairsResult<T>
swapPairs.dataLast(): <const T extends [unknown, unknown][]>(pairs: T) => SwapPairsResult<T>
```

2要素のタプルの配列を受け取り、各タプルの `[0]` と `[1]` を入れ替えた新しい配列を返します。型も入れ替わります。

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

値を配列にします。文字列以外のイテラブル（`Set`、`Map` など）は展開し、それ以外の値は1要素の配列で包みます。`null` / `undefined` は空配列になり、配列はコピーを返します。

```ts
toArray(new Set([1, 2])); // [1, 2]
toArray('abc'); // ['abc']
toArray(1); // [1]
```

| オプション | 型        | 説明                 |
| ---------- | --------- | -------------------- |
| `raw?`     | `boolean` | `ensureArray` と同じ |

#### 型

| 型                                   | 説明                                                    |
| ------------------------------------ | ------------------------------------------------------- |
| `CompactMapOptions`                  | `compactMap` のオプション                               |
| `CompactMapExclude`                  | `compactMap` で除外する値の種類                         |
| `CompactMapIteratee<V, R>`           | `compactMap` のコールバック `(value, index, data) => R` |
| `EnsureArrayOptions`                 | `ensureArray` のオプション                              |
| `NestedGroupByOptions`               | `nestedGroupBy` のオプション                            |
| `NestedGroupByResult<I>`             | `nestedGroupBy` の戻り値                                |
| `NestedKeyByOptions`                 | `nestedKeyBy` のオプション                              |
| `NestedKeyByResult<I>`               | `nestedKeyBy` の戻り値                                  |
| `PushUniqueMutableOptions<T>`        | `pushUniqueMutable` のオプション                        |
| `PushUniqueOptions<T>`               | `PushUniqueMutableOptions<T>` と同じ                    |
| `RotateArrayMutableOptions`          | `rotateArrayMutable` のオプション                       |
| `RotateArrayOptions`                 | `RotateArrayMutableOptions` と同じ                      |
| `SortDependenciesOptions<I>`         | `sortDependencies` のオプション                         |
| `SortDependenciesGetId<I>`           | 要素から ID を返す関数 `(item) => unknown`              |
| `SortDependenciesGetDependencies<I>` | 要素から依存先を返す関数 `(item) => I \| I[]`           |
| `SwapPairsResult<T>`                 | `swapPairs` の戻り値（各タプルの要素を入れ替えた型）    |
| `ToArrayOptions`                     | `toArray` のオプション                                  |

### boolean

| 関数                            | 説明             |
| ------------------------------- | ---------------- |
| `ensureBoolean(data, options?)` | 値を真偽値にする |

#### `ensureBoolean`

```ts
ensureBoolean(data: unknown, options?: EnsureBooleanOptions): boolean
ensureBoolean.dataLast(options?: EnsureBooleanOptions): (data: unknown) => boolean
```

値を真偽値にします。真偽値はそのまま返し、文字列は `trueValues` に含まれる場合だけ `true` にします（デフォルトでは `'true'`、`'True'`、`'TRUE'`）。それ以外の値は `!!data` で変換します。

```ts
ensureBoolean('true'); // true
ensureBoolean('yes'); // false
ensureBoolean('YES', { trueValues: ['yes'], ignoreCase: true }); // true
ensureBoolean(1); // true
```

| オプション    | 型         | 説明                                                             |
| ------------- | ---------- | ---------------------------------------------------------------- |
| `trueValues?` | `string[]` | `true` として扱う文字列。デフォルトは `['true', 'True', 'TRUE']` |
| `ignoreCase?` | `boolean`  | `true` の場合、文字列を大文字・小文字を区別せずに比較する        |

#### 型

| 型                     | 説明                         |
| ---------------------- | ---------------------------- |
| `EnsureBooleanOptions` | `ensureBoolean` のオプション |

### compare

| 関数                                    | 説明                                            |
| --------------------------------------- | ----------------------------------------------- |
| `compare(left, operator, right)`        | 演算子を指定して2つの値を比較する               |
| `isEqual(value1, value2, options?)`     | 比較方法を指定して2つの値が等しいか判定する     |
| `isEqualWith(value, other, customizer)` | 独自の比較関数を使って2つの値を再帰的に比較する |

#### `compare`

```ts
compare<O extends ComparisonOperator>(left: CompareLeft[O], operator: O, right: CompareRight[O]): boolean
compare.dataLast<O extends ComparisonOperator>(operator: O, right: CompareRight[O]): (left: CompareLeft[O]) => boolean
```

`left` と `right` を `operator` で比較します。対応していない演算子を指定した場合は `Error` を投げます。

```ts
compare(5, '>', 3); // true
compare(5, 'between', [1, 10]); // true（両端を含む）
compare('a', 'in', ['a', 'b']); // true
compare('hello', 'like', 'ell'); // true（部分一致）
```

| 演算子                          | 内容                                                 |
| ------------------------------- | ---------------------------------------------------- |
| `'==='` / `'!=='`               | 厳密な等価・不等価                                   |
| `'=='` / `'!='`                 | 緩い等価・不等価                                     |
| `'>'` / `'<'` / `'>='` / `'<='` | 大小比較                                             |
| `'between'`                     | `right` を `[min, max]` として範囲内か（両端を含む） |
| `'in'`                          | `right` の配列に `left` が含まれるか                 |
| `'like'`                        | 文字列 `left` が `right` を含むか                    |

#### `isEqual`

```ts
isEqual(value1: unknown, value2: unknown, options?: IsEqualOptions): boolean
isEqual.dataLast(value2: unknown, options?: IsEqualOptions): (value1: unknown) => boolean
```

2つの値が等しいか判定します。比較方法は `mode` で指定します。

```ts
isEqual(1, '1'); // false
isEqual(1, '1', { mode: 'loose' }); // true
isEqual({ a: [1] }, { a: [1] }, { mode: 'deep' }); // true
```

| オプション    | 型                                                                                    | 説明                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode?`       | `CompareMode`                                                                         | 比較方法。`'strict'`: `===`、`'loose'`: `==`、`'deep'`: 構造が同じか。デフォルトは `'strict'`                                                                                |
| `customizer?` | `(value1, value2, indexOrKey?, value1Parent?, value2Parent?) => boolean \| undefined` | 独自の比較関数。`mode` が `'deep'` の場合は `isEqualWith` の `customizer` として使う。それ以外の場合は `value1`・`value2` だけを渡し、`boolean` 以外を返すと通常の比較を行う |

#### `isEqualWith`

```ts
isEqualWith(value: unknown, other: unknown, customizer: (value1, value2, indexOrKey?, value1Parent?, value2Parent?) => boolean | undefined): boolean
isEqualWith.dataLast(other: unknown, customizer: ...): (value: unknown) => boolean
```

2つの値が等しいかを再帰的に比較します。比較の各段階で `customizer` を呼び、`boolean` を返した場合はそれを結果とし、`undefined` を返した場合は既定の比較を行います。

既定の比較では、配列は要素ごと、プレーンなオブジェクトは自身の列挙可能なプロパティごと、`Date` は時刻、`Map` はキーと値、`Set` は同じ要素（SameValueZero）を持つかで比較します。

```ts
// 文字列は大文字・小文字を区別せずに比較する
isEqualWith({ a: 'Hello' }, { a: 'hello' }, (v1, v2) =>
  typeof v1 === 'string' && typeof v2 === 'string'
    ? v1.toLowerCase() === v2.toLowerCase()
    : undefined,
); // true
```

#### 定数

| 定数                 | 説明                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `ComparisonOperator` | `compare` の演算子。`EQ`、`NE`、`GT`、`LT`、`GE`、`LE`、`LOOSE_EQ`、`LOOSE_NE`、`BETWEEN`、`IN`、`LIKE` |
| `CompareMode`        | `isEqual` の比較方法。`strict`、`loose`、`deep`                                                         |

#### 型

| 型                   | 説明                                  |
| -------------------- | ------------------------------------- |
| `ComparisonOperator` | `compare` の演算子の値                |
| `CompareLeft`        | 演算子ごとの `compare` の左辺の値の型 |
| `CompareRight`       | 演算子ごとの `compare` の右辺の値の型 |
| `CompareMode`        | `isEqual` の比較方法の値              |
| `IsEqualOptions`     | `isEqual` のオプション                |

### date

| 関数                                      | 説明                                                            |
| ----------------------------------------- | --------------------------------------------------------------- |
| `asUtcDate(date)`                         | ローカル時刻の日時を、同じ日時の UTC として扱った `Date` を返す |
| `createUtcDate(year, month?, date?, ...)` | UTC の日時を指定して `Date` を作る                              |
| `lerpDate(value, ratio, options?)`        | 基準の日時と目標の日時の間を割合で補間する                      |

#### `asUtcDate`

```ts
asUtcDate(date: Date): Date
```

`date` のローカル時刻の年月日・時分秒・ミリ秒を、そのまま UTC の値として持つ新しい `Date` を返します。

```ts
// 日本時間（UTC+9）の環境で
asUtcDate(new Date(2024, 0, 15, 12, 0)).toISOString(); // '2024-01-15T12:00:00.000Z'
```

#### `createUtcDate`

```ts
createUtcDate(year: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): Date
```

UTC の日時を指定して `Date` を作ります。`Date.UTC` と同じく `month` は 0 〜 11 です。省略した引数は、`month` が `0`、`date` が `1`、それ以外は `0` になります。

#### `lerpDate`

```ts
lerpDate(value: Date, ratio: number, options?: LerpDateOptions): Date
lerpDate.dataLast(ratio: number, options?: LerpDateOptions): (value: Date) => Date
```

基準の日時（`baseValue`）から目標の日時（`value`）までを `ratio` の割合で線形補間した日時を返します。`ratio` が `0` のときは基準の日時、`1` のときは目標の日時になります。

| オプション   | 型     | 説明                                     |
| ------------ | ------ | ---------------------------------------- |
| `baseValue?` | `Date` | 補間の基準の日時。デフォルトは現在の日時 |

#### 型

| 型                | 説明                    |
| ----------------- | ----------------------- |
| `LerpDateOptions` | `lerpDate` のオプション |

### function

| 関数                          | 説明                     |
| ----------------------------- | ------------------------ |
| `alwaysFalse(...args)`        | 常に `false` を返す      |
| `alwaysInput(value, ...args)` | 最初の引数をそのまま返す |
| `alwaysTrue(...args)`         | 常に `true` を返す       |
| `alwaysVoid(...args)`         | 何もしない               |

#### `alwaysFalse` / `alwaysTrue` / `alwaysInput` / `alwaysVoid`

```ts
alwaysFalse(...args: unknown[]): boolean
alwaysTrue(...args: unknown[]): boolean
alwaysInput<T>(value: T, ...args: unknown[]): T
alwaysVoid(...args: unknown[]): void
```

引数に関わらず決まった値を返す関数です。コールバックやオプションの既定値として使います。`alwaysInput` は最初の引数をそのまま返し、`alwaysVoid` は何もしません。

### map

| 関数                        | 説明              |
| --------------------------- | ----------------- |
| `ensureMap(data, options?)` | 値を `Map` にする |

#### `ensureMap`

```ts
ensureMap<K, V>(data: EnsureMapSource<K, V> | null | undefined, options?: EnsureMapOptions): Map<K, V>
ensureMap.dataLast(options?: EnsureMapOptions): <K, V>(data: EnsureMapSource<K, V> | null | undefined) => Map<K, V>
```

値を `Map` にします。`Map` はコピーを返し、オブジェクトはプロパティをエントリーにします。配列は、最初の要素が2要素の配列の場合は `[キー, 値]` の配列として扱い、それ以外の場合はインデックスをキーにします。`null` / `undefined` やその他の値は空の `Map` になります。

```ts
ensureMap({ a: 1 }); // Map { 'a' => 1 }
ensureMap([['a', 1]]); // Map { 'a' => 1 }
ensureMap(['x', 'y']); // Map { 0 => 'x', 1 => 'y' }
```

| オプション | 型        | 説明                                                                                       |
| ---------- | --------- | ------------------------------------------------------------------------------------------ |
| `raw?`     | `boolean` | `true` の場合、`data` が `Map` のときはコピーせずに同じ `Map` を返す。デフォルトは `false` |

#### 型

| 型                      | 説明                                                                        |
| ----------------------- | --------------------------------------------------------------------------- |
| `EnsureMapOptions`      | `ensureMap` のオプション                                                    |
| `EnsureMapSource<K, V>` | `ensureMap` が受け取る値（`Map`、オブジェクト、エントリーの配列、値の配列） |

### measure

| 関数                               | 説明                                                 |
| ---------------------------------- | ---------------------------------------------------- |
| `comparePerformance(options)`      | 複数の関数の実行時間を測定して比較する               |
| `comparePerformanceAsync(options)` | 複数の非同期関数の実行時間を測定して比較する         |
| `measure(fn, options?)`            | 関数を指定の回数実行し、かかった時間を測定する       |
| `measureAsync(fn, options?)`       | 非同期関数を指定の回数実行し、かかった時間を測定する |

#### `comparePerformance`

```ts
comparePerformance<A extends unknown[] = unknown[], R = unknown>(options: ComparePerformanceOptions<A>): ComparePerformanceResult<A, R>
```

`targets` の関数の実行時間を測定して比較します。1周ごとに各関数を `iterations` 回ずつ実行して時間を測り、これを `rounds` 周繰り返します。周ごとに実行する順番を入れ替え、順番による偏りを減らします。

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
result.order.map((target) => target.id); // 速い順
```

| オプション    | 型                                 | 説明                                                             |
| ------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `targets`     | `ComparePerformanceTarget<A, R>[]` | 測定する関数 `{ id, fn }` の配列                                 |
| `iterations?` | `number`                           | 1周の中で各関数を実行する回数。デフォルトは `10`                 |
| `rounds?`     | `number`                           | 測定を繰り返す周数。デフォルトは `10`                            |
| `args?`       | `A`                                | 関数に渡す引数                                                   |
| `getArgs?`    | `() => A`                          | 実行するたびに引数を作る関数。指定した場合は `args` より優先する |
| `warmUp?`     | `boolean`                          | `true` の場合、測定前に各関数を1回ずつ実行する                   |
| `id?`         | `string`                           | 測定の ID。結果にそのまま含める。デフォルトは開始時刻のミリ秒    |

| プロパティ     | 型                              | 説明                                    |
| -------------- | ------------------------------- | --------------------------------------- | ---------------------- |
| `average`      | `ElapsedTimes`                  | 関数ごとの1周あたりの平均時間（ミリ秒） |
| `totalAverage` | `number`                        | 全関数の平均時間（ミリ秒）              |
| `order`        | `ComparePerformanceTarget<A>[]` | 平均時間が短い順に並べた測定対象        |
| `results`      | `ElapsedTimes[]`                | 周ごとの関数ごとの時間                  |
| `returnValues` | `{ [id: string]: R              | undefined }`                            | 関数ごとの最後の戻り値 |
| `start`        | `Date`                          | 測定の開始日時                          |
| `end`          | `Date`                          | 測定の終了日時                          |
| `id?`          | `string`                        | 測定の ID                               |

#### `comparePerformanceAsync`

```ts
comparePerformanceAsync<A extends unknown[] = unknown[], R = unknown>(options: ComparePerformanceAsyncOptions<A>): Promise<ComparePerformanceAsyncResult<A, R>>
```

`comparePerformance` の非同期関数版です。各関数の実行は1つずつ順番に行います。オプションと戻り値は `comparePerformance` と同じです。

#### `measure`

```ts
measure<A extends unknown[] = unknown[], R = unknown>(fn: (...args: A) => R, options?: MeasureOptions<A>): MeasureResult<R>
```

`fn` を `iterations` 回実行し、合計の実行時間（ミリ秒）と最後の戻り値を返します。時間は `performance.now()` で測定します。

```ts
const { time, returnValue } = measure(() => heavyCalc(), { iterations: 100 });
```

| オプション    | 型        | 説明                                                             |
| ------------- | --------- | ---------------------------------------------------------------- |
| `iterations?` | `number`  | 実行する回数。デフォルトは `10`                                  |
| `args?`       | `A`       | 関数に渡す引数                                                   |
| `getArgs?`    | `() => A` | 実行するたびに引数を作る関数。指定した場合は `args` より優先する |

| プロパティ    | 型               | 説明                       |
| ------------- | ---------------- | -------------------------- |
| `time`        | `number`         | 合計の実行時間（ミリ秒）   |
| `returnValue` | `R \| undefined` | 最後に実行したときの戻り値 |

#### `measureAsync`

```ts
measureAsync<A extends unknown[] = unknown[], R = unknown>(fn: (...args: A) => Promise<R>, options?: MeasureAsyncOptions<A>): Promise<MeasureAsyncResult<R>>
```

`measure` の非同期関数版です。`fn` を1回ずつ順番に実行し、完了を待ってから次を実行します。オプションと戻り値は `measure` と同じです。

#### 型

| 型                                     | 説明                                              |
| -------------------------------------- | ------------------------------------------------- |
| `ComparePerformanceOptions<A, R>`      | `comparePerformance` のオプション                 |
| `ComparePerformanceResult<A, R>`       | `comparePerformance` の戻り値                     |
| `ComparePerformanceTarget<A, R>`       | 測定する関数 `{ id, fn }`                         |
| `ComparePerformanceAsyncOptions<A, R>` | `ComparePerformanceOptions<A, Promise<R>>` と同じ |
| `ComparePerformanceAsyncResult<A, R>`  | `ComparePerformanceResult<A, R>` と同じ           |
| `ElapsedTimes`                         | 関数の ID ごとの時間 `{ [id: string]: number }`   |
| `MeasureOptions<A>`                    | `measure` のオプション                            |
| `MeasureResult<R>`                     | `measure` の戻り値                                |
| `MeasureAsyncOptions<A>`               | `MeasureOptions<A>` と同じ                        |
| `MeasureAsyncResult<R>`                | `MeasureResult<R>` と同じ                         |

### number

| 関数                                              | 説明                                               |
| ------------------------------------------------- | -------------------------------------------------- |
| `clampInRange(value, min, max)`                   | 値を最小値〜最大値の範囲に収める                   |
| `ensureNumber(data)`                              | 値を数値にする                                     |
| `getValidMinMax(min, max, options?)`              | 最小値と最大値を正しい順序にして返す               |
| `getValidNumber(value, options?)`                 | 有効な数値でない場合に代わりの値を返す             |
| `isStrictlyWithinRange(value, min, max)`          | 値が範囲内か判定する（境界を含まない）             |
| `isWithinRange(value, min, max)`                  | 値が範囲内か判定する（境界を含む）                 |
| `keepInRange(value, min, max, options?)`          | 範囲外の場合の扱いを指定して、値を範囲内に収める   |
| `lerpNumber(value, ratio, options?)`              | 基準値と目標値の間を割合で補間する                 |
| `limitNaturalNumber(value, options?)`             | 値を自然数（1 以上の整数）に制限する               |
| `limitPositiveNumber(value, options?)`            | 値を正の数に制限する                               |
| `loopInRange(value, min, max)`                    | 範囲がループしているものとして、値を範囲内に収める |
| `pingpongInRange(value, min, max)`                | 範囲の端で折り返すものとして、値を範囲内に収める   |
| `replaceOutOfRange(value, min, max, replacement)` | 範囲外の場合に指定の値に置き換える                 |
| `roundToStep(data, step)`                         | 値を指定の刻み幅で四捨五入する                     |

#### `clampInRange`

```ts
clampInRange(value: number, min: number, max: number): number
clampInRange.dataLast(min: number, max: number): (value: number) => number
```

`value` が `min` を下回る場合は `min`、`max` を上回る場合は `max`、それ以外の場合は `value` を返します。

```ts
clampInRange(150, 0, 100); // 100
clampInRange(-10, 0, 100); // 0
```

#### `ensureNumber`

```ts
ensureNumber(data: unknown): number
ensureNumber.dataLast(): (data: unknown) => number
```

値を数値にします。数値はそのまま返し（`NaN` は `0`）、文字列は `Number()` で変換します。変換できない文字列、`null`、`undefined`、真偽値、オブジェクトなどは `0` になります。

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

`min` と `max` を、小さい方・大きい方の順に並べた配列を返します。`null` / `undefined` の場合はデフォルト値を使います。

```ts
getValidMinMax(10, 1); // [1, 10]
getValidMinMax(null, 5); // [-Infinity, 5]
```

| オプション    | 型       | 説明                                               |
| ------------- | -------- | -------------------------------------------------- |
| `defaultMin?` | `number` | `min` が未指定の場合の値。デフォルトは `-Infinity` |
| `defaultMax?` | `number` | `max` が未指定の場合の値。デフォルトは `Infinity`  |

#### `getValidNumber`

```ts
getValidNumber(value: number | null | undefined, options?: GetValidNumberOptions): number
getValidNumber.dataLast(options?: GetValidNumberOptions): (value: number | null | undefined) => number
```

`value` が有効な数値（`isValidNumber` が `true`）の場合はそのまま返し、それ以外の場合は `invalidValue` を返します。

```ts
getValidNumber(NaN); // 0
getValidNumber(Infinity, { invalidValue: -1 }); // -1
getValidNumber(Infinity, { allowInfinity: true }); // Infinity
```

| オプション       | 型        | 説明                                                       |
| ---------------- | --------- | ---------------------------------------------------------- |
| `invalidValue?`  | `number`  | 有効な数値でない場合に返す値。デフォルトは `0`             |
| `allowInfinity?` | `boolean` | `true` の場合、`Infinity` / `-Infinity` も有効な数値とする |

#### `isStrictlyWithinRange`

```ts
isStrictlyWithinRange(value: number, min: number, max: number): boolean
isStrictlyWithinRange.dataLast(min: number, max: number): (value: number) => boolean
```

`value` が `min` より大きく、`max` より小さい場合に `true` を返します。

#### `isWithinRange`

```ts
isWithinRange(value: number, min: number, max: number): boolean
isWithinRange.dataLast(min: number, max: number): (value: number) => boolean
```

`value` が `min` 以上、`max` 以下の場合に `true` を返します。

#### `keepInRange`

```ts
keepInRange(value: number, min: number, max: number, options?: KeepInRangeOptions): number
keepInRange.dataLast(min: number, max: number, options?: KeepInRangeOptions): (value: number) => number
```

`value` を `min` 〜 `max` の範囲に収めます。範囲外の場合の扱いは `mode` で指定し、最小値を下回った場合と最大値を上回った場合で別々に指定することもできます。

```ts
keepInRange(15, 0, 10); // 10
keepInRange(15, 0, 10, { mode: 'loop' }); // 5
keepInRange(-1, 0, 10, { minMode: 'max' }); // 10
keepInRange(15, 0, 10, { mode: 'replace', outOfRangeValue: -1 }); // -1
```

| オプション         | 型          | 説明                                                                                                                                                                                                   |
| ------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mode?`            | `RangeMode` | 範囲外の場合の扱い。`'clamp'`: 近い方の端の値、`'min'`: 最小値、`'max'`: 最大値、`'loop'`: `loopInRange` と同じ、`'pingpong'`: `pingpongInRange` と同じ、`'replace'`: 指定の値。デフォルトは `'clamp'` |
| `minMode?`         | `RangeMode` | 最小値を下回った場合の扱い。デフォルトは `mode` と同じ                                                                                                                                                 |
| `maxMode?`         | `RangeMode` | 最大値を上回った場合の扱い。デフォルトは `mode` と同じ                                                                                                                                                 |
| `outOfRangeValue?` | `number`    | `'replace'` の場合に返す値。デフォルトは `0`                                                                                                                                                           |
| `belowMinValue?`   | `number`    | 最小値を下回り、`minMode` が `'replace'` の場合に返す値。デフォルトは `outOfRangeValue` と同じ                                                                                                         |
| `aboveMaxValue?`   | `number`    | 最大値を上回り、`maxMode` が `'replace'` の場合に返す値。デフォルトは `outOfRangeValue` と同じ                                                                                                         |

#### `lerpNumber`

```ts
lerpNumber(value: number, ratio: number, options?: LerpNumberOptions): number
lerpNumber.dataLast(ratio: number, options?: LerpNumberOptions): (value: number) => number
```

基準値（`baseValue`）から目標値（`value`）までを `ratio` の割合で線形補間した値を返します。

```ts
lerpNumber(100, 0.5); // 50
lerpNumber(200, 0.25, { baseValue: 100 }); // 125
```

| オプション   | 型       | 説明                           |
| ------------ | -------- | ------------------------------ |
| `baseValue?` | `number` | 補間の基準値。デフォルトは `0` |

#### `limitNaturalNumber`

```ts
limitNaturalNumber(value: number | null | undefined, options?: LimitNaturalNumberOptions): number | null | undefined
```

値を自然数（1 以上の整数）にします。小数は切り捨てます。切り捨てた結果が `0` になる場合は `zeroValue` を返します。それ以外のオプションは `limitPositiveNumber` と同じです。オプションで指定した値は切り捨てずにそのまま返します。

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

値を正の数（0 より大きい数）にします。正の数はそのまま返し、それ以外の場合はオプションで指定した値を返します。

```ts
limitPositiveNumber(1.5); // 1.5
limitPositiveNumber(-1); // null
limitPositiveNumber(-1, { negativeValue: 'abs' }); // 1
limitPositiveNumber(0, { zeroValue: 0 }); // 0
```

| オプション       | 型                                     | 説明                                                                        |
| ---------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| `negativeValue?` | `number \| null \| undefined \| 'abs'` | 値が負の数の場合に返す値。`'abs'` の場合は絶対値を返す。デフォルトは `null` |
| `zeroValue?`     | `number \| null \| undefined`          | 値が `0` の場合に返す値。デフォルトは `null`                                |
| `nanValue?`      | `number \| null \| undefined`          | 値が `NaN` の場合に返す値。デフォルトは `null`                              |
| `defaultValue?`  | `number`                               | 値が `null` / `undefined` の場合に返す値。デフォルトは値をそのまま返す      |

#### `loopInRange`

```ts
loopInRange(value: number, min: number, max: number): number
loopInRange.dataLast(min: number, max: number): (value: number) => number
```

範囲がループしているものとして、範囲外の `value` を範囲内の値にします。範囲内の値（`min`・`max` を含む）はそのまま返します。

```ts
loopInRange(12, 0, 10); // 2
loopInRange(-1, 0, 10); // 9
```

#### `pingpongInRange`

```ts
pingpongInRange(value: number, min: number, max: number): number
pingpongInRange.dataLast(min: number, max: number): (value: number) => number
```

範囲の端で折り返して往復するものとして、範囲外の `value` を範囲内の値にします。

```ts
pingpongInRange(12, 0, 10); // 8
pingpongInRange(-2, 0, 10); // 2
```

#### `replaceOutOfRange`

```ts
replaceOutOfRange(value: number, min: number, max: number, replacement: number): number
replaceOutOfRange.dataLast(min: number, max: number, replacement: number): (value: number) => number
```

`value` が範囲内（`min` 以上 `max` 以下）の場合はそのまま返し、範囲外の場合は `replacement` を返します。

#### `roundToStep`

```ts
roundToStep(data: number, step: number): number
roundToStep.dataLast(step: number): (data: number) => number
```

`data` を `step` の倍数のうち最も近い値に四捨五入します。計算は浮動小数点数で行うため、小数の `step` では誤差が出ることがあります。

```ts
roundToStep(7, 5); // 5
roundToStep(8, 5); // 10
```

#### 定数

| 定数        | 説明                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------- |
| `RangeMode` | `keepInRange` の範囲外の場合の扱い。`clamp`、`min`、`max`、`loop`、`pingpong`、`replace` |

#### 型

| 型                           | 説明                                   |
| ---------------------------- | -------------------------------------- |
| `GetValidMinMaxOptions`      | `getValidMinMax` のオプション          |
| `GetValidNumberOptions`      | `getValidNumber` のオプション          |
| `KeepInRangeOptions`         | `keepInRange` のオプション             |
| `LerpNumberOptions`          | `lerpNumber` のオプション              |
| `LimitNaturalNumberOptions`  | `LimitPositiveNumberOptions` と同じ    |
| `LimitPositiveNumberOptions` | `limitPositiveNumber` のオプション     |
| `RangeMode`                  | `keepInRange` の範囲外の場合の扱いの値 |

### object

| 関数                                                   | 説明                                                                    |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `assignDefined(target, values, options?)`              | `undefined` でない値だけを代入した新しいオブジェクトを返す              |
| `assignDefinedMutable(target, values, options?)`       | `undefined` でない値だけを代入する（破壊的）                            |
| `cloneDeep(value)`                                     | 値を深くコピーする                                                      |
| `cloneShallow(value)`                                  | 値を浅くコピーする                                                      |
| `countKeys(obj)`                                       | オブジェクトの列挙可能なプロパティの数を返す                            |
| `distribute(data, rules, options?)`                    | プロパティをルールに従って複数のオブジェクトに分ける                    |
| `exactKeys<T>()(keys)`                                 | 型のキーを過不足なく列挙した配列であることをコンパイル時に検査する      |
| `exactKeysFromRecord<T>(keys)`                         | 型の全てのキーを持つオブジェクトからキーの配列を作る                    |
| `fillDefaults(target, defaultValues, options?)`        | 値の無いプロパティをデフォルト値で埋めた新しいオブジェクトを返す        |
| `fillDefaultsMutable(target, defaultValues, options?)` | 値の無いプロパティをデフォルト値で埋める（破壊的）                      |
| `filterByKeys(target, condition, options?)`            | 条件に合うキーのプロパティだけを残す                                    |
| `filterByValues(target, condition, options?)`          | 条件に合う値だけを残す                                                  |
| `flattenObject(data, options?)`                        | ネストしたオブジェクトを1階層にする                                     |
| `forEachValue(target, callback, options?)`             | 各プロパティの値でコールバックを実行する                                |
| `get(data, path)`                                      | パスで指定したプロパティの値を返す                                      |
| `maybeHasOwn(data, key)`                               | オブジェクトが指定のプロパティを自身で持つか判定する（`null` でも安全） |
| `omit(data, keys)`                                     | 指定のキーのプロパティを除いた新しいオブジェクトを返す                  |
| `overrideInstance(instance, overrides)`                | インスタンスのプロパティを上書きするプロキシを作る                      |
| `set(data, path, value)`                               | パスで指定したプロパティに値を設定した新しいオブジェクトを返す          |
| `setMutable(data, path, value)`                        | パスで指定したプロパティに値を設定する（破壊的）                        |
| `stableStringify(value, space?)`                       | キーを並べ替えて JSON 文字列にする                                      |
| `transformObject(source, rules, options?)`             | ルールに従ってオブジェクトの構造を変換する                              |
| `unset(data, path)`                                    | パスで指定したプロパティを削除した新しいオブジェクトを返す              |
| `unsetMutable(data, path)`                             | パスで指定したプロパティを削除する（破壊的）                            |
| `update(object, values, options?)`                     | 値が変わるプロパティだけを更新した新しいオブジェクトを返す              |
| `updateMutable(object, values, options?)`              | 値が変わるプロパティだけを更新し、更新前の値を返す（破壊的）            |

#### `assignDefined`

```ts
assignDefined<T extends LooseRecord, V extends LooseRecord>(target: T, values: V, options?: AssignDefinedOptions): AssignDefinedResult<T, V>
assignDefined.dataLast<V extends LooseRecord>(values: V, options?: AssignDefinedOptions): <T extends LooseRecord>(target: T) => AssignDefinedResult<T, V>
```

`values` の各プロパティのうち、値が `undefined` でないものだけを `target` に代入した新しいオブジェクトを返します。`target` か `values` が `null` / `undefined` の場合は `target` をそのまま返します。

```ts
assignDefined({ a: 1, b: 2 }, { a: undefined, b: null, c: 3 }); // { a: 1, b: null, c: 3 }
assignDefined({ a: 1, b: 2 }, { b: null }, { skipNull: true }); // { a: 1, b: 2 }
```

| オプション          | 型        | 説明                                                           |
| ------------------- | --------- | -------------------------------------------------------------- |
| `skipNull?`         | `boolean` | `true` の場合、値が `null` のプロパティも代入しない            |
| `includeInherited?` | `boolean` | `true` の場合、`values` の継承したプロパティも代入の対象にする |

#### `assignDefinedMutable`

```ts
assignDefinedMutable<T extends LooseRecord, V extends LooseRecord>(target: T, values: V, options?: AssignDefinedMutableOptions): AssignDefinedResult<T, V>
```

`assignDefined` の破壊的な版です。`target` に直接代入し、同じオブジェクトを返します。オプションは `assignDefined` と同じです。

#### `cloneDeep`

```ts
cloneDeep<T>(value: T): T
```

値を深くコピーします。[klona/full](https://github.com/lukeed/klona) を使い、`Map`・`Set`・`Date`・`RegExp`・TypedArray やプロパティの記述子、シンボルのプロパティも複製します。

#### `cloneShallow`

```ts
cloneShallow<T>(value: T): T
```

値を浅くコピーします。オブジェクト（プロトタイプを引き継ぐ）・配列・`Map`・`Set`・`Date`・`RegExp`・`ArrayBuffer`・TypedArray・`DataView` に対応し、プロパティの記述子やシンボルのプロパティも引き継ぎます。プリミティブや対応していない値はそのまま返します。

#### `countKeys`

```ts
countKeys(obj: unknown): number
```

オブジェクトの自身の列挙可能なプロパティの数（`Object.keys(obj).length`）を返します。オブジェクトでない値の場合は `0` を返します。

#### `distribute`

```ts
distribute<T extends LooseRecord, DR extends DistributeRules<T>>(data: T, rules: DR, options?: DistributeOptions): DistributeResult<T, DR>
distribute.dataLast<T extends LooseRecord, DR extends DistributeRules<T>>(rules: DR, options?: DistributeOptions): (data: T) => DistributeResult<T, DR>
```

`data` の直下のプロパティを、`rules` に従って複数のオブジェクトに分けます。`rules` にはグループ名とプロパティ名の配列を指定し、`null` を指定したグループには、他のどのグループにも入らなかったプロパティが入ります。戻り値の型も、グループごとに指定したプロパティを持つ型になります。

```ts
const { identity, rest } = distribute(user, {
  identity: ['id', 'name'],
  rest: null,
});
// identity: { id, name }
// rest: user のそれ以外のプロパティ
```

| オプション          | 型        | 説明                                                |
| ------------------- | --------- | --------------------------------------------------- |
| `includeInherited?` | `boolean` | `true` の場合、継承したプロパティも分ける対象にする |
| `cloneValue?`       | `boolean` | `true` の場合、値を複製して分ける                   |

#### `exactKeys`

```ts
exactKeys<T>(): <const K extends readonly (keyof T)[]>(keys: K) => K
```

型 `T` のキーを過不足なく、重複なく列挙した配列であることをコンパイル時に検査します。実行時は受け取った配列をそのまま返します。`T` を明示し、キーの配列は推論させるため、2段階で呼び出します。

```ts
type User = { id: number; name: string; age: number };

const userKeys = exactKeys<User>()(['id', 'name', 'age']); // readonly ['id', 'name', 'age']
exactKeys<User>()(['id', 'name']); // 型エラー: __missingKeys: 'age'
exactKeys<User>()(['id', 'name', 'age', 'id']); // 型エラー: __duplicateKeys: 'id'
```

#### `exactKeysFromRecord`

```ts
exactKeysFromRecord<T>(keys: Record<keyof T, true>): (keyof T)[]
```

型 `T` の全てのキーを持ち、値が `true` のオブジェクトから、キーの配列を作ります。キーの不足・重複・余分は TypeScript の通常のチェックでエラーになります。戻り値の順序はオブジェクトのキーの順序に従うため、整数として扱われるキーは先頭に昇順で並びます。キーの並びをリテラルのタプル型で受け取りたい場合は `exactKeys` を使います。

```ts
const userKeys = exactKeysFromRecord<User>({ id: true, name: true, age: true }); // ('id' | 'name' | 'age')[]
```

#### `fillDefaults`

```ts
fillDefaults<T extends LooseRecord, V extends LooseRecord>(target: T, defaultValues: V, options?: FillDefaultsOptions): FillDefaultsResult<T, V>
fillDefaults.dataLast<V extends LooseRecord>(defaultValues: V, options?: FillDefaultsOptions): <T extends LooseRecord>(target: T) => FillDefaultsResult<T, V>
```

`target` のプロパティの値が `undefined` の場合に、`defaultValues` の値を設定した新しいオブジェクトを返します。`defaultValues` の値が `undefined` の場合は設定しません。`target` か `defaultValues` が `null` / `undefined` の場合は `target` をそのまま返します。

```ts
fillDefaults({ a: undefined, b: null, c: 1 }, { a: 1, b: 2, c: 3, d: 4 }); // { a: 1, b: null, c: 1, d: 4 }
fillDefaults({ b: null }, { b: 2 }, { overwriteNull: true }); // { b: 2 }
```

| オプション          | 型        | 説明                                                                  |
| ------------------- | --------- | --------------------------------------------------------------------- |
| `overwriteNull?`    | `boolean` | `true` の場合、`target` の値が `null` のプロパティにも設定する        |
| `skipNull?`         | `boolean` | `true` の場合、`defaultValues` の値が `null` のプロパティは設定しない |
| `includeInherited?` | `boolean` | `true` の場合、`defaultValues` の継承したプロパティも対象にする       |

#### `fillDefaultsMutable`

```ts
fillDefaultsMutable<T extends LooseRecord, V extends LooseRecord>(target: T, defaultValues: V, options?: FillDefaultsMutableOptions): FillDefaultsResult<T, V>
```

`fillDefaults` の破壊的な版です。`target` に直接設定し、同じオブジェクトを返します。オプションは `fillDefaults` と同じです。

#### `filterByKeys`

```ts
filterByKeys<T = unknown>(target: T, condition: PropertyKey, options?: FilterByKeysOptions): T | null
filterByKeys.dataLast(condition: PropertyKey, options?: FilterByKeysOptions): <T = unknown>(target: T) => T | null
```

オブジェクトや配列を再帰的にたどり、キーが条件に合うプロパティだけを残した新しい値を返します。`condition` が文字列の場合はキーに含まれるか（部分一致）、それ以外の場合はキーと等しいかで判定します。条件に合ったプロパティは値ごと残し、合わなかったプロパティは値の中をさらにたどります。条件に合うものが1つもない場合は `null` を返します。配列は元のインデックスを保ち、条件に合わなかった位置は空き要素になります。

```ts
filterByKeys({ a: { name: 1, x: 2 }, y: [{ name: 3 }] }, 'name');
// { a: { name: 1 }, y: [{ name: 3 }] }
filterByKeys({ UserName: 'A', age: 1 }, 'username', {
  normalize: (value) => value.toLowerCase(),
});
// { UserName: 'A' }
```

| オプション   | 型                          | 説明                                                                                       |
| ------------ | --------------------------- | ------------------------------------------------------------------------------------------ |
| `normalize?` | `(value: string) => string` | 文字列の条件で比較する際に、キーと条件を正規化する関数。省略した場合は正規化せずに比較する |

#### `filterByValues`

```ts
filterByValues<T = unknown>(target: T, condition: unknown, options?: FilterByValuesOptions): T | null
filterByValues.dataLast(condition: unknown, options?: FilterByValuesOptions): <T = unknown>(target: T) => T | null
```

オブジェクトや配列を再帰的にたどり、値が条件に合う要素だけを残した新しい値を返します。`condition` が文字列の場合は文字列の値に含まれるか（部分一致）、それ以外の場合は値と等しいか（`===`）で判定します。残す要素や `null` を返す条件、配列の扱いは `filterByKeys` と同じです。

```ts
filterByValues({ a: 'Alice', b: 'Bob', c: { d: 'Alan' } }, 'Al');
// { a: 'Alice', c: { d: 'Alan' } }
filterByValues({ a: 1, b: 2, c: 1 }, 1); // { a: 1, c: 1 }
```

| オプション   | 型                          | 説明                                                                                     |
| ------------ | --------------------------- | ---------------------------------------------------------------------------------------- |
| `normalize?` | `(value: string) => string` | 文字列の条件で比較する際に、値と条件を正規化する関数。省略した場合は正規化せずに比較する |

#### `flattenObject`

```ts
flattenObject(data: LooseRecord, options?: FlattenObjectOptions): LooseRecord
flattenObject.dataLast(options?: FlattenObjectOptions): (data: LooseRecord) => LooseRecord
```

ネストしたプレーンなオブジェクトと配列を、キーのパスを連結した1階層のオブジェクトにします。

```ts
flattenObject({ a: { b: [1, { c: 2 }] } }); // { 'a.b.0': 1, 'a.b.1.c': 2 }
flattenObject({ a: { b: [1] } }, { keepArrays: true }); // { 'a.b': [1] }
```

| オプション      | 型        | 説明                                                                                                      |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `keySeparator?` | `string`  | パスを連結する区切り文字。デフォルトは `'.'`                                                              |
| `keepArrays?`   | `boolean` | `true` の場合、配列は展開せずにそのまま値にする。デフォルトは `false`                                     |
| `leafKeysOnly?` | `boolean` | `true` の場合、パスを連結せずに末端のキーだけをキーにする（同じキーは上書きされる）。デフォルトは `false` |

#### `forEachValue`

```ts
forEachValue<T extends LooseRecord>(target: T, callback: (value: unknown, key: PropertyKey, obj: T) => void | boolean, options?: ForEachValueOptions): boolean
forEachValue.dataLast<T extends LooseRecord>(callback: (value: unknown, key: PropertyKey, obj: T) => void | boolean, options?: ForEachValueOptions): (target: T) => boolean
```

オブジェクトの自身の列挙可能なプロパティごとに `callback` を実行します。`callback` が `false` を返すと処理を中断します。最後まで処理した場合は `true`、中断した場合は `false` を返します。

| オプション          | 型        | 説明                                          |
| ------------------- | --------- | --------------------------------------------- |
| `includeInherited?` | `boolean` | `true` の場合、継承したプロパティも対象にする |

#### `get`

```ts
get<T, R = unknown>(data: T, path: PropertyKey | PropertyKey[]): R | undefined
get.dataLast<T, R = unknown>(path: PropertyKey | PropertyKey[]): (data: T) => R | undefined
```

パスで指定したプロパティの値を返します。パスは `'a.b[0]'` や `'a.b.0'` のような文字列か、キーの配列で指定します。途中のプロパティが無い場合や `data` が `null` / `undefined` の場合は `undefined` を返します。

```ts
get({ a: { b: [{ c: 1 }] } }, 'a.b[0].c'); // 1
get({ a: { b: [{ c: 1 }] } }, ['a', 'b', 0, 'c']); // 1
```

#### `maybeHasOwn`

```ts
maybeHasOwn(data: object | null | undefined, key: PropertyKey): boolean
```

`data` が `key` のプロパティを自身で持つか判定します（`Object.hasOwn`）。`data` が `null` / `undefined` の場合は `false` を返します。

#### `omit`

```ts
omit<T, R = unknown>(data: T, keys: PropertyKey | readonly PropertyKey[]): R | undefined
omit.dataLast<T, R = unknown>(keys: PropertyKey | readonly PropertyKey[]): (data: T) => R | undefined
```

`keys` のプロパティを除いた新しいオブジェクトを返します。キーはパスとして解釈しません（ネストしたプロパティを削除する場合は `unset` を使います）。`data` が `null` / `undefined` の場合は `undefined` を返します。

```ts
omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { b: 2 }
```

#### `overrideInstance`

```ts
overrideInstance<I extends object, O extends Record<PropertyKey, (target: I, prop: string | symbol, receiver: any) => any>>(instance: I, overrides?: O): I & { [K in keyof O]: ReturnType<O[K]> }
```

`instance` のプロパティを上書きするプロキシを作ります。クラスを継承できない場合に、インスタンスのメソッドやプロパティを差し替えるために使います。`overrides` には、プロパティ名と、そのプロパティを読んだときの値を返す関数を指定します。

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

パスで指定したプロパティに `value` を設定した新しいオブジェクトを返します。パスの途中のオブジェクト・配列はコピーし、存在しない場合は作ります（次のキーが数値の場合は配列）。パスの指定方法は `get` と同じです。

```ts
set({ a: { b: 1 } }, 'a.c', 2); // { a: { b: 1, c: 2 } }
set({}, 'a[0].b', 1); // { a: [{ b: 1 }] }
```

#### `setMutable`

```ts
setMutable<T extends object>(data: T, path: string | PropertyKey[], value: unknown): T
setMutable.dataLast<T extends object>(path: string | PropertyKey[], value: unknown): (data: T) => T
```

`set` の破壊的な版です。`data` を直接変更し、同じオブジェクトを返します。

#### `stableStringify`

```ts
stableStringify(value: unknown, space?: string | number): string
```

オブジェクトのキーを再帰的に昇順に並べ替えてから、JSON 文字列にします。キーの順序に関わらず同じ内容のオブジェクトは同じ文字列になるため、キャッシュのキーなどに使えます。`toJSON` を持つ値（`Date` など）は `JSON.stringify` と同じく `toJSON` の結果を使います。`space` は `JSON.stringify` の `space` と同じです。

```ts
stableStringify({ b: 2, a: { d: 1, c: 2 } }); // '{"a":{"c":2,"d":1},"b":2}'
```

#### `transformObject`

```ts
transformObject<T extends LooseRecord = LooseRecord, S extends LooseRecord = LooseRecord>(source: S, rules: (string | TransformObjectRule<S, T>)[], options?: TransformObjectOptions): T
transformObject.dataLast<T extends LooseRecord = LooseRecord, S extends LooseRecord = LooseRecord>(rules: (string | TransformObjectRule<S, T>)[], options?: TransformObjectOptions): (source: S) => T
```

`rules` に従って `source` から値を取り出し、新しいオブジェクトを作ります。文字列のルールは、同じパスで取り出して設定します。取り出した値が `undefined` の場合は設定しません。`removeFromSource` を指定した場合は `source` を直接変更します。

```ts
transformObject({ firstName: 'Alice', age: 30 }, [
  'age',
  { from: 'firstName', to: 'user.name' },
  { from: (source) => source.age * 2, to: 'doubleAge' },
]);
// { age: 30, user: { name: 'Alice' }, doubleAge: 60 }
```

| ルールのプロパティ  | 型                                             | 説明                                                                                                  |
| ------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `from`              | `string \| ((source: S) => unknown)`           | 取り出すパス、または値を返す関数                                                                      |
| `to?`               | `string \| ((target: T, value: unknown) => T)` | 設定するパス、または値を設定したオブジェクトを返す関数。省略した場合は `from` と同じパス              |
| `removeFromSource?` | `boolean`                                      | `true` の場合、取り出した後に `source` からプロパティを削除する。省略した場合はオプションの指定に従う |

| オプション          | 型        | 説明                                                                                                                |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `removeFromSource?` | `boolean` | `true` の場合、パスで指定したルールについて、取り出した後に `source` からプロパティを削除する。デフォルトは `false` |

#### `unset`

```ts
unset<T extends LooseRecord>(data: T, path: string | PropertyKey[]): T
unset.dataLast<T extends LooseRecord>(path: string | PropertyKey[]): (data: T) => T
```

パスで指定したプロパティを削除した新しいオブジェクトを返します。配列の要素を削除した場合は後ろの要素を詰めます。パスが存在しない場合は `data` をそのまま返します。パスの指定方法は `get` と同じです。

```ts
unset({ a: { b: 1, c: 2 } }, 'a.b'); // { a: { c: 2 } }
unset({ a: [1, 2, 3] }, 'a[1]'); // { a: [1, 3] }
```

#### `unsetMutable`

```ts
unsetMutable<T extends LooseRecord>(data: T, path: string | PropertyKey[]): T
unsetMutable.dataLast<T extends LooseRecord>(path: string | PropertyKey[]): (data: T) => T
```

`unset` の破壊的な版です。`data` を直接変更し、同じオブジェクトを返します。

#### `update`

```ts
update<T extends LooseRecord>(object: T, values: Partial<T>, options?: UpdateOptions): T
update.dataLast(values: LooseRecord, options?: UpdateOptions): <T extends LooseRecord>(object: T) => T
```

`values` の各プロパティのうち、`object` の値と異なるものだけを更新した新しいオブジェクトを返します。どのプロパティも変わらない場合は `object` をそのまま返すため、参照の比較で変更の有無を判定できます。値の比較方法は `isEqual` のオプションで指定します。

```ts
const state = { a: 1, b: 2 };
update(state, { a: 9 }); // { a: 9, b: 2 }（新しいオブジェクト）
update(state, { a: 1 }) === state; // true
update({ a: { x: 1 } }, { a: { x: 1 } }, { mode: 'deep' }); // 元のオブジェクト
```

| オプション    | 型            | 説明                             |
| ------------- | ------------- | -------------------------------- |
| `mode?`       | `CompareMode` | 値の比較方法。`isEqual` と同じ   |
| `customizer?` | `function`    | 独自の比較関数。`isEqual` と同じ |

#### `updateMutable`

```ts
updateMutable<T extends LooseRecord>(object: T | null | undefined, values: Partial<T> | null | undefined, options?: UpdateMutableOptions): Partial<T>
updateMutable.dataLast<T extends LooseRecord>(values: Partial<T> | null | undefined, options?: UpdateMutableOptions): (object: T | null | undefined) => Partial<T>
```

`update` の破壊的な版です。`object` を直接更新し、更新したプロパティの更新前の値を持つオブジェクトを返します。オプションは `update` と同じです。

```ts
const state = { a: 1, b: 2 };
updateMutable(state, { a: 9, b: 2 }); // { a: 1 }（state は { a: 9, b: 2 }）
```

#### 型

| 型                            | 説明                                                                                                                                                                    |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssignDefinedMutableOptions` | `assignDefinedMutable` のオプション                                                                                                                                     |
| `AssignDefinedOptions`        | `AssignDefinedMutableOptions` と同じ                                                                                                                                    |
| `AssignDefinedResult<T, V>`   | `assignDefined`・`assignDefinedMutable` の戻り値。`values` の値が `undefined`（`skipNull` の場合は `null` も）で反映されない可能性があるキーは、`target` の値の型も残る |
| `DistributeOptions`           | `distribute` のオプション                                                                                                                                               |
| `DistributeRules<T>`          | `distribute` のルール `{ [group]: プロパティ名の配列 \| null }`                                                                                                         |
| `DistributePropertyList<T>`   | `distribute` のルールに指定するプロパティ名の配列                                                                                                                       |
| `DistributeResult<T, R>`      | `distribute` の戻り値                                                                                                                                                   |
| `FillDefaultsMutableOptions`  | `fillDefaultsMutable` のオプション                                                                                                                                      |
| `FillDefaultsOptions`         | `FillDefaultsMutableOptions` と同じ                                                                                                                                     |
| `FillDefaultsResult<T, V>`    | `fillDefaults`・`fillDefaultsMutable` の戻り値。`target` の値が `undefined`（`overwriteNull` の場合は `null` も）のキーには、`defaultValues` の値の型が加わる           |
| `FilterByKeysOptions`         | `filterByKeys` のオプション                                                                                                                                             |
| `FilterByValuesOptions`       | `filterByValues` のオプション                                                                                                                                           |
| `FlattenObjectOptions`        | `flattenObject` のオプション                                                                                                                                            |
| `ForEachValueOptions`         | `forEachValue` のオプション                                                                                                                                             |
| `TransformObjectOptions`      | `transformObject` のオプション                                                                                                                                          |
| `TransformObjectRule<S, T>`   | `transformObject` のルール                                                                                                                                              |
| `UpdateMutableOptions`        | `updateMutable` のオプション（`IsEqualOptions` と同じ）                                                                                                                 |
| `UpdateOptions`               | `UpdateMutableOptions` と同じ                                                                                                                                           |

### string

| 関数                                                | 説明                                             |
| --------------------------------------------------- | ------------------------------------------------ |
| `createExtractor(delimiters?)`                      | 囲み文字で囲まれた部分を抽出する関数を作る       |
| `ensureString(data)`                                | 値を文字列にする                                 |
| `escapeRegExp(target)`                              | 正規表現の特殊文字をエスケープする               |
| `isSurroundedBy(str, prefix, suffix?)`              | 指定の文字列で囲まれているか判定する             |
| `lowerFirst(str)`                                   | 先頭の文字を小文字にする                         |
| `maybeMatchAll(str, regexp)`                        | `matchAll` の結果を配列で返す（`null` でも安全） |
| `maybeReplace(str, pattern, replacement, options?)` | 文字列を置換する（`null` でも安全）              |
| `recaseCamel(data)` など                            | 文字列のケースを変換する                         |
| `replaceByMap(str, map)`                            | マップに従って文字列を置換する                   |
| `replacePlaceholders(template, values, options?)`   | テンプレートのプレースホルダーを値で置換する     |
| `upperFirst(str)`                                   | 先頭の文字を大文字にする                         |

#### `createExtractor`

```ts
createExtractor(delimiters?: string | [string, string]): CreateExtractorResult
```

`delimiters` で囲まれた部分を抽出する関数を作ります。囲み文字が1つの文字列の場合は、開始・終了で共通にします。デフォルトは `['{{', '}}']` です。作った関数は、抽出した文字列の配列を返します。

```ts
const extract = createExtractor();
extract('{{a}} and {{ b }} and {{a}}', { trim: true, unique: true }); // ['a', 'b']
createExtractor('%')('%x% %y%'); // ['x', 'y']
```

作った関数のオプションとプロパティは次のとおりです。

| オプション        | 型        | 説明                                                      |
| ----------------- | --------- | --------------------------------------------------------- |
| `keepDelimiters?` | `boolean` | `true` の場合、囲み文字を含めて返す。デフォルトは `false` |
| `trim?`           | `boolean` | `true` の場合、前後の空白を削除する。デフォルトは `false` |
| `unique?`         | `boolean` | `true` の場合、重複を除く。デフォルトは `false`           |

| プロパティ | 型       | 説明           |
| ---------- | -------- | -------------- |
| `prefix`   | `string` | 開始の囲み文字 |
| `suffix`   | `string` | 終了の囲み文字 |

#### `ensureString`

```ts
ensureString(data: unknown): string
ensureString.dataLast(): (data: unknown) => string
```

値を文字列にします。文字列はそのまま返し、`null` / `undefined` は空文字、それ以外の値は `String()` で変換します。

#### `escapeRegExp`

```ts
escapeRegExp(target: string): string
```

文字列を `RegExp` のコンストラクターに渡せるよう、正規表現の特殊文字（`- . * + ? ^ $ { } ( ) | [ ]` とバックスラッシュ）をエスケープします。`-` は標準の `RegExp.escape` と同じく `\x2d` にするため、`u` / `v` フラグを指定した場合や文字クラスの中でも使えます。

```ts
new RegExp(escapeRegExp('1.5*2')); // /1\.5\*2/
```

#### `isSurroundedBy`

```ts
isSurroundedBy(str: string, prefix: string, suffix?: string): boolean
isSurroundedBy.dataLast(prefix: string, suffix?: string): (str: string) => boolean
```

`str` が `prefix` で始まり `suffix` で終わるか判定します。`prefix` と `suffix` の間に1文字以上ある必要があります。`suffix` を省略した場合は `prefix` と同じです。

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

先頭の文字を小文字（`lowerFirst`）・大文字（`upperFirst`）にします。

#### `maybeMatchAll`

```ts
maybeMatchAll(str: string | null | undefined, regexp: RegExp): RegExpExecArray[]
```

`str.matchAll(regexp)` の結果を配列で返します。`str` が `null` / `undefined` / 空文字の場合は空配列を返します。`String.prototype.matchAll` と同じく、`regexp` には `g` フラグが必要です。

#### `maybeReplace`

```ts
maybeReplace(str: string | null | undefined, pattern: MaybeReplacePattern, replacement: string | ((substring: string, ...args: unknown[]) => string), options?: MaybeReplaceOptions): string | null | undefined
maybeReplace.dataLast(pattern: MaybeReplacePattern, replacement: ..., options?: MaybeReplaceOptions): (str: string | null | undefined) => string | null | undefined
```

文字列を置換します。`str` が `null` / `undefined` の場合はそのまま返します。`pattern` が文字列の場合は全ての一致を置換し（`replaceAll`）、正規表現の場合は `String.prototype.replace` と同じく `g` フラグの有無に従います。`pattern` に関数を指定した場合は、`options` を渡して呼び出した戻り値をパターンにします。

```ts
maybeReplace('a-b-c', '-', '_'); // 'a_b_c'
maybeReplace('a-b-c', /-/, '_'); // 'a_b-c'
maybeReplace(null, '-', '_'); // null
```

#### ケース変換

```ts
recaseCamel(data: string): string
recaseKebab(data: string): string
recaseLower(data: string): string
recasePascal(data: string): string
recaseScreamingSnake(data: string): string
recaseSnake(data: string): string
recaseTitle(data: string): string
recaseUpper(data: string): string
// いずれも dataLast(): (data: string) => string を持つ
```

文字列のケースを変換します。`recaseLower` / `recaseUpper` は単語を区切らずに全体を小文字・大文字にし、それ以外は単語の区切り（空白、`_`、`-`、大文字の位置など）を判断して変換します。`data` が空文字・`null`・`undefined` の場合はそのまま返します。

| 関数                   | `'hello world'` の変換結果 |
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

`map` のキーの文字列を値の文字列に置換します。一度にまとめて置換するため、置換した結果がさらに置換されることはありません。キーが重なる場合は長いキーを優先します。

```ts
replaceByMap('hello world', { hello: 'hi', world: 'earth' }); // 'hi earth'
replaceByMap('abcab', { ab: 'X', a: 'Y' }); // 'XcX'
```

#### `replacePlaceholders`

```ts
replacePlaceholders(template: string, values: Record<string, unknown> | unknown[], options?: ReplacePlaceholdersOptions): string
replacePlaceholders.dataLast(values: Record<string, unknown> | unknown[], options?: ReplacePlaceholdersOptions): (template: string) => string
```

`template` の中のプレースホルダー（デフォルトは `{{キー}}`）を `values` の値で置換します。キーは `get` と同じくパスとして解釈し、囲み文字の内側の前後の空白は無視します。値が `null` / `undefined` の場合はプレースホルダーをそのまま残します。

```ts
replacePlaceholders('{{ user.name }}さん、{{greeting}}', {
  user: { name: 'Alice' },
  greeting: 'こんにちは',
}); // 'Aliceさん、こんにちは'
replacePlaceholders('{{0}}と{{1}}', ['Alice', 'Bob']); // 'AliceとBob'
```

| オプション          | 型                           | 説明                                                                                               |
| ------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `delimiters?`       | `string \| [string, string]` | プレースホルダーの囲み文字。1つの文字列の場合は開始・終了で共通にする。デフォルトは `['{{', '}}']` |
| `removeUnresolved?` | `boolean`                    | `true` の場合、値が無いプレースホルダーを削除する                                                  |
| `flatKeys?`         | `boolean`                    | `true` の場合、キーをパスとして解釈せず、`values` の直下のプロパティ名として扱う                   |

#### 型

| 型                           | 説明                                                              |
| ---------------------------- | ----------------------------------------------------------------- |
| `CreateExtractorResult`      | `createExtractor` で作った関数                                    |
| `ExtractorOptions`           | `createExtractor` で作った関数のオプション                        |
| `MaybeReplaceOptions`        | `maybeReplace` のパターンを作る関数に渡すオプション               |
| `MaybeReplacePattern`        | `maybeReplace` のパターン（静的なパターンか、パターンを返す関数） |
| `MaybeReplaceStaticPattern`  | 静的なパターン（`string \| RegExp`）                              |
| `MaybeReplaceDynamicPattern` | パターンを返す関数                                                |
| `ReplacePlaceholdersOptions` | `replacePlaceholders` のオプション                                |

### timer

| 関数                              | 説明                                                |
| --------------------------------- | --------------------------------------------------- |
| `debounce(fn, wait, options?)`    | 呼び出しが落ち着いてから実行する関数を作る          |
| `setLongTimeout(callback, delay)` | `setTimeout` の上限を超える長さのタイマーを設定する |
| `sleep(ms)`                       | 指定の時間待つ `Promise` を返す                     |
| `throttle(fn, wait, options?)`    | 一定の時間に1回まで実行する関数を作る               |

#### `debounce`

```ts
debounce<ARGS extends unknown[]>(fn: (...args: ARGS) => void, wait: number, options?: DebounceOptions): DebounceResult<ARGS>
```

最後の呼び出しから `wait` ミリ秒の間、呼び出しが無かった場合に `fn` を実行する関数を作ります。`fn` には最後の呼び出しの引数を渡します。

```ts
const onInput = debounce((value: string) => search(value), 300);
```

| オプション   | 型                           | 説明                                                                                                                     |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `triggerAt?` | `'end' \| 'start' \| 'both'` | 実行するタイミング。`'end'`: 呼び出しが落ち着いた後、`'start'`: 最初の呼び出しの時、`'both'`: 両方。デフォルトは `'end'` |

作った関数は次のメソッドを持ちます。

| メソッド   | 説明                                   |
| ---------- | -------------------------------------- |
| `cancel()` | 保留中の実行を取り消す                 |
| `flush()`  | 保留中の実行をすぐに行う               |
| `isIdle()` | 保留中の実行が無い場合に `true` を返す |

#### `setLongTimeout`

```ts
setLongTimeout(callback: () => void, delay: number): () => void
```

`delay` ミリ秒後に `callback` を実行します。`setTimeout` の上限（約 24.8 日）を超える `delay` も指定できます。タイマーを取り消す関数を返します。

#### `sleep`

```ts
sleep(ms: number): Promise<void>
```

`ms` ミリ秒後に解決する `Promise` を返します。

```ts
await sleep(1000);
```

#### `throttle`

```ts
throttle<ARGS extends unknown[]>(fn: (...args: ARGS) => void, wait: number, options?: ThrottleOptions): ThrottleResult<ARGS>
```

`wait` ミリ秒の間に `fn` を最大1回まで実行する関数を作ります。`fn` には最後の呼び出しの引数を渡します。作った関数のメソッドは `debounce` と同じです。

```ts
const onScroll = throttle(() => updatePosition(), 100);
```

| オプション   | 型                           | 説明                                                                                                      |
| ------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| `triggerAt?` | `'both' \| 'start' \| 'end'` | 実行するタイミング。`'start'`: 各区間の最初、`'end'`: 各区間の最後、`'both'`: 両方。デフォルトは `'both'` |

#### 型

| 型                     | 説明                    |
| ---------------------- | ----------------------- |
| `DebounceOptions`      | `debounce` のオプション |
| `DebounceResult<ARGS>` | `debounce` で作った関数 |
| `ThrottleOptions`      | `throttle` のオプション |
| `ThrottleResult<ARGS>` | `throttle` で作った関数 |

### type

| 関数                               | 説明                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `ensureValidValue(data, options?)` | 値が想定の種類でない場合や `null` / `undefined` の場合に代わりの値を返す |
| `getKind(data)`                    | 値の種類を `typeof` より詳しく返す                                       |
| `getPriority(data, options?)`      | 値の種類に応じた優先度を返す                                             |
| `getRawType(value)`                | `Object.prototype.toString` による型のラベルを返す                       |
| `isAsyncIterable(value)`           | 非同期イテラブルか判定する                                               |
| `isBlank(value, options?)`         | `null` / `undefined` / 空文字か判定する                                  |
| `isEmptyCollection(value)`         | 空の配列・`Map`・`Set` か判定する                                        |
| `isEmptyValue(value, options?)`    | `isBlank` か `isEmptyCollection` に当てはまるか判定する                  |
| `isInvalidDate(value)`             | 無効な日付（`Invalid Date`）の `Date` か判定する                         |
| `isIterable(value)`                | イテラブルか判定する                                                     |
| `isNonNegativeInteger(value)`      | 0 以上の整数か判定する                                                   |
| `isNullish(value)`                 | `null` か `undefined` か判定する                                         |
| `isNumberLike(value)`              | 数値、または10進数の数値の文字列か判定する                               |
| `isPresent(value)`                 | `null` でも `undefined` でもないか判定する                               |
| `isPrimitive(value)`               | プリミティブ値か判定する                                                 |
| `isRegExp(value)`                  | `RegExp` か判定する                                                      |
| `isUndefined(value)`               | `undefined` か判定する                                                   |
| `isValidDate(value)`               | 有効な日付の `Date` か判定する                                           |
| `isValidNumber(value, options?)`   | 有効な数値（`NaN` や `Infinity` でない数値）か判定する                   |
| `unsafeCast(value)`                | 型チェックを無視して型を変換する                                         |

#### `ensureValidValue`

```ts
ensureValidValue<T = unknown>(data: unknown, options?: EnsureValidValueOptions<T>): T
ensureValidValue.dataLast<T = unknown>(options?: EnsureValidValueOptions<T>): (data: unknown) => T
```

値が想定の種類でない場合や、`null` / `undefined` の場合に、オプションで指定した値を返します。該当する値を指定していない場合は `data` をそのまま返します。`validType` を省略した場合は、`null` / `undefined` の置き換えだけを行います。

```ts
ensureValidValue('a', { validType: 'number', invalidValue: 0 }); // 0
ensureValidValue(null, { nullValue: '' }); // ''
```

| オプション        | 型     | 説明                                      |
| ----------------- | ------ | ----------------------------------------- |
| `validType?`      | `Kind` | 想定する値の種類（`getKind` の値）        |
| `undefinedValue?` | `T`    | 値が `undefined` の場合に返す値           |
| `nullValue?`      | `T`    | 値が `null` の場合に返す値                |
| `invalidValue?`   | `T`    | 値の種類が `validType` と違う場合に返す値 |

#### `getKind`

```ts
getKind(data: unknown): Kind
getKind.dataLast(): (data: unknown) => Kind
```

値の種類を返します。`typeof` の結果に加えて、オブジェクトは `null`、`array`、`plainobject`（`Object.prototype` を直接継承したオブジェクト）、`date`、`regexp`、`error`、`map`、`set`、`weakmap`、`weakset`、`promise`、`arraybuffer`、`sharedarraybuffer` に分けます。どれにも当てはまらないオブジェクトは `object` です。

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

値の種類に応じた優先度を返します。並べ替えで `null` / `undefined` を後ろに回す場合などに使います。デフォルトでは `undefined` は `-2`、`null` は `-1`、それ以外は `0` です。

```ts
getPriority(undefined); // -2
getPriority([], { useKind: true, priorityMap: { array: 3 } }); // 3
```

| オプション             | 型                                              | 説明                                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------- |
| `priorityMap?`         | `Partial<Record<Kind \| TypeOfResult, number>>` | 種類ごとの優先度。指定した場合はデフォルトの `{ undefined: -2, null: -1 }` を置き換える |
| `useKind?`             | `boolean`                                       | `true` の場合、`typeof` ではなく `getKind` の種類で優先度を引く。デフォルトは `false`   |
| `getFallbackPriority?` | `(data: unknown) => number`                     | `priorityMap` に無い種類の優先度を返す関数。省略した場合は `0`                          |

#### `getRawType`

```ts
getRawType(value: unknown): GetRawTypeReturn
```

`Object.prototype.toString.call(value)` の結果（`'[object Array]'` など）を返します。

#### `isAsyncIterable` / `isIterable`

```ts
isAsyncIterable(value: unknown): value is AsyncIterable<unknown>
isIterable<T>(value: unknown): value is Iterable<T>
```

値が `Symbol.asyncIterator`（`isAsyncIterable`）・`Symbol.iterator`（`isIterable`）のメソッドを持つか判定します。文字列もイテラブルです。

#### `isBlank`

```ts
isBlank(value: unknown, options?: IsBlankOptions): boolean
```

値が `null`、`undefined`、空文字の場合に `true` を返します。`trimType` を指定すると、空白だけの文字列も `true` にできます。文字列以外の値は `false` です。

```ts
isBlank(''); // true
isBlank('  '); // false
isBlank('  ', { trimType: 'half' }); // true
```

| オプション  | 型                                              | 説明                                                                                                                                                                                         |
| ----------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trimType?` | `'none' \| 'half' \| 'full' \| 'both' \| 'all'` | 空として扱う空白。`'none'`: 扱わない、`'half'`: 半角の空白（スペース・タブ・改行など）、`'full'`: 全角スペース、`'both'`: 半角・全角スペース、`'all'`: 全ての空白文字。デフォルトは `'none'` |

#### `isEmptyCollection`

```ts
isEmptyCollection(value: unknown): boolean
```

値が空の配列・`Map`・`Set` の場合と、`null` / `undefined` の場合に `true` を返します。

#### `isEmptyValue`

```ts
isEmptyValue(value: unknown, options?: IsEmptyValueOptions): boolean
```

`isBlank` か `isEmptyCollection` に当てはまる場合に `true` を返します。オプションは `isBlank` と同じです。空のオブジェクト（`{}`）は `false` です。

#### `isInvalidDate` / `isValidDate`

```ts
isInvalidDate(value: unknown): boolean
isValidDate(value: unknown): boolean
```

値が無効な日付（`Invalid Date`）の `Date` か（`isInvalidDate`）、有効な日付の `Date` か（`isValidDate`）判定します。`Date` 以外の値はどちらも `false` です。

#### `isNonNegativeInteger`

```ts
isNonNegativeInteger(value: unknown): value is number
```

値が 0 以上の整数（`0`、`1`、`2` …）の場合に `true` を返します。

#### `isNullish` / `isPresent` / `isUndefined`

```ts
isNullish(value: unknown): value is null | undefined
isPresent<T>(value: T | null | undefined): value is T
isUndefined(value: unknown): value is undefined
```

値が `null` か `undefined` か（`isNullish`）、`null` でも `undefined` でもないか（`isPresent`）、`undefined` か（`isUndefined`）判定します。`isPresent` は `Array.prototype.filter` に渡して型を絞り込む場合にも使えます。

#### `isNumberLike`

```ts
isNumberLike(value: unknown): boolean
```

値が有限の数値、または10進数の数値の文字列（`'12'`、`'-1.5'`、`'+5'`、`'.5'`、`'5.'`）の場合に `true` を返します。ユーザーの入力が10進数の数値かどうかの判定を想定しているため、前後の空白を含む文字列、16進数、指数表記、`'Infinity'` は `false` になります。

#### `isPrimitive`

```ts
isPrimitive(value: unknown): boolean
```

値がプリミティブ値（`null`、`undefined`、真偽値、数値、BigInt、文字列、シンボル）の場合に `true` を返します。

#### `isRegExp`

```ts
isRegExp(value: unknown): value is RegExp
```

値が `RegExp` の場合に `true` を返します。

#### `isValidNumber`

```ts
isValidNumber(value: unknown, options?: IsValidNumberOptions): boolean
```

値が `NaN` でない数値の場合に `true` を返します。`Infinity` / `-Infinity` は、`allowInfinity` を指定しない限り `false` です。

| オプション       | 型        | 説明                                                       |
| ---------------- | --------- | ---------------------------------------------------------- |
| `allowInfinity?` | `boolean` | `true` の場合、`Infinity` / `-Infinity` も有効な数値とする |

#### `unsafeCast`

```ts
unsafeCast<T>(value: unknown): T
```

型チェックを無視して、値を推論された型として返します。`as any` を各所に書く代わりに使い、`unsafeCast` を検索することで安全でない変換の箇所を洗い出せるようにします。

#### 定数

| 定数   | 説明                     |
| ------ | ------------------------ |
| `Kind` | `getKind` が返す値の種類 |

#### 型

| 型                           | 説明                            |
| ---------------------------- | ------------------------------- |
| `EnsureValidValueOptions<V>` | `ensureValidValue` のオプション |
| `GetPriorityOptions`         | `getPriority` のオプション      |
| `GetRawTypeReturn`           | `getRawType` の戻り値           |
| `IsBlankOptions`             | `isBlank` のオプション          |
| `IsEmptyValueOptions`        | `IsBlankOptions` と同じ         |
| `IsValidNumberOptions`       | `isValidNumber` のオプション    |
| `Kind`                       | `getKind` が返す値の種類の値    |

## ライセンス

MIT
