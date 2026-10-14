import type { StrictRecord } from '@fringeworks/types';
import _createContainer from '../../_internal/_createContainer';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { hasOwn } from '../hasOwn';
import { parsePropertyPath, type PropertyPath } from '../parsePropertyPath';

/**
 * オブジェクトを更新して同じオブジェクトを返す（破壊的変更）
 * @param data 更新対象のオブジェクト
 * @param path 更新するプロパティのパス（例: 'a.b[0]' または ['a', 'b', 0]）
 * @param value 設定する値
 * @returns 更新された同じオブジェクト
 */
export default function setMutable<T extends object>(
  data: T,
  path: PropertyPath,
  value: unknown,
): T {
  const segments = parsePropertyPath(path);
  if (segments.some(_isUnsafeKey)) {
    return data;
  }
  const length = segments.length;
  let current = data as StrictRecord;

  for (const [i, key] of segments.entries()) {
    if (i === length - 1) {
      current[key] = value;
    } else {
      // プロトタイプ上のオブジェクトを書き換えないよう、自身のプロパティだけを辿る
      let next = hasOwn(current, key) ? current[key] : undefined;
      if (next === null || typeof next !== 'object') {
        next = _createContainer(segments[i + 1]);
        current[key] = next;
      }
      current = next as StrictRecord;
    }
  }
  return data;
}
