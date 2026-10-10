import { Kind } from './constants';

/**
 * typeofの拡張。\
 * typeof value === 'object' よりも詳細な結果を返す
 *
 * @param data 任意の値
 * @returns
 */
const getKind = (data: unknown): Kind => _getKind(data);
getKind.dataLast = () => getKind;
export default getKind;

function _getKind(data: unknown): Kind {
  const type = typeof data;
  if (type === 'object') {
    if (data === null) {
      return Kind.null;
    } else if (Array.isArray(data)) {
      return Kind.array;
    } else if (Object.getPrototypeOf(data) === Object.prototype) {
      return Kind.plainobject;
    } else if (data instanceof Date) {
      return Kind.date;
    } else if (data instanceof RegExp) {
      return Kind.regexp;
    } else if (data instanceof Error) {
      return Kind.error;
    } else if (data instanceof Map) {
      return Kind.map;
    } else if (data instanceof Set) {
      return Kind.set;
    } else if (data instanceof WeakMap) {
      return Kind.weakmap;
    } else if (data instanceof WeakSet) {
      return Kind.weakset;
    } else if (data instanceof Promise) {
      return Kind.promise;
    } else if (data instanceof ArrayBuffer) {
      return Kind.arraybuffer;
    } else if (data instanceof SharedArrayBuffer) {
      return Kind.sharedarraybuffer;
    }
    return Kind.object;
  } else {
    return type;
  }
}
