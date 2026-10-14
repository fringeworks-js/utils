import isSurroundedBy from './isSurroundedBy';

describe('isSurroundedBy', () => {
  describe('prefix === suffix', () => {
    it('true', () => {
      const result = isSurroundedBy('"abc"', '"');
      expect(result).toBe(true);
    });
    it('false', () => {
      const result = isSurroundedBy('"abc"', "'");
      expect(result).toBe(false);
    });
  });
  describe('prefix !== suffix', () => {
    it('true', () => {
      const result = isSurroundedBy('{abc}', '{', '}');
      expect(result).toBe(true);
    });
    it('false', () => {
      const result = isSurroundedBy('[abc]', '{', '}');
      expect(result).toBe(false);
    });
  });

  it('prefixとsuffixの間が0文字の場合はtrue', () => {
    expect(isSurroundedBy('""', '"')).toBe(true);
    expect(isSurroundedBy('{{}}', '{{', '}}')).toBe(true);
  });

  it('prefixとsuffixが重なっている場合はfalse', () => {
    expect(isSurroundedBy('"', '"')).toBe(false);
    expect(isSurroundedBy('aba', 'ab', 'ba')).toBe(false);
  });

  it('空文字はfalse', () => {
    expect(isSurroundedBy('', '"')).toBe(false);
  });

  it('null・undefinedはfalse', () => {
    expect(isSurroundedBy(null as any, '"')).toBe(false);
    expect(isSurroundedBy(undefined as any, '"')).toBe(false);
  });
});
