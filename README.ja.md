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

### 関数名

動詞だけでは対象の型が分からない場合は、名前に型名を付けます（`rotateArray`、`flattenObject`、`lerpNumber`）。`pushAll` の `push` のように、動詞だけで対象の型が分かる場合は付けません。破壊的な版は、この名前の後ろに `Mutable` を付けます（`rotateArrayMutable`、`clearArrayMutable`）。

### null / undefined の扱い

`array` の関数は、配列の引数に渡された `null` / `undefined` を次のように扱います。

- 新しい値を返す関数は、空配列として扱います。戻り値は `null` / `undefined` になりません（例: `pushAll(null, [1])` は `[1]`）
- 要素を1つ返す関数（`firstDefined` など）は、`undefined` を返します
- 破壊的な関数は、変更する配列（`data`）に `null` / `undefined` を受け付けません。追加する要素の配列（`source`・`items`）は、空配列として扱います

配列の要素としての `null` / `undefined` は対象外です（`compactMap` の `exclude` や `firstPresent` などで扱います）。

---

## API

### array

| 関数                                        | 説明                                                     |
| ------------------------------------------- | -------------------------------------------------------- |
| `clearArrayMutable(data)`                   | 配列の全要素を削除し、削除した要素を返す（破壊的）       |
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

#### `clearArrayMutable`

```ts
clearArrayMutable<T>(data: T[]): T[]
```

配列の全要素を削除し（破壊的）、削除した要素の配列を返します。

#### `compactMap`

```ts
compactMap<V, R = V>(data: readonly V[] | null | undefined, callback: IndexedIteratee<V, R>, options?: CompactMapOptions): R[]
```

各要素を `callback` で変換し、`options.exclude` で指定した値を除いた配列を返します。`callback` は `(value, index, data) => R` の形です（`@fringeworks/types` の `IndexedIteratee`）。

```ts
compactMap([1, 2, 3], (v) => (v === 2 ? undefined : v * 10)); // [10, 30]
compactMap(['a', '', null], (v) => v, { exclude: 'empty' }); // ['a']
```

| オプション | 型                  | 説明                                                                                                                                                                                     |
| ---------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exclude?` | `CompactMapExclude` | 除外する値。`'undefined'`: `undefined`、`'nullish'`: `null` と `undefined`、`'empty'`: 加えて空文字、`'falsy'`: falsy な値すべて（`false`、`0`、`NaN` など）。デフォルトは `'undefined'` |

#### `ensureArray`

```ts
ensureArray<T>(data: T | readonly T[] | null | undefined, options: EnsureArrayOptions & { raw: true }): readonly T[]
ensureArray<T>(data: T | readonly T[] | null | undefined, options?: EnsureArrayOptions & { raw?: false }): T[]
ensureArray<T>(data: T | readonly T[] | null | undefined, options?: EnsureArrayOptions): readonly T[]
```

配列でない値を1要素の配列で包みます。`null` / `undefined` は空配列になり、配列はコピーを返します。イテラブル（`Set` など）は展開しません（展開する場合は `toArray` を使います）。

```ts
ensureArray(1); // [1]
ensureArray([1, 2]); // [1, 2]（コピー）
ensureArray(null); // []
```

| オプション | 型        | 説明                                                                                                                                                                      |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `raw?`     | `boolean` | `true` の場合、`data` が配列のときはコピーせずに同じ配列を返す。このとき戻り値の型は `readonly T[]` になる（`raw` が `boolean` の変数の場合も同じ）。デフォルトは `false` |

#### `firstDefined`

```ts
firstDefined<V>(data: readonly V[] | null | undefined): V | undefined
```

先頭から見て最初の `undefined` でない要素を返します。`null` は対象になります。

#### `firstPresent`

```ts
firstPresent<V>(data: readonly V[] | null | undefined): V | undefined
```

先頭から見て最初の `null` / `undefined` でない要素を返します。

#### `insertAt`

```ts
insertAt<T, U = T>(data: readonly T[] | null | undefined, index: number, items: readonly U[] | null | undefined): (T | U)[]
```

`index` の位置に `items` の要素を挿入した新しい配列を返します。`index` は 0 〜配列の長さの範囲に収めます（負の数は先頭、長さを超える数は末尾）。

```ts
insertAt([1, 2, 3], 1, ['a', 'b']); // [1, 'a', 'b', 2, 3]
```

#### `insertAtMutable`

```ts
insertAtMutable<T, U = T>(data: T[], index: number, items: readonly U[] | null | undefined): (T | U)[]
```

`insertAt` の破壊的な版です。`data` に直接挿入し、同じ配列を返します。

#### `nestedGroupBy`

```ts
nestedGroupBy<I extends object>(data: readonly I[] | null | undefined, properties: keyof I | readonly (keyof I)[], options?: NestedGroupByOptions): NestedGroupByResult<I>
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
nestedKeyBy<I extends object>(data: readonly I[] | null | undefined, properties: keyof I | readonly (keyof I)[], options?: NestedKeyByOptions): NestedKeyByResult<I>
```

`nestedGroupBy` と同じ形のオブジェクトを作りますが、各キーには要素を1つだけ格納します。同じキーの要素が複数ある場合は、デフォルトでは先の要素が残ります。

| オプション      | 型        | 説明                                                                      |
| --------------- | --------- | ------------------------------------------------------------------------- |
| `flat?`         | `boolean` | `nestedGroupBy` と同じ                                                    |
| `keySeparator?` | `string`  | `nestedGroupBy` と同じ                                                    |
| `overwrite?`    | `boolean` | `true` の場合、同じキーの要素は後の要素で上書きする。デフォルトは `false` |

#### `pushAll`

```ts
pushAll<T>(data: readonly T[] | null | undefined, source: readonly T[] | null | undefined): T[]
```

`data` の末尾に `source` の全要素を追加した新しい配列を返します。

#### `pushAllMutable`

```ts
pushAllMutable<T>(data: T[], source: readonly T[] | null | undefined): T[]
```

`pushAll` の破壊的な版です。`data` に直接追加し、同じ配列を返します。

#### `pushUnique`

```ts
pushUnique<T>(data: readonly T[] | null | undefined, items: readonly T[] | null | undefined, options?: PushUniqueOptions<T>): T[]
```

`items` のうち、`data` にまだ含まれていない要素だけを追加した新しい配列を返します。`items` 内の重複も追加しません。

```ts
pushUnique([1, 2], [2, 3, 3]); // [1, 2, 3]
```

| オプション   | 型                                  | 説明                                                                                                              |
| ------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `threshold?` | `number`                            | 要素数の合計がこの値以上の場合は `Set` を使って判定する。デフォルトは `100`                                       |
| `isEqual?`   | `(value1: T, value2: T) => boolean` | 2つの要素が等しいかを判定する関数。指定した場合は `threshold` に関わらず線形探索になる。デフォルトは `===` で判定 |

#### `pushUniqueMutable`

```ts
pushUniqueMutable<T>(data: T[], items: readonly T[] | null | undefined, options?: PushUniqueMutableOptions<T>): T[]
```

`pushUnique` の破壊的な版です。`data` に直接追加し、同じ配列を返します。オプションは `pushUnique` と同じです。

#### `repeatToLength`

```ts
repeatToLength<T>(data: readonly T[] | null | undefined, length: number): T[]
```

`data` の要素を繰り返し並べて、長さ `length` の新しい配列を返します。`length` が負の数の場合は、逆順にした配列を繰り返します。`length` の小数は切り捨て、`NaN`・`Infinity` は `0` として扱います。`data` が空の場合は空配列を返します。

```ts
repeatToLength([1, 2, 3], 7); // [1, 2, 3, 1, 2, 3, 1]
repeatToLength([1, 2, 3], -5); // [3, 2, 1, 3, 2]
```

#### `rotateArray`

```ts
rotateArray<I>(data: readonly I[] | null | undefined, options?: RotateArrayOptions): I[]
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
```

`rotateArray` の破壊的な版です。`data` を直接変更し、同じ配列を返します。オプションは `rotateArray` と同じです。

#### `sortDependencies`

```ts
sortDependencies<I>(data: readonly I[] | null | undefined, options?: SortDependenciesOptions<I>): I[]
```

要素の依存関係に従って、依存される側が先に来るように並べ替えた新しい配列を返します（トポロジカルソート）。同じ ID の要素は1つにまとめます。循環した依存関係がある場合は `Error`（`Cyclic dependency: <ID>`）を投げます。

デフォルトでは、各要素を `[ID, 依存先の配列]` のタプルとして扱います。依存先は要素と ID のどちらで持っても構いません。依存先がオブジェクト（要素）の場合は `id` と同じ方法で ID を取得し、それ以外の場合は依存先の値そのものを ID とします。

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
  { id: 'id', dependencies: 'deps' },
);
// [{ id: 'b', ... }, { id: 'a', ... }]
```

