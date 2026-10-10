/**
 * Object.definePropertyが必要なプロパティか判定する
 * @param key
 * @param descriptor
 * @returns
 */
export default function needsDefineProperty(
  key: string | symbol,
  descriptor: PropertyDescriptor,
): boolean {
  return (
    key === '__proto__' ||
    !!descriptor.get ||
    !!descriptor.set ||
    !descriptor.configurable ||
    !descriptor.enumerable ||
    !descriptor.writable
  );
}
