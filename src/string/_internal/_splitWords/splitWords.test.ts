import splitWords from './splitWords';

describe('splitWords', () => {
  it.each([
    ['hello world', ['hello', 'world']],
    ['hello_world', ['hello', 'world']],
    ['hello-world', ['hello', 'world']],
    ['hello.world', ['hello', 'world']],
    ['helloWorld', ['hello', 'World']],
    ['HelloWorld', ['Hello', 'World']],
    ['HELLO_WORLD', ['HELLO', 'WORLD']],
  ])('%s', (input, expected) => {
    expect(splitWords(input)).toEqual(expected);
  });

  it('英字・数字以外の文字はすべて区切りとして扱う', () => {
    expect(splitWords('user/profile:page@v2')).toEqual([
      'user',
      'profile',
      'page',
      'v2',
    ]);
  });

  it('先頭・末尾の区切りは除く', () => {
    expect(splitWords('__private__')).toEqual(['private']);
    expect(splitWords('--main-color')).toEqual(['main', 'color']);
  });

  it('連続する区切りは1つとして扱う', () => {
    expect(splitWords('a  _-b')).toEqual(['a', 'b']);
  });

  it('引用符は区切らずに取り除く', () => {
    expect(splitWords("don't stop")).toEqual(['dont', 'stop']);
    expect(splitWords('don\u2019t')).toEqual(['dont']);
  });

  it('略語は小文字が続く最後の1文字の前で区切る', () => {
    expect(splitWords('XMLParser')).toEqual(['XML', 'Parser']);
    expect(splitWords('XMLHttpRequest')).toEqual(['XML', 'Http', 'Request']);
    expect(splitWords('parseXML')).toEqual(['parse', 'XML']);
  });

  it('英字の後の数字の前では区切らない', () => {
    expect(splitWords('i18n')).toEqual(['i18n']);
    expect(splitWords('utf8')).toEqual(['utf8']);
    expect(splitWords('h1')).toEqual(['h1']);
  });

  it('数字の後の大文字の前で区切る', () => {
    expect(splitWords('base64Encode')).toEqual(['base64', 'Encode']);
    expect(splitWords('version2Beta')).toEqual(['version2', 'Beta']);
    expect(splitWords('HTML5Parser')).toEqual(['HTML5', 'Parser']);
  });

  it('大文字・小文字の無い文字は区切らない', () => {
    expect(splitWords('日本語 テキスト')).toEqual(['日本語', 'テキスト']);
    expect(splitWords('helloワールド')).toEqual(['helloワールド']);
  });

  it('結合文字は単語の一部として扱う', () => {
    expect(splitWords('cafe\u0301 au lait')).toEqual([
      'cafe\u0301',
      'au',
      'lait',
    ]);
  });

  it('区切りしか無い場合や空文字は空配列を返す', () => {
    expect(splitWords('')).toEqual([]);
    expect(splitWords(' _-. ')).toEqual([]);
  });
});
