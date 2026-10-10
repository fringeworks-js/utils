export default function maybeMatchAll(
  str: string | null | undefined,
  regexp: RegExp,
) {
  if (str) {
    return Array.from(str.matchAll(regexp));
  }
  return [];
}
