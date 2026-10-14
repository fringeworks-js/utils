/**
 * isEqualWith の独自の比較関数\
 * boolean を返した場合はそれを比較結果とし、undefined を返した場合は既定の比較を行う
 * @param value1 比較する値1
 * @param value2 比較する値2
 * @param indexOrKey 親が配列の場合は添字、オブジェクトの場合はキー、Map の場合は Map のキー（最上位と Set の要素では undefined）
 * @param value1Parent value1 の親
 * @param value2Parent value2 の親
 */
export type IsEqualWithCustomizer = (
  value1: unknown,
  value2: unknown,
  indexOrKey: unknown,
  value1Parent: unknown,
  value2Parent: unknown,
) => boolean | undefined;
