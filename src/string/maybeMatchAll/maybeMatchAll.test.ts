import maybeMatchAll from './maybeMatchAll';

describe('maybeMatchAll', () => {
  it('マッチした結果を返す', () => {
    const result = maybeMatchAll('hello world hello', /hello/g);
    expect([...result]).toHaveLength(2);
  });

  it('nullを渡した場合は空のイテレーターを返す', () => {
    const result = maybeMatchAll(null, /pattern/g);
    expect([...result]).toHaveLength(0);
  });

  it('undefinedを渡した場合は空のイテレーターを返す', () => {
    const result = maybeMatchAll(undefined, /pattern/g);
    expect([...result]).toHaveLength(0);
  });

  it('マッチしない場合は空のイテレーターを返す', () => {
    const result = maybeMatchAll('hello', /xyz/g);
    expect([...result]).toHaveLength(0);
  });

  it('キャプチャグループを含むマッチ', () => {
    const result = [...maybeMatchAll('2024-01-15', /(\d{4})-(\d{2})-(\d{2})/g)];
    expect(result[0]?.[1]).toBe('2024');
    expect(result[0]?.[2]).toBe('01');
    expect(result[0]?.[3]).toBe('15');
  });
});
