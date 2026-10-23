import _isEnumerable from '../../_internal/_isEnumerable';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import type { SplitKeyRecord, SplitRest } from './types';

/**
 * オブジェクトを、指定したキーのプロパティとそれ以外のプロパティに分ける関数を作る
 *
 * - キーは値が `true` のオブジェクトで受け取る。`T` のキーに過不足があると型エラーになる
 * - 作った関数は、値が `undefined` でもキーの種類で振り分ける
 * - 対象にするのは自身の列挙可能なプロパティ（symbol のキーを含む）で、`__proto__` は無視する
 * - 分けたプロパティが `T` の型を満たすかは検査しない
 * @template T 分けるプロパティの型
 * @param keys 分けるキーを持ち、値が `true` のオブジェクト
 * @returns オブジェクトを受け取り、`[picked, rest]` のタプルを返す関数
 * @example
 * type Options = { gap?: number; gapX?: number };
 *
 * const splitOptions = createSplitByKeys<Options>({ gap: true, gapX: true });
 * splitOptions({ gap: 8, id: 'a' }); // [{ gap: 8 }, { id: 'a' }]
 */
export default function createSplitByKeys<T extends object>(
  keys: SplitKeyRecord<T>,
) {
  const keySet = new Set<PropertyKey>(Reflect.ownKeys(keys));

  /**
   * オブジェクトを、指定したキーのプロパティとそれ以外のプロパティに分ける
   *
   * @param data 分けるオブジェクト
   * @returns `[picked, rest]` のタプル。`picked` は指定したキーのプロパティ、`rest` はそれ以外のプロパティ
   */
  return <D extends object>(data: D): [T, SplitRest<D, T>] => {
    const picked: Record<PropertyKey, unknown> = {};
    const rest: Record<PropertyKey, unknown> = {};
    const record = data as Record<PropertyKey, unknown>;
    // `Reflect.ownKeys`より速いため、文字列とsymbolのキーを分けて列挙する
    for (const key of Object.keys(record)) {
      if (!_isUnsafeKey(key)) {
        (keySet.has(key) ? picked : rest)[key] = record[key];
      }
    }
    for (const key of Object.getOwnPropertySymbols(record)) {
      if (_isEnumerable(record, key)) {
        (keySet.has(key) ? picked : rest)[key] = record[key];
      }
    }
    return [picked as T, rest as SplitRest<D, T>];
  };
}
