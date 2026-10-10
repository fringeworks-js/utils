import * as R from 'remeda';
import { isRegExp } from '../../type/isRegExp';
import { unsafeCast } from '../../type/unsafeCast';
import type {
  MaybeReplaceDynamicPattern,
  MaybeReplaceOptions,
  MaybeReplacePattern,
} from './types';

/**
 * 文字列の置換を行う
 * @param str 対象の文字列
 * @param pattern 置換対象のパターン。パターンが関数の場合はその戻り値の文字列や正規表現で置換を行う
 * @param replacement 置換後の文字列
 * @param options patternが関数の場合に引数として渡すオプション
 * @returns
 */
const maybeReplace = <O extends MaybeReplaceOptions = MaybeReplaceOptions>(
  str: string | null | undefined,
  pattern: MaybeReplacePattern,
  replacement: string | ((substring: string, ...args: unknown[]) => string),
  options?: O,
) => _maybeReplace(str, pattern, replacement, options);
maybeReplace.dataLast =
  <O extends MaybeReplaceOptions = MaybeReplaceOptions>(
    pattern: MaybeReplacePattern,
    replacement: string | ((substring: string, ...args: unknown[]) => string),
    options?: O,
  ) =>
  (str: string | null | undefined) =>
    _maybeReplace(str, pattern, replacement, options);
export default maybeReplace;

function _maybeReplace<O extends MaybeReplaceOptions = MaybeReplaceOptions>(
  str: string | null | undefined,
  pattern: MaybeReplacePattern,
  replacement: string | ((substring: string, ...args: unknown[]) => string),
  options?: O,
) {
  if (str != null) {
    if (R.isString(pattern)) {
      // パターンが文字列の場合
      return str.replaceAll(pattern, unsafeCast(replacement));
    } else if (isRegExp(pattern)) {
      // パターンが正規表現の場合
      return str.replace(pattern, unsafeCast(replacement));
    } else if (R.isFunction(pattern)) {
      // パターンが関数の場合
      return _maybeReplace(
        str,
        (pattern as MaybeReplaceDynamicPattern)(options),
        replacement,
      );
    }
  }
  return str;
}
