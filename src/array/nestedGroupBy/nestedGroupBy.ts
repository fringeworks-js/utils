import _nestedBy from '../../_internal/_nestedBy';
import type { NestedGroupByOptions, NestedGroupByResult } from './types';

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
 *    '0101': [
 *      { prefecture: '01', city: '0101', name: 'foo' }
 *    ],
 *    '0102': [
 *      { prefecture: '01', city: '0102', name: 'bar1' },
 *      { prefecture: '01', city: '0102', name: 'bar2' },
 *    ],
 *  },
 *  '02': {
 *    '0201': [
 *      { prefecture: '02', city: '0201', name: 'baz' }
 *    ],
 *  }
 * }
 *
 *
 * @param data オブジェクト配列。null・undefinedは空配列として扱う
 * @param properties キーとする値を持ったプロパティ
 * @param options オプション
 * @returns
 */
export default function nestedGroupBy<I extends object>(
  data: readonly I[] | null | undefined,
  properties: keyof I | readonly (keyof I)[],
  options: NestedGroupByOptions = {},
): NestedGroupByResult<I> {
  return _nestedBy<I, I[]>(
    data,
    properties,
    (group = [], item) => {
      group.push(item);
      return group;
    },
    options,
  );
}