| オプション       | 型                                                       | 説明                                                                                                                                                     |
| ---------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id?`            | `string \| number \| SortDependenciesGetId<I>`           | 要素の ID を持つプロパティ、または ID を返す関数。デフォルトは `0`                                                                                       |
| `dependencies?`  | `string \| number \| SortDependenciesGetDependencies<I>` | 依存先を持つプロパティ、または依存先を返す関数。デフォルトは `1`                                                                                         |
| `dependencyId?`  | `string \| number \| SortDependenciesGetId<I>`           | 依存先の ID を持つプロパティ、または依存先の ID を返す関数。デフォルトは、依存先がオブジェクトなら `id` と同じ方法で取得し、それ以外は依存先の値そのもの |
| `tree?`          | `boolean`                                                | `true` の場合、依存先を再帰的にたどり、`data` に含まれない依存先の要素も並べ替えの対象に加える（ツリー構造のデータ用）                                   |
| `ignoreMissing?` | `boolean`                                                | `true` の場合、`data` に存在しない依存先を無視する。`false` の場合は `Error`（`No substance: <ID>`）を投げる。デフォルトは `false`                       |
| `reverse?`       | `boolean`                                                | `true` の場合、並び順を逆にする（依存する側が先）。デフォルトは `false`                                                                                  |

#### `swapPairs`

```ts
swapPairs<const T extends readonly (readonly [unknown, unknown])[]>(pairs: T | null | undefined): SwapPairsResult<T>
```

2要素のタプルの配列を受け取り、各タプルの `[0]` と `[1]` を入れ替えた新しい配列を返します。型も入れ替わります。readonly の配列（`as const` を付けたものなど）も渡せます。戻り値は常に書き換えられる配列です。

```ts
swapPairs([
  ['a', 1],
  ['b', 2],
]); // [[1, 'a'], [2, 'b']]
```

#### `toArray`

```ts
toArray<T>(data: unknown, options: ToArrayOptions & { raw: true }): readonly T[]
toArray<T>(data: unknown, options?: ToArrayOptions & { raw?: false }): T[]
toArray<T>(data: unknown, options?: ToArrayOptions): readonly T[]
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

| 型                                   | 説明                                                   |
| ------------------------------------ | ------------------------------------------------------ |
| `CompactMapOptions`                  | `compactMap` のオプション                              |
| `CompactMapExclude`                  | `compactMap` で除外する値の種類                        |
| `EnsureArrayOptions`                 | `ensureArray` のオプション                             |
| `NestedGroupByOptions`               | `nestedGroupBy` のオプション                           |
| `NestedGroupByResult<I>`             | `nestedGroupBy` の戻り値                               |
| `NestedKeyByOptions`                 | `nestedKeyBy` のオプション                             |
| `NestedKeyByResult<I>`               | `nestedKeyBy` の戻り値                                 |
| `PushUniqueMutableOptions<T>`        | `pushUniqueMutable` のオプション                       |
| `PushUniqueOptions<T>`               | `PushUniqueMutableOptions<T>` と同じ                   |
| `RotateArrayMutableOptions`          | `rotateArrayMutable` のオプション                      |
| `RotateArrayOptions`                 | `RotateArrayMutableOptions` と同じ                     |
| `SortDependenciesOptions<I>`         | `sortDependencies` のオプション                        |
| `SortDependenciesGetId<I>`           | 要素から ID を返す関数 `(item) => unknown`             |
| `SortDependenciesGetDependencies<I>` | 要素から依存先を返す関数 `(item) => I \| readonly I[]` |
| `SwapPairsResult<T>`                 | `swapPairs` の戻り値（各タプルの要素を入れ替えた型）   |
| `ToArrayOptions`                     | `toArray` のオプション                                 |

### boolean

| 関数                            | 説明             |
| ------------------------------- | ---------------- |
| `ensureBoolean(data, options?)` | 値を真偽値にする |

#### `ensureBoolean`

```ts
ensureBoolean(data: unknown, options?: EnsureBooleanOptions): boolean
```

値を真偽値にします。真偽値はそのまま返し、文字列は前後の空白を除いて `trueValues` に含まれる場合だけ `true` にします（デフォルトでは `'true'`、`'True'`、`'TRUE'`、`'1'`）。それ以外の値は `!!data` で変換します。

```ts
ensureBoolean('true'); // true
ensureBoolean(' 1 '); // true
ensureBoolean('yes'); // false
ensureBoolean('YES', { trueValues: ['yes'], ignoreCase: true }); // true
ensureBoolean(1); // true
```

| オプション    | 型                  | 説明                                                                                        |
| ------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `trueValues?` | `readonly string[]` | `true` として扱う文字列。文字列の値にだけ使う。デフォルトは `['true', 'True', 'TRUE', '1']` |
| `ignoreCase?` | `boolean`           | `true` の場合、文字列を大文字・小文字を区別せずに比較する                                   |

#### 型

| 型                     | 説明                         |
| ---------------------- | ---------------------------- |
| `EnsureBooleanOptions` | `ensureBoolean` のオプション |

### compare

| 関数                                      | 説明                                            |
| ----------------------------------------- | ----------------------------------------------- |
| `compare(left, operator, right)`          | 演算子を指定して2つの値を比較する               |
| `isEqual(value1, value2)`                 | 2つの値の構造が等しいかを再帰的に比較する       |
| `isEqualWith(value1, value2, customizer)` | 独自の比較関数を使って2つの値を再帰的に比較する |

#### `compare`

```ts
compare<O extends ComparisonOperator>(left: CompareLeft[O], operator: O, right: CompareRight[O]): boolean
```

`left` と `right` を `operator` で比較します。`left` と `right` の型は演算子ごとに決まります（`CompareLeft` / `CompareRight`）。設定から比較方法を切り替える用途を想定しており、`ComparisonOperator` の値（`'>='` など）をそのまま演算子として渡せます。

対応していない演算子を指定した場合は `Error` を投げます。値が想定した形でない場合（`'between'` の `right` が配列でない、`'startsWith'` の値が文字列でない、`'matches'` のパターンが正規表現として不正など）は、否定の演算子も含めて `false` を返します。

```ts
compare(5, '>', 3); // true
compare(5, 'between', [1, 10]); // true（両端を含む）
compare('a', 'oneOf', ['a', 'b']); // true
compare('hello', 'includes', 'ell'); // true（部分一致）
compare(['a', 'b', 'c'], 'includesAll', ['a', 'c']); // true
compare('hello', 'matches', /^h/); // true
```

| 演算子                           | `left`           | `right`                    | 内容                                                                                                   |
| -------------------------------- | ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `'==='` / `'!=='`                | 任意             | 任意                       | 厳密な等価・不等価                                                                                     |
| `'=='` / `'!='`                  | 任意             | 任意                       | 緩い等価・不等価                                                                                       |
| `'>'` / `'>='` / `'<'` / `'<='`  | 任意             | 任意                       | 大小比較（数値・文字列・`Date` など、JavaScript の比較演算子の動作に従う）                             |
| `'deepEqual'` / `'notDeepEqual'` | 任意             | 任意                       | 構造が等しいか・等しくないか（`isEqual`）                                                              |
| `'between'` / `'notBetween'`     | 任意             | `[min, max]`               | 範囲内か・範囲外か（両端を含む）                                                                       |
| `'oneOf'` / `'notOneOf'`         | 任意             | 配列                       | `right` のいずれかと等しいか・どれとも等しくないか（`Array.includes`）                                 |
| `'includes'` / `'notIncludes'`   | 文字列または配列 | 部分文字列または要素       | `left` が `right` を含むか・含まないか（`String.includes` / `Array.includes`）                         |
| `'includesAll'`                  | 文字列または配列 | 部分文字列または要素の配列 | `left` が `right` のすべてを含むか（`right` が空なら `true`）                                          |
| `'includesAny'`                  | 文字列または配列 | 部分文字列または要素の配列 | `left` が `right` のいずれかを含むか（`right` が空なら `false`）                                       |
| `'startsWith'` / `'endsWith'`    | 文字列           | 文字列                     | 前方一致・後方一致                                                                                     |
| `'matches'`                      | 文字列           | 正規表現または文字列       | 正規表現に一致するか。文字列は `RegExp` に変換する。`g`・`y` フラグの正規表現の `lastIndex` は変えない |

#### `isEqual`

```ts
isEqual(value1: unknown, value2: unknown): boolean
```

2つの値の構造が等しいかを再帰的に比較します。比較の基準は `isEqualWith` の既定の比較と同じです。

```ts
isEqual({ a: [1] }, { a: [1] }); // true
isEqual([1], { 0: 1 }); // false
```

#### `isEqualWith`

```ts
isEqualWith(value1: unknown, value2: unknown, customizer: IsEqualWithCustomizer): boolean
```

2つの値が等しいかを再帰的に比較します。比較の各段階で `customizer` を呼び、`boolean` を返した場合はそれを結果とし、`undefined` を返した場合は既定の比較を行います。

`customizer` は `(value1, value2, indexOrKey, value1Parent, value2Parent)` を受け取ります。`indexOrKey` は、親が配列なら添字、オブジェクトならキー、`Map` なら `Map` のキー（型を問わない）です。最上位の値と `Set` の要素では `undefined` になります。

既定の比較では、プロトタイプが異なるオブジェクトは等しくないとみなします（`null` プロトタイプのオブジェクトとプレーンなオブジェクトは同じとみなす）。そのうえで、配列は要素ごと、`Map` はキーと値、`Set` は構造が等しい要素を持つか、`Date` は時刻、`RegExp` はパターンとフラグ、それ以外のオブジェクトは自身の列挙可能なプロパティごとに比較します。`NaN` 同士は等しく、`0` と `-0` も等しいとみなします。循環参照は、比較中の組に再び到達した時点で等しいとみなします。

