# @fringeworks/utils

`@fringeworks/utils` は、配列・オブジェクト・文字列・数値・日付・タイマーなど幅広いカテゴリにわたる汎用ユーティリティ関数のニッチなライブラリです。

**[English README is available here](./README.md)**

## インストール

```bash
npm install @fringeworks/utils
# または
pnpm add @fringeworks/utils
```

## 使い方

```ts
import { ensureArray, normalizeString, rangeClamp } from '@fringeworks/utils';
```

カテゴリごとにインポートすることもできます。

```ts
import { ensureArray } from '@fringeworks/utils/array';
import { normalizeString } from '@fringeworks/utils/string';
```

## Data Last パターン

多くの関数は `.dataLast` プロパティを持ち、データを最後の引数として受け取るカリー化された関数を返します。パイプライン処理に活用できます。

```ts
import { ensureArray } from '@fringeworks/utils/array';

// data-first（通常の呼び出し）
const arr = ensureArray('hello'); // ['hello']

// data-last（カリー化）
const toArray = ensureArray.dataLast();
const arr2 = toArray('hello'); // ['hello']
```

---

## API リファレンス

### array — 配列操作

#### `asArray(data, options?)` [`*`](#-data-last-対応)

あらゆる値を配列に変換します。イテラブルは展開され、文字列・プリミティブは1要素の配列になります。

```ts
asArray([1, 2, 3]); // [1, 2, 3]
asArray('hello'); // ['hello']
asArray(null); // []
asArray(new Set([1, 2])); // [1, 2]
```

| オプション | 型        | 説明                                                   |
| ---------- | --------- | ------------------------------------------------------ |
| `raw`      | `boolean` | `true` のとき、イテラブルを展開せずそのまま1要素にする |

---

#### `ensureArray(data, options?)` [`*`](#-data-last-対応)

値が配列でない場合に配列へラップします。`null`/`undefined` は空配列を返します。

```ts
ensureArray([1, 2]); // [1, 2]
ensureArray(42); // [42]
ensureArray(null); // []
```

| オプション | 型        | 説明                                                   |
| ---------- | --------- | ------------------------------------------------------ |
| `raw`      | `boolean` | `true` のとき、配列かどうか判定せずそのまま1要素にする |

---

#### `cycle(data, size)` [`*`](#-data-last-対応)

配列をループさせて指定サイズの新しい配列を生成します。`size` が負のとき逆順になります。

```ts
cycle([1, 2, 3], 7); // [1, 2, 3, 1, 2, 3, 1]
cycle([1, 2, 3], -5); // [3, 2, 1, 3, 2]
```

---

#### `insertAt(data, index, items, options?)` [`*`](#-data-last-対応)

配列の指定インデックスに要素を挿入します。インデックスは有効範囲にクランプされます。

```ts
insertAt([1, 2, 3], 1, [10, 20]); // [1, 10, 20, 2, 3]
```

| オプション | 型        | 説明                                |
| ---------- | --------- | ----------------------------------- |
| `inplace`  | `boolean` | `true` のとき元の配列を直接変更する |

---

#### `pushAll(data, source, options?)` [`*`](#-data-last-対応)

配列に別の配列の全要素を追加した新しい配列を返します。`data` が `null` の場合は `null` を返します。

```ts
pushAll([1, 2], [3, 4]); // [1, 2, 3, 4]
```

---

#### `pushAllMutable(data, source)` [`*`](#-data-last-対応)

配列に別の配列の全要素を破壊的に追加します。

```ts
const arr = [1, 2];
pushAllMutable(arr, [3, 4]); // arr => [1, 2, 3, 4]
```

---

#### `pushUnique(data, items, options?)` [`*`](#-data-last-対応)

重複しない要素のみを配列に追加した新しい配列を返します。

```ts
pushUnique([1, 2], [2, 3, 4]); // [1, 2, 3, 4]
```

---

#### `pushUniqueMutable(data, items, options?)` [`*`](#-data-last-対応)

重複しない要素のみを配列に破壊的に追加します。

---

#### `rotateArray(data, options?)` [`*`](#-data-last-対応)

配列の先頭から要素を取り出して末尾に追加するローテーションを行います。

```ts
rotateArray([1, 2, 3, 4, 5], { count: 2 }); // [3, 4, 5, 1, 2]
```

| オプション | 型        | 説明                                      |
| ---------- | --------- | ----------------------------------------- |
| `count`    | `number`  | ローテーションする要素数（デフォルト: 1） |
| `inplace`  | `boolean` | `true` のとき元の配列を直接変更する       |

---

#### `nestedKeyBy(data, properties, options?)` [`*`](#-data-last-対応)

