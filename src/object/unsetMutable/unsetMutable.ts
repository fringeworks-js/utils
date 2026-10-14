import type { StrictRecord } from '@fringeworks/types';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import _toArrayIndex from '../../_internal/_toArrayIndex';
import { hasOwn } from '../hasOwn';
import { parsePropertyPath, type PropertyPath } from '../parsePropertyPath';

/**
 * オブジェクトから指定のパスの値を削除する（破壊的変更）
 * @param data 削除対象のオブジェクト
 * @param path 削除するプロパティのパス（例: 'a.b[0]' または ['a', 'b', 0]）
 * @returns 削除された同じオブジェクト
 */
export default function unsetMutable<T extends object>(
  data: T,
  path: PropertyPath,
): T {
  const segments = parsePropertyPath(path);
  if (segments.some(_isUnsafeKey)) {
    return data;
  }
  const length = segments.length;
  let current: unknown = data;

  for (const [i, key] of segments.entries()) {
    // 値が存在しない、またはプリミティブな値に到達した場合は終わり
    if (
      current == null ||
      typeof current !== 'object' ||
      !hasOwn(current, key)
    ) {
      break;
    }

    if (i === length - 1) {
      // 最終要素の削除
      if (Array.isArray(current)) {
        const index = _toArrayIndex(current, key);
        // 有効なインデックスの場合のみ詰め、それ以外はdelete
        if (index !== undefined) {
          current.splice(index, 1);
        } else {
          Reflect.deleteProperty(current, key);
        }
      } else {
        delete (current as StrictRecord)[key];
      }
    } else {
      // 次の階層へ
      current = (current as StrictRecord)[key];
    }
  }

  return data;
}
