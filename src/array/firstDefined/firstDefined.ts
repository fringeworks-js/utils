/**
 * 配列の先頭から見て最初のundefined以外の値を返す
 * @param data 配列。null・undefinedの場合はundefinedを返す
 */
export default function firstDefined<V>(
  data: readonly V[] | null | undefined,
): V | undefined {
  return data?.find(_isTarget);
}

function _isTarget<V>(value: V) {
  return value !== undefined;
}
