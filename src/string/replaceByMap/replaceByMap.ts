import { ensureMap } from '../../map/ensureMap';
import { isBlank } from '../../type/isBlank';
import type { ReplacementMap } from '../_internal/_createReplacer';
import _createReplacer from '../_internal/_createReplacer';

/**
 * mapのキーの文字列を値の文字列に置き換える
 * @param str
 * @param map
 * @returns
 */
const replaceByMap = (
  str: string,
  map: ReplacementMap | Record<string, string> | [string, string][],
): string => _replaceByMap(str, map);
replaceByMap.dataLast = (
  map: ReplacementMap | Record<string, string> | [string, string][],
) => {
  // 置換関数は1度だけ作成する。作成後のmapの変更は反映しない
  const replacer = _createReplacer(ensureMap(map));
  return (str: string): string => replacer(str);
};
export default replaceByMap;

function _replaceByMap(
  str: string,
  map: ReplacementMap | Record<string, string> | [string, string][],
): string {
  if (isBlank(str)) {
    return str;
  }
  const replacer = _createReplacer(ensureMap(map, { raw: true }));
  return replacer(str);
}