```ts
// 文字列は大文字・小文字を区別せずに比較する
isEqualWith({ a: 'Hello' }, { a: 'hello' }, (v1, v2) =>
  typeof v1 === 'string' && typeof v2 === 'string'
    ? v1.toLowerCase() === v2.toLowerCase()
    : undefined,
); // true
```

#### 定数

| 定数                 | 説明                                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ComparisonOperator` | `compare` の演算子。記号の演算子は短い名前（`eq`、`ne`、`looseEq`、`looseNe`、`gt`、`gte`、`lt`、`lte`）、単語の演算子は値と同じ名前（`deepEqual`、`between`、`oneOf`、`includes` など）をキーにしている |

#### 型

| 型                      | 説明                                  |
| ----------------------- | ------------------------------------- |
| `ComparisonOperator`    | `compare` の演算子の値                |
| `CompareLeft`           | 演算子ごとの `compare` の左辺の値の型 |
| `CompareRight`          | 演算子ごとの `compare` の右辺の値の型 |
| `IsEqualWithCustomizer` | `isEqualWith` の `customizer` の型    |

### date

| 関数                                      | 説明                                                            |
| ----------------------------------------- | --------------------------------------------------------------- |
| `asUtcDate(value)`                        | ローカル時刻の日時を、同じ日時の UTC として扱った `Date` を返す |
| `createUtcDate(year, month?, date?, ...)` | UTC の日時を指定して `Date` を作る                              |
| `lerpDate(value, ratio, options?)`        | 基準の日時と目標の日時の間を割合で補間する                      |

#### `asUtcDate`

```ts
asUtcDate(value: Date): Date
```

`value` のローカル時刻の年月日・時分秒・ミリ秒を、そのまま UTC の値として持つ新しい `Date` を返します。

```ts
// 日本時間（UTC+9）の環境で
asUtcDate(new Date(2024, 0, 15, 12, 0)).toISOString(); // '2024-01-15T12:00:00.000Z'
```

#### `createUtcDate`

```ts
createUtcDate(year: number, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): Date
```

UTC の日時を指定して `Date` を作ります。`Date.UTC` と同じく `month` は 0 〜 11 です。ただし `Date.UTC` と異なり、0 〜 99 の年は 1900 年代にせず、そのままの年として扱います。省略した引数は、`month` が `0`、`date` が `1`、それ以外は `0` になります。

#### `lerpDate`

```ts
lerpDate(value: Date, ratio: number, options?: LerpDateOptions): Date
```

基準の日時（`baseValue`）から目標の日時（`value`）までを `ratio` の割合で線形補間した日時を返します。`ratio` が `0` のときは基準の日時、`1` のときは目標の日時になります。`ratio` が 0 〜 1 の範囲外の場合は外挿します。

| オプション   | 型     | 説明                                                     |
| ------------ | ------ | -------------------------------------------------------- |
| `baseValue?` | `Date` | 補間の基準の日時。デフォルトは呼び出した時点の現在の日時 |

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
alwaysFalse(...args: unknown[]): false
alwaysTrue(...args: unknown[]): true
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
ensureMap<K, V>(data: Iterable<readonly [K, V]> | null | undefined, options: EnsureMapOptions & { raw: true }): ReadonlyMap<K, V>
ensureMap<K, V>(data: Iterable<readonly [K, V]> | null | undefined, options?: EnsureMapOptions & { raw?: false }): Map<K, V>
ensureMap<V>(data: Record<string, V> | null | undefined, options?: EnsureMapOptions): Map<string, V>
ensureMap<K, V>(data: EnsureMapSource<K, V> | null | undefined, options: EnsureMapOptions & { raw: true }): ReadonlyMap<K | string, V>
ensureMap<K, V>(data: EnsureMapSource<K, V> | null | undefined, options?: EnsureMapOptions & { raw?: false }): Map<K | string, V>
ensureMap<K, V>(data: EnsureMapSource<K, V> | null | undefined, options?: EnsureMapOptions): ReadonlyMap<K | string, V>
```

値を `Map` にします。`Map` はコピーを返します。それ以外の反復可能なオブジェクト（エントリーの配列、`Set` など）は、`Map` のコンストラクターと同じく各要素を `[キー, 値]` として扱います。それ以外のオブジェクトは、プロパティをエントリーにします。`null` / `undefined` やプリミティブ値は空の `Map` になります。

```ts
ensureMap({ a: 1 }); // Map { 'a' => 1 }
ensureMap([['a', 1]]); // Map { 'a' => 1 }
ensureMap(['x', 'y'].entries()); // Map { 0 => 'x', 1 => 'y' }
```

反復可能なオブジェクトの要素がエントリーでない場合（`[1, 2]` など）は、`Map` のコンストラクターと同じく `TypeError` になります。

| オプション | 型        | 説明                                                                                                                                                                                                                                            |
| ---------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `raw?`     | `boolean` | `true` の場合、`data` が `Map` のときはコピーせずに同じ `Map` を返す。このとき戻り値の型は `ReadonlyMap` になる（`raw` が `boolean` の変数の場合も同じ）。オブジェクトのプロパティから作る場合は、常に新しい `Map` になる。デフォルトは `false` |

#### 型

| 型                      | 説明                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `EnsureMapOptions`      | `ensureMap` のオプション                                                                                              |
| `EnsureMapSource<K, V>` | `ensureMap` が受け取る値（`[キー, 値]` を返す反復可能なオブジェクト、またはプロパティをエントリーにするオブジェクト） |

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
| `roundToStep(value, step)`                        | 値を指定の刻み幅で丸める                           |

範囲を受け取る関数（`clampInRange`、`isStrictlyWithinRange`、`isWithinRange`、`keepInRange`、`loopInRange`、`pingpongInRange`、`replaceOutOfRange`）は、`min` が `max` より大きい場合は入れ替えて扱います。

#### `clampInRange`

```ts
clampInRange(value: number, min: number, max: number): number
```

`value` が `min` を下回る場合は `min`、`max` を上回る場合は `max`、それ以外の場合は `value` を返します。

```ts
clampInRange(150, 0, 100); // 100
clampInRange(-10, 0, 100); // 0
```

#### `ensureNumber`

```ts
ensureNumber(data: unknown): number
```

値を `number` 型の値にします。数値はそのまま返し（`NaN` は `0`）、文字列は `Number()` で変換します。変換できない文字列、`null`、`undefined`、真偽値、bigint、オブジェクトなどは `0` になります。

`Infinity` / `-Infinity` はそのまま返します。有限の数だけを扱う場合は `getValidNumber` を使います。

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

`min` と `max` を、小さい方・大きい方の順に並べた配列を返します。`null` / `undefined` / `NaN` の場合はデフォルト値を使います。

```ts
getValidMinMax(10, 1); // [1, 10]
getValidMinMax(null, 5); // [-Infinity, 5]
getValidMinMax(NaN, 5); // [-Infinity, 5]
```

| オプション    | 型       | 説明                                                                       |
| ------------- | -------- | -------------------------------------------------------------------------- |
| `defaultMin?` | `number` | `min` が `null` / `undefined` / `NaN` の場合の値。デフォルトは `-Infinity` |
| `defaultMax?` | `number` | `max` が `null` / `undefined` / `NaN` の場合の値。デフォルトは `Infinity`  |

#### `getValidNumber`

```ts
getValidNumber(value: number | null | undefined, options?: GetValidNumberOptions): number
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
```

`value` が `min` より大きく、`max` より小さい場合に `true` を返します。

#### `isWithinRange`

```ts
isWithinRange(value: number, min: number, max: number): boolean
```

`value` が `min` 以上、`max` 以下の場合に `true` を返します。

#### `keepInRange`

```ts
keepInRange(value: number, min: number, max: number, options?: KeepInRangeOptions): number
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
```

基準値（`baseValue`）から目標値（`value`）までを `ratio` の割合で線形補間した値を返します。`ratio` が 0 〜 1 の範囲外の場合は外挿します。

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
```

値を正の数（0 より大きい数）にします。正の数はそのまま返し、それ以外の場合はオプションで指定した値を返します。`null` / `undefined` はそのまま返します（既定値を使う場合は、呼び出す前に `??` で補います）。

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

#### `loopInRange`

```ts
loopInRange(value: number, min: number, max: number): number
```

範囲がループしているものとして、`value` を `min` 以上 `max` 未満の値にします。`max` は `min` と同じ位置として扱います（剰余と同じ考え方）。添字や角度のように、終わりと始まりが同じ位置になる値に使えます。`min` と `max` が同じ場合は `min` を返します。

```ts
loopInRange(12, 0, 10); // 2
loopInRange(-1, 0, 10); // 9
loopInRange(10, 0, 10); // 0
```

#### `pingpongInRange`

```ts
pingpongInRange(value: number, min: number, max: number): number
```

範囲の端で折り返して往復するものとして、範囲外の `value` を範囲内の値にします。

```ts
pingpongInRange(12, 0, 10); // 8
pingpongInRange(-2, 0, 10); // 2
```

#### `replaceOutOfRange`

```ts
replaceOutOfRange(value: number, min: number, max: number, replacement: number): number
```

`value` が範囲内（`min` 以上 `max` 以下）の場合はそのまま返し、範囲外の場合は `replacement` を返します。

#### `roundToStep`

```ts
roundToStep(value: number, step: number): number
```

`value` を `step` の倍数のうち最も近い値に丸めます。ちょうど中間の値は正の方向へ丸めます（`Math.round` と同じで、`-2.5` は `-2`）。結果は `step` の小数の桁数で丸め直すため、`0.30000000000000004` のような誤差は出ません。`step` が `0` や有限の数でない場合は `value` をそのまま返します。

丸めは浮動小数点数（double）の値に対して行います。`1.15` は double では `1.1499…` なので、`roundToStep(1.15, 0.1)` は `1.1` になります。表記どおりに十進数で丸める場合は `@fringeworks/numeric-string` を使います。

```ts
roundToStep(7, 5); // 5
roundToStep(8, 5); // 10
roundToStep(0.3, 0.1); // 0.3
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

