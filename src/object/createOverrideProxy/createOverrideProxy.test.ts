import createOverrideProxy from './createOverrideProxy';

describe('createOverrideProxy', () => {
  it('プロパティをオーバーライドできる', () => {
    const instance = { greet: () => 'hello', name: 'original' };
    const proxy = createOverrideProxy(instance, {
      greet: () => () => 'overridden',
    });
    expect(proxy.greet()).toBe('overridden');
  });

  it('オーバーライドされていないプロパティは元のinstanceの値を返す', () => {
    const instance = { a: 1, b: 2 };
    const proxy = createOverrideProxy(instance, {
      a: () => 99,
    });
    expect(proxy.b).toBe(2);
  });

  it('overridesが空でも元のinstanceと同様に動作する', () => {
    const instance = { x: 42 };
    const proxy = createOverrideProxy(instance);
    expect(proxy.x).toBe(42);
  });

  it('overridesのプロトタイプにあるプロパティはオーバーライドとして扱わない', () => {
    const instance = { a: 1 };
    const proxy = createOverrideProxy(instance, {});
    expect(proxy.valueOf()).toBe(instance);
    expect(proxy.toString()).toBe('[object Object]');
    expect(proxy.constructor).toBe(Object);
  });

  it('内部スロットを持つインスタンスのメソッドやゲッターを使える', () => {
    const map = new Map([[1, 'one']]);
    const proxy = createOverrideProxy(map, {
      get: (target) => (key: number) => `${target.get(key)}!`,
    });
    expect(proxy.get(1)).toBe('one!');
    expect(proxy.has(1)).toBe(true);
    expect(proxy.size).toBe(1);
    proxy.set(2, 'two');
    expect(map.get(2)).toBe('two');
  });

  it('プライベートフィールドを使うゲッター・セッター・メソッドを使える', () => {
    class Counter {
      #count = 0;
      get count() {
        return this.#count;
      }
      set count(value: number) {
        this.#count = value;
      }
      increment() {
        this.#count++;
      }
    }
    const counter = new Counter();
    const proxy = createOverrideProxy(counter, {});
    proxy.increment();
    proxy.count = proxy.count + 10;
    expect(counter.count).toBe(11);
  });

  it('メソッドは読むたびに同じ関数を返す', () => {
    const proxy = createOverrideProxy(new Map(), {});
    expect(proxy.get).toBe(proxy.get);
  });
});
