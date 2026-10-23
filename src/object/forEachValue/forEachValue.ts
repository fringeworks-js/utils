import type { StrictRecord } from '@fringeworks/types';
import _isEnumerable from '../../_internal/_isEnumerable';
import type { ForEachValueOptions } from './types';

/**
 * 自身の列挙可能なプロパティをcallbackで処理する
 * スプレッド構文やObject.assignと同じく、symbolのキーも対象にする
 * callbackがfalseを返した場合、処理を中断する
 * @param target 対象のオブジェクト
 * @param callback 各プロパティで呼ぶ関数
 * @param options オプション
 * @returns 処理が最後まで行われた場合にtrue、処理が中断された場合にfalse
 */
export default function forEachValue<T extends object>(
  target: T,
  callback: (value: T[keyof T], key: string | symbol, obj: T) => void | boolean,
  options: ForEachValueOptions = {},
): boolean {
  const record = target as StrictRecord;
  const visit = (key: string | symbol) =>
    callback(record[key] as T[keyof T], key, target) !== false;

  if (options.includeInherited) {
    // for...inは継承した列挙可能なプロパティも列挙する
    for (const key in target) {
      if (!visit(key)) {
        return false;
      }
    }
  } else {
    for (const key of Object.keys(target)) {
      if (!visit(key)) {
        return false;
      }
    }
  }
  // symbolのキーはfor...inやObject.keysで列挙されないため、自身のものを別に処理する
  for (const symbol of Object.getOwnPropertySymbols(target)) {
    if (_isEnumerable(target, symbol)) {
      if (!visit(symbol)) {
        return false;
      }
    }
  }
  return true;
}
