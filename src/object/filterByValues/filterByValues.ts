import type { LooseRecord } from '@fringeworks/types';
import * as R from 'remeda';
import alwaysInput from '../../function/alwaysInput';
import normalizeString from '../../string/normalizeString';
import countKeys from '../countKeys';
import type { FilterByValuesOptions } from './types';

/**
 * 指定の文字列が含まれる値を持つ項目以外をフィルタリングする
 * @param target
 * @param condition
 * @param options
 * @returns
 */
const filterByValues = <T = unknown>(
  target: T,
  condition: unknown,
  options: FilterByValuesOptions = {},
): T => _filterByValues(target, condition, options);
filterByValues.dataLast =
  (condition: unknown, options: FilterByValuesOptions = {}) =>
  <T = unknown>(target: T): T =>
    _filterByValues(target, condition, options);
export default filterByValues;

function _filterByValues<T = unknown>(
  target: T,
  condition: unknown,
  options: FilterByValuesOptions = {},
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
  condition: unknown,
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
      // 子要素を処理
      const result = _filter(target[key], condition, normalizeFn);
      if (result != null) {
        obj[key] = result;
      }
    }
    if (countKeys(obj)) {
      return obj;
    }
  } else {
    // valueで比較
    if (R.isString(condition) && R.isString(target)) {
      // 文字列の場合
      const normalizedValue = normalizeFn(target);
      if (normalizedValue !== '' && normalizedValue.includes(condition)) {
        // conditionが含まれる
        return target;
      }
    } else if (condition === target) {
      // 文字列以外の場合
      // valueが一致
      return target;
    }
  }
}
