import type { LooseRecord } from '@fringeworks/types';
import * as R from 'remeda';
import alwaysInput from '../../function/alwaysInput';
import normalizeString from '../../string/normalizeString';
import countKeys from '../countKeys';
import type { FilterByKeysOptions } from './types';

/**
 * 指定の文字列が含まれるキー以外をフィルタリングする
 * @param target
 * @param condition
 * @param options
 * @returns
 */
const filterByKeys = <T = unknown>(
  target: T,
  condition: PropertyKey,
  options: FilterByKeysOptions = {},
): T => _filterByKeys(target, condition, options);
filterByKeys.dataLast =
  (condition: PropertyKey, options: FilterByKeysOptions = {}) =>
  <T = unknown>(target: T): T =>
    _filterByKeys(target, condition, options);
export default filterByKeys;

function _filterByKeys<T = unknown>(
  target: T,
  condition: PropertyKey,
  options: FilterByKeysOptions = {},
): T {
  const { normalize } = options;

  let normalizeFn: (value: string) => string = alwaysInput;
  if (condition !== undefined) {
    if (normalize && R.isString(condition)) {
      normalizeFn = normalizeString;
      condition = normalizeFn(condition);
    }
  }

  return _filter(target, condition, normalizeFn) ?? null;
}

function _filter<T = unknown>(
  target: T,
  condition: PropertyKey,
  normalizeFn: (value: string) => string,
): T {
  if (Array.isArray(target)) {
    // array
    const array: unknown[] = [];
    for (let i = 0; i < target.length; i++) {
      const item = target[i];
      const result = _filter(item, condition, normalizeFn);
      if (result != null) {
        array[i] = result;
      }
    }
    if (array.length) {
      return array as T;
    }
  } else if (R.isPlainObject(target)) {
    // object
    const obj: LooseRecord = {};
    for (const key in target) {
      const value = target[key];
      if (R.isString(condition) && R.isString(key)) {
        // 文字列の場合
        const normalizedKey = normalizeFn(key);
        if (normalizedKey !== '' && normalizedKey.includes(condition)) {
          // conditionが含まれる
          obj[key] = value;
        }
      } else if (condition === key) {
        // 文字列以外の場合
        obj[key] = value;
      }

      if (key in obj === false) {
        // keyが不一致の場合は子要素を処理
        const result = _filter(value, condition, normalizeFn);
        if (result != null) {
          obj[key] = result;
        }
      }
    }
    if (countKeys(obj)) {
      return obj;
    }
  }
}