配列をプロパティ値をキーとしたネストオブジェクトに変換します。各リーフに単一アイテムが格納されます。

```ts
const users = [
  { id: 'a', role: 'admin', name: 'Alice' },
  { id: 'b', role: 'user', name: 'Bob' },
];
nestedKeyBy(users, ['role', 'id']);
// { admin: { a: {...} }, user: { b: {...} } }
```

| オプション     | 型        | 説明                                                                |
| -------------- | --------- | ------------------------------------------------------------------- |
| `overwrite`    | `boolean` | `true` のとき同一キーで後の値を優先する（デフォルト: 先の値を優先） |
| `flat`         | `boolean` | `true` のときキーを結合したフラットなオブジェクトにする             |
| `keySeparator` | `string`  | `flat` 時のキー区切り文字（デフォルト: `'.'`）                      |

---

#### `nestedGroupBy(data, properties, options?)` [`*`](#-data-last-対応)

配列をプロパティ値をキーとしたネストオブジェクトに変換します。各リーフにアイテムの配列が格納されます。

```ts
nestedGroupBy(users, 'role');
// { admin: [...], user: [...] }
```

---

#### `sortDependencies(data, options?)` [`*`](#-data-last-対応)

依存関係に基づいて配列をトポロジカルソートします。循環依存がある場合はエラーをスローします。

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

| オプション          | 型                    | 説明                                             |
| ------------------- | --------------------- | ------------------------------------------------ |
| `idProp`            | `keyof I \| Function` | IDを取得するプロパティ名または関数               |
| `depsProp`          | `keyof I \| Function` | 依存リストを取得するプロパティ名または関数       |
| `depsIdProp`        | `keyof I \| Function` | 依存アイテムのIDを取得するプロパティ名または関数 |
| `isTree`            | `boolean`             | ツリー形式の依存関係を処理する                   |
| `ignoreNoSubstance` | `boolean`             | 存在しない依存先を無視する                       |
| `desc`              | `boolean`             | `true` のとき逆順にする                          |

---

#### `swapPairs(data)` [`*`](#-data-last-対応)

配列内の隣接する要素ペアを入れ替えます。

```ts
swapPairs([1, 2, 3, 4]); // [2, 1, 4, 3]
```

---

#### `maybeFind(data, predicate)` [`*`](#-data-last-対応)

条件に一致する最初の要素を返します。一致しない場合は `undefined` を返します。

---

#### `maybeMap(data, mapper, options?)` [`*`](#-data-last-対応)

配列の各要素をマッピングし、`null`/`undefined` を除いた新しい配列を返します。

---

#### `firstDefined(data)` [`*`](#-data-last-対応)

配列内の最初の `undefined` でない値を返します。

---

#### `firstPresent(data)` [`*`](#-data-last-対応)

配列内の最初の `null`/`undefined` でない値を返します。

---

#### `clearArray(data)`

配列の全要素を削除します（破壊的）。

---

### boolean — 真偽値

#### `ensureBoolean(value, options?)` [`*`](#-data-last-対応)

値をブール値に変換します。文字列 `'true'`・`'1'`・`'yes'` なども `true` に変換可能です。

```ts
ensureBoolean('true'); // true
ensureBoolean(0); // false
ensureBoolean('yes', { trueValues: ['yes'] }); // true
```

---

### compare — 比較

#### `compare(left, operator, right)` [`*`](#-data-last-対応)

演算子を用いて2つの値を比較し、真偽値を返します。

```ts
compare(5, '>', 3); // true
compare(5, 'between', [1, 10]); // true
compare('a', 'in', ['a', 'b']); // true
```

対応演算子: `'='` `'!='` `'<'` `'<='` `'>'` `'>='` `'between'` `'in'` `'notIn'`

---

#### `isEqualBy(a, b, options?)` [`*`](#-data-last-対応)

2つの値を指定した比較モードで等値判定します。

```ts
isEqualBy({ a: 1 }, { a: 1 }, { mode: 'deep' }); // true
```

| オプション   | 型                              | 説明                                 |
| ------------ | ------------------------------- | ------------------------------------ |
| `mode`       | `'strict' \| 'loose' \| 'deep'` | 比較モード（デフォルト: `'strict'`） |
| `customizer` | `Function`                      | カスタム比較関数                     |

---

#### `isEqualWith(a, b, customizer)` [`*`](#-data-last-対応)

カスタム比較関数を用いて2つの値を再帰的に等値判定します。

---

### date — 日付

#### `asUtcDate(date)`

ローカル時刻の日付のコンポーネント（年月日時分秒）をそのままUTC値として解釈した新しい `Date` を返します。

