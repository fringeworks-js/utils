/**
 * 型 `T` のキーを過不足なく重複なしで列挙した配列を、キーを持つオブジェクトから作る
 *
 * 引数の型が `T` だけで決まるため、`exactKeys` と異なり一度の呼び出しで済む。
 * 検査は TypeScript 標準の仕組みで行われる。
 * - 不足 — 必須プロパティの不足としてエラーになる
 * - 重複 — オブジェクトリテラルの同名プロパティとしてエラーになる
 * - 余分 — 過剰プロパティチェックでエラーになる
 *
 * 戻り値の順序はオブジェクトのキーの順序に従う。
 * そのため整数として扱われるキー（`'1'` など）は、記述順に関わらず先頭に昇順で並び、`string` として返される。
 * 戻り値をリテラルのタプル型で受け取りたい場合は `exactKeys` を使う。
 * @template T キーを列挙する対象の型
 * @param keys `T` のすべてのキーを持ち、値が `true` のオブジェクト
 * @returns キーの配列
 * @example
 * type User = { id: number; name: string; age: number };
 *
 * const userKeys = exactKeysFromRecord<User>({ id: true, name: true, age: true }); // OK: ('id' | 'name' | 'age')[]
 * exactKeysFromRecord<User>({ id: true, name: true }); // エラー: 'age' が不足
 * exactKeysFromRecord<User>({ id: true, name: true, age: true, id: true }); // エラー: 同名のプロパティ
 * exactKeysFromRecord<User>({ id: true, name: true, age: true, email: true }); // エラー: 余分なプロパティ
 */
export default function exactKeysFromRecord<T>(
  keys: Record<keyof T, true>,
): (keyof T)[] {
  return Reflect.ownKeys(keys) as (keyof T)[];
}
