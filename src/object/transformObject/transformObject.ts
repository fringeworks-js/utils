import type { LooseRecord } from '@fringeworks/types';
import * as R from 'remeda';
import get from '../get';
import setMutable from '../setMutable';
import unsetMutable from '../unsetMutable';
import type { MappingRule, TransformObjectOptions } from './types';

/**
 * 指定されたルールに従ってオブジェクトの構造を変換・抽出する
 */
const transformObject = <
  T extends LooseRecord = LooseRecord,
  S extends LooseRecord = LooseRecord,
>(
  source: S,
  rules: (string | MappingRule<S, T>)[],
  options: TransformObjectOptions = {},
): T => _transformObject(source, rules, options);
transformObject.dataLast =
  <T extends LooseRecord = LooseRecord, S extends LooseRecord = LooseRecord>(
    rules: (string | MappingRule<S, T>)[],
    options: TransformObjectOptions = {},
  ) =>
  (source: S): T =>
    _transformObject(source, rules, options);
export default transformObject;

function _transformObject<
  T extends LooseRecord = LooseRecord,
  S extends LooseRecord = LooseRecord,
>(
  source: S,
  rules: (string | MappingRule<S, T>)[],
  options: TransformObjectOptions = {},
): T {
  const { deleteSourceKeys = false } = options;
  let result = {} as T;

  if (!rules || !source) {
    return result;
  }

  for (const rule of rules) {
    let fromPath: string | ((s: S) => unknown);
    let toPath: string | ((t: T, v: unknown) => T);
    let specificDelete: boolean | undefined;

    // ルールの正規化
    if (R.isString(rule)) {
      fromPath = toPath = rule;
    } else {
      fromPath = rule.from;
      toPath = rule.to ?? (R.isString(fromPath) ? fromPath : '');
      specificDelete = rule.shouldRemoveFromSource;
    }

    let value: unknown;

    // 値の抽出
    if (R.isString(fromPath)) {
      value = get(source, fromPath);

      // 削除フラグ
      const needsDelete = specificDelete ?? deleteSourceKeys;
      if (needsDelete) {
        unsetMutable(source, fromPath);
      }
    } else if (R.isFunction(fromPath)) {
      value = fromPath(source);
    }

    // 値の設定
    if (value !== undefined) {
      if (R.isString(toPath)) {
        if (toPath !== '') {
          setMutable(result, toPath, value);
        }
      } else if (R.isFunction(toPath)) {
        result = toPath(result, value);
      }
    }
  }

  return result;
}