```ts
// JST 2024-01-15 12:00:00 → UTC 2024-01-15 12:00:00 として扱う
asUtcDate(new Date(2024, 0, 15, 12, 0, 0));
```

---

#### `createUtcDate(year, month, day, ...)`

UTC タイムゾーンの日付を生成します。

---

#### `interpolateDate(value, ratio, options?)` [`*`](#-data-last-対応)

2つの日付の間を比率で補間した日付を返します。

```ts
interpolateDate(targetDate, 0.5, { baseValue: startDate });
// startDate と targetDate の中間の日付
```

---

### format — フォーマット

#### `analyzeNumberFormat(format)`

数値フォーマット文字列（Excel形式など）を解析し、整数部・小数部の桁数、セパレーター、プレフィックス・サフィックスなどの情報を返します。

```ts
analyzeNumberFormat('#,##0.00');
// { intNumLength: 1, dp: true, dpLength: 2, ... }
```

---

### function — 関数ユーティリティ

#### `withCache(fn, options?)`

非同期関数の結果をキャッシュし、同じ引数での重複リクエストを防ぎます。

```ts
const cachedFetch = withCache(fetchUser, { ttl: 60000 });
await cachedFetch('user-1'); // API呼び出し
await cachedFetch('user-1'); // キャッシュから返却
```

| オプション | 型         | 説明                           |
| ---------- | ---------- | ------------------------------ |
| `ttl`      | `number`   | キャッシュの有効期限（ミリ秒） |
| `cacheKey` | `Function` | キャッシュキー生成関数         |

---

#### `withRetry(fn, maxRetries, options?)`

失敗時に自動リトライする非同期関数ラッパーです。

```ts
const reliableFetch = withRetry(fetchData, 3, {
  delay: 1000,
  exponentialBackoff: true,
});
```

| オプション           | 型         | 説明                             |
| -------------------- | ---------- | -------------------------------- |
| `delay`              | `number`   | リトライまでの待機時間（ミリ秒） |
| `exponentialBackoff` | `boolean`  | 指数バックオフを使用する         |
| `shouldRetry`        | `Function` | リトライするか判定する関数       |
| `onRetry`            | `Function` | リトライ時に呼ばれるコールバック |

---

#### `withTimeout(fn, timeout, options?)`

指定時間内に完了しない場合に `TimeoutError` をスローする非同期関数ラッパーです。

```ts
const timedFetch = withTimeout(fetchData, 5000);
```

---

#### `withFallback(fn, fallback, options?)`

エラー発生時にフォールバック値を返す非同期関数ラッパーです。

```ts
const safeFetch = withFallback(fetchData, null);
```

---

#### `alwaysTrue() / alwaysFalse() / alwaysInput(v) / alwaysVoid()`

常に固定値を返す関数です。

```ts
alwaysTrue(); // true
alwaysFalse(); // false
alwaysInput('hi'); // 'hi'
alwaysVoid(); // undefined
```

---

#### `maybeApply(fn, value)`

`value` が `null`/`undefined` でない場合のみ関数を適用します。

---

#### `maybeCall(fn, ...args)`

`fn` が関数の場合のみ呼び出します。

---

#### `ensureAsync(fn)`

同期関数を非同期関数（Promise を返す関数）に変換します。

---

### geometry — ジオメトリ

#### `fitToRatio(value, ratio, options?)` [`*`](#-data-last-対応)

値をアスペクト比に合わせてスケールします。

```ts
fitToRatio(100, 16 / 9, { mode: 'expand' }); // 178
fitToRatio(100, 16 / 9, { mode: 'shrink' }); // 56
```

| オプション | 型                     | 説明             |
| ---------- | ---------------------- | ---------------- |
| `mode`     | `'expand' \| 'shrink'` | 拡大・縮小モード |
| `decimals` | `number`               | 小数点以下の桁数 |

各比率に対応した専用関数も提供されています。

| 関数            | 比率            | Data Last |
| --------------- | --------------- | --------- |
| `fitToGolden`   | 黄金比 (1.618…) | ✓         |
| `fitToSilver`   | 白銀比 (2.414…) |           |
| `fitToBronze`   | 青銅比 (3.303…) |           |
| `fitToDouble`   | 2:1             |           |
| `fitToYamato`   | 大和比 (√2)     |           |
| `fitToSqrt2`    | √2              |           |
| `fitToSqrt3`    | √3              |           |
| `fitToSqrt5`    | √5              |           |
| `fitToHarmonic` | 調和比          |           |
| `fitToPlatinum` | 白金比          |           |

---

### input — 入力制御

#### `limitDecimal(value, options?)`