プロトタイプ汚染を防ぐため、オブジェクトのキーを読み書きする関数は `__proto__` というキーを無視します。`set`・`unset` などのパスを受け取る関数は、パスに `__proto__` を含む場合は何もしません。

| 関数                                                   | 説明                                                                         |
| ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `assignDefined(target, values, options?)`              | `undefined` でない値だけを代入した新しいオブジェクトを返す                   |
| `assignDefinedMutable(target, values, options?)`       | `undefined` でない値だけを代入する（破壊的）                                 |
| `assignPresent(target, values, options?)`              | `null` / `undefined` でない値だけを代入した新しいオブジェクトを返す          |
| `assignPresentMutable(target, values, options?)`       | `null` / `undefined` でない値だけを代入する（破壊的）                        |
| `cloneDeep(value)`                                     | 値を深くコピーする                                                           |
| `cloneShallow(value)`                                  | 値を浅くコピーする                                                           |
| `countKeys(data)`                                      | オブジェクトの列挙可能なプロパティの数を返す                                 |
| `createOverrideProxy(instance, overrides)`             | インスタンスのプロパティを上書きするプロキシを作る                           |
| `createSplitByKeys<T>(keys)`                           | 指定したキーのプロパティとそれ以外に分ける関数を作る                         |
| `distribute(data, rules, options?)`                    | プロパティをルールに従って複数のオブジェクトに分ける                         |
| `exactKeys<T>()(keys)`                                 | 型のキーを過不足なく列挙した配列であることをコンパイル時に検査する           |
| `exactKeysFromRecord<T>(keys)`                         | 型の全てのキーを持つオブジェクトからキーの配列を作る                         |
| `fillDefaults(target, defaultValues, options?)`        | 値の無いプロパティをデフォルト値で埋めた新しいオブジェクトを返す             |
| `fillDefaultsMutable(target, defaultValues, options?)` | 値の無いプロパティをデフォルト値で埋める（破壊的）                           |
| `filterByKeys(data, condition, options?)`              | 条件に合うキーのプロパティだけを残す                                         |
| `filterByValues(data, condition, options?)`            | 条件に合う値だけを残す                                                       |
| `flattenObject(data, options?)`                        | ネストしたオブジェクトを1階層にする                                          |
| `forEachValue(data, callback, options?)`               | 各プロパティの値でコールバックを実行する                                     |
| `get(data, path, options?)`                            | パスで指定したプロパティの値を返す                                           |
| `hasOwn(data, key)`                                    | オブジェクトが指定のプロパティを自身で持つか判定する（`Object.hasOwn` 相当） |
| `maybeHasOwn(data, key)`                               | オブジェクトが指定のプロパティを自身で持つか判定する（`null` でも安全）      |
| `omit(data, keys)`                                     | 指定のキーのプロパティを除いた新しいオブジェクトを返す                       |
| `parsePropertyPath(path)`                              | プロパティのパスをキーの配列に変換する                                       |
| `set(data, path, value)`                               | パスで指定したプロパティに値を設定した新しいオブジェクトを返す               |
| `setMutable(data, path, value)`                        | パスで指定したプロパティに値を設定する（破壊的）                             |
| `stableStringify(value, space?)`                       | キーを並べ替えて JSON 文字列にする                                           |
| `transformObject(source, rules, options?)`             | ルールに従ってオブジェクトの構造を変換する                                   |
| `unset(data, path)`                                    | パスで指定したプロパティを削除した新しいオブジェクトを返す                   |
| `unsetMutable(data, path)`                             | パスで指定したプロパティを削除する（破壊的）                                 |
| `update(target, values, options?)`                     | 値が変わるプロパティだけを更新した新しいオブジェクトを返す                   |
| `updateMutable(target, values, options?)`              | 値が変わるプロパティだけを更新し、更新前の値を返す（破壊的）                 |

#### `assignDefined`

```ts
assignDefined<T extends object, V extends object>(target: T, values: V, options?: AssignDefinedOptions): AssignDefinedResult<T, V>
```

`values` の各プロパティのうち、値が `undefined` でないものだけを `target` に代入した新しいオブジェクトを返します。symbol のキーも対象にします。`null` も代入しない場合は `assignPresent` を使います。

```ts
assignDefined({ a: 1, b: 2 }, { a: undefined, b: null, c: 3 }); // { a: 1, b: null, c: 3 }
```

| オプション          | 型        | 説明                                                           |
| ------------------- | --------- | -------------------------------------------------------------- |
| `includeInherited?` | `boolean` | `true` の場合、`values` の継承したプロパティも代入の対象にする |

#### `assignDefinedMutable`

```ts
assignDefinedMutable<T extends object, V extends object>(target: T, values: V, options?: AssignDefinedMutableOptions): AssignDefinedResult<T, V>
```

`assignDefined` の破壊的な版です。`target` に直接代入し、同じオブジェクトを返します。オプションは `assignDefined` と同じです。

#### `assignPresent`

```ts
assignPresent<T extends object, V extends object>(target: T, values: V, options?: AssignPresentOptions): AssignPresentResult<T, V>
```

`values` の各プロパティのうち、値が `null` / `undefined` でないものだけを `target` に代入した新しいオブジェクトを返します。symbol のキーも対象にします。`null` も代入する場合は `assignDefined` を使います。

```ts
assignPresent({ a: 1, b: 2 }, { a: undefined, b: null, c: 3 }); // { a: 1, b: 2, c: 3 }
```

| オプション          | 型        | 説明                                                           |
| ------------------- | --------- | -------------------------------------------------------------- |
| `includeInherited?` | `boolean` | `true` の場合、`values` の継承したプロパティも代入の対象にする |

#### `assignPresentMutable`

```ts
assignPresentMutable<T extends object, V extends object>(target: T, values: V, options?: AssignPresentMutableOptions): AssignPresentResult<T, V>
```

`assignPresent` の破壊的な版です。`target` に直接代入し、同じオブジェクトを返します。オプションは `assignPresent` と同じです。

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
countKeys(data: unknown): number
```

オブジェクトの自身の列挙可能なプロパティの数（`Object.keys(obj).length`）を返します。オブジェクトでない値の場合は `0` を返します。

#### `createOverrideProxy`

```ts
createOverrideProxy<I extends object, O extends Record<PropertyKey, (target: I, prop: string | symbol, receiver: any) => any>>(instance: I, overrides?: O): I & { [K in keyof O]: ReturnType<O[K]> }
```

`instance` のプロパティを上書きするプロキシを作ります。`instance` 自体は変更しません。クラスを継承できない場合に、インスタンスのメソッドやプロパティを差し替えるために使います。`overrides` には、プロパティ名と、そのプロパティを読んだときの値を返す関数を指定します。上書きしないメソッドやゲッターは元のインスタンスを `this` として呼ぶため、`Map` や DOM 要素など内部状態を持つインスタンスにも使えます。その代わり、元のメソッドの中から `this` 経由で読んだプロパティには上書きが反映されません。

```ts
const logger = createOverrideProxy(console, {
  log:
    (target) =>
    (...args: unknown[]) =>
      target.log('[app]', ...args),
});
logger.log('hello'); // [app] hello
```

#### `createSplitByKeys`

```ts
createSplitByKeys<T extends object>(keys: SplitKeyRecord<T>): <D extends object>(data: D) => [T, SplitRest<D, T>]
```

オブジェクトを、`T` のキーのプロパティとそれ以外のプロパティに分ける関数を作ります。作った関数は `[picked, rest]` のタプルを返します。React のコンポーネントで、ライブラリが使うプロパティと DOM に渡すプロパティを分ける場合などに使います。

- `keys` には `T` の全てのキーを持ち、値が `true` のオブジェクトを指定します。キーの不足・余分は型エラーになります。`T` がユニオン型の場合は、全てのメンバーのキーを指定します
- 値が `undefined` のプロパティも、キーの種類で振り分けます
- 自身の列挙可能なプロパティ（symbol のキーを含む）を対象にします
- `picked` が `T` の型を満たすかは検査しません

```ts
type Options = { gap?: number; gapX?: number };

