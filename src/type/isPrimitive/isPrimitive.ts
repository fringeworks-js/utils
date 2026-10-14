import type { Primitive } from '@fringeworks/types';

/**
 * 値がプリミティブ（`null`・`undefined`・`boolean`・`number`・`bigint`・`string`・`symbol`）か判定する
 * @param value 判定する値
 * @returns プリミティブであれば true
 */
export default function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null || (typeof value !== 'object' && typeof value !== 'function')
  );
}