数値入力のバリデーション・整形を行います。小数点以下の桁数制限、最小値・最大値制限に対応し、インタラクティブ入力（編集中）とバッチ処理の両モードをサポートします。

```ts
limitDecimal('3.14159', { dp: 2 }); // '3.14'
limitDecimal('999', { max: 100 }); // '100'
limitDecimal('-', { interactive: true, min: -100 }); // '-'（入力中を許可）
```

| オプション    | 型                 | 説明                                            |
| ------------- | ------------------ | ----------------------------------------------- |
| `dp`          | `number`           | 小数点以下の最大桁数                            |
| `min`         | `number \| string` | 最小値                                          |
| `max`         | `number \| string` | 最大値                                          |
| `interactive` | `boolean`          | 入力中の状態（`-` や末尾の `.` など）を許可する |

---

#### `limitNaturalNumber(value, options?)`

値を自然数（正の整数）に変換・制限します。

```ts
limitNaturalNumber(3.7); // 3
limitNaturalNumber(0); // null（ゼロ不可）
limitNaturalNumber(0, { allowZero: true }); // 0
```

---

#### `limitPositiveNumber(value, options?)` [`*`](#-data-last-対応)

値を正数（ゼロより大きい数）に変換・制限します。

---

### map — Map 操作

#### `ensureMap(data, options?)` [`*`](#-data-last-対応)

さまざまな型の値を `Map` に変換します。

```ts
ensureMap({ a: 1, b: 2 }); // Map { 'a' => 1, 'b' => 2 }
ensureMap([['a', 1]]); // Map { 'a' => 1 }
ensureMap(null); // Map {}
```

---

### measure — パフォーマンス計測

#### `measure(fn, options?)`

関数の実行時間を計測します。

```ts
const result = measure(() => heavyCalc(), { iteration: 100 });
console.log(result.time); // 実行時間（ms）
```

| オプション  | 型       | 説明                       |
| ----------- | -------- | -------------------------- |
| `iteration` | `number` | 実行回数（デフォルト: 10） |

---

#### `measureAsync(fn, options?)`

非同期関数の実行時間を計測します。

---

#### `comparePerformance(fns, options?)`

複数の関数の実行時間を比較します。

---

#### `comparePerformanceAsync(fns, options?)`

複数の非同期関数の実行時間を比較します。

---

### number — 数値

#### `rangeClamp(value, min, max)` [`*`](#-data-last-対応)

値を最小値・最大値の範囲に収めます。

```ts
rangeClamp(150, 0, 100); // 100
rangeClamp(-10, 0, 100); // 0
```

---

#### `rangeLoop(value, min, max)` [`*`](#-data-last-対応)

値が範囲外のとき、ループ（剰余）して範囲内の値を返します。

```ts
rangeLoop(12, 0, 10); // 2
rangeLoop(-1, 0, 10); // 9
```

---

#### `rangeDefault(value, min, max, defaultValue)` [`*`](#-data-last-対応)

値が範囲外のとき、デフォルト値を返します。

---

#### `rangeMax(value, max)` [`*`](#-data-last-対応)

値が最大値を超える場合に最大値を返します。

---

#### `rangeMin(value, min)` [`*`](#-data-last-対応)

値が最小値を下回る場合に最小値を返します。

---

#### `rangePingpong(value, min, max)` [`*`](#-data-last-対応)

値が範囲外のとき、ピンポン（往復）して範囲内の値を返します。

---

#### `interpolateNumber(value, ratio, options?)` [`*`](#-data-last-対応)

基準値と目標値の間を比率で補間した値を返します。

```ts
interpolateNumber(100, 0.5, { baseValue: 0 }); // 50
interpolateNumber(200, 0.25, { baseValue: 100 }); // 125
```

---

#### `roundToStep(value, step)` [`*`](#-data-last-対応)

値をステップ単位で丸めます。

```ts
roundToStep(7, 5); // 5
roundToStep(8, 5); // 10
```

---

#### `ensureNumber(value, options?)` [`*`](#-data-last-対応)

値を数値に変換します。

---

#### `ensureRange(value, options?)` [`*`](#-data-last-対応)

値を指定の範囲に収めます。

---

#### `getValidMinMax(min, max)`

有効な最小値・最大値のペアを取得します（順序の自動修正など）。

---

#### `getValidNumber(value, options?)` [`*`](#-data-last-対応)

有効な数値かどうかを検証して返します。

---

#### `isWithinRange(value, min, max)` [`*`](#-data-last-対応)

値が `min` 以上 `max` 以下かどうかを返します。

---

#### `isStrictlyWithinRange(value, min, max)` [`*`](#-data-last-対応)

値が `min` より大きく `max` より小さいかどうかを返します。

---

### object — オブジェクト操作

