/**
 * instanceをオーバーライドするプロキシを作る
 * クラスの継承ができない場合にインスタンスのメソッドやプロパティをオーバーライドする為の関数
 *
 * @param instance
 * @param overrides
 * @returns
 */
export default function overrideInstance<
  I extends object,
  O extends Record<
    PropertyKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target: I, prop: string | symbol, receiver: any) => any
  >,
>(
  instance: I,
  overrides: O = {} as O,
): I & { [K in keyof O]: ReturnType<O[K]> } {
  return new Proxy(instance, {
    get: (target, property, receiver) => {
      const override = overrides[property as keyof O];
      if (property in overrides && override) {
        return override(target, property, receiver);
      }
      return Reflect.get(target, property, receiver);
    },
  }) as I & { [K in keyof O]: ReturnType<O[K]> };
}
