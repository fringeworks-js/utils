import _createContainer from '../../_internal/_createContainer';
import _parsePath from '../../_internal/_parsePath';

/**
 * オブジェクトを更新して新しいオブジェクトを返す（非破壊的変更）
 * @param data 更新対象のオブジェクト
 * @param path 更新するプロパティのパス（例: 'a.b.0' または ['a', 'b', 0]）
 * @param value 設定する値
 * @returns 更新された新しいオブジェクト
 */
const set = <T extends object>(
  data: T,
  path: string | PropertyKey[],
  value: unknown,
) => _set(data, path, value);
set.dataLast =
  (path: string | PropertyKey[], value: unknown) =>
  <T extends object>(data: T) =>
    _set(data, path, value);
export default set;

function _set<T extends object>(
  data: T,
  path: string | PropertyKey[],
  value: unknown,
): T {
  const segments = _parsePath(path);

  const setter = (current: unknown, index: number): unknown => {
    if (index === segments.length) {
      return value;
    }

    const key = segments[index];
    // 既存の値を保持、なければ新しいコンテナを作成
    const target =
      current && typeof current === 'object' && key in current
        ? current[key]
        : _createContainer(segments[index + 1]);

    const updatedValue = setter(target, index + 1);

    // 配列かオブジェクトかでコピー処理を分岐
    if (Array.isArray(current) || typeof key === 'number') {
      const clone = Array.isArray(current) ? [...current] : [];
      clone[key as PropertyKey] = updatedValue;
      return clone;
    } else {
      return { ...(current as object), [key]: updatedValue };
    }
  };

  return setter(data, 0) as T;
}
