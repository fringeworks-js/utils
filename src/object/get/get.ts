import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { hasOwn } from '../hasOwn';
import { parsePropertyPath, type PropertyPath } from '../parsePropertyPath';
import type { GetOptions } from './types';

/**
 * パスで指定したプロパティの値を返す\
 * 既定では自身のプロパティだけを辿り、プロトタイプ上のプロパティ（`toString` など）は無いものとして扱う
 *
 * 値の型はパスから決められないため unknown を返す。呼び出し側で型を確かめて使う
 * @param data 対象の値
 * @param path 取得するプロパティのパス（例: 'a.b[0]' または ['a', 'b', 0]）
 * @param options オプション
 * @returns パスの値。途中のプロパティが無い場合、パスが空の場合、dataがnull/undefinedの場合はundefined
 */
export default function get(
  data: unknown,
  path: PropertyPath,
  options: GetOptions = {},
): unknown {
  const { includeInherited = false } = options;
  const keys = parsePropertyPath(path);
  if (keys.length === 0) {
    return undefined;
  }

  let current = data;
  for (const key of keys) {
    if (
      current == null ||
      _isUnsafeKey(key) ||
      // hasOwnProperty はプリミティブな値もオブジェクトに変換して判定する
      (!includeInherited && !hasOwn(current as object, key))
    ) {
      return undefined;
    }
    current = (current as Record<PropertyKey, unknown>)[key];
  }
  return current;
}
