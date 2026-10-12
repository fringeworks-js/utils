import type { LooseRecord } from '@fringeworks/types';
import { hasOwn } from '../hasOwn';
import type { ForEachValueOptions } from './types';

/**
 * 配下の要素をcallbackで処理する
 * callbackがfalseを返した場合、処理を中断する
 * @param target
 * @param callback
 * @param options
 * @returns 処理が最後まで行われた場合にtrue、処理が中断された場合にfalse
 */
const forEachValue = <T extends LooseRecord>(
  target: T,
  callback: (value: unknown, key: PropertyKey, obj: T) => void | boolean,
  options: ForEachValueOptions = {},
): boolean => _forEachValue(target, callback, options);
forEachValue.dataLast =
  <T extends LooseRecord>(
    callback: (value: unknown, key: PropertyKey, obj: T) => void | boolean,
    options: ForEachValueOptions = {},
  ) =>
  (target: T): boolean =>
    _forEachValue(target, callback, options);
export default forEachValue;

function _forEachValue<T extends LooseRecord>(
  target: T,
  callback: (value: unknown, key: PropertyKey, obj: T) => void | boolean,
  options: ForEachValueOptions = {},
): boolean {
  const { includeInherited } = options;
  if (target) {
    const has = includeInherited
      ? (target: T, key: PropertyKey) => key in target
      : (target: T, key: PropertyKey) => hasOwn(target, key);
    for (const key in target) {
      if (has(target, key)) {
        const value = target[key];
        const result = callback(value, key, target);
        if (result === false) {
          return false;
        }
      }
    }
  }
  return true;
}
