import type { LooseDictionary } from '@fringeworks/types';
import get from '../../object/get';
import escapeRegExp from '../escapeRegExp';
import type { ReplacePlaceholdersOptions } from './types';

const getShallow = (values: unknown, key: string) => values[key];

/**
 * テンプレート内のプレイスホルダーを指定された値で置換する
 */
const replacePlaceholders = (
  template: string,
  values: LooseDictionary | unknown[],
  options: ReplacePlaceholdersOptions = {},
): string => _replacePlaceholders(template, values, options);
replacePlaceholders.dataLast =
  (
    values: LooseDictionary | unknown[],
    options: ReplacePlaceholdersOptions = {},
  ) =>
  (template: string): string =>
    _replacePlaceholders(template, values, options);
export default replacePlaceholders;

function _replacePlaceholders(
  template: string,
  values: LooseDictionary | unknown[],
  options: ReplacePlaceholdersOptions = {},
): string {
  const {
    bracket = ['{{', '}}'],
    removePlaceholders = false,
    flatKeys = false,
  } = options;

  // 正規表現の構築
  const left = escapeRegExp(bracket[0]);
  const right = escapeRegExp(bracket[1]);
  // {{ key }} のようなスペース入りにも対応
  const regex = new RegExp(`${left}\\s*(.*?)\\s*${right}`, 'g');

  // 値取得ロジックの決定
  const getValue = flatKeys ? getShallow : get;

  // 置換処理
  return template.replace(regex, (match, key) => {
    const value = getValue(values, key);

    // null または undefined の場合
    if (value == null) {
      return removePlaceholders ? '' : match;
    }

    // 値がオブジェクト等の場合は文字列に変換、基本は string/number を想定
    return String(value);
  });
}
