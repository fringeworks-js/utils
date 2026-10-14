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

  it('自身の列挙可能なsymbolのキーも処理する', () => {
    const symbol = Symbol('s');
    const hidden = Symbol('hidden');
    const target = { a: 1, [symbol]: 2 };
    Object.defineProperty(target, hidden, { value: 3, enumerable: false });
    const keys: (string | symbol)[] = [];
    forEachValue(target, (_value, key) => {
      keys.push(key);
    });
    expect(keys).toEqual(['a', symbol]);
  });

  it('symbolのキーの処理中にfalseを返すと中断する', () => {
    const target = { a: 1, [Symbol('s')]: 2, [Symbol('t')]: 3 };
    const calls: unknown[] = [];
    const result = forEachValue(target, (value) => {
      calls.push(value);
      return value !== 2;
    });
    expect(result).toBe(false);
    expect(calls).toEqual([1, 2]);
  });
});
