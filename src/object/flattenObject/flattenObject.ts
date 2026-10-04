import type { LooseRecord } from '@fringeworks/types';
import * as R from 'remeda';
import type { FlattenObjectOptions } from './types';

/**
 * ネストされたオブジェクトを走査し、キーを連結して平坦化（フラット化）したオブジェクトを生成する
 * 階層構造を区切り文字（デフォルトは '.'）で繋いだパスを新しいキーとし、
 * 値がプリミティブ、または特定の条件を満たさない限り再帰的に処理する
 *
 * @param data フラット化する対象のオブジェクト
 * @param options オプション
 * @returns キーが平坦化された新しいオブジェクト
 * * @example
 * // デフォルトの挙動
 * flattenObject({ a: { b: 1 } }); // { "a.b": 1 }
 * * @example
 * // 配列を含む場合
 * flattenObject({ a: [1, 2] }); // { "a.0": 1, "a.1": 2 }
 */
const flattenObject = (
  data: LooseRecord,
  options: FlattenObjectOptions = {},
): LooseRecord => _flattenObject(data, options);
flattenObject.dataLast =
  (options: FlattenObjectOptions = {}) =>
  (data: LooseRecord): LooseRecord =>
    _flattenObject(data, options);
export default flattenObject;

function _flattenObject(
  data: LooseRecord,
  options: FlattenObjectOptions,
  parentPath?: string,
): LooseRecord {
  if (R.isPlainObject(data) || (Array.isArray(data) && !options.ignoreArray)) {
    // オブジェクトの場合は配下要素をフラットな状態に変換
    let flatObj: { [key: string]: unknown } = {};
    let currentPath: string;
    const { noPathKeys = false, keySeparator = '.' } = options;
    const keys = Object.keys(data);

    for (const key of keys) {
      const value: unknown = data[key];
      // キー名
      if (parentPath && !noPathKeys) {
        // ネストしたキー名
        currentPath = parentPath + keySeparator + key;
      } else {
        currentPath = key;
      }
      const flatItems: unknown = _flattenObject(value, options, currentPath);
      if (R.isPlainObject(flatItems)) {
        // flattenedがobjectectの場合はflatにする為にマージする
        flatObj = Object.assign(flatObj, flatItems);
      } else {
        // objectect以外はそのまま設定
        flatObj[currentPath] = flatItems;
      }
    }
    return flatObj;
  } else {
    // 上記以外はそのまま
    return data;
  }
}
