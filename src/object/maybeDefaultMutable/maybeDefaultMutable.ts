import type { LooseRecord } from '@fringeworks/types';
import forEachValues from '../forEachValues';
import type { MaybeDefaultMutableOptions } from './types';

/**
 * 対象のオブジェクトのプロパティ値がundefinedのとき、デフォルト値のプロパティ値がundefinedでなければ設定する。
 *
 * @param target 対象のオブジェクト
 * @param defaultValues デフォルト値
 * @param options オプション
 * @returns デフォルト値が設定されたオブジェクト
 */
export default function maybeDefaultMutable<
  T extends LooseRecord,
  V extends LooseRecord,
>(
  target: T,
  defaultValues: V,
  options: MaybeDefaultMutableOptions = {},
): T & V {
  if (target && defaultValues) {
    const { skipNull, overwriteNull, ...opts } = options;
    const isValidValue = skipNull
      ? (value: unknown) => value != null
      : (value: unknown) => value !== undefined;
    const isOverwritedValue = overwriteNull
      ? (value: unknown) => value == null
      : (value: unknown) => value === undefined;
    forEachValues(
      defaultValues,
      (value, key) => {
        if (isValidValue(value) && isOverwritedValue(target[key])) {
          (target[key] as LooseRecord) = value;
        }
      },
      opts,
    );
  }
  return target as T & V;
}
