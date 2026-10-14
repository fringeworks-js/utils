import isEqualWith from './isEqualWith';

describe('isEqualWith', () => {
  describe('プリミティブ', () => {
    it('同じプリミティブはtrue', () => {
      const customizer = () => undefined;
      expect(isEqualWith(1, 1, customizer)).toBe(true);
      expect(isEqualWith('a', 'a', customizer)).toBe(true);
      expect(isEqualWith(true, true, customizer)).toBe(true);
    });

    it('異なるプリミティブはfalse', () => {
      const customizer = () => undefined;
      expect(isEqualWith(1, 2, customizer)).toBe(false);
      expect(isEqualWith('a', 'b', customizer)).toBe(false);
    });
  });

  describe('配列', () => {
    it('同じ配列はtrue', () => {
      expect(isEqualWith([1, 2, 3], [1, 2, 3], () => undefined)).toBe(true);
    });

    it('長さが異なる配列はfalse', () => {
      expect(isEqualWith([1, 2], [1, 2, 3], () => undefined)).toBe(false);
    });

    it('要素が異なる配列はfalse', () => {
      expect(isEqualWith([1, 2, 3], [1, 2, 4], () => undefined)).toBe(false);
    });
  });

  describe('オブジェクト', () => {
    it('同じオブジェクトはtrue', () => {
      expect(isEqualWith({ a: 1, b: 2 }, { a: 1, b: 2 }, () => undefined)).toBe(
        true,
      );
    });

    it('キーが異なるオブジェクトはfalse', () => {
      expect(isEqualWith({ a: 1 }, { a: 1, b: 2 }, () => undefined)).toBe(
        false,
      );
    });

    it('値が異なるオブジェクトはfalse', () => {
      expect(isEqualWith({ a: 1 }, { a: 2 }, () => undefined)).toBe(false);
    });

    it('片方にしかないキーはfalse', () => {
      expect(isEqualWith({ a: 1, b: 2 }, { a: 1, c: 2 }, () => undefined)).toBe(
        false,
      );
    });
  });

  describe('Date', () => {
    it('同じ日時はtrue', () => {
      const d1 = new Date('2024-01-01');
      const d2 = new Date('2024-01-01');
      expect(isEqualWith(d1, d2, () => undefined)).toBe(true);
    });

    it('異なる日時はfalse', () => {
      const d1 = new Date('2024-01-01');
      const d2 = new Date('2024-01-02');
      expect(isEqualWith(d1, d2, () => undefined)).toBe(false);
    });
  });

  describe('customizer', () => {
    it('customizerが結果を返した場合はそれを使う', () => {
      const customizer = (a: unknown, b: unknown) => {
        if (typeof a === 'string' && typeof b === 'string') {
          return a.toLowerCase() === b.toLowerCase();
        }
        return undefined;
      };
      expect(isEqualWith('Hello', 'hello', customizer)).toBe(true);
      expect(isEqualWith('Hello', 'world', customizer)).toBe(false);
    });

    it('customizerがundefinedを返した場合はデフォルト比較', () => {
      expect(isEqualWith(42, 42, () => undefined)).toBe(true);
    });

    it('ネストされたオブジェクトでもcustomizerが呼ばれる', () => {
      const calls: unknown[] = [];
      const customizer = (a: unknown) => {
        calls.push(a);
        return undefined;
      };
      isEqualWith({ a: { b: 1 } }, { a: { b: 1 } }, customizer);
      expect(calls.length).toBeGreaterThan(1);
    });
  });

  it('異なるプリミティブ型はfalse', () => {
    expect(isEqualWith(1, '1', () => undefined)).toBe(false);
  });

  describe('型・プロトタイプの違い', () => {
    const customizer = () => undefined;
    it('配列と配列風のオブジェクトはfalse', () => {
      expect(isEqualWith([1], { 0: 1 }, customizer)).toBe(false);
    });
    it('Dateとオブジェクトはfalse', () => {
      expect(isEqualWith(new Date(0), {}, customizer)).toBe(false);
    });
    it('プロトタイプが異なるオブジェクトはfalse', () => {
      class A {
        x = 1;
      }
      class B {
        x = 1;
      }
      expect(isEqualWith(new A(), new B(), customizer)).toBe(false);
      expect(isEqualWith(new A(), new A(), customizer)).toBe(true);
    });
    it('nullプロトタイプとプレーンなオブジェクトは同じとみなす', () => {
      const obj = Object.assign(Object.create(null), { a: 1 });
      expect(isEqualWith(obj, { a: 1 }, customizer)).toBe(true);
    });
  });

  describe('RegExp', () => {
    it('パターンとフラグで比較する', () => {
      expect(isEqualWith(/a/g, /a/g, () => undefined)).toBe(true);
      expect(isEqualWith(/a/, /b/, () => undefined)).toBe(false);
      expect(isEqualWith(/a/, /a/i, () => undefined)).toBe(false);
    });
  });

  describe('特殊な数値', () => {
    it('NaN同士はtrue', () => {
      expect(isEqualWith(NaN, NaN, () => undefined)).toBe(true);
    });
    it('0と-0はtrue', () => {
      expect(isEqualWith(0, -0, () => undefined)).toBe(true);
    });
  });

  describe('循環参照', () => {
    it('同じ構造の循環参照はtrue', () => {
      const a: Record<string, unknown> = { x: 1 };
      a['self'] = a;
      const b: Record<string, unknown> = { x: 1 };
      b['self'] = b;
      expect(isEqualWith(a, b, () => undefined)).toBe(true);
    });
    it('循環参照以外の値が異なる場合はfalse', () => {
      const a: Record<string, unknown> = { x: 1 };
      a['self'] = a;
      const b: Record<string, unknown> = { x: 2 };
      b['self'] = b;
      expect(isEqualWith(a, b, () => undefined)).toBe(false);
    });
  });

  it('customizerに添字・キーと親が渡される', () => {
    const calls: unknown[][] = [];
    const value = { a: [1] };
    const other = { a: [1] };
    isEqualWith(value, other, (...args) => {
      calls.push(args);
      return undefined;
    });
    expect(calls).toEqual([
      [value, other, undefined, undefined, undefined],
      [value.a, other.a, 'a', value, other],
      [1, 1, 0, value.a, other.a],
    ]);
  });

  it('Mapのキーは型を問わずそのままcustomizerに渡される', () => {
    const key = { id: 1 };
    const keys: unknown[] = [];
    isEqualWith(new Map([[key, 1]]), new Map([[key, 1]]), (_v1, _v2, k) => {
      keys.push(k);
      return undefined;
    });
    expect(keys).toEqual([undefined, key]);
  });

  describe('Map・Set', () => {
    const customizer = () => undefined;
    it('同じ内容のMapはtrue', () => {
      expect(
        isEqualWith(
          new Map([['a', { x: 1 }]]),
          new Map([['a', { x: 1 }]]),
          customizer,
        ),
      ).toBe(true);
    });
    it('内容が異なるMapはfalse', () => {
      expect(isEqualWith(new Map([[1, 2]]), new Map(), customizer)).toBe(false);
      expect(
        isEqualWith(new Map([[1, 2]]), new Map([[1, 3]]), customizer),
      ).toBe(false);
      expect(
        isEqualWith(new Map([[1, 2]]), new Map([[2, 2]]), customizer),
      ).toBe(false);
    });
    it('構造が同じ要素を持つSetはtrue', () => {
      expect(
        isEqualWith(new Set([{ a: 1 }]), new Set([{ a: 1 }]), customizer),
      ).toBe(true);
      expect(
        isEqualWith(
          new Set([{ a: 1 }, { a: 1 }]),
          new Set([{ a: 1 }, { a: 2 }]),
          customizer,
        ),
      ).toBe(false);
    });
    it('同じ要素のSetはtrue', () => {
      expect(isEqualWith(new Set([1, 2]), new Set([2, 1]), customizer)).toBe(
        true,
      );
    });
    it('要素が異なるSetはfalse', () => {
      expect(isEqualWith(new Set([1]), new Set(), customizer)).toBe(false);
      expect(isEqualWith(new Set([1]), new Set([2]), customizer)).toBe(false);
    });
    it('MapとMap以外はfalse', () => {
      expect(isEqualWith(new Map(), {}, customizer)).toBe(false);
      expect(isEqualWith(new Set(), {}, customizer)).toBe(false);
    });
  });
});
