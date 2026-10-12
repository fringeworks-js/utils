import _createContainer from '../../_internal/_createContainer';
import _parsePath from '../../_internal/_parsePath';

/**
 * オブジェクトを更新して同じオブジェクトを返す（破壊的変更）
 * @param data 更新対象のオブジェクト
 * @param path 更新するプロパティのパス（例: 'a.b.0' または ['a', 'b', 0]）
 * @param value 設定する値
 * @returns 更新された同じオブジェクト
 */
const setMutable = <T extends object>(
  data: T,
  path: string | PropertyKey[],
  value: unknown,
) => _setMutable(data, path, value);
setMutable.dataLast =
  <T extends object>(path: string | PropertyKey[], value: unknown) =>
  (data: T) =>
    _setMutable(data, path, value);
export default setMutable;

function _setMutable<T extends object>(
  data: T,
  path: string | PropertyKey[],
  value: unknown,
): T {
  const segments = _parsePath(path);
  const length = segments.length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = data;

  for (const [i, key] of segments.entries()) {
    if (i === length - 1) {
      current[key] = value;
    } else {
      if (current[key] === null || typeof current[key] !== 'object') {
        current[key] = _createContainer(segments[i + 1]);
      }
      current = current[key];
    }
  }
  return data;
}
