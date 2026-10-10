import * as R from 'remeda';
import { isEqualWith } from '../isEqualWith';
import { CompareMode } from './constants';
import type { IsEqualOptions } from './types';

const EQUAL = {
  // 厳密な比較
  [CompareMode.strict]: (value1: unknown, value2: unknown) => {
    return value1 === value2;
  },
  // 緩い比較
  [CompareMode.loose]: (value1: unknown, value2: unknown) => {
    return value1 == value2;
  },
  // 構造の比較
  [CompareMode.deep]: (
    value1: unknown,
    value2: unknown,
    options: IsEqualOptions,
  ) => {
    if (options.customizer) {
      // customizerがある場合
      return isEqualWith(value1, value2, options.customizer);
    } else {
      return R.isDeepEqual(value1, value2);
    }
  },
};
const EQUAL_WITH_CUSTOMIZER = {
  // 厳密な比較
  [CompareMode.strict]: (
    value1: unknown,
    value2: unknown,
    options: IsEqualOptions,
  ) => {
    const customizer = options.customizer;
    const result = customizer(value1, value2);
    if (result == null) {
      return value1 === value2;
    } else {
      return result;
    }
  },
  // 緩い比較
  [CompareMode.loose]: (
    value1: unknown,
    value2: unknown,
    options: IsEqualOptions,
  ) => {
    const customizer = options.customizer;
    const result = customizer(value1, value2);
    if (result == null) {
      return value1 == value2;
    } else {
      return result;
    }
  },
  // 構造の比較
  [CompareMode.deep]: (
    value1: unknown,
    value2: unknown,
    options: IsEqualOptions,
  ) => {
    const customizer = options.customizer;
    return isEqualWith(value1, value2, customizer);
  },
};

/**
 * 2つの値が等しいことを判定する
 * @param value1 比較する値1
 * @param value2 比較する値2
 * @param options オプション
 * @returns 比較結果
 */
const isEqual = (
  value1: unknown,
  value2: unknown,
  options: IsEqualOptions = {},
): boolean => _isEqual(value1, value2, options);
isEqual.dataLast =
  (value2: unknown, options: IsEqualOptions = {}) =>
  (value1: unknown): boolean =>
    _isEqual(value1, value2, options);
export default isEqual;

function _isEqual(
  value1: unknown,
  value2: unknown,
  options: IsEqualOptions = {},
): boolean {
  const { mode = CompareMode.strict, customizer } = options;
  if (customizer) {
    // customizerありの比較
    return EQUAL_WITH_CUSTOMIZER[mode](value1, value2, options);
  } else {
    // 比較
    return EQUAL[mode](value1, value2, options);
  }
}
