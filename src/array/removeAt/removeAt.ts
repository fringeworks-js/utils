import { removeAtMutable } from '../removeAtMutable';
import type { RemoveAtOptions } from './types';

/**
 * 配列の指定の位置から要素を削除した新しい配列を返す\
 * インデックスが範囲外（負の数・配列の長さ以上・NaN）の場合は何も削除しない
 * @param data 配列。null・undefinedは空配列として扱う
 * @param index 削除を始めるインデックス。小数は切り捨てる
 * @param options オプション
 * @returns 要素を削除した新しい配列
 */
export default function removeAt<T>(
  data: readonly T[] | null | undefined,
  index: number,
  options?: RemoveAtOptions,
): T[] {
  return removeAtMutable(data ? [...data] : [], index, options);
}
