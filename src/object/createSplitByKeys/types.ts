/**
 * ユニオン型を分配して全てのキーを取り出す
 *
 * `keyof`をユニオン型へそのまま適用すると共通のキーしか得られないため、
 * 分配してから取り出す
 */
type KeysOfUnion<T> = T extends unknown ? keyof T : never;

/**
 * `createSplitByKeys` に渡す、分離するキーのオブジェクト
 *
 * - `T` がユニオン型の場合は、全てのメンバーのキーを持つ
 * - オブジェクトリテラルで渡すと、キーの不足も余分なキーも型エラーになる
 */
export type SplitKeyRecord<T> = { [K in KeysOfUnion<T>]-?: true };

/**
 * `D` から `T` のキーを除いた残りのプロパティ
 *
 * - `T` がユニオン型の場合は、全てのメンバーのキーを除く
 */
export type SplitRest<D, T> = Omit<D, KeysOfUnion<T>>;
