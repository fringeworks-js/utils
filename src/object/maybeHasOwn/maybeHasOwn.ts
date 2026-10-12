export default function maybeHasOwn(
  data: object | null | undefined,
  key: PropertyKey,
): boolean {
  return data != null && Object.hasOwn(data, key);
}