const splitOptions = createSplitByKeys<Options>({ gap: true, gapX: true });
const [options, rest] = splitOptions({ gap: 8, id: 'a' }); // [{ gap: 8 }, { id: 'a' }]
```

#### `distribute`

```ts
distribute<T extends object, DR extends DistributeRules<T>>(data: T, rules: DR, options?: DistributeOptions): DistributeResult<T, DR>
```

`data` の直下のプロパティを、`rules` に従って複数のオブジェクトに分けます。`rules` にはグループ名とプロパティ名の配列を指定し、`null` を指定したグループには、他のどのグループにも入らなかったプロパティが入ります。同じプロパティを複数のグループに指定した場合は、それぞれのグループに入ります。戻り値の型も、グループごとに指定したプロパティを持つ型になります。

```ts
const { identity, rest } = distribute(user, {
  identity: ['id', 'name'],
  rest: null,
});
// identity: { id, name }
// rest: user のそれ以外のプロパティ
```

| オプション          | 型        | 説明                                                                                                    |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| `includeInherited?` | `boolean` | `true` の場合、継承したプロパティも分ける対象にする                                                     |
| `cloneValue?`       | `boolean` | `true` の場合、値を `cloneDeep` で複製して分ける。`null` のグループにも、グループごとに複製した値が入る |

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
fillDefaults<T extends object, const V extends object, const O extends FillDefaultsOptions = {}>(target: T, defaultValues: V, options?: O): FillDefaultsResult<T, V, O>
```

`target` のプロパティの値が `undefined` の場合に、`defaultValues` の値を設定した新しいオブジェクトを返します。`defaultValues` の値が `undefined` の場合は設定しません。symbol のキーも対象にします。

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
fillDefaultsMutable<T extends object, const V extends object, const O extends FillDefaultsMutableOptions = {}>(target: T, defaultValues: V, options?: O): FillDefaultsResult<T, V, O>
```

`fillDefaults` の破壊的な版です。`target` に直接設定し、同じオブジェクトを返します。オプションは `fillDefaults` と同じです。

#### `filterByKeys`

```ts
filterByKeys(data: unknown, condition: string | number, options?: FilterByKeysOptions): unknown
```

オブジェクトや配列を再帰的にたどり、キーが条件に合うプロパティだけを残した新しい値を返します。`condition` が文字列の場合はキーに含まれるか（部分一致）、数値の場合はキーと等しいか（`0` は `'0'` に一致）で判定します。条件に合ったプロパティは値ごと残し、合わなかったプロパティは値の中をさらにたどります。条件に合うものが1つもない場合は `null` を返します。残る構造は実行時に決まるため、戻り値の型は `unknown` です。配列は元のインデックスを保ち、条件に合わなかった位置は空き要素になります。

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
filterByValues(data: unknown, condition: unknown, options?: FilterByValuesOptions): unknown
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
flattenObject(data: object, options?: FlattenObjectOptions): LooseRecord
```

ネストしたプレーンなオブジェクトと配列を、キーのパスを連結した1階層のオブジェクトにします。配列の要素は `a[0]` の形で連結するため、デフォルトの区切り文字で作ったキーは `set` などのパスとしてそのまま使えます（`.` や `[` を含むキーは区別できません）。中身の無いオブジェクト・配列は値としてそのまま残します。連結したキーが重複した場合は、後に処理した値で上書きします。

```ts
flattenObject({ a: { b: [1, { c: 2 }] } }); // { 'a.b[0]': 1, 'a.b[1].c': 2 }
flattenObject({ a: { b: [1] } }, { keepArrays: true }); // { 'a.b': [1] }
```

| オプション      | 型        | 説明                                                                                                      |
| --------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| `keySeparator?` | `string`  | パスを連結する区切り文字。配列の要素は区切り文字に関わらず `[0]` の形で連結する。デフォルトは `'.'`       |
| `keepArrays?`   | `boolean` | `true` の場合、配列は展開せずにそのまま値にする。デフォルトは `false`                                     |
| `leafKeysOnly?` | `boolean` | `true` の場合、パスを連結せずに末端のキーだけをキーにする（同じキーは上書きされる）。デフォルトは `false` |

#### `forEachValue`

```ts
forEachValue<T extends object>(data: T, callback: (value: T[keyof T], key: string | symbol, obj: T) => void | boolean, options?: ForEachValueOptions): boolean
```

オブジェクトの自身の列挙可能なプロパティごとに `callback` を実行します。スプレッド構文や `Object.assign` と同じく、symbol のキーも対象にします。`callback` が `false` を返すと処理を中断します。最後まで処理した場合は `true`、中断した場合は `false` を返します。

| オプション          | 型        | 説明                                                                                     |
| ------------------- | --------- | ---------------------------------------------------------------------------------------- |
| `includeInherited?` | `boolean` | `true` の場合、継承したプロパティも対象にする。symbol のキーは自身のものだけを対象にする |

#### `get`

```ts
get(data: unknown, path: PropertyPath, options?: GetOptions): unknown
```

パスで指定したプロパティの値を返します。パスは `'a.b[0]'` のような文字列か、キーの配列で指定します。配列のインデックスは `[0]` の形で書きます。文字列の解釈の規則は `parsePropertyPath` を参照してください。数値や symbol は1つのキーとして扱います。途中のプロパティが無い場合、パスが空の場合、`data` が `null` / `undefined` の場合は `undefined` を返します。値の型はパスから決められないため `unknown` を返します。型を確かめてから使ってください。

既定では自身のプロパティだけを辿り、プロトタイプ上のプロパティ（`toString` やクラスの getter など）は無いものとして扱います。

```ts
get({ a: { b: [{ c: 1 }] } }, 'a.b[0].c'); // 1
get({ a: { b: [{ c: 1 }] } }, ['a', 'b', 0, 'c']); // 1
get({}, 'toString'); // undefined
```

| オプション          | 型        | 説明                                                                                            |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `includeInherited?` | `boolean` | `true` の場合、プロトタイプ上のプロパティも辿る（`__proto__` は辿らない）。デフォルトは `false` |

#### `hasOwn`

```ts
hasOwn(data: object, key: PropertyKey): boolean
```

`data` が `key` のプロパティを自身で持つか判定します。`Object.hasOwn` は Safari 15.4 以降の機能のため、`Object.prototype.hasOwnProperty` で同じ判定をします。`hasOwnProperty` を上書きしたオブジェクトや、プロトタイプが `null` のオブジェクトでも使えます。

```ts
hasOwn({ a: 1 }, 'a'); // true
hasOwn(Object.create({ a: 1 }), 'a'); // false
```

#### `maybeHasOwn`

```ts
maybeHasOwn(data: object | null | undefined, key: PropertyKey): boolean
```

`data` が `key` のプロパティを自身で持つか判定します（`hasOwn`）。`data` が `null` / `undefined` の場合は `false` を返します。

#### `omit`

```ts
omit<T extends object, K extends PropertyKey>(data: T, keys: K | readonly K[]): Omit<T, K>
omit<T extends object, K extends PropertyKey>(data: T | null | undefined, keys: K | readonly K[]): Omit<T, K> | undefined
```

`keys` のプロパティを除いた新しいオブジェクトを返します。キーはパスとして解釈しません（ネストしたプロパティを削除する場合は `unset` を使います）。`data` に無いキーも指定できます。戻り値の型は `Omit<T, K>` になります。`data` が `null` / `undefined` の場合は `undefined` を返します。

```ts
omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { b: 2 }
```

#### `parsePropertyPath`

```ts
parsePropertyPath(path: PropertyPath): readonly PropertyKey[]
```

プロパティのパスをキーの配列に変換します。`get`・`set`・`unset` などは、この規則でパスを解釈します。文字列は次のように解釈します。

