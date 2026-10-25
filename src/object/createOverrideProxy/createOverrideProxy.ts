import { hasOwn } from '../hasOwn';

/**
 * instanceのプロパティをオーバーライドするプロキシを作る
 * クラスの継承ができない場合にインスタンスのメソッドやプロパティをオーバーライドする為の関数
 * 元のインスタンスは変更しない
 *
 * オーバーライドしないメソッドは元のインスタンスに束縛して返す。
 * そのため、元のメソッドの中から this 経由で読んだプロパティにはオーバーライドが反映されない
 *
 * @param instance オーバーライドする対象のインスタンス
 * @param overrides プロパティ名と、そのプロパティを読んだときの値を返す関数
 * @returns オーバーライドしたプロキシ
 */
export default function createOverrideProxy<
  I extends object,
  O extends Record<
    PropertyKey,
    // 標準の ProxyHandler の get と同じく、receiver と戻り値は any にする
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target: I, prop: string | symbol, receiver: any) => any
  >,
>(
  instance: I,
  overrides: O = {} as O,
): I & { [K in keyof O]: ReturnType<O[K]> } {
  // 束縛したメソッドを保持し、読むたびに別の関数にならないようにする
  const boundMethods = new WeakMap<object, unknown>();
  return new Proxy(instance, {
    get: (target, property, receiver) => {
      if (hasOwn(overrides, property)) {
        const override = overrides[property as keyof O];
        if (override) {
          return override(target, property, receiver);
        }
      }
      // 内部スロットやプライベートフィールドを持つインスタンス（Map や DOM 要素など）でも動くよう、
      // ゲッターやメソッドは元のインスタンスを this として呼ぶ
      const value: unknown = Reflect.get(target, property, target);
      if (typeof value !== 'function' || property === 'constructor') {
        return value;
      }
      let bound = boundMethods.get(value);
      if (bound === undefined) {
        bound = value.bind(target);
        boundMethods.set(value, bound);
      }
      return bound;
    },
    set: (target, property, value) =>
      Reflect.set(target, property, value, target),
  }) as I & { [K in keyof O]: ReturnType<O[K]> };
}