#### `get(data, path)` [`*`](#-data-last-対応)

ドット記法やブラケット記法のパスでネストしたプロパティを取得します。

```ts
get({ a: { b: { c: 42 } } }, 'a.b.c'); // 42
get({ arr: [1, 2, 3] }, 'arr[1]'); // 2
```

---

#### `set(data, path, value)` [`*`](#-data-last-対応)

パスでネストしたプロパティに値をセットした新しいオブジェクトを返します（イミュータブル）。

```ts
set({ a: { b: 1 } }, 'a.b', 99); // { a: { b: 99 } }
```

---

#### `setMutable(data, path, value)` [`*`](#-data-last-対応)

パスでネストしたプロパティに値を破壊的にセットします。

---

#### `unset(data, path)` [`*`](#-data-last-対応)

パスのプロパティを削除した新しいオブジェクトを返します（イミュータブル）。

```ts
unset({ a: 1, b: 2 }, 'a'); // { b: 2 }
```

---

#### `unsetMutable(data, path)` [`*`](#-data-last-対応)

パスのプロパティを破壊的に削除します。配列の場合は `splice` で詰めます。

---

#### `update(data, values)` [`*`](#-data-last-対応)

オブジェクトの既存プロパティを新しい値で更新した新しいオブジェクトを返します（イミュータブル）。

---

#### `updateMutable(data, values)` [`*`](#-data-last-対応)

オブジェクトの既存の自身のプロパティを破壊的に更新します。更新前の値を返します。

---

#### `omit(data, paths)` [`*`](#-data-last-対応)

指定したパスのプロパティを除いたオブジェクトを返します。

```ts
omit({ a: 1, b: 2, c: 3 }, ['b']); // { a: 1, c: 3 }
```

---

#### `filterByKeys(target, condition, options?)` [`*`](#-data-last-対応)

指定の文字列をキーに含む要素のみを残すフィルタリングを行います（再帰的）。

```ts
filterByKeys({ name: 'Alice', age: 30 }, 'na');
// { name: 'Alice' }
```

| オプション  | 型        | 説明                           |
| ----------- | --------- | ------------------------------ |
| `normalize` | `boolean` | 比較前に文字列正規化を適用する |

---

#### `filterByValues(target, condition, options?)` [`*`](#-data-last-対応)

指定の値を含む要素のみを残すフィルタリングを行います（再帰的）。

```ts
filterByValues({ a: 'Alice', b: 'Bob', c: 1 }, 'Ali');
// { a: 'Alice' }
filterByValues({ a: 1, b: 2, c: 1 }, 1);
// { a: 1, c: 1 }
```

| オプション  | 型        | 説明                           |
| ----------- | --------- | ------------------------------ |
| `normalize` | `boolean` | 文字列比較前に正規化を適用する |

---

#### `transformObject(source, rules, options?)` [`*`](#-data-last-対応)

マッピングルールに従ってオブジェクトの構造を変換・抽出します。

```ts
transformObject({ firstName: 'Alice', age: 30 }, [
  { from: 'firstName', to: 'user.name' },
  { from: (s) => s.age * 2, to: 'doubleAge' },
]);
// { user: { name: 'Alice' }, doubleAge: 60 }
```

| ルールプロパティ         | 型                   | 説明                                  |
| ------------------------ | -------------------- | ------------------------------------- |
| `from`                   | `string \| Function` | 取得元のパスまたは値を算出する関数    |
| `to`                     | `string \| Function` | 設定先のパスまたは結果を変換する関数  |
| `shouldRemoveFromSource` | `boolean`            | `true` のとき元のプロパティを削除する |

| オプション         | 型        | 説明                                        |
| ------------------ | --------- | ------------------------------------------- |
| `deleteSourceKeys` | `boolean` | `true` のとき全ルールでソースキーを削除する |

---

#### `flattenObject(data, options?)` [`*`](#-data-last-対応)

ネストしたオブジェクトをフラットなキー・バリューペアに変換します。

```ts
flattenObject({ a: { b: { c: 1 } } });
// { 'a.b.c': 1 }
```

| オプション     | 型        | 説明                                  |
| -------------- | --------- | ------------------------------------- |
| `keySeparator` | `string`  | キーの区切り文字（デフォルト: `'.'`） |
| `ignoreArray`  | `boolean` | `true` のとき配列を展開しない         |

---

#### `distribute(data, rules, options?)` [`*`](#-data-last-対応)

オブジェクトのプロパティをルールに従って複数のグループに分配します。各グループにはプロパティ名の配列を指定します。`null` を指定したグループには、他のどのグループにも分配されなかったプロパティが入ります。

