/**
 * str が prefix で始まり、suffix で終わっているか判定する\
 * prefix と suffix の間は0文字でもよいが、prefix と suffix が重なっている場合は false
 * @param str 文字列。null・undefined は false
 * @param prefix 接頭語
 * @param suffix 接尾語。省略した場合は prefix と同じ
 * @returns prefix と suffix で囲まれている場合は true
 */
export default function isSurroundedBy(
  str: string,
  prefix: string,
  suffix: string = prefix,
): boolean {
  return (
    str != null &&
    str.length >= prefix.length + suffix.length &&
    str.startsWith(prefix) &&
    str.endsWith(suffix)
  );
}
