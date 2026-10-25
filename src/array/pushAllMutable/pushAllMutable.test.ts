import pushAllMutable from './pushAllMutable';

describe('pushAllMutable', () => {
  it('全要素を追加する', () => {
    const target = [1, 2];
    pushAllMutable(target, [3, 4, 5]);
    expect(target).toEqual([1, 2, 3, 4, 5]);
  });

  it('空配列を追加しても変化しない', () => {
    const target = [1, 2];
    pushAllMutable(target, []);
    expect(target).toEqual([1, 2]);
  });

  it('空配列に追加する', () => {
    const target: number[] = [];
    pushAllMutable(target, [1, 2, 3]);
    expect(target).toEqual([1, 2, 3]);
  });

  it('元の配列を破壊的に変更する', () => {
    const target = [1, 2];
    const result = pushAllMutable(target, [3, 4]);
    expect(result).toBe(target);
  });

  it('sourceがnullの場合は変更しない', () => {
    const result = pushAllMutable([1, 2], null);
    expect(result).toEqual([1, 2]);
  });
  it('要素数が多い配列も追加できる', () => {
    const result = pushAllMutable([1], new Array(300000).fill(0));
    expect(result.length).toBe(300001);
  });

  it('追加する要素は readonly の配列を受け付ける', () => {
    const source: readonly number[] = [2, 3];
    expect(pushAllMutable([1], source)).toEqual([1, 2, 3]);
  });
});
