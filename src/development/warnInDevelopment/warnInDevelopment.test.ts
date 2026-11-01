import warnInDevelopment from './warnInDevelopment';

describe('warnInDevelopment', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warnSpy.mockRestore();
    vi.unstubAllEnvs();
  });

  it('開発時は console.warn に値を渡す', () => {
    vi.stubEnv('NODE_ENV', 'development');
    warnInDevelopment('a', 1);
    expect(warnSpy).toHaveBeenCalledWith('a', 1);
  });

  it('NODE_ENV が production なら何もしない', () => {
    vi.stubEnv('NODE_ENV', 'production');
    warnInDevelopment('a');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('process が無い環境では警告する', () => {
    vi.stubGlobal('process', undefined);
    try {
      warnInDevelopment('a');
    } finally {
      vi.unstubAllGlobals();
    }
    expect(warnSpy).toHaveBeenCalledWith('a');
  });
});
