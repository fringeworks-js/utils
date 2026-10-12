import { hasOwn } from '../../object/hasOwn';

/**
 * カスタム比較関数。
 * 明示的に結果を返さない(undefined)場合は、デフォルトの再帰比較が行われる
 */
type Customizer = (
  value1: unknown,
  value2: unknown,
  indexOrKey?: PropertyKey | undefined,
  value1Parent?: unknown,
  value2Parent?: unknown,
) => boolean | undefined;

/**
 * 2つの値が等しいかどうかを深く比較する
 * customizerを渡すことで、特定の型やプロパティの比較ロジックをカスタマイズできる
 */
const isEqualWith = (
  value: unknown,
  other: unknown,
  customizer: Customizer,
): boolean => _isEqualWith(value, other, customizer);
isEqualWith.dataLast =
  (other: unknown, customizer: Customizer) =>
  (value: unknown): boolean =>
    _isEqualWith(value, other, customizer);
export default isEqualWith;

function _isEqualWith(
  value: unknown,
  other: unknown,
  customizer: Customizer,
  key?: string | number,
  parent?: unknown,
  otherParent?: unknown,
): boolean {
  const result = customizer(value, other, key, parent, otherParent);
  if (result !== undefined) {
    return result;
  }

  if (Object.is(value, other)) {
    return true;
  }

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      if (!_isEqualWith(value[i], other[i], customizer, i, value, other)) {
        return false;
      }
    }
    return true;
  }

  if (
    value !== null &&
    typeof value === 'object' &&
    other !== null &&
    typeof other === 'object'
  ) {
    if (value instanceof Date && other instanceof Date) {
      return value.getTime() === other.getTime();
    }
    if (value instanceof Map || other instanceof Map) {
      // Mapはキーの有無と値を比較する
      if (
        !(value instanceof Map && other instanceof Map) ||
        value.size !== other.size
      ) {
        return false;
      }
      for (const [k, v] of value) {
        if (!other.has(k)) {
          return false;
        }
        const indexOrKey =
          typeof k === 'string' || typeof k === 'number' ? k : undefined;
        if (
          !_isEqualWith(v, other.get(k), customizer, indexOrKey, value, other)
        ) {
          return false;
        }
      }
      return true;
    }
    if (value instanceof Set || other instanceof Set) {
      // Setは同じ要素（SameValueZero）を持つかを比較する
      if (
        !(value instanceof Set && other instanceof Set) ||
        value.size !== other.size
      ) {
        return false;
      }
      for (const item of value) {
        if (!other.has(item)) {
          return false;
        }
      }
      return true;
    }

    const keys = Object.keys(value);
    const otherKeys = Object.keys(other);

    if (keys.length !== otherKeys.length) {
      return false;
    }

    for (const k of keys) {
      if (!hasOwn(other, k)) {
        return false;
      }
      if (
        !_isEqualWith(
          (value as Record<string, unknown>)[k],
          (other as Record<string, unknown>)[k],
          customizer,
          k,
          value,
          other,
        )
      ) {
        return false;
      }
    }
    return true;
  }

  return false;
}
