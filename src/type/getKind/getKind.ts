import { Kind } from './constants';

/**
 * typeofの拡張。\
 * オブジェクトを `null`・配列・単純なオブジェクト・主な組み込みオブジェクトに分け、
 * どれにも当たらないものを `'instance'` とする。\
 * 組み込みオブジェクトは `instanceof` で判定するため、iframe など別の realm の値は `'instance'` になる
 *
 * @param data 任意の値
 * @returns 型種別
 */
export default function getKind(data: unknown): Kind {
  const type = typeof data;
  if (type !== 'object') {
    return type as Exclude<typeof type, 'object'>;
  }
  if (data === null) {
    return Kind.null;
  }
  if (Array.isArray(data)) {
    return Kind.array;
  }
  const proto: unknown = Object.getPrototypeOf(data);
  if (proto === Object.prototype || proto === null) {
    return Kind.plainobject;
  }
  if (data instanceof Date) {
    return Kind.date;
  }
  if (data instanceof RegExp) {
    return Kind.regexp;
  }
  if (data instanceof Error) {
    return Kind.error;
  }
  if (data instanceof Map) {
    return Kind.map;
  }
  if (data instanceof Set) {
    return Kind.set;
  }
  if (data instanceof WeakMap) {
    return Kind.weakmap;
  }
  if (data instanceof WeakSet) {
    return Kind.weakset;
  }
  if (data instanceof Promise) {
    return Kind.promise;
  }
  if (data instanceof ArrayBuffer) {
    return Kind.arraybuffer;
  }
  // cross-origin isolated でないページでは SharedArrayBuffer が定義されていない
  if (
    typeof SharedArrayBuffer !== 'undefined' &&
    data instanceof SharedArrayBuffer
  ) {
    return Kind.sharedarraybuffer;
  }
  return Kind.instance;
}
