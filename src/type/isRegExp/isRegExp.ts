/**
 * 値が正規表現か判定する。\
 * `instanceof` で判定するため、iframe など別の realm の値は false になる
 * @param value 判定する値
 * @returns `RegExp` のインスタンスであれば true
 */
export default function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}