- `.` で区切った部分は文字列のキー（`'a.1'` は `['a', '1']`）
- `[0]` のように角括弧で囲んだ0以上の整数は、配列のインデックス（数値）
- `["b.c"]` や `['b.c']` のように引用符で囲むと、`.` や `[` を含むキーも書ける。`\` の次の文字はそのまま使う
- 引用符の無い角括弧の中身が整数でない場合（`[b]`・`[01]`・`[-1]`）は、文字列のキー
- 空のキー（`'a..b'` の間など）は読み飛ばし、閉じていない角括弧や引用符は、そこから後ろをキーの文字として扱う

配列のインデックスは `[0]` の形で書くことを推奨します。`'a.0'` と `'a[0]'` は読み取りや削除では同じ要素を指しますが、`set` でパスの途中を新しく作る場合は、`'a.0'` ではオブジェクト、`'a[0]'` では配列を作ります。数値・symbol は1つのキーとして扱い、配列はそのまま返します。

```ts
parsePropertyPath('a.b[0].c'); // ['a', 'b', 0, 'c']
parsePropertyPath('a.1'); // ['a', '1']
parsePropertyPath('a["b.c"]'); // ['a', 'b.c']
```

#### `set`

```ts
set<T extends object>(data: T, path: PropertyPath, value: unknown): T
```

パスで指定したプロパティに `value` を設定した新しいオブジェクトを返します。パスの途中のオブジェクト・配列はコピーし、存在しない場合は作ります（次のキーが `[0]` のようなインデックスの場合は配列、それ以外はオブジェクト）。既存のオブジェクトは、キーが数値でも配列にはしません。パスが空の場合は何もせず `data` を返します。パスの指定方法は `get` と同じです。

```ts
set({ a: { b: 1 } }, 'a.c', 2); // { a: { b: 1, c: 2 } }
set({}, 'a[0].b', 1); // { a: [{ b: 1 }] }
```

#### `setMutable`

```ts
setMutable<T extends object>(data: T, path: PropertyPath, value: unknown): T
```

`set` の破壊的な版です。`data` を直接変更し、同じオブジェクトを返します。

#### `stableStringify`

```ts
stableStringify(value: unknown, space?: string | number): string
```

オブジェクトのキーを再帰的に昇順に並べ替えてから、JSON 文字列にします。キーの順序に関わらず同じ内容のオブジェクトは同じ文字列になるため、キャッシュのキーなどに使えます。`toJSON` を持つ値（`Date` など）やボックス化したプリミティブ（`new Number(1)` など）は `JSON.stringify` と同じように変換し、循環参照がある場合は `JSON.stringify` と同じく `TypeError` を投げます。`space` は `JSON.stringify` の `space` と同じです。

```ts
stableStringify({ b: 2, a: { d: 1, c: 2 } }); // '{"a":{"c":2,"d":1},"b":2}'
```

#### `transformObject`

```ts
transformObject<T extends object = LooseRecord, S extends object = LooseRecord>(source: S, rules: readonly (string | TransformObjectRule<S, T>)[], options?: TransformObjectOptions): T
```

`rules` に従って `source` から値を取り出し、新しいオブジェクトを作ります。文字列のルールは、同じパスで取り出して設定します。取り出した値が `undefined` の場合は設定しません。`removeFromSource` を指定した場合は `source` を直接変更します。削除はすべてのルールで値を取り出した後に行うため、配列の要素を削除してもほかのルールのインデックスはずれません。

```ts
transformObject({ firstName: 'Alice', age: 30 }, [
  'age',
  { from: 'firstName', to: 'user.name' },
  { from: (source) => source.age * 2, to: 'doubleAge' },
]);
// { age: 30, user: { name: 'Alice' }, doubleAge: 60 }
```

| ルールのプロパティ  | 型                                                   | 説明                                                                                                                                     |
| ------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `from`              | `PropertyPath \| ((source: S) => unknown)`           | 取り出すパス、または値を返す関数                                                                                                         |
| `to?`               | `PropertyPath \| ((target: T, value: unknown) => T)` | 設定するパス、または値を設定したオブジェクトを返す関数。省略した場合は `from` と同じパス。`from` が関数の場合は必須                      |
| `removeFromSource?` | `boolean`                                            | `true` の場合、取り出した後に `source` からプロパティを削除する。省略した場合はオプションの指定に従う。`from` が関数の場合は指定できない |

| オプション          | 型        | 説明                                                                                                                |
| ------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `removeFromSource?` | `boolean` | `true` の場合、パスで指定したルールについて、取り出した後に `source` からプロパティを削除する。デフォルトは `false` |

#### `unset`

```ts
unset<T extends object>(data: T, path: PropertyPath): T
```

パスで指定したプロパティを削除した新しいオブジェクトを返します。配列の要素を削除した場合は後ろの要素を詰めます。パスが存在しない場合は `data` をそのまま返します。パスの指定方法は `get` と同じです。

```ts
unset({ a: { b: 1, c: 2 } }, 'a.b'); // { a: { c: 2 } }
unset({ a: [1, 2, 3] }, 'a[1]'); // { a: [1, 3] }
```

#### `unsetMutable`

```ts
unsetMutable<T extends object>(data: T, path: PropertyPath): T
```

`unset` の破壊的な版です。`data` を直接変更し、同じオブジェクトを返します。

#### `update`

```ts
update<T extends object>(target: T, values: Partial<T>, options?: UpdateOptions): T
```

`values` の各プロパティのうち、`target` の値と異なるものだけを更新した新しいオブジェクトを返します。どのプロパティも変わらない場合は `target` をそのまま返すため、参照の比較で変更の有無を判定できます。値の比較方法は `isEqual` オプションで指定します。

```ts
const state = { a: 1, b: 2 };
update(state, { a: 9 }); // { a: 9, b: 2 }（新しいオブジェクト）
update(state, { a: 1 }) === state; // true
update({ a: { x: 1 } }, { a: { x: 1 } }, { isEqual }); // 元のオブジェクト
```

| オプション | 型                                              | 説明                                                                                                                                                            |
| ---------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isEqual?` | `(value1: unknown, value2: unknown) => boolean` | 値が変わっていないかを判定する関数。デフォルトは `Object.is` で比較する（`NaN` 同士は等しく、`+0` と `-0` は異なる）。構造で比較する場合は `isEqual` 関数を渡す |

#### `updateMutable`

```ts
updateMutable<T extends object>(target: T, values: Partial<T>, options?: UpdateMutableOptions): Partial<T>
```

`update` の破壊的な版です。`target` を直接更新し、更新したプロパティの更新前の値を持つオブジェクトを返します。オプションは `update` と同じです。

```ts
const state = { a: 1, b: 2 };
updateMutable(state, { a: 9, b: 2 }); // { a: 1 }（state は { a: 9, b: 2 }）
```

#### 型

