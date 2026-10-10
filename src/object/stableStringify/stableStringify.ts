/**
 * オブジェクトのキーをアルファベット順にソートして JSON 文字列に変換する。
 * ネストされたオブジェクトや配列内のオブジェクトも再帰的にソートされる。
 * @param value 変換対象の値
 * @param space インデント
 * @returns キーがソートされた一意な JSON 文字列
 */
export default function stableStringify(
  value: unknown,
  space?: string | number,
): string {
  return JSON.stringify(_prepareSortedValue(value), null, space);
}

function _prepareSortedValue(value: unknown): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (typeof (value as { toJSON?: unknown }).toJSON === 'function') {
    // JSON.stringifyと同様にtoJSONの結果を変換対象とする（Dateなど）
    return _prepareSortedValue((value as { toJSON: () => unknown }).toJSON());
  }

  if (Array.isArray(value)) {
    return value.map(_prepareSortedValue);
  }

  const sortedObj: Record<string, unknown> = {};
  const keys = Object.keys(value as Record<string, unknown>).sort();

  for (const key of keys) {
    sortedObj[key] = _prepareSortedValue(
      (value as Record<string, unknown>)[key],
    );
  }

  return sortedObj;
}
