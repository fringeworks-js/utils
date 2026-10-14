import type { LooseRecord, StrictRecord } from '@fringeworks/types';
import * as R from 'remeda';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import type { FlattenObjectOptions } from './types';

/**
 * ネストされたオブジェクトを走査し、キーを連結して平坦化（フラット化）したオブジェクトを生成する
 * 階層構造を区切り文字（デフォルトは '.'）で繋いだパスを新しいキーとし、
 * プレーンなオブジェクトと配列（keepArrays の場合は除く）を再帰的に処理する
 * 配列の要素は、区切り文字に関わらず `a[0]` の形で連結する（leafKeysOnly の場合は `0`）
 * デフォルトの区切り文字で作ったキーは、そのまま parsePropertyPath や set などのパスとして使える
 * （ただし `.` や `[` を含むキーは引用符で囲まないため、元の構造には戻せない）
 * 中身の無いオブジェクト・配列は値としてそのまま残す
 * 連結したキーが重複した場合（`{ 'a.b': 1, a: { b: 2 } }` など）は、後に処理した値で上書きする
 *
 * @param data フラット化する対象のオブジェクト
 * @param options オプション
 * @returns キーが平坦化された新しいオブジェクト
 * @example
 * // デフォルトの挙動
 * flattenObject({ a: { b: 1 } }); // { "a.b": 1 }
 * @example
 * // 配列を含む場合
 * flattenObject({ a: [1, 2] }); // { "a[0]": 1, "a[1]": 2 }
 */
export default function flattenObject(
  data: object,
  options: FlattenObjectOptions = {},
): LooseRecord {
  const {
    leafKeysOnly = false,
    keySeparator = '.',
    keepArrays = false,
  } = options;
  const isBranch = (value: unknown): value is object =>
    R.isPlainObject(value) || (Array.isArray(value) && !keepArrays);
  if (!isBranch(data)) {
    // 対象外の値はそのまま返す
    return data as LooseRecord;
  }

  const result: StrictRecord = {};
  // 結果のオブジェクトに直接設定しながら、配下をたどる
  const visit = (node: object, parentPath: string | undefined) => {
    // 配列の要素は区切り文字に関わらず `[0]` の形で連結する
    const isArray = Array.isArray(node);
    for (const key of Object.keys(node)) {
      if (_isUnsafeKey(key)) {
        continue;
      }
      const value: unknown = (node as StrictRecord)[key];
      const path = leafKeysOnly
        ? key
        : isArray
          ? (parentPath ?? '') + `[${key}]`
          : parentPath === undefined
            ? key
            : parentPath + keySeparator + key;
      if (isBranch(value) && Object.keys(value).length > 0) {
        visit(value, path);
      } else if (!_isUnsafeKey(path)) {
        result[path] = value;
      }
    }
  };
  visit(data, undefined);
  return result;
}
