/**
 * 自身の列挙可能なプロパティかどうかを判定する\
 * `Object.create(null)` で作ったオブジェクトや、同名のプロパティを持つオブジェクトでも判定できるよう、
 * `Object.prototype` のメソッドを呼ぶ
 */
export default function _isEnumerable(data: object, key: PropertyKey): boolean {
  return Object.prototype.propertyIsEnumerable.call(data, key);
}
