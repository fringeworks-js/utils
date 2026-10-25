import type { LooseRecord } from '@fringeworks/types';
import { ensureArray } from '../../array/ensureArray';
import { hasOwn } from '../../object/hasOwn';
import setProperty from '../_setProperty';
import type { NestedByOptions, NestedByResult } from './types';

/**
 * 配列の要素を指定のプロパティの値をキーとしたオブジェクトに格納する
 *
 * キーが `constructor` や `__proto__` など `Object.prototype` のプロパティ名でも
 * 自身のプロパティとして扱う
 * @param data オブジェクト配列。null・undefinedは空配列として扱う
 * @param properties キーとする値を持ったプロパティ
 * @param merge キーに格納済みの値（未格納の場合は undefined）と要素から、格納する値を返す
 * @param options オプション
 */
export default function _nestedBy<I extends object, V>(
  data: readonly I[] | null | undefined,
  properties: keyof I | readonly (keyof I)[],
  merge: (current: V | undefined, item: I) => V,
  options: NestedByOptions,
): NestedByResult<V> {
  const result: LooseRecord = {};
  if (!data) {
    return result as NestedByResult<V>;
  }
  const { flat = false, keySeparator = '.' } = options;
  const propNames = ensureArray(properties);

  for (const item of data) {
    // 指定のプロパティの値を配列に取得
    const keyArray = propNames.map((propName) => String(item[propName]));
    const path = flat ? [keyArray.join(keySeparator)] : keyArray;
    const lastIndex = path.length - 1;
    let container = result;
    for (let i = 0; i < lastIndex; i++) {
      container = getOrCreateContainer(container, path[i]!);
    }
    const key = path[lastIndex]!;
    const current = hasOwn(container, key) ? (container[key] as V) : undefined;
    setOwnProperty(container, key, merge(current, item));
  }
  return result as NestedByResult<V>;
}

function getOrCreateContainer(container: LooseRecord, key: string) {
  if (hasOwn(container, key)) {
    return container[key] as LooseRecord;
  }
  const child: LooseRecord = {};
  setOwnProperty(container, key, child);
  return child;
}

function setOwnProperty(container: LooseRecord, key: string, value: unknown) {
  setProperty(container, key, {
    value,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}
