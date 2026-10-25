import type { Kind } from '../getKind';
import { getKind } from '../getKind';
import type { GetPriorityOptions } from './types';

const DEFAULT_PRIORITY_MAP: Partial<Record<Kind, number>> = {
  undefined: -2,
  null: -1,
};

/**
 * 値の型種別（`getKind` の結果）に応じた優先度を返す。\
 * デフォルトでは undefined は-2、null は-1、それ以外は0
 * @param value 値
 * @param options オプション
 * @returns 優先度
 */
export default function getPriority(
  value: unknown,
  options: GetPriorityOptions = {},
): number {
  const { priorityMap, getFallbackPriority } = options;
  const kind = getKind(value);
  return (
    priorityMap?.[kind] ??
    DEFAULT_PRIORITY_MAP[kind] ??
    getFallbackPriority?.(value) ??
    0
  );
}
