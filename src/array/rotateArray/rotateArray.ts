import { rotateArrayMutable } from '../rotateArrayMutable';
import type { RotateArrayOptions } from './types';

/**
 * 配列の前方の要素を末尾に移動した新しい配列を返す
 * @param data 対象の配列。null・undefinedは空配列として扱う
 * @param options オプション
 * @returns ローテーションした新しい配列
 */
export default function rotateArray<I>(
  data: readonly I[] | null | undefined,
  options?: RotateArrayOptions,
): I[] {
  return rotateArrayMutable(data ? [...data] : [], options);
}
