import type { GetValidMinMaxOptions } from './types';

/**
 * 最小値と最大値の順序を正しく整えて返す
 * @param min 最小値候補
 * @param max 最大値候補
 * @param defaultMin minがnull/undefinedの場合の代替値
 * @param defaultMax maxがnull/undefinedの場合の代替値
 * @returns [最小値, 最大値]
 */
export default function getValidMinMax(
  min: number | null | undefined,
  max: number | null | undefined,
  options: GetValidMinMaxOptions = {},
): [number, number] {
  const { defaultMin = -Infinity, defaultMax = Infinity } = options;
  const minValue = min ?? defaultMin;
  const maxValue = max ?? defaultMax;
  return [Math.min(minValue, maxValue), Math.max(minValue, maxValue)];
}
