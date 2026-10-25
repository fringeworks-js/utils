/**
 * data が prefix で始まり、suffix で終わっているか判定する\
 * prefix と suffix の間は0文字でもよいが、prefix と suffix が重なっている場合は false
 * @param data 文字列
 * @param prefix 接頭語
 * @param suffix 接尾語。省略した場合は prefix と同じ
 * @returns prefix と suffix で囲まれている場合は true
 */
export default function isSurroundedBy(
  data: string,
  prefix: string,
  suffix: string = prefix,
): boolean {
  return (
    data != null &&
    data.length >= prefix.length + suffix.length &&
    data.startsWith(prefix) &&
    data.endsWith(suffix)
  );
}
