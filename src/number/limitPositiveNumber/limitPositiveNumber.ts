import type { LimitPositiveNumberOptions } from './types';

/**
 * 正の数に変換する。
 * デフォルトでは負の数だった場合にnullを返す。
 * @param value 値
 * @param options オプション
 * @returns
 */
export default function limitPositiveNumber(
  value: number | null | undefined,
  options: LimitPositiveNumberOptions = {},
): number | null | undefined {
  if (value == null) {
    // null,undefinedの場合はそのまま返す
    return value;
  } else if (Number.isNaN(value)) {
    // NaNの場合
    return options.nanValue ?? null;
  } else if (value > 0) {
    // 正の数はそのまま
    return value;
  } else if (value === 0) {
    // 0の場合
    return options.zeroValue ?? null;
  } else {
    // 負の数の場合
    if (options.negativeValue === 'abs') {
      return Math.abs(value);
    }
    return options.negativeValue ?? null;
  }
}
