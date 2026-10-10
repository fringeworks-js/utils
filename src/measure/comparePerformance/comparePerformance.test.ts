import comparePerformance from './comparePerformance';

describe('comparePerformance', () => {
  it('複数関数の実行時間を比較してresultsとreturnValuesを返す', () => {
    const result = comparePerformance({
      targets: [
        { id: 'fn1', fn: () => 1 },
        { id: 'fn2', fn: () => 2 },
      ],
      rounds: 2,
      iterations: 2,
    });
    expect(result.results).toHaveLength(2);
    expect(result.returnValues['fn1']).toBe(1);
    expect(result.returnValues['fn2']).toBe(2);
    expect(result.start).toBeInstanceOf(Date);
    expect(result.end).toBeInstanceOf(Date);
  });

  it('idを省略するとstart時刻のgetTimeが使われる', () => {
    const result = comparePerformance({
      targets: [{ id: 'fn', fn: () => 0 }],
      rounds: 1,
    });
    expect(typeof result.id).toBe('string');
  });

  it('warmUpを有効にしてもresultsが返る', () => {
    const result = comparePerformance({
      targets: [{ id: 'fn', fn: () => 0 }],
      rounds: 1,
      iterations: 1,
      warmUp: true,
    });
    expect(result.results).toHaveLength(1);
  });
});
