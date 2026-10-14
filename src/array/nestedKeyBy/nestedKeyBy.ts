import _nestedBy from '../../_internal/_nestedBy';
import type { NestedKeyByOptions, NestedKeyByResult } from './types';

/**
 * 配列から指定のプロパティの値をキーとしたオブジェクトを作成する。
 *
 * @example
 * array: [
 *   { prefecture: '01', city: '0101', name: 'foo' },
 *   { prefecture: '01', city: '0102', name: 'bar1' },
 *   { prefecture: '01', city: '0102', name: 'bar2' },
 *   { prefecture: '02', city: '0201', name: 'baz' },
 * ]
 * properties: ['prefecture', 'city']
 *
 * // ↓
 *
 * result: {
 *  '01': {
 *    '0101': { prefecture: '01', city: '0101', name: 'foo' },
 *    '0102': { prefecture: '01', city: '0102', name: 'bar1' },
 *  },
 *  '02': {
 *    '0201': { prefecture: '02', city: '0201', name: 'baz' },
 *  }
 * }
 *
 *
 * @param data オブジェクト配列。null・undefinedは空配列として扱う
 * @param properties キーとする値を持ったプロパティ
 * @param options オプション
 * @returns
 */
export default function nestedKeyBy<I extends object>(
  data: I[] | null | undefined,
  properties: keyof I | (keyof I)[],
  options: NestedKeyByOptions = {},
): NestedKeyByResult<I> {
  const { overwrite, ...rest } = options;
  const merge: (current: I | undefined, item: I) => I = overwrite
    ? // 後勝ち
      (_current, item) => item
    : // 先勝ち
      (current, item) => current ?? item;

  return _nestedBy(data, properties, merge, rest);
}