| 型                            | 説明                                                                                                                                                                                                                                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AssignDefinedMutableOptions` | `assignDefinedMutable` のオプション                                                                                                                                                                                                                                                                       |
| `AssignDefinedOptions`        | `AssignDefinedMutableOptions` と同じ                                                                                                                                                                                                                                                                      |
| `AssignDefinedResult<T, V>`   | `assignDefined`・`assignDefinedMutable` の戻り値。`values` の値が `undefined` で反映されない可能性があるキーは、`target` の値の型も残る                                                                                                                                                                   |
| `AssignPresentMutableOptions` | `assignPresentMutable` のオプション                                                                                                                                                                                                                                                                       |
| `AssignPresentOptions`        | `AssignPresentMutableOptions` と同じ                                                                                                                                                                                                                                                                      |
| `AssignPresentResult<T, V>`   | `assignPresent`・`assignPresentMutable` の戻り値。`values` の値が `null` / `undefined` で反映されない可能性があるキーは、`target` の値の型も残る（`target` に無いキーは `undefined`）                                                                                                                     |
| `DistributeOptions`           | `distribute` のオプション                                                                                                                                                                                                                                                                                 |
| `DistributeRules<T>`          | `distribute` のルール `{ [group]: プロパティ名の配列 \| null }`                                                                                                                                                                                                                                           |
| `DistributePropertyList<T>`   | `distribute` のルールに指定するプロパティ名の配列                                                                                                                                                                                                                                                         |
| `DistributeResult<T, R>`      | `distribute` の戻り値                                                                                                                                                                                                                                                                                     |
| `FillDefaultsMutableOptions`  | `fillDefaultsMutable` のオプション                                                                                                                                                                                                                                                                        |
| `FillDefaultsOptions`         | `FillDefaultsMutableOptions` と同じ                                                                                                                                                                                                                                                                       |
| `FillDefaultsResult<T, V, O>` | `fillDefaults`・`fillDefaultsMutable` の戻り値。`target` の値が `undefined`（`overwriteNull: true` の場合は `null` も）のキーは、その値を除いて `defaultValues` の値の型が加わる。`defaultValues` のリテラル型は保たれる。`overwriteNull` がコンパイル時に決まらない `boolean` の場合は `null` が残りうる |
| `FilterByKeysOptions`         | `filterByKeys` のオプション                                                                                                                                                                                                                                                                               |
| `FilterByValuesOptions`       | `filterByValues` のオプション                                                                                                                                                                                                                                                                             |
| `FlattenObjectOptions`        | `flattenObject` のオプション                                                                                                                                                                                                                                                                              |
| `ForEachValueOptions`         | `forEachValue` のオプション                                                                                                                                                                                                                                                                               |
| `GetOptions`                  | `get` のオプション                                                                                                                                                                                                                                                                                        |
| `PropertyPath`                | `get`・`set`・`unset` などのパス。文字列は `parsePropertyPath` の規則で解釈し、数値・symbol は1つのキー、配列はキーの並びとして扱う                                                                                                                                                                       |
| `SplitKeyRecord<T>`           | `createSplitByKeys` に渡すキーのオブジェクト。`T` がユニオン型の場合は、全てのメンバーのキーを持つ                                                                                                                                                                                                        |
| `SplitRest<D, T>`             | `createSplitByKeys` で作った関数の戻り値の `rest`。`D` から `T` のキーを除いたもの                                                                                                                                                                                                                        |
| `TransformObjectOptions`      | `transformObject` のオプション                                                                                                                                                                                                                                                                            |
| `TransformObjectRule<S, T>`   | `transformObject` のルール                                                                                                                                                                                                                                                                                |
| `UpdateMutableOptions`        | `updateMutable` のオプション                                                                                                                                                                                                                                                                              |
| `UpdateOptions`               | `UpdateMutableOptions` と同じ                                                                                                                                                                                                                                                                             |

### string

| 関数                                              | 説明                                         |
| ------------------------------------------------- | -------------------------------------------- |
| `createExtractor(delimiters?)`                    | 囲み文字で囲まれた部分を抽出する関数を作る   |
| `createReplacerByMap(map)`                        | マップに従って文字列を置換する関数を作る     |
| `ensureString(data)`                              | 値を文字列にする                             |
| `escapeRegExp(data)`                              | 正規表現の特殊文字をエスケープする           |
| `isSurroundedBy(data, prefix, suffix?)`           | 指定の文字列で囲まれているか判定する         |
| `lowerFirst(data)`                                | 先頭の文字を小文字にする                     |
| `replaceByMap(data, map)`                         | マップに従って文字列を置換する               |
| `replacePlaceholders(template, values, options?)` | テンプレートのプレースホルダーを値で置換する |
| `toCamelCase(data)` など                          | 文字列のケースを変換する                     |
| `upperFirst(data)`                                | 先頭の文字を大文字にする                     |

#### `createExtractor`

```ts
createExtractor(delimiters?: string | readonly [string, string]): Extractor
```

`delimiters` で囲まれた部分を抽出する関数を作ります。囲み文字が1つの文字列の場合は、開始・終了で共通にします。省略した場合や空文字の場合は `['{{', '}}']` です。作った関数は、抽出した文字列の配列を返します。囲み文字の内側の前後の空白は削除し、内側に改行を含むものは抽出しません。対象の文字列が空文字の場合は空配列を返します。

```ts
const extract = createExtractor();
extract('{{a}} and {{ b }} and {{a}}', { unique: true }); // ['a', 'b']
extract('{{ a }}', { keepWhitespace: true }); // [' a ']
extract('{{ a }}', { keepDelimiters: true }); // ['{{ a }}']
createExtractor('%')('%x% %y%'); // ['x', 'y']
```

作った関数のオプションとプロパティは次のとおりです。

| オプション        | 型        | 説明                                                                                    |
| ----------------- | --------- | --------------------------------------------------------------------------------------- |
| `keepDelimiters?` | `boolean` | `true` の場合、囲み文字を含めて元の文字列のまま返す（空白も残す）。デフォルトは `false` |
| `keepWhitespace?` | `boolean` | `true` の場合、囲み文字の内側の前後の空白を残す。デフォルトは `false`                   |
| `unique?`         | `boolean` | `true` の場合、重複を除く（空白を削除した後の文字列で比べる）。デフォルトは `false`     |

| プロパティ | 型       | 説明                           |
| ---------- | -------- | ------------------------------ |
| `prefix`   | `string` | 開始の囲み文字（読み取り専用） |
| `suffix`   | `string` | 終了の囲み文字（読み取り専用） |

#### `createReplacerByMap`

```ts
createReplacerByMap(map: ReplacementMap): Replacer
```

`replaceByMap` と同じ規則で置換する関数を作ります。置換用の索引を最初に一度だけ作るため、同じマップで何度も置換する場合は `replaceByMap` より速くなります。作成した後に `map` を変更しても、作成した関数には反映しません。作った関数は、空文字をそのまま返します。

```ts
const replace = createReplacerByMap({ hello: 'hi', world: 'earth' });
['hello world', 'hello'].map(replace); // ['hi earth', 'hi']
```

#### `ensureString`

```ts
ensureString(data: unknown): string
```

値を文字列にします。文字列はそのまま返し、`null` / `undefined` は空文字、それ以外の値は `String()` で変換します。`String()` で変換できない値（プロトタイプが `null` のオブジェクトなど）は、普通のオブジェクトと同じく `'[object Object]'` の形にします。

#### `escapeRegExp`

```ts
escapeRegExp(data: string): string
```

文字列を、正規表現の中でその文字列自体に一致するようにエスケープします。標準の `RegExp.escape` と同じ結果を返し、標準の機能がある環境ではそちらを使います。`u` / `v` フラグを指定した場合や、文字クラスの中に埋め込んだ場合も、元の文字列として扱われます。前後の文字とつながって意味が変わらないよう、先頭の英数字も `\x31` のような形でエスケープします。

```ts
new RegExp(escapeRegExp('1.5*2')); // /\x31\.5\*2/
```

#### `isSurroundedBy`

```ts
isSurroundedBy(data: string, prefix: string, suffix?: string): boolean
```

`data` が `prefix` で始まり `suffix` で終わるか判定します。`prefix` と `suffix` の間は0文字でもかまいませんが、`prefix` と `suffix` が重なっている場合は `false` です。`suffix` を省略した場合は `prefix` と同じです。

```ts
isSurroundedBy('(a)', '(', ')'); // true
isSurroundedBy('()', '(', ')'); // true
isSurroundedBy('"', '"'); // false
```

#### `lowerFirst` / `upperFirst`

```ts
lowerFirst(data: string): string
upperFirst(data: string): string
```

先頭の文字を小文字（`lowerFirst`）・大文字（`upperFirst`）にします。サロゲートペアの文字も1文字として扱います。

#### `replaceByMap`

```ts
replaceByMap(data: string, map: ReplacementMap): string
```

`map` のキーの文字列を値の文字列に置換します。一度にまとめて置換するため、置換した結果がさらに置換されることはありません。キーが重なる場合は長いキーを優先します。`data` が空文字の場合はそのまま返します。

```ts
replaceByMap('hello world', { hello: 'hi', world: 'earth' }); // 'hi earth'
replaceByMap('abcab', { ab: 'X', a: 'Y' }); // 'XcX'
```

#### `replacePlaceholders`

```ts
replacePlaceholders(template: string, values: Record<string, unknown> | readonly unknown[], options?: ReplacePlaceholdersOptions): string
```

`template` の中のプレースホルダー（デフォルトは `{{キー}}`）を `values` の値で置換します。キーは `get` と同じくパスとして解釈し、囲み文字の内側の前後の空白は無視します。内側に改行を含むものはプレースホルダーとして扱いません。

値が見つからない場合はプレースホルダーをそのまま残します。値が `null` / `undefined` / 関数の場合や、キーが空の場合も、見つからない場合と同じです。それ以外の値は `ensureString` で文字列にします。プロトタイプ上のプロパティ（`toString` やクラスの getter など）は、`includeInherited` を指定しない限り値として使いません。

```ts
replacePlaceholders('{{ user.name }}さん、{{greeting}}', {
  user: { name: 'Alice' },
  greeting: 'こんにちは',
}); // 'Aliceさん、こんにちは'
replacePlaceholders('{{0}}と{{1}}', ['Alice', 'Bob']); // 'AliceとBob'
replacePlaceholders('{{toString}}', {}); // '{{toString}}'
```

| オプション          | 型                                    | 説明                                                                                                                     |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `delimiters?`       | `string \| readonly [string, string]` | プレースホルダーの囲み文字。1つの文字列の場合は開始・終了で共通にする。デフォルトは `['{{', '}}']`（空文字の場合も同じ） |
| `removeUnresolved?` | `boolean`                             | `true` の場合、値が見つからないプレースホルダーを削除する                                                                |
| `flatKeys?`         | `boolean`                             | `true` の場合、キーをパスとして解釈せず、`values` の直下のプロパティ名として扱う                                         |
| `includeInherited?` | `boolean`                             | `true` の場合、プロトタイプ上のプロパティ（クラスの getter など）も値として使う。関数の値は使わない                      |

#### ケース変換

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

文字列のケースを変換します。`toLowerCase` / `toUpperCase` は単語を区切らずに全体を小文字・大文字にします。それ以外は文字列を単語に分けてから、各ケースの形でつなぎます。そのため、表のケースはフラットケース以外どれも入力として扱えます。`data` が空文字の場合はそのまま返します。

単語は次の規則で分けます。

- 英字・数字以外の文字（空白、`_`、`-`、`.`、`/`、`:` など）を区切りとして扱い、先頭・末尾の区切りは除く（`'_private'` は `private`）
- 引用符（`'`・`’`）は区切らずに取り除く（`"don't"` は `dont`）
- 小文字・数字の後の大文字の前で区切る（`helloWorld`、`version2Beta`）
- 連続する大文字（略語）は1つの単語として扱い、小文字が続く最後の1文字の前で区切る（`XMLParser` は `XML` / `Parser`）。略語も他の単語と同じく大文字・小文字を変換する
- 英字の後の数字の前では区切らない（`i18n`・`utf8`・`base64` は1つの単語）
- 日本語など、大文字・小文字の無い文字は単語の一部として扱う

| 関数                   | `'hello world'` の変換結果 | `'XMLParser'` の変換結果 | `'user/i18n:v2'` の変換結果 |
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

#### 型

| 型                           | 説明                                                                                                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `Extractor`                  | `createExtractor` で作った関数                                                                                  |
| `ExtractorOptions`           | `createExtractor` で作った関数のオプション                                                                      |
| `ReplacementMap`             | `replaceByMap`・`createReplacerByMap` のマップ。Map・プロパティをエントリーにするオブジェクト・エントリーの配列 |
| `Replacer`                   | `createReplacerByMap` で作った関数                                                                              |
| `ReplacePlaceholdersOptions` | `replacePlaceholders` のオプション                                                                              |

### timer

| 関数                                        | 説明                                                |
| ------------------------------------------- | --------------------------------------------------- |
| `debounce(fn, options?)`                    | 呼び出しが落ち着いてから実行する関数を作る          |
| `setLongTimeout(callback, delay, options?)` | `setTimeout` の上限を超える長さのタイマーを設定する |
| `sleep(ms, options?)`                       | 指定の時間待つ `Promise` を返す                     |
| `throttle(fn, options?)`                    | 一定の時間に1回まで実行する関数を作る               |

#### `debounce`

```ts
debounce<ARGS extends unknown[]>(fn: (...args: ARGS) => void, options?: DebounceOptions): DebounceResult<ARGS>
```

最後の呼び出しから `wait` ミリ秒の間、呼び出しが無かった場合に `fn` を実行する関数を作ります。`fn` には最後の呼び出しの引数を渡します。

```ts
const onInput = debounce((value: string) => search(value), { wait: 300 });
```

| オプション   | 型                           | 説明                                                                                                                     |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `wait?`      | `number`                     | 呼び出しが途切れたと見なすまでのミリ秒。デフォルトは `240`                                                               |
| `triggerAt?` | `'end' \| 'start' \| 'both'` | 実行するタイミング。`'end'`: 呼び出しが落ち着いた後、`'start'`: 最初の呼び出しの時、`'both'`: 両方。デフォルトは `'end'` |

