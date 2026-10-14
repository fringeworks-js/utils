/**
 * 次のキーが数値（インデックス）なら配列、そうでなければ（次のキーが無い場合も）オブジェクトを返す
 */
export default function _createContainer(nextKey: PropertyKey | undefined) {
  return typeof nextKey === 'number' ? [] : {};
}
