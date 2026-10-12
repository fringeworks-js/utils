import { getKind } from '../getKind';
import type { GetPriorityOptions } from './types';

const DEFAULT_PRIORITY_MAP = {
  undefined: -2,
  null: -1,
};

/**
 * 値の型に応じた優先度を返す
 * デフォルトでは値の型がundefinedは-2、nullは-1、それ以外は0
 * @param data 値
 * @param options オプション
 * @returns 優先度
 */
const getPriority = (data: unknown, options?: GetPriorityOptions): number =>
  _getPriority(data, options);
getPriority.dataLast = (options?: GetPriorityOptions) => (data: unknown) =>
  getPriority(data, options);
export default getPriority;

function _getPriority(data: unknown, options: GetPriorityOptions = {}): number {
  const priorityMap: NonNullable<GetPriorityOptions['priorityMap']> =
    options.priorityMap ?? DEFAULT_PRIORITY_MAP;
  if (data === undefined) {
    return priorityMap['undefined'] ?? 0;
  } else if (data === null) {
    return priorityMap['null'] ?? 0;
  } else {
    let result: number | undefined;
    if (options.useKind) {
      result = priorityMap[getKind(data)];
    } else {
      result = priorityMap[typeof data];
    }
    if (result === undefined) {
      result = options.getFallbackPriority?.(data) ?? 0;
    }
    return result;
  }
}