作った関数は次のメソッドを持ちます。

| メソッド   | 説明                                   |
| ---------- | -------------------------------------- |
| `cancel()` | 保留中の実行を取り消す                 |
| `flush()`  | 保留中の実行をすぐに行う               |
| `isIdle()` | 保留中の実行が無い場合に `true` を返す |

#### `setLongTimeout`

```ts
setLongTimeout(callback: () => void, delay: number, options?: SetLongTimeoutOptions): () => void
```

`delay` ミリ秒後に `callback` を実行します。`setTimeout` の上限（約 24.8 日）を超える `delay` も指定できます。その場合は目標の時刻までの残り時間からタイマーを設定し直すため、PC のスリープなどでタイマーが止まっても時刻がずれません。`setTimeout` と同じく `NaN` や負の値は `0` として扱い、`Infinity` の場合は `callback` を実行しません。タイマーを取り消す関数を返します。

| オプション | 型            | 説明                           |
| ---------- | ------------- | ------------------------------ |
| `signal?`  | `AbortSignal` | 中断されるとタイマーを取り消す |

#### `sleep`

```ts
sleep(ms: number, options?: SleepOptions): Promise<void>
```

`ms` ミリ秒後に解決する `Promise` を返します。`setLongTimeout` と同じく、`setTimeout` の上限を超える `ms` も指定できます。中断された場合は `signal.reason`（未設定の場合は `AbortError`）で reject します。

```ts
await sleep(1000);
```

| オプション | 型            | 説明                     |
| ---------- | ------------- | ------------------------ |
| `signal?`  | `AbortSignal` | 中断されると待機をやめる |

#### `throttle`

```ts
throttle<ARGS extends unknown[]>(fn: (...args: ARGS) => void, options?: ThrottleOptions): ThrottleResult<ARGS>
```

`wait` ミリ秒の間に `fn` を最大1回まで実行する関数を作ります。`'start'` と `'both'` では、実行から次の実行まで `wait` ミリ秒以上空けます。`fn` には最後の呼び出しの引数を渡します。作った関数のメソッドは `debounce` と同じです。

```ts
const onScroll = throttle(() => updatePosition(), { wait: 100 });
```

| オプション   | 型                           | 説明                                                                                                      |
| ------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| `wait?`      | `number`                     | 実行の間隔のミリ秒。デフォルトは `240`                                                                    |
| `triggerAt?` | `'both' \| 'start' \| 'end'` | 実行するタイミング。`'start'`: 各区間の最初、`'end'`: 各区間の最後、`'both'`: 両方。デフォルトは `'both'` |

#### 型

| 型                      | 説明                          |
| ----------------------- | ----------------------------- |
| `DebounceOptions`       | `debounce` のオプション       |
| `DebounceResult<ARGS>`  | `debounce` で作った関数       |
| `SetLongTimeoutOptions` | `setLongTimeout` のオプション |
| `SleepOptions`          | `sleep` のオプション          |
| `ThrottleOptions`       | `throttle` のオプション       |
| `ThrottleResult<ARGS>`  | `throttle` で作った関数       |

### type

| 関数                             | 説明                                                       |
| -------------------------------- | ---------------------------------------------------------- |
| `getKind(value)`                 | 値の種類を `typeof` より詳しく返す                         |
| `getPriority(value, options?)`   | 値の種類に応じた優先度を返す                               |
| `getRawType(value)`              | `Object.prototype.toString` による型のラベルを返す         |
| `isAsyncIterable(value)`         | 非同期イテラブルか判定する                                 |
| `isBlank(value)`                 | `null` / `undefined` / 空文字 / 空白だけの文字列か判定する |
| `isEmpty(value)`                 | `null` / `undefined` / 空文字か判定する                    |
| `isEmptyCollection(value)`       | 空の配列・`Map`・`Set` か判定する                          |
| `isInvalidDate(value)`           | 無効な日付（`Invalid Date`）の `Date` か判定する           |
| `isIterable(value)`              | イテラブルか判定する                                       |
| `isNonNegativeInteger(value)`    | 0 以上の整数か判定する                                     |
| `isNullish(value)`               | `null` か `undefined` か判定する                           |
| `isNumberLike(value)`            | 数値、または10進数の数値の文字列か判定する                 |
| `isPresent(value)`               | `null` でも `undefined` でもないか判定する                 |
| `isPrimitive(value)`             | プリミティブ値か判定する                                   |
| `isRegExp(value)`                | `RegExp` か判定する                                        |
| `isUndefined(value)`             | `undefined` か判定する                                     |
| `isValidDate(value)`             | 有効な日付の `Date` か判定する                             |
| `isValidNumber(value, options?)` | 有効な数値（`NaN` や `Infinity` でない数値）か判定する     |
| `unsafeCast(value)`              | 型チェックを無視して型を変換する                           |

#### `getKind`

```ts
getKind(value: unknown): Kind
```

値の種類を返します。オブジェクト以外の値は `typeof` の結果を返します。オブジェクトは `null`、`array`、`plainobject`（プロトタイプが `Object.prototype` か `null` のオブジェクト）、`date`、`regexp`、`error`、`map`、`set`、`weakmap`、`weakset`、`promise`、`arraybuffer`、`sharedarraybuffer` に分けます。どれにも当てはまらないオブジェクト（クラスのインスタンス、DOM 要素、TypedArray など）は `instance` です。

組み込みオブジェクトは `instanceof` で判定するため、iframe など別の realm のオブジェクトは `instance` になります。

```ts
getKind([]); // 'array'
getKind({}); // 'plainobject'
getKind(new Date()); // 'date'
getKind(null); // 'null'
getKind(new (class {})()); // 'instance'
```

#### `getPriority`

```ts
getPriority(value: unknown, options?: GetPriorityOptions): number
```

`getKind` による値の種類に応じた優先度を返します。並べ替えで `null` / `undefined` を後ろに回す場合などに使います。デフォルトでは `undefined` は `-2`、`null` は `-1`、それ以外は `0` です。

```ts
getPriority(undefined); // -2
getPriority([], { priorityMap: { array: 3 } }); // 3
getPriority(null, { priorityMap: { array: 3 } }); // -1（デフォルトとマージされる）
```

| オプション             | 型                              | 説明                                                                                  |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `priorityMap?`         | `Partial<Record<Kind, number>>` | `getKind` の種類ごとの優先度。デフォルトの `{ undefined: -2, null: -1 }` とマージする |
| `getFallbackPriority?` | `(data: unknown) => number`     | `priorityMap` にもデフォルトにも無い種類の優先度を返す関数。省略した場合は `0`        |

#### `getRawType`

```ts
getRawType(value: unknown): GetRawTypeResult
```

`Object.prototype.toString.call(value)` の結果（`'[object Array]'` など）を返します。

#### `isAsyncIterable` / `isIterable`

```ts
isAsyncIterable(value: unknown): value is AsyncIterable<unknown>
isIterable(value: unknown): value is Iterable<unknown>
```

値が `Symbol.asyncIterator`（`isAsyncIterable`）・`Symbol.iterator`（`isIterable`）のメソッドを持つか判定します。文字列もイテラブルです。

#### `isBlank` / `isEmpty`

```ts
isBlank(value: unknown): boolean
isEmpty(value: unknown): value is Empty
```

`isEmpty` は、値が `null`、`undefined`、空文字（`@fringeworks/types` の `Empty` 型）の場合に `true` を返します。`isBlank` は、それに加えて空白だけの文字列でも `true` を返します。空白は正規表現の `\s` と同じ（半角・全角スペース、タブ、改行など）です。それ以外の値は `false` です。

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

値が空の配列・`Map`・`Set` の場合に `true` を返します。`null`、`undefined`、空のオブジェクト（`{}`）などそれ以外の値は `false` です。両方を判定する場合は `isBlank(value) || isEmptyCollection(value)` のように組み合わせます。

#### `isInvalidDate` / `isValidDate`

```ts
isInvalidDate(value: unknown): boolean
isValidDate(value: unknown): boolean
```

値が無効な日付（`Invalid Date`）の `Date` か（`isInvalidDate`）、有効な日付の `Date` か（`isValidDate`）判定します。`Date` 以外の値はどちらも `false` です。

#### `isNonNegativeInteger`

```ts
isNonNegativeInteger(value: unknown): boolean
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
isPrimitive(value: unknown): value is Primitive
```

値がプリミティブ値（`null`、`undefined`、真偽値、数値、BigInt、文字列、シンボル）の場合に `true` を返します。

#### `isRegExp`

```ts
isRegExp(value: unknown): value is RegExp
```

値が `RegExp` の場合に `true` を返します。`instanceof` で判定するため、`Symbol.toStringTag` で `RegExp` に見せかけたオブジェクトや、iframe など別の realm の `RegExp` は `false` になります。

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

| 型                     | 説明                         |
| ---------------------- | ---------------------------- |
| `GetPriorityOptions`   | `getPriority` のオプション   |
| `GetRawTypeResult`     | `getRawType` の戻り値        |
| `IsValidNumberOptions` | `isValidNumber` のオプション |
| `Kind`                 | `getKind` が返す値の種類の値 |

## ライセンス

MIT
