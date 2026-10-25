/**
 * 配列の先頭から見て最初のnull,undefined以外の値を返す
 * @param data 配列。null・undefinedの場合はundefinedを返す
 */
export default function firstPresent<V>(
  data: readonly V[] | null | undefined,
): V | undefined {
  return data?.find(_isTarget);
}

function _isTarget<V>(value: V) {
  return value != null;
}
