import type { LooseDictionary } from '@fringeworks/types';
import { get } from '../../object/get';
import _createDelimiterPattern from '../_internal/_createDelimiterPattern';
import { ensureString } from '../ensureString';
import type { ReplacePlaceholdersOptions } from './types';

/**
 * テンプレート内のプレースホルダーを指定された値で置換する\
 * プレースホルダーの内側の前後の空白は無視し、改行を含むものはプレースホルダーとして扱わない。
 * 値が見つからない場合（null・undefined・関数の場合を含む）は、プレースホルダーをそのまま残す
 * @param template テンプレート
 * @param values プレースホルダーのキーで値を引くオブジェクトまたは配列
 * @param options オプション
 * @returns 置換した文字列
 */
export default function replacePlaceholders(
  template: string,
  values: LooseDictionary | readonly unknown[],
  options: ReplacePlaceholdersOptions = {},
): string {
  const {
    delimiters,
    removeUnresolved = false,
    flatKeys = false,
    includeInherited = false,
  } = options;
  const { pattern } = _createDelimiterPattern(delimiters);

  return template.replace(pattern, (match, content: string) => {
    const key = content.trim();
    const value = key
      ? get(values, flatKeys ? [key] : key, { includeInherited })
      : undefined;
    if (value == null || typeof value === 'function') {
      return removeUnresolved ? '' : match;
    }
    return ensureString(value);
  });
}