```ts
const { identity, rest } = distribute(user, {
  identity: ['id', 'name'],
  rest: null,
});
// identity: { id, name }
// rest: user のそれ以外のプロパティ
```

---

#### `cloneDeep(data)`

オブジェクトを深くクローンします。

---

#### `cloneShallow(data)`

オブジェクトを浅くクローンします。配列・`Map`・`Set`・`ArrayBuffer`・TypedArray・`DataView`・`Date`・正規表現に対応しています。

---

#### `createCaseInsensitiveObject(options?)`

キーの大文字・小文字を区別しないオブジェクト（Proxy）を作成します。

```ts
const obj = createCaseInsensitiveObject({ target: { Name: 'Alice' } });
obj['name']; // 'Alice'
obj['NAME']; // 'Alice'
'name' in obj; // true

// caseSensitive: true で大文字・小文字を区別する
const sensitive = createCaseInsensitiveObject({
  target: { Name: 'Alice' },
  caseSensitive: true,
});
sensitive['name']; // undefined
sensitive['Name']; // 'Alice'
```

| オプション         | 型                            | 説明                                                         |
| ------------------ | ----------------------------- | ------------------------------------------------------------ |
| `target`           | `object`                      | 初期値オブジェクト                                           |
| `caseSensitive`    | `boolean`                     | `true` のとき大文字・小文字を区別する（デフォルト: `false`） |
| `storedKeyType`    | `'transformed' \| 'original'` | キーの保存形式                                               |
| `isMutable`        | `boolean`                     | `true` のとき元のオブジェクトを直接変更する                  |
| `includeInherited` | `boolean`                     | `true` のとき継承プロパティも対象にする                      |

---

#### `createKeyTransformObject(transformKey, options?)`

キーを変換して管理するオブジェクト（Proxy）を作成します。`createCaseInsensitiveObject` の基盤です。

```ts
// 全キーを大文字で保存するオブジェクト
const obj = createKeyTransformObject((_, key) =>
  typeof key === 'string' ? key.toUpperCase() : key,
);
obj['name'] = 'Alice';
obj['NAME']; // 'Alice'
```

---

#### `countKeys(data)`

オブジェクトの自身のプロパティ数を返します。

---

#### `forEachValues(data, callback, options?)` [`*`](#-data-last-対応)

オブジェクトの各プロパティ値でコールバックを実行します。コールバックが `false` を返すと中断します。

```ts
forEachValues({ a: 1, b: 2 }, (value) => {
  if (value === 2) return false; // 中断
});
```

---

#### `getByNormalizedKey(data, key, options?)`

正規化されたキー（例: 大文字・小文字を無視）でオブジェクトの値を取得します。

---

#### `setByNormalizedKey(data, key, value, options?)`

正規化されたキーでオブジェクトに値をセットします。

---

#### `maybeAssign(target, source)` [`*`](#-data-last-対応)

`source` の各プロパティを `target` に設定した新しいオブジェクトを返します（イミュータブル）。

---

#### `maybeAssignMutable(target, source)`

`source` の各プロパティを `target` に破壊的に設定します。

---

#### `maybeDefault(target, defaults)` [`*`](#-data-last-対応)

`target` の `null`/`undefined` なプロパティにデフォルト値を設定した新しいオブジェクトを返します。

---

#### `maybeDefaultMutable(target, defaults, options?)`

`target` の `null`/`undefined` なプロパティにデフォルト値を破壊的に設定します。

| オプション      | 型        | 説明                                          |
| --------------- | --------- | --------------------------------------------- |
| `overwriteNull` | `boolean` | `true` のとき `null` のプロパティも上書きする |

---

#### `maybeHasOwn(data, key)`

オブジェクトが指定のプロパティを自身として持つかどうかを返します（`data` が `null` の場合は `false`）。

---

#### `stableStringify(data)`

オブジェクトのキーをアルファベット順に再帰的にソートした JSON 文字列を返します。

```ts
stableStringify({ b: 2, a: 1 }); // '{"a":1,"b":2}'
```

---

#### `needsDefineProperty(target, key, descriptor)`

プロパティ定義の適用が必要かどうかを判定します。

---

#### `setProperty(target, key, descriptor)`

プロパティを `Object.defineProperty` で定義します。

---

#### `overrideInstance(target, overrides)`

インスタンスのメソッドやプロパティをオーバーライドします。

---

### string — 文字列

#### `normalizeString(value, options?)` [`*`](#-data-last-対応)

文字列を統一的な表現に正規化します。検索・比較での揺れを吸収するのに使えます。

