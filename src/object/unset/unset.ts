import type { StrictRecord } from '@fringeworks/types';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import _toArrayIndex from '../../_internal/_toArrayIndex';
import { hasOwn } from '../hasOwn';
import { parsePropertyPath, type PropertyPath } from '../parsePropertyPath';

/**
 * 指定のパスの値を削除した新しいオブジェクトを返す（非破壊的変更）
 * @param data 削除対象のオブジェクト
 * @param path 削除するプロパティのパス（例: 'a.b[0]' または ['a', 'b', 0]）
 * @returns 削除された新しいオブジェクト。削除するものが無い場合は data をそのまま返す
 */
export default function unset<T extends object>(
  data: T,
  path: PropertyPath,
): T {
  const segments = parsePropertyPath(path);
  if (segments.some(_isUnsafeKey)) {
    return data;
  }

  const unsetter = (current: unknown, index: number): unknown => {
    const key = segments[index];

    // 値が存在しない、またはプリミティブな値に到達した場合はそのまま返す
    if (
      key === undefined ||
      current == null ||
      typeof current !== 'object' ||
      !hasOwn(current, key)
    ) {
      return current;
    }

    // 削除対象のキーに達した場合
    if (index === segments.length - 1) {
      if (Array.isArray(current)) {
        const arrayIndex = _toArrayIndex(current, key);
        if (arrayIndex === undefined) {
          // インデックス以外のキー（length など）は削除しない
          return current;
        }
        // 配列の場合は要素を除去
        const next = [...current];
        next.splice(arrayIndex, 1);
        return next;
      } else {
        // オブジェクトの場合はプロパティを除外
        const { [key]: _, ...next } = current as StrictRecord;
        return next;
      }
    }

    // 直下の値を取得し再帰的に進む
    const oldValue = (current as StrictRecord)[key];
    const newValue = unsetter(oldValue, index + 1);

    if (oldValue === newValue) {
      // 直下に変更なし
      return current;
    } else if (Array.isArray(current)) {
      // 直下に変更あり(配列)
      const next = [...current];
      Reflect.set(next, key, newValue);
      return next;
    } else {
      // 直下に変更あり(オブジェクト)
      return { ...current, [key]: newValue };
    }
  };

  return unsetter(data, 0) as T;
}
