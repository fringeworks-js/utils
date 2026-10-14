import { ensureMap } from '../../map/ensureMap';
import _createReplacer from '../_internal/_createReplacer';
import type { ReplacementMap, Replacer } from './types';

/**
 * mapのキーの文字列を値の文字列に置き換える関数を作る\
 * 置換用の索引を最初に1度だけ作るため、同じmapで何度も置き換える場合はreplaceByMapより速い。
 * 作成後にmapを変更しても、作成した関数には反映しない
 * @param map 置き換え前の文字列をキー、置き換え後の文字列を値に持つマップ
 * @returns 文字列を置き換える関数。空文字・null・undefined はそのまま返す
 */
export default function createReplacerByMap(map: ReplacementMap): Replacer {
  // 索引はここで作り終えるため、Mapをコピーする必要は無い
  return _createReplacer(ensureMap(map, { raw: true }));
}
