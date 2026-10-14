/**
 * 0以上の整数（非負整数）であることを判定する。\
 * 負の数や小数の `number` も false になるため、型ガードにはしていない
 * （型ガードにすると、false の側で `number` が除外されてしまう）
 * @param value 判定する値
 * @returns 0、1、2... のいずれかであれば true
 */
export default function isNonNegativeInteger(value: unknown): boolean {
  return Number.isInteger(value) && (value as number) >= 0;
}
