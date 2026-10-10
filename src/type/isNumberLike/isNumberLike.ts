/**
 * 10進数の数値として扱える文字列のパターン
 * 符号、整数部、小数部（'1.'、'.5'も可）で構成される
 */
const DECIMAL_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)$/;

/**
 * 対象の値が数値、または10進数の数値の文字列の場合にtrueを返す
 * ユーザーの入力が10進数の数値かどうかの判定を想定しているため、
 * 前後の空白、16進数、指数表記、Infinityなどはfalseになる
 * @param value 対象の値
 * @returns
 */
export default function isNumberLike(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  } else if (typeof value === 'string') {
    return DECIMAL_PATTERN.test(value);
  } else {
    return false;
  }
}
