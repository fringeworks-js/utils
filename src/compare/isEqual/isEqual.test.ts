import isEqual from './isEqual';

describe('isEqual', () => {
  describe('strict (デフォルト)', () => {
    it('厳密に等しい', () => {
      expect(isEqual(1, 1)).toBe(true);
    });

    it('型が異なる場合はfalse', () => {
      expect(isEqual(1, '1')).toBe(false);
    });

    it('nullとundefinedはfalse', () => {
      expect(isEqual(null, undefined)).toBe(false);
    });
  });

  describe('loose', () => {
    it('緩い比較', () => {
      expect(isEqual(1, '1', { mode: 'loose' })).toBe(true);
    });

    it('nullとundefinedはtrue', () => {
      expect(isEqual(null, undefined, { mode: 'loose' })).toBe(true);
    });
  });

  describe('deep', () => {
    it('オブジェクトの深い比較', () => {
      expect(
        isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }, { mode: 'deep' }),
      ).toBe(true);
    });

    it('配列の深い比較', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3], { mode: 'deep' })).toBe(true);
    });

    it('参照が異なるが内容が同じオブジェクト', () => {
      const a = { x: 1 };
      const b = { x: 1 };
      expect(isEqual(a, b, { mode: 'deep' })).toBe(true);
    });

    it('内容が異なる場合はfalse', () => {
      expect(isEqual({ a: 1 }, { a: 2 }, { mode: 'deep' })).toBe(false);
    });
  });

  describe('customizer', () => {
    it('カスタム比較関数', () => {
      const customizer = (a: unknown, b: unknown) => {
        if (typeof a === 'string' && typeof b === 'string') {
          return a.toLowerCase() === b.toLowerCase();
        }
        return undefined;
      };
      expect(isEqual('Hello', 'hello', { customizer })).toBe(true);
    });

    it('customizerがundefinedを返した場合はデフォルトの厳密比較', () => {
      const customizer = () => undefined;
      expect(isEqual(1, 1, { customizer })).toBe(true);
      expect(isEqual(1, 2, { customizer })).toBe(false);
    });
  });

  describe('loose + customizer', () => {
    it('customizerがundefinedを返した場合は緩い比較にフォールバック', () => {
      expect(
        isEqual(1, '1', { mode: 'loose', customizer: () => undefined }),
      ).toBe(true);
    });

    it('customizerが値を返した場合はそれを使う', () => {
      expect(isEqual(1, '1', { mode: 'loose', customizer: () => false })).toBe(
        false,
      );
    });
  });

  describe('deep + customizer', () => {
    it('customizerでネストされた値の比較をカスタマイズ', () => {
      const customizer = (a: unknown, b: unknown) => {
        if (typeof a === 'string' && typeof b === 'string') {
          return a.toLowerCase() === b.toLowerCase();
        }
        return undefined;
      };
      expect(
        isEqual({ a: 'Hello' }, { a: 'hello' }, { mode: 'deep', customizer }),
      ).toBe(true);
    });
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(isEqual.dataLast(1)(1)).toBe(true);
    });
  });
});
