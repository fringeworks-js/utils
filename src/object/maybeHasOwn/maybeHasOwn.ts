import { hasOwn } from '../hasOwn';

/**
 * null / undefined になりうる値が、指定のプロパティを自身で持つか判定する
 * @param data 対象のオブジェクト。null / undefined の場合は false を返す
 * @param key プロパティのキー
 * @returns 自身で持つ場合は true
 */
export default function maybeHasOwn(
  data: object | null | undefined,
  key: PropertyKey,
): boolean {
  return data != null && hasOwn(data, key);
}
