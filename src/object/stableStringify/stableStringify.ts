import _isUnsafeKey from '../../_internal/_isUnsafeKey';

/**
 * オブジェクトのキーをアルファベット順にソートして JSON 文字列に変換する。
 * ネストされたオブジェクトや配列内のオブジェクトも再帰的にソートされる。
 * キーの順序以外は JSON.stringify と同じように変換する（toJSON・ボックス化したプリミティブ・循環参照の扱い）
 * @param value 変換対象の値
 * @param space インデント
 * @returns キーの順序に関わらず、同じ内容なら同じになる JSON 文字列
 */
export default function stableStringify(
  value: unknown,
  space?: string | number,
): string {
  return JSON.stringify(_prepareSortedValue(value, '', []), null, space);
}

/**
 * @param value 変換対象の値
 * @param key value を持つプロパティのキー（toJSON に渡す）
 * @param ancestors 処理中の祖先のオブジェクト（循環参照の検出用）
 */
function _prepareSortedValue(
  value: unknown,
  key: string,
  ancestors: object[],
): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (typeof (value as { toJSON?: unknown }).toJSON === 'function') {
    // JSON.stringifyと同様に、キーを渡したtoJSONの結果を変換対象とする（Dateなど）
    return _prepareSortedValue(
      (value as { toJSON: (key: string) => unknown }).toJSON(key),
      key,
      ancestors,
    );
  }
  if (
    value instanceof Number ||
    value instanceof String ||
    value instanceof Boolean ||
    value instanceof BigInt
  ) {
    // JSON.stringifyと同様に、ボックス化したプリミティブは中の値にする
    return value.valueOf();
  }
  if (ancestors.includes(value)) {
    // そのまま再帰すると終わらないため、JSON.stringifyと同じ例外にする
    throw new TypeError('Converting circular structure to JSON');
  }

  ancestors.push(value);
  let result: unknown;
  if (Array.isArray(value)) {
    result = value.map((item: unknown, index) =>
      _prepareSortedValue(item, String(index), ancestors),
    );
  } else {
    const sortedObj: Record<string, unknown> = {};
    for (const childKey of Object.keys(value).sort()) {
      if (_isUnsafeKey(childKey)) {
        continue;
      }
      sortedObj[childKey] = _prepareSortedValue(
        (value as Record<string, unknown>)[childKey],
        childKey,
        ancestors,
      );
    }
    result = sortedObj;
  }
  ancestors.pop();
  return result;
}
