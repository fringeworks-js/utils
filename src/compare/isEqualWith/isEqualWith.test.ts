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

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(isEqualWith.dataLast(1, () => undefined)(1)).toBe(true);
    });
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
