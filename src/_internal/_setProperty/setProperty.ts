import needsDefineProperty from './needsDefineProperty';

/**
 * Object.definePropertyの要否を判断しオブジェクトに値を設定する
 * @param obj
 * @param key
 * @param descriptor
 * @returns
 */
export default function setProperty(
  obj: object,
  key: string | symbol,
  descriptor: PropertyDescriptor | null | undefined,
): void {
  if (!descriptor) {
    return;
  }
  if (needsDefineProperty(key, descriptor)) {
    Object.defineProperty(obj, key, descriptor);
  } else {
    obj[key] = descriptor.value;
  }
}
