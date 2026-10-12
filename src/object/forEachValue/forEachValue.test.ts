import forEachValue from './forEachValue';

describe('forEachValue', () => {
  it('各プロパティでコールバックが呼ばれる', () => {
    const calls: unknown[] = [];
    forEachValue({ a: 1, b: 2 }, (value) => {
      calls.push(value);
    });
    expect(calls).toEqual([1, 2]);
  });

  it('全て処理した場合はtrueを返す', () => {
    const result = forEachValue({ a: 1, b: 2 }, () => {});
    expect(result).toBe(true);
  });

  it('コールバックがfalseを返すと処理を中断してfalseを返す', () => {
    const calls: unknown[] = [];
    const result = forEachValue({ a: 1, b: 2, c: 3 }, (value) => {
      calls.push(value);
      return value !== 2;
    });
    expect(result).toBe(false);
    expect(calls).toEqual([1, 2]);
  });

  it('nullを渡した場合はtrueを返す', () => {
    expect(forEachValue(null as any, () => {})).toBe(true);
  });

  it('includeInherited: trueで継承プロパティも処理する', () => {
    const parent = { inherited: 'yes' };
    const child = Object.create(parent) as Record<string, unknown>;
    child['own'] = 'own';
    const calls: unknown[] = [];
    forEachValue(
      child,
      (value) => {
        calls.push(value);
      },
      { includeInherited: true },
    );
    expect(calls).toContain('yes');
    expect(calls).toContain('own');
  });

  it('デフォルトで継承プロパティは処理しない', () => {
    const parent = { inherited: 'yes' };
    const child = Object.create(parent) as Record<string, unknown>;
    child['own'] = 'own';
    const calls: unknown[] = [];
    forEachValue(child, (value) => {
      calls.push(value);
    });
    expect(calls).toEqual(['own']);
    expect(calls).not.toContain('yes');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const calls: unknown[] = [];
      forEachValue.dataLast((value) => {
        calls.push(value);
      })({ a: 1, b: 2 });
      expect(calls).toEqual([1, 2]);
    });
  });
});
