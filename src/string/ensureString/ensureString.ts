/**
 * 文字列であることを保証する\
 * null や undefined は空文字列に変換される。
 * `String()` で変換できない値（`Object.create(null)` など）は、
 * 普通のオブジェクトと同じく `Object.prototype.toString` の結果（`'[object Object]'`）にする
 *
 * @param data 任意の値
 * @returns 文字列
 */
export default function ensureString(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }
  if (data == null) {
    return '';
  }
  try {
    return String(data);
  } catch {
    return Object.prototype.toString.call(data);
  }
}
