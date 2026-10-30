import type { StrictRecord } from '@fringeworks/types';
import type { AssignDefinedMutableOptions } from '../object/assignDefinedMutable/types';
import { forEachValue } from '../object/forEachValue';
import _isUnsafeKey from './_isUnsafeKey';

/**
 * valuesの値のうち、shouldAssignが真を返すものだけをtargetへ代入する（破壊的変更）\
 * assignDefinedMutable・assignPresentMutable・assignOnlyMutableの共通の処理
 * @param target 代入先のオブジェクト
 * @param values 代入する値を持ったオブジェクト
 * @param shouldAssign 値を代入するかを判定する関数（値とキーを受け取る）
 * @param options オプション（moveToEnd が true なら、代入するキーを一度削除して末尾に移す）
 */
export default function _assignValues(
  target: object,
  values: object,
  shouldAssign: (value: unknown, key: string | symbol) => boolean,
  options: AssignDefinedMutableOptions,
): void {
  const { moveToEnd = false, ...forEachOptions } = options;
  const record = target as StrictRecord;
  forEachValue(
    values,
    (value, key) => {
      if (!_isUnsafeKey(key) && shouldAssign(value, key)) {
        if (moveToEnd) {
          delete record[key];
        }
        record[key] = value;
      }
    },
    forEachOptions,
  );
}
