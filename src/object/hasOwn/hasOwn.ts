/**
 * オブジェクトが指定のプロパティを自身で持つか判定する（`Object.hasOwn` 相当）
 *
 * `Object.hasOwn` は Safari 15.4 以降のため、`hasOwnProperty` で代用する。
 * 対応ブラウザーが揃った時点で `Object.hasOwn` に置き換えられるようにしている
 * @param data 対象のオブジェクト
 * @param key プロパティのキー
 * @returns 自身で持つ場合は true
 */
export default function hasOwn(data: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(data, key);
}
