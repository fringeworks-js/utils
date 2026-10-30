import type { CreateRangeOptions } from './types';

/**
 * 連続した数値の配列を作る\
 * 各要素は `start + index * step` で求める（足し合わせないので小数の誤差がたまらない）
 * @param length 配列の長さ。小数は切り捨て、負の数・NaN・Infinityは0として扱う
 * @param options オプション
 * @returns 連続した数値の新しい配列
 */
export default function createRange(
  length: number,
  options: CreateRangeOptions = {},
): number[] {
  const { start = 0, step = 1 } = options;
  const size = Number.isFinite(length) ? Math.max(0, Math.trunc(length)) : 0;
  return Array.from({ length: size }, (_, index) => start + index * step);
}
