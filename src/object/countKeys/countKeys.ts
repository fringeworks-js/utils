/**
 * オブジェクトの列挙可能なプロパティ（キー）の数を返す
 * @param data 対象のオブジェクト
 * @returns キーの数。オブジェクトでない場合は 0 を返す
 */
export default function countKeys(data: unknown): number {
  if (data === null || typeof data !== 'object') {
    return 0;
  }
  return Object.keys(data).length;
}
