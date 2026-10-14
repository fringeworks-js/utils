import _createContainer from '../../_internal/_createContainer';
import _isUnsafeKey from '../../_internal/_isUnsafeKey';
import { hasOwn } from '../hasOwn';
import { parsePropertyPath, type PropertyPath } from '../parsePropertyPath';

/**
 * オブジェクトを更新して新しいオブジェクトを返す（非破壊的変更）
 * @param data 更新対象のオブジェクト
 * @param path 更新するプロパティのパス（例: 'a.b[0]' または ['a', 'b', 0]）
 * @param value 設定する値
 * @returns 更新された新しいオブジェクト
 */
export default function set<T extends object>(
  data: T,
  path: PropertyPath,
  value: unknown,
): T {
  const segments = parsePropertyPath(path);
  // 空のパスは設定先が無いため、何もしない
  if (segments.length === 0 || segments.some(_isUnsafeKey)) {
    return data;
  }

  const setter = (current: unknown, index: number): unknown => {
    if (index === segments.length) {
      return value;
    }

    const key = segments[index]!;
    const isObject = current !== null && typeof current === 'object';
    // 既存の値を保持する。なければ undefined のまま進め、次の階層で作る
    // 結果はスプレッドで複製し自身のプロパティだけを引き継ぐため、読み取りも自身のプロパティに限る
    const target =
      isObject && hasOwn(current, key)
        ? (current as Record<PropertyKey, unknown>)[key]
        : undefined;

    const updatedValue = setter(target, index + 1);

    // 既存の値がオブジェクト・配列でなければ、キーに合わせて作る（数値なら配列）
    const base = isObject ? current : _createContainer(key);
    if (Array.isArray(base)) {
      const clone = [...base];
      Reflect.set(clone, key, updatedValue);
      return clone;
    } else {
      return { ...base, [key]: updatedValue };
    }
  };

  return setter(data, 0) as T;
}
