import replaceByMap from '../replaceByMap/replaceByMap';
import createReplacerByMap from './createReplacerByMap';

describe('createReplacerByMap', () => {
  it('replaceByMapと同じ規則で置き換える関数を作る', () => {
    const map = { ab: 'X', a: 'Y', hello: 'hi' };
    const replace = createReplacerByMap(map);
    for (const str of ['abcab', 'hello world', 'xyz']) {
      expect(replace(str)).toBe(replaceByMap(str, map));
    }
  });

  it('Mapやエントリーの配列も受け取る', () => {
    expect(createReplacerByMap(new Map([['a', 'b']]))('aa')).toBe('bb');
    expect(createReplacerByMap([['a', 'b']])('aa')).toBe('bb');
  });

  it('readonlyのMap・オブジェクト・エントリーの配列も受け取る', () => {
    const map: ReadonlyMap<string, string> = new Map([['a', 'b']]);
    expect(createReplacerByMap(map)('aa')).toBe('bb');
    expect(createReplacerByMap({ a: 'b' } as const)('aa')).toBe('bb');
    expect(createReplacerByMap([['a', 'b']] as const)('aa')).toBe('bb');
  });

  it('作成後にmapを変更しても反映しない', () => {
    const map = new Map([['a', 'b']]);
    const replace = createReplacerByMap(map);
    map.set('a', 'c');
    expect(replace('a')).toBe('b');
  });

  it('空文字はそのまま返す', () => {
    expect(createReplacerByMap({ a: 'b' })('')).toBe('');
  });

  it('null・undefinedはそのまま返す', () => {
    const replace = createReplacerByMap({ a: 'b' });
    expect(replace(null as any)).toBeNull();
    expect(replace(undefined as any)).toBeUndefined();
  });
});
