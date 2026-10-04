import type { LooseRecord } from '@fringeworks/types';
import _parsePath from '../../_internal/_parsePath';

/**
 * オブジェクトから指定のパスの値を削除する（破壊的変更）
 * @param data 削除対象のオブジェクト
 * @param path 削除するプロパティのパス（例: 'a.b.0' または ['a', 'b', 0]）
 * @returns 削除された同じオブジェクト
 */
const unsetMutable = <T extends LooseRecord>(
  data: T,
  path: string | PropertyKey[],
) => _unsetMutable(data, path);
unsetMutable.dataLast =
  <T extends LooseRecord>(path: string | PropertyKey[]) =>
  (data: T) =>
    _unsetMutable(data, path);
export default unsetMutable;

function _unsetMutable<T extends LooseRecord>(
  data: T,
  path: string | PropertyKey[],
): T {
  const segments = _parsePath(path);
  const length = segments.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = data;

  for (let i = 0; i < length; i++) {
    const key = segments[i];

    // 値が存在しない、またはプリミティブな値に到達した場合は終わり
    if (current == null || typeof current !== 'object' || !(key in current)) {
      break;
    }

    if (i === length - 1) {
      // 最終要素の削除
      if (Array.isArray(current)) {
        const index = typeof key === 'number' ? key : Number(key);
        // 有効なインデックスの場合のみ詰め、それ以外はdelete
        if (Number.isInteger(index) && index >= 0 && index < current.length) {
          current.splice(index, 1);
        } else {
          delete current[key];
        }
      } else {
        delete current[key];
      }
    } else {
      // 次の階層へ
      current = current[key];
    }
  }

  return data;
}
