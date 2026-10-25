import { Kind } from './constants';

/**
 * typeofの拡張。\
 * オブジェクトを `null`・配列・単純なオブジェクト・主な組み込みオブジェクトに分け、
 * どれにも当たらないものを `'instance'` とする。\
 * 組み込みオブジェクトは `instanceof` で判定するため、iframe など別の realm の値は `'instance'` になる
 *
 * @param value 任意の値
 * @returns 型種別
 */
export default function getKind(value: unknown): Kind {
  const type = typeof value;
  if (type !== 'object') {
    return type as Exclude<typeof type, 'object'>;
  }
  if (value === null) {
    return Kind.null;
  }
  if (Array.isArray(value)) {
    return Kind.array;
  }
  const proto: unknown = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) {
    return Kind.plainobject;
  }
  if (value instanceof Date) {
    return Kind.date;
  }
  if (value instanceof RegExp) {
    return Kind.regexp;
  }
  if (value instanceof Error) {
    return Kind.error;
  }
  if (value instanceof Map) {
    return Kind.map;
  }
  if (value instanceof Set) {
    return Kind.set;
  }
  if (value instanceof WeakMap) {
    return Kind.weakmap;
  }
  if (value instanceof WeakSet) {
    return Kind.weakset;
  }
  if (value instanceof Promise) {
    return Kind.promise;
  }
  if (value instanceof ArrayBuffer) {
    return Kind.arraybuffer;
  }
  // cross-origin isolated でないページでは SharedArrayBuffer が定義されていない
  if (
    typeof SharedArrayBuffer !== 'undefined' &&
    value instanceof SharedArrayBuffer
  ) {
    return Kind.sharedarraybuffer;
  }
  return Kind.instance;
}
