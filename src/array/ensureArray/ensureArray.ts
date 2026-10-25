import type { EnsureArrayOptions } from './types';

/**
 * 配列であることを保証する\
 * 配列は複製して返す。`raw: true`の場合は複製せずにそのまま返すため、戻り値は`readonly`の配列になる
 * @param data 変換する値
 * @param options オプション
 * @returns 配列に変換された値
 */
function ensureArray<T>(
  data: T | readonly T[] | null | undefined,
  options: EnsureArrayOptions & { raw: true },
): readonly T[];
function ensureArray<T>(
  data: T | readonly T[] | null | undefined,
  options?: EnsureArrayOptions & { raw?: false },
): T[];
function ensureArray<T>(
  data: T | readonly T[] | null | undefined,
  options?: EnsureArrayOptions,
): readonly T[];
function ensureArray<T>(
  data: T | readonly T[] | null | undefined,
  options: EnsureArrayOptions = {},
): readonly T[] {
  if (data == null) {
    return [];
  }

  if (_isArray(data)) {
    return options.raw ? data : [...data];
  }

  return [data];
}

export default ensureArray;

/**
 * `Array.isArray`は`readonly`の配列を除いた型に絞り込めないため、型を明示して判定する
 */
function _isArray<T>(value: T | readonly T[]): value is readonly T[] {
  return Array.isArray(value);
}
