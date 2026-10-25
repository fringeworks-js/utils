/**
 * 値を指定された刻み幅で丸める\
 * ちょうど中間の値は正の方向へ丸める（Math.roundと同じ）。
 * 結果はstepの小数の桁数で丸め直し、0.30000000000000004のような誤差を除く。
 * 丸めはdoubleの値に対して行うため、1.15（実際は1.1499…）のように表記どおりにならない場合がある
 * @param value 元の値
 * @param step 刻み幅 (例: 0.5, 10, 0.01)。0や有限の数でない場合はvalueをそのまま返す
 * @returns 刻み幅に丸められた値
 */
export default function roundToStep(value: number, step: number): number {
  if (step === 0 || !Number.isFinite(step)) {
    return value;
  }
  const rounded = Math.round(value / step) * step;
  return Number(rounded.toFixed(countDecimals(step)));
}

/**
 * 小数の桁数を数える（1e-7のような指数表記にも対応）
 */
function countDecimals(value: number): number {
  const [mantissa = '', exponent = '0'] = String(value).split('e');
  const fraction = mantissa.split('.')[1] ?? '';
  // toFixedが受け付ける桁数は100まで
  return Math.min(100, Math.max(0, fraction.length - Number(exponent)));
}
