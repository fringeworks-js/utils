import * as R from 'remeda';
import { ensureArray } from '../array/ensureArray';

/**
 * 'a.b[0].c' 形式の文字列をPropertyKey[]に変換
 */
export default function _parsePath(path: PropertyKey | PropertyKey[]) {
  return Array.isArray(path)
    ? path
    : R.isString(path)
      ? R.stringToPath(path)
      : ensureArray(path);
}
