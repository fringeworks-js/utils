import { hasOwn } from '../../object/hasOwn';
import type { IsEqualWithCustomizer } from './types';

/**
 * 比較中のオブジェクトの組（循環参照の検出に使う）
 */
type Stack = [object, object][];

/**
 * 2つの値が等しいかどうかを深く比較する
 * customizerを渡すことで、特定の型やプロパティの比較ロジックをカスタマイズできる
 *
 * 既定の比較は `remeda` の `isDeepEqual` と同じ基準で行う
 * - プロトタイプが異なるオブジェクトは等しくない（`null` プロトタイプとプレーンなオブジェクトは同じとみなす）
 * - 配列は要素ごと、Map はキーと値、Set は構造が等しい要素を持つか、Date は時刻、RegExp はパターンとフラグで比較する
 * - それ以外のオブジェクトは自身の列挙可能なプロパティごとに比較する
 * - 循環参照は、比較中の組に再び到達した時点で等しいとみなす
 */
export default function isEqualWith(
  value: unknown,
  other: unknown,
  customizer: IsEqualWithCustomizer,
): boolean {
  return _isEqualWith(value, other, customizer, [], undefined);
}

function _isEqualWith(
  value: unknown,
  other: unknown,
  customizer: IsEqualWithCustomizer,
  stack: Stack,
  key: unknown,
  parent?: unknown,
  otherParent?: unknown,
): boolean {
  const result = customizer(value, other, key, parent, otherParent);
  if (result !== undefined) {
    return result;
  }

  if (value === other || Object.is(value, other)) {
    return true;
  }

  if (
    value === null ||
    typeof value !== 'object' ||
    other === null ||
    typeof other !== 'object' ||
    !hasSamePrototype(value, other)
  ) {
    return false;
  }

  if (stack.some(([v, o]) => v === value && o === other)) {
    return true;
  }

  stack.push([value, other]);
  try {
    return compareObjects(value, other, customizer, stack);
  } finally {
    stack.pop();
  }
}

/**
 * プロトタイプが同じオブジェクト同士を比較する
 */
function compareObjects(
  value: object,
  other: object,
  customizer: IsEqualWithCustomizer,
  stack: Stack,
): boolean {
  if (Array.isArray(value)) {
    const otherArray = other as unknown[];
    if (value.length !== otherArray.length) {
      return false;
    }
    for (let i = 0; i < value.length; i++) {
      if (
        !_isEqualWith(
          value[i],
          otherArray[i],
          customizer,
          stack,
          i,
          value,
          other,
        )
      ) {
        return false;
      }
    }
    return true;
  }

  if (value instanceof Map) {
    const otherMap = other as Map<unknown, unknown>;
    if (value.size !== otherMap.size) {
      return false;
    }
    for (const [k, v] of value) {
      if (!otherMap.has(k)) {
        return false;
      }
      if (
        !_isEqualWith(v, otherMap.get(k), customizer, stack, k, value, other)
      ) {
        return false;
      }
    }
    return true;
  }

  if (value instanceof Set) {
    const otherSet = other as Set<unknown>;
    if (value.size !== otherSet.size) {
      return false;
    }
    // 構造が等しい要素を1対1で対応付ける
    const rest = [...otherSet];
    for (const item of value) {
      const index = rest.findIndex((candidate) =>
        _isEqualWith(
          item,
          candidate,
          customizer,
          stack,
          undefined,
          value,
          other,
        ),
      );
      if (index < 0) {
        return false;
      }
      rest.splice(index, 1);
    }
    return true;
  }

  if (value instanceof Date) {
    return value.getTime() === (other as Date).getTime();
  }

  if (value instanceof RegExp) {
    return value.toString() === (other as RegExp).toString();
  }

  const keys = Object.keys(value);
  if (keys.length !== Object.keys(other).length) {
    return false;
  }
  for (const k of keys) {
    if (
      !hasOwn(other, k) ||
      !_isEqualWith(
        (value as Record<string, unknown>)[k],
        (other as Record<string, unknown>)[k],
        customizer,
        stack,
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

/**
 * 2つのオブジェクトのプロトタイプが同じか判定する\
 * `null` プロトタイプと `Object.prototype` は同じとみなす
 */
function hasSamePrototype(value: object, other: object): boolean {
  const proto = Object.getPrototypeOf(value);
  const otherProto = Object.getPrototypeOf(other);
  if (proto === otherProto) {
    return true;
  }
  return (
    (proto === null && otherProto === Object.prototype) ||
    (proto === Object.prototype && otherProto === null)
  );
}
