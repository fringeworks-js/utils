import maybeReplace from './maybeReplace';

describe('maybeReplace', () => {
  it('文字列パターンで置換', () => {
    expect(maybeReplace('hello world', 'world', 'there')).toBe('hello there');
  });

  it('文字列パターンは全て置換（replaceAll）', () => {
    expect(maybeReplace('aaa', 'a', 'b')).toBe('bbb');
  });

  it('正規表現で置換', () => {
    expect(maybeReplace('hello world', /world/, 'there')).toBe('hello there');
  });

  it('正規表現グローバルで複数置換', () => {
    expect(maybeReplace('aaa', /a/g, 'b')).toBe('bbb');
  });

  it('nullの場合はnullを返す', () => {
    expect(maybeReplace(null, 'a', 'b')).toBeNull();
  });

  it('undefinedの場合はundefinedを返す', () => {
    expect(maybeReplace(undefined, 'a', 'b')).toBeUndefined();
  });

  it('置換対象がない場合は元の文字列を返す', () => {
    expect(maybeReplace('hello', 'xyz', 'abc')).toBe('hello');
  });

  it('関数パターン', () => {
    const pattern = () => /hello/;
    expect(maybeReplace('hello world', pattern, 'hi')).toBe('hi world');
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      expect(maybeReplace.dataLast('world', 'there')('hello world')).toBe(
        'hello there',
      );
    });
  });
});
