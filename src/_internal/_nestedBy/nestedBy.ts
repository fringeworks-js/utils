import type { LooseRecord } from '@fringeworks/types';
import { ensureArray } from '../../array/ensureArray';
import type { NestedByOptions, NestedByResult } from './types';

export default function _nestedBy<I extends object, R = NestedByResult<I>>(
  data: I[],
  properties: keyof I | (keyof I)[],
  setByFlatKey: (data: LooseRecord, key: string, value: I) => void,
  setByNestedKey: (data: LooseRecord, path: string[], value: I) => void,
  options: NestedByOptions,
) {
  if (!data) {
    return {} as R;
  }
  const { flat = false, keySeparator = '.' } = options;
  const propNames = ensureArray(properties);
  const set: (result: R, keyArray: string[], item: I) => void = flat
    ? (result, keyArray, item) =>
        setByFlatKey(result, keyArray.join(keySeparator), item)
    : setByNestedKey;

  return data.reduce((result, item) => {
    // 指定のプロパティの値を配列に取得
    const keyArray = propNames.map((propName) => String(item[propName]));
    set(result, keyArray, item);
    return result;
  }, {} as R);
}
