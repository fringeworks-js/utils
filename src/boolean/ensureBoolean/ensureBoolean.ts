import type { EnsureBooleanOptions } from './types';

/**
 * 真偽値であることを保証する\
 * 文字列は前後の空白を除いて trueValues に含まれる場合だけ true、それ以外の値は `!!data` で変換する
 * @param data 変換する値
 * @param options オプション
 * @returns 真偽値に変換された値
 */
export default function ensureBoolean(
  data: unknown,
  options?: EnsureBooleanOptions,
): boolean {
  return _ensureBoolean(data, createTrueSet(options), options?.ignoreCase);
}

const DEFAULT_TRUE_VALUES: ReadonlySet<string> = new Set([
  'true',
  'True',
  'TRUE',
  '1',
]);

function createTrueSet(options?: EnsureBooleanOptions): ReadonlySet<string> {
  const { trueValues, ignoreCase } = options ?? {};
  if (!trueValues) {
    return DEFAULT_TRUE_VALUES;
  }
  return new Set(
    ignoreCase ? trueValues.map((value) => value.toLowerCase()) : trueValues,
  );
}

function _ensureBoolean(
  data: unknown,
  trueSet: ReadonlySet<string>,
  ignoreCase: boolean | undefined,
): boolean {
  if (typeof data === 'boolean') {
    return data;
  }

  if (typeof data === 'string') {
    const str = data.trim();
    return trueSet.has(ignoreCase ? str.toLowerCase() : str);
  }

  return !!data;
}
