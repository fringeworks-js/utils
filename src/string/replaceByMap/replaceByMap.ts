import { ensureMap } from '../../map/ensureMap';
import _createReplacer from '../_internal/_createReplacer';
import type { ReplacementMap } from '../createReplacerByMap';

/**
 * mapのキーの文字列を値の文字列に置き換える\
 * 一度にまとめて置換するため、置換した結果がさらに置換されることはない。
 * キーが重なる場合は長いキーを優先する
 * @param data 対象の文字列。空文字はそのまま返す
 * @param map 置き換え前の文字列をキー、置き換え後の文字列を値に持つマップ
 * @returns 置き換えた文字列
 */
export default function replaceByMap(
  data: string,
  map: ReplacementMap,
): string {
  if (!data) {
    return data;
  }
  return _createReplacer(ensureMap(map, { raw: true }))(data);
}