```ts
normalizeString('ＡＢＣ', { ignoreWidth: true }); // 'abc'
normalizeString('アイウ', { ignoreKana: true }); // 'あいう'
normalizeString('Café', { ignoreDakuon: true }); // 'Cafe'
normalizeString('Hello World', { ignoreCase: true }); // 'hello world'
```

| オプション            | 型        | 説明                                           |
| --------------------- | --------- | ---------------------------------------------- |
| `ignoreCase`          | `boolean` | 大文字・小文字を無視する（小文字に統一）       |
| `ignoreWidth`         | `boolean` | 全角・半角を無視する（半角に統一）             |
| `ignoreKana`          | `boolean` | カタカナ・ひらがなを無視する（ひらがなに統一） |
| `ignoreDakuon`        | `boolean` | 濁点・半濁点を無視する                         |
| `ignoreSokuon`        | `boolean` | 促音（っ・ッ）を無視する（つ・ツに統一）       |
| `ignoreYouon`         | `boolean` | 拗音（ゃゅょ等）を無視する                     |
| `ignoreChouon`        | `boolean` | 長音符（ー）を無視する                         |
| `ignoreLineFeed`      | `boolean` | 改行を無視する                                 |
| `ignoreSpace`         | `boolean` | スペースを無視する                             |
| `ignoreCompatibility` | `boolean` | Unicode 互換文字を正規化する                   |
| `ignoreComposition`   | `boolean` | Unicode 合成文字を正規化する                   |

---

#### `replacePlaceholders(template, values, options?)` [`*`](#-data-last-対応)

テンプレート文字列のプレースホルダーを値で置換します。

```ts
replacePlaceholders('{{name}}さん、{{greeting}}！', {
  name: 'Alice',
  greeting: 'こんにちは',
});
// 'Aliceさん、こんにちは！'

replacePlaceholders('{{0}}と{{1}}', ['Alice', 'Bob']);
// 'AliceとBob'
```

| オプション           | 型                 | 説明                                                          |
| -------------------- | ------------------ | ------------------------------------------------------------- |
| `bracket`            | `[string, string]` | プレースホルダーの括り文字（デフォルト: `['{{', '}}']`）      |
| `removePlaceholders` | `boolean`          | `true` のとき対応する値がない場合にプレースホルダーを削除する |
| `flatKeys`           | `boolean`          | `true` のときネストせずフラットなキーで取得する               |

---

#### `interpolateString(value, ratio, options?)`

文字列をアニメーション的に補間します（タイピングエフェクトなど）。

```ts
interpolateString('Hello', 0.6); // 'Hel'
interpolateString('World', 0.5, { initialValue: 'Hello' }); // 'HellWorld' のような中間値
```

---

#### `transformString(str, types, options?)` [`*`](#-data-last-対応)

文字列の変換を複数のタイプで順次適用します。ケース変換や文字種変換などを組み合わせられます。

---

#### `replaceByMap(str, map, options?)` [`*`](#-data-last-対応)

マップ（オブジェクト・配列）に従って文字列内の出現箇所を一括置換します。

```ts
replaceByMap('hello world', { hello: 'hi', world: 'earth' });
// 'hi earth'
```

---

#### `createExtractor(bracket)`

指定の括り文字で囲まれた部分を抽出する関数を生成します。

```ts
const extract = createExtractor(['{{', '}}']);
extract('{{name}}さん'); // ['name']
```

---

#### 文字種変換

| 関数                           | 説明                               | Data Last |
| ------------------------------ | ---------------------------------- | --------- |
| `retypeToFullWidth(str)`       | 半角→全角変換                      | ✓         |
| `retypeToHalfWidth(str)`       | 全角→半角変換                      |           |
| `retypeToHiragana(str)`        | カタカナ→ひらがな変換              | ✓         |
| `retypeToKatakana(str)`        | ひらがな→カタカナ変換              |           |
| `retypeToHiraganaSeion(str)`   | カタカナ→ひらがな（清音のみ）      |           |
| `retypeToKatakanaSeion(str)`   | ひらがな→カタカナ（清音のみ）      |           |
| `retypeToNoChouon(str)`        | 長音符除去                         |           |
| `retypeToNoLineFeed(str)`      | 改行除去                           |           |
| `retypeToNoSpace(str)`         | スペース除去                       |           |
| `retypeToNfc(str)`             | NFC正規化                          | ✓         |
| `retypeToNfd(str)`             | NFD正規化                          | ✓         |
| `retypeToNfkc(str)`            | NFKC正規化                         | ✓         |
| `retypeToNfkd(str)`            | NFKD正規化                         | ✓         |
| `retype(str, types, options?)` | 複数の文字種変換を組み合わせて適用 |           |

---

#### ケース変換

