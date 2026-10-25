import type { StrictRecord } from '@fringeworks/types';
import type { ForEachValueOptions } from '../object/forEachValue';
import { forEachValue } from '../object/forEachValue';
import _isUnsafeKey from './_isUnsafeKey';

/**
 * valuesの値のうち、shouldAssignが真を返すものだけをtargetへ代入する（破壊的変更）\
 * assignDefinedMutable・assignPresentMutableの共通の処理
 * @param target 代入先のオブジェクト
 * @param values 代入する値を持ったオブジェクト
 * @param shouldAssign 値を代入するかを判定する関数
 * @param options オプション
 */
export default function _assignValues(
  target: object,
  values: object,
  shouldAssign: (value: unknown) => boolean,
  options: ForEachValueOptions,
): void {
  const record = target as StrictRecord;
  forEachValue(
    values,
    (value, key) => {
      if (!_isUnsafeKey(key) && shouldAssign(value)) {
        record[key] = value;
      }
    },
    options,
  );
}
