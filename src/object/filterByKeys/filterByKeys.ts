import type { StrictRecord } from '@fringeworks/types';
import * as R from 'remeda';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { alwaysInput } from '../../function/alwaysInput';
import { countKeys } from '../countKeys';
import type { FilterByKeysOptions } from './types';

/**
 * 条件に合うキーのプロパティだけを残す
 * 文字列の条件はキーに含まれるか（部分一致）、数値の条件はキーと等しいかで判定する
 * 残る構造は実行時に決まるため、戻り値は unknown とする
 * @param target 対象の値
 * @param condition 条件
 * @param options オプション
 * @returns 条件に合うものだけを残した新しい値。1つも無い場合は null
 */
export default function filterByKeys(
  target: unknown,
  condition: string | number,
  options: FilterByKeysOptions = {},
): unknown {
  let isMatch: (key: string) => boolean;
  if (typeof condition === 'string') {
    const normalize: (value: string) => string =
      options.normalize ?? alwaysInput;
    const normalizedCondition = normalize(condition);
    isMatch = (key) => {
      const normalizedKey = normalize(key);
      return (
        normalizedKey !== '' && normalizedKey.includes(normalizedCondition)
      );
    };
  } else {
    // オブジェクトのキーは文字列なので、数値は文字列にして完全一致で比較する
    const conditionKey = String(condition);
    isMatch = (key) => key === conditionKey;
  }

  return _filter(target, isMatch) ?? null;
}

function _filter(target: unknown, isMatch: (key: string) => boolean): unknown {
  if (Array.isArray(target)) {
    // array
    const array: unknown[] = [];
    for (let i = 0; i < target.length; i++) {
      const item = target[i];
      const result = _filter(item, isMatch);
      if (result != null) {
        array[i] = result;
      }
    }
    if (array.length) {
      return array;
    }
  } else if (R.isPlainObject(target)) {
    // object
    const obj: StrictRecord = {};
    for (const key in target) {
      if (_isUnsafeKey(key)) {
        continue;
      }
      const value = target[key];
      if (isMatch(key)) {
        // 条件に合うキーは値ごと残す
        obj[key] = value;
      } else {
        // 条件に合わないキーは子要素を処理
        const result = _filter(value, isMatch);
        if (result != null) {
          obj[key] = result;
        }
      }
    }
    if (countKeys(obj)) {
      return obj;
    }
  }
  return undefined;
}
