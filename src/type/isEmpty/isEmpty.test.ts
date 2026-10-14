import isEmpty from './isEmpty';

describe('isEmpty', () => {
  it.each([undefined, null, ''])('%o はtrue', (value) => {
    expect(isEmpty(value)).toBe(true);
  });

  it.each([' ', '\u3000', 'a', 0, false, NaN, [], {}, new Map()])(
    '%o はfalse',
    (value) => {
      expect(isEmpty(value)).toBe(false);
    },
  );
});
