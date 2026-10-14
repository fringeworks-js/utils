import type { LooseRecord } from '@fringeworks/types';
import * as R from 'remeda';
import { get } from '../get';
import { parsePropertyPath, type PropertyPath } from '../parsePropertyPath';
import { setMutable } from '../setMutable';
import { unsetMutable } from '../unsetMutable';
import type { TransformObjectOptions, TransformObjectRule } from './types';

/**
 * 指定されたルールに従ってオブジェクトの構造を変換・抽出する
 */
export default function transformObject<
  T extends object = LooseRecord,
  S extends object = LooseRecord,
>(
  source: S,
  rules: readonly (string | TransformObjectRule<S, T>)[],
  options: TransformObjectOptions = {},
): T {
  const { removeFromSource = false } = options;
  let result = {} as T;
  // source から削除するパス。すべてのルールで値を取り出してから削除する
  const removePaths: PropertyPath[] = [];

  for (const rule of rules) {
    let value: unknown;
    let to: PropertyPath | ((target: T, value: unknown) => T) | undefined;

    // 値の抽出
    if (R.isString(rule)) {
      value = get(source, rule);
      to = rule;
      if (removeFromSource) {
        removePaths.push(rule);
      }
    } else if (isFunctionRule(rule)) {
      value = rule.from(source);
      to = rule.to;
    } else {
      value = get(source, rule.from);
      to = rule.to ?? rule.from;
      if (rule.removeFromSource ?? removeFromSource) {
        removePaths.push(rule.from);
      }
    }

    // 値の設定
    if (value === undefined || to === undefined) {
      continue;
    }
    if (R.isFunction(to)) {
      result = to(result, value);
    } else {
      setMutable(result, to, value);
    }
  }

  removeFromObject(source, removePaths);
  return result;
}

/**
 * 関数で値を取り出すルールかどうか
 */
function isFunctionRule<S extends object, T extends object>(
  rule: TransformObjectRule<S, T>,
): rule is Extract<
  TransformObjectRule<S, T>,
  { from: (source: S) => unknown }
> {
  return R.isFunction(rule.from);
}

/**
 * パスの値を削除する\
 * 配列の要素を詰めてもほかのパスのインデックスがずれないよう、後ろのパスから削除する
 */
function removeFromObject(source: object, paths: PropertyPath[]): void {
  const segmentsList = paths.map(parsePropertyPath).sort(compareSegmentsDesc);
  let previous: readonly PropertyKey[] | undefined;
  for (const segments of segmentsList) {
    // 同じパスを2回削除すると後ろの要素まで消えるため、1回だけ削除する
    if (previous === undefined || compareSegmentsDesc(previous, segments)) {
      unsetMutable(source, segments);
    }
    previous = segments;
  }
}

/**
 * パスを降順に並べるための比較関数\
 * インデックスとして読めるキー（`1` や `'1'`）は数値として比べ、子孫のパスは祖先のパスより前にする
 * `'a.1'` と `'a[1]'` は同じ要素を指すため、等しいとみなす
 */
function compareSegmentsDesc(
  a: readonly PropertyKey[],
  b: readonly PropertyKey[],
): number {
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i++) {
    const x = toIndexKey(a[i]!);
    const y = toIndexKey(b[i]!);
    if (x === y) {
      continue;
    }
    if (typeof x === 'number') {
      return typeof y === 'number' ? y - x : -1;
    }
    if (typeof y === 'number') {
      return 1;
    }
    return String(x) < String(y) ? 1 : -1;
  }
  return b.length - a.length;
}

/**
 * インデックスとして読めるキーを数値にする
 */
function toIndexKey(key: PropertyKey): PropertyKey {
  return typeof key === 'string' && /^(?:0|[1-9]\d*)$/.test(key)
    ? Number(key)
    : key;
}
