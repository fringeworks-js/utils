import type { StrictRecord } from '@fringeworks/types';
import * as R from 'remeda';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { alwaysInput } from '../../function/alwaysInput';
import { countKeys } from '../countKeys';
import type { FilterByValuesOptions } from './types';

/**
 * 指定の文字列が含まれる値を持つ項目以外をフィルタリングする
 * 残る構造は実行時に決まるため、戻り値は unknown とする
 * @param data 対象の値
 * @param condition 条件
 * @param options オプション
 * @returns 条件に合うものだけを残した新しい値。1つも無い場合は null
 */
export default function filterByValues(
  data: unknown,
  condition: unknown,
  options: FilterByValuesOptions = {},
): unknown {
  const { normalize } = options;

  let normalizeFn: (value: string) => string = alwaysInput;
  if (condition !== undefined) {
    if (normalize && R.isString(condition)) {
      normalizeFn = normalize;
      condition = normalizeFn(condition);
    }
  }

  return _filter(data, condition, normalizeFn) ?? null;
}

function _filter(
  data: unknown,
  condition: unknown,
  normalizeFn: (value: string) => string,
): unknown {
  if (Array.isArray(data)) {
    // array
    const array: unknown[] = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const result = _filter(item, condition, normalizeFn);
      if (result != null) {
        array[i] = result;
      }
    }
    if (array.length) {
      return array;
    }
  } else if (R.isPlainObject(data)) {
    // object
    const obj: StrictRecord = {};
    for (const key in data) {
      if (_isUnsafeKey(key)) {
        continue;
      }
      // 子要素を処理
      const result = _filter(data[key], condition, normalizeFn);
      if (result != null) {
        obj[key] = result;
      }
    }
    if (countKeys(obj)) {
      return obj;
    }
  } else {
    // valueで比較
    if (R.isString(condition) && R.isString(data)) {
      // 文字列の場合
      const normalizedValue = normalizeFn(data);
      if (normalizedValue !== '' && normalizedValue.includes(condition)) {
        // conditionが含まれる
        return data;
      }
    } else if (condition === data) {
      // 文字列以外の場合
      // valueが一致
      return data;
    }
  }
  return undefined;
}
