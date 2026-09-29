/**
 * タプル `T` の中で重複している要素の型をユニオンで返す
 *
 * 先頭から順に要素を取り出し、それまでに出現した要素（`Seen`）に含まれていれば重複として収集する。
 * 重複がなければ `never` になる。
 * @template T 検査対象のタプル
 * @template Seen これまでに出現した要素のユニオン（再帰用の内部パラメータ）
 */
type Duplicates<
  T extends readonly unknown[],
  Seen = never,
> = T extends readonly [infer H, ...infer R]
  ? // `[]` で囲んでユニオン型の分配を防ぎ、H が Seen に含まれるかを判定する
    [H] extends [Seen]
    ? H | Duplicates<R, Seen>
    : Duplicates<R, Seen | H>
  : never;

/**
 * キーのタプル `K` が `T` のキーを過不足なく重複なしで列挙しているかを検査する
 *
 * 問題がなければ `unknown`（交差しても型に影響しない）を返す。
 * 問題があれば、エラーメッセージに原因が表示されるよう次のプロパティを持つ型を返す。
 * - `__missingKeys` — `K` に含まれていない `T` のキー
 * - `__duplicateKeys` — `K` 内で重複しているキー
 *
 * `T` に存在しないキーは `K` の制約（`keyof T`）の時点で弾かれるため、ここでは検査しない。
 * @template T キーを列挙する対象の型
 * @template K 列挙されたキーのタプル
 */
type CheckKeys<T, K extends readonly (keyof T)[]> = [
  Exclude<keyof T, K[number]>,
] extends [never]
  ? [Duplicates<K>] extends [never]
    ? unknown
    : { __duplicateKeys: Duplicates<K> }
  : { __missingKeys: Exclude<keyof T, K[number]> };

/**
 * 型 `T` のキーを過不足なく重複なしで列挙した配列であることを、コンパイル時に保証する
 *
 * `T` は明示し、キーの配列は推論させたいため、カリー化した関数として提供する。
 * 実行時は受け取った配列をそのまま返すだけで、検査はすべて型レベルで行われる。
 * @template T キーを列挙する対象の型
 * @returns キーの配列を受け取り、そのまま（リテラルのタプル型として）返す関数
 * @example
 * type User = { id: number; name: string; age: number };
 *
 * const userKeys = exactKeys<User>()(['id', 'name', 'age']); // OK: readonly ['id', 'name', 'age']
 * exactKeys<User>()(['id', 'name']); // エラー: __missingKeys: 'age'
 * exactKeys<User>()(['id', 'name', 'age', 'id']); // エラー: __duplicateKeys: 'id'
 * exactKeys<User>()(['id', 'name', 'age', 'email']); // エラー: 'email' は keyof User ではない
 */
export default function exactKeys<T>() {
  return <const K extends readonly (keyof T)[]>(keys: K & CheckKeys<T, K>): K =>
    keys;
}
