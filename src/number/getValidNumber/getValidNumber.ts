import { isValidNumber } from '../../type/isValidNumber';
import type { GetValidNumberOptions } from './types';

/**
 * 対象の値が有効な数値でない場合はデフォルト値を返す
 * @param value 対象の値
 * @param options オプション
 * @returns 対象の値またはデフォルト値
 */
export default function getValidNumber(
  value: number | null | undefined,
  options: GetValidNumberOptions = {},
): number {
  const { invalidValue = 0, ...rest } = options;
  return (isValidNumber(value, rest) ? value : invalidValue) as number;
}
