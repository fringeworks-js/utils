import { hasOwn } from '../hasOwn';

export default function maybeHasOwn(
  data: object | null | undefined,
  key: PropertyKey,
): boolean {
  return data != null && hasOwn(data, key);
}
