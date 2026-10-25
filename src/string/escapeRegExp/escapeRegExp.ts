import _escapeRegExp from '../_internal/_escapeRegExp';

type RegExpConstructorWithEscape = RegExpConstructor & {
  escape?: (str: string) => string;
};

/**
 * 標準の `RegExp.escape`（Chrome 136・Firefox 134・Safari 18.2 以降）
 */
const nativeEscape = (RegExp as RegExpConstructorWithEscape).escape;

/**
 * 文字列を、正規表現の中でその文字列自体に一致するようにエスケープする\
 * 標準の `RegExp.escape` と同じ結果を返し、標準がある環境ではそちらを使う
 *
 * `u` / `v` フラグを指定した場合や、文字クラスの中に埋め込んだ場合も、元の文字列として扱われる。
 * 前後の文字とつながって意味が変わらないよう、先頭の英数字もエスケープする
 * @param data エスケープする文字列
 * @returns エスケープした文字列
 * @example
 * new RegExp(escapeRegExp('1.5*2')); // /\x31\.5\*2/
 */
export default function escapeRegExp(data: string): string {
  return nativeEscape ? nativeEscape(data) : _escapeRegExp(data);
}
