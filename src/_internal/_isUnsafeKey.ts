/**
 * プロトタイプ汚染を防ぐために読み書きの対象にしないキーかどうかを判定する\
 * `__proto__` への代入はプロパティではなくプロトタイプを書き換えるため、対象にしない
 */
export default function _isUnsafeKey(key: PropertyKey): boolean {
  return key === '__proto__';
}