| 関数                        | 説明                   | 例            | Data Last |
| --------------------------- | ---------------------- | ------------- | --------- |
| `recaseCamel(str)`          | キャメルケース         | `helloWorld`  | ✓         |
| `recasePascal(str)`         | パスカルケース         | `HelloWorld`  | ✓         |
| `recaseSnake(str)`          | スネークケース         | `hello_world` | ✓         |
| `recaseScreamingSnake(str)` | スクリーミングスネーク | `HELLO_WORLD` | ✓         |
| `recaseKebab(str)`          | ケバブケース           | `hello-world` | ✓         |
| `recaseTitle(str)`          | タイトルケース         | `Hello World` | ✓         |
| `recaseLower(str)`          | 全小文字               | `hello world` | ✓         |
| `recaseUpper(str)`          | 全大文字               | `HELLO WORLD` | ✓         |
| `lowerFirst(str)`           | 先頭を小文字に         | `helloWorld`  | ✓         |
| `upperFirst(str)`           | 先頭を大文字に         | `HelloWorld`  | ✓         |

---

#### その他の文字列ユーティリティ

| 関数                                      | 説明                                  | Data Last |
| ----------------------------------------- | ------------------------------------- | --------- |
| `ensureString(value)`                     | 値を文字列に変換                      | ✓         |
| `escapeRegExp(str)`                       | 正規表現の特殊文字をエスケープ        |           |
| `isFullWidth(str)`                        | 全角文字のみかどうかを判定            |           |
| `isHalfWidth(str)`                        | 半角文字のみかどうかを判定            |           |
| `isLooseEqual(a, b, options?)`            | 文字列を正規化して等値判定            | ✓         |
| `isSurroundedBy(str, prefix, suffix)`     | 指定の前後文字で囲まれているか判定    | ✓         |
| `maybeReplace(str, pattern, replacement)` | パターンにマッチした場合のみ置換      | ✓         |
| `safeMatchAll(str, pattern)`              | `matchAll` を安全に実行して結果を返す |           |

---

### timer — タイマー

#### `debounce(fn, delay, options?)`

最後の呼び出しから指定時間後に1回だけ実行するデバウンス関数を返します。

```ts
const onInput = debounce((value) => search(value), 300);
// .cancel() で保留中の実行をキャンセル
// .flush()  で即座に実行
// .isIdle() で待機中かどうかを確認
```

---

#### `throttle(fn, delay, options?)`

指定時間に1回以上実行されないスロットル関数を返します。

```ts
const onScroll = throttle((e) => update(e), 100);
```

---

#### `sleep(duration)`

指定ミリ秒待機する Promise を返します。

```ts
await sleep(1000); // 1秒待機
```

---

### type — 型判定

| 関数                                | 説明                                                      | Data Last |
| ----------------------------------- | --------------------------------------------------------- | --------- |
| `isBlank(value)`                    | `null`/`undefined`/空文字/空白文字列かどうか              |           |
| `isNullish(value)`                  | `null` または `undefined` かどうか                        |           |
| `isPresent(value)`                  | `null`/`undefined` でないかどうか                         |           |
| `isUndefined(value)`                | `undefined` かどうか                                      |           |
| `isEmptyCollection(value)`          | 空の配列・`Map`・`Set` かどうか                           |           |
| `isEmptyValue(value)`               | `null`/`undefined`/空文字/空配列/空オブジェクト等かどうか |           |
| `isValidDate(value)`                | 有効な `Date` オブジェクトかどうか                        |           |
| `isInvalidDate(value)`              | 無効な `Date` オブジェクト（`Invalid Date`）かどうか      |           |
| `isValidNumber(value, options?)`    | 有効な数値かどうか（NaN・Infinity を除外）                |           |
| `isNumberLike(value)`               | 数値または数値文字列かどうか                              |           |
| `isNonNegativeInteger(value)`       | 非負整数かどうか                                          |           |
| `isPrimitive(value)`                | プリミティブ型かどうか                                    |           |
| `isRegExp(value)`                   | `RegExp` かどうか                                         |           |
| `isIterable(value)`                 | イテラブルかどうか                                        |           |
| `isAsyncIterable(value)`            | 非同期イテラブルかどうか                                  |           |
| `getRawType(value)`                 | `Object.prototype.toString` の内部型文字列を取得          |           |
| `kind(value)`                       | 値の種類を文字列で取得                                    | ✓         |
| `priority(value)`                   | 値の優先度を数値で取得                                    | ✓         |
| `ensureValidValue(value, options?)` | 有効な値でない場合に代替値を返す                          | ✓         |
| `unsafeCast(value)`                 | 型チェックを無視して型キャストする                        |           |

---

###### \* Data Last 対応

## ライセンス

MIT
