import type { Empty } from '@fringeworks/types';

/**
 * 値が `null`・`undefined`・空文字のいずれかであるか判定する
 * @param value 判定する値
 * @returns `null`・`undefined`・空文字であれば true
 */
export default function isEmpty(value: unknown): value is Empty {
  return value == null || value === '';
}
