import type { EnsureArrayOptions } from './types';

/**
 * 配列であることを保証する\
 * @param data 変換する値
 * @param options オプション
 * @returns 配列に変換された値
 */
export default function ensureArray<T>(
  data: T | T[] | null | undefined,
  options: EnsureArrayOptions = {},
): T[] {
  if (data == null) {
    return [];
  }

  if (Array.isArray(data)) {
    return options.raw ? data : [...data];
  }

  return [data];
}
