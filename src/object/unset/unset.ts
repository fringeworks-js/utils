import type { LooseRecord } from '@fringeworks/types';
import _parsePath from '../../_internal/_parsePath';

/**
 * オブジェクトを更新して新しいオブジェクトを返す（非破壊的変更）
 * @param data 更新対象のオブジェクト
 * @param path 更新するプロパティのパス（例: 'a.b.0' または ['a', 'b', 0]）
 * @param value 設定する値
 * @returns 更新された新しいオブジェクト
 */
const unset = <T extends LooseRecord>(data: T, path: string | PropertyKey[]) =>
  _unset(data, path);
unset.dataLast =
  <T extends LooseRecord>(path: string | PropertyKey[]) =>
  (data: T) =>
    _unset(data, path);
export default unset;

function _unset<T extends LooseRecord>(
  data: T,
  path: string | PropertyKey[],
): T {
  const segments = _parsePath(path);

  const unsetter = (current: unknown, index: number): unknown => {
    const key = segments[index];

    // 値が存在しない、またはプリミティブな値に到達した場合はそのまま返す
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return current;
    }

    // 削除対象のキーに達した場合
    if (index === segments.length - 1) {
      if (Array.isArray(current)) {
        // 配列の場合は要素を除去
        const next = [...current];
        next.splice(key as number, 1);
        return next;
      } else {
        // オブジェクトの場合はプロパティを除外
        const { [key]: _, ...next } = current as LooseRecord;
        return next;
      }
    }

    // 直下の値を取得し再帰的に進む
    const oldValue = current[key];
    const newValue = unsetter(oldValue, index + 1);

    if (oldValue === newValue) {
      // 直下に変更なし
      return current;
    } else if (Array.isArray(current)) {
      // 直下に変更あり(配列)
      const next = [...current];
      next[key] = newValue;
      return next;
    } else {
      // 直下に変更あり(オブジェクト)
      return { ...current, [key]: newValue };
    }
  };

  return unsetter(data, 0) as T;
}
