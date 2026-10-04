import sortDependencies from './sortDependencies';

const ID_1A = '1a';
const ID_1A_2A = '1a_2a';
const ID_1A_2A_3A = '1a_2a_3a';
const ID_1A_2B = '1a_2b';
const ID_1A_2B_3A = '1a_2a_3b';
const ID_1B = '1b';
const ID_1B_2A = '1b_2a';
const ID_1B_2A_3A = '1b_2a_3a';
const ID_1B_2B = '1b_2b';
const ID_1B_2B_3A = '1b_2a_3b';

const NODE_1A = { id: ID_1A };
const NODE_1A_2A = { id: ID_1A_2A };
const NODE_1A_2A_3A = { id: ID_1A_2A_3A };
const NODE_1A_2B = { id: ID_1A_2B };
const NODE_1A_2B_3A = { id: ID_1A_2B_3A };
const NODE_1B = { id: ID_1B };
const NODE_1B_2A = { id: ID_1B_2A };
const NODE_1B_2A_3A = { id: ID_1B_2A_3A };
const NODE_1B_2B = { id: ID_1B_2B };
const NODE_1B_2B_3A = { id: ID_1B_2B_3A };

const TREE_1 = [
  {
    ...NODE_1A,
    deps: [
      {
        ...NODE_1A_2A,
        deps: [NODE_1A_2A_3A],
      },
      {
        ...NODE_1A_2B,
        deps: [NODE_1A_2B_3A],
      },
    ],
  },
  {
    ...NODE_1B,
    deps: [
      { ...NODE_1B_2A, deps: [NODE_1B_2A_3A] },
      { ...NODE_1B_2B, deps: [NODE_1B_2B_3A] },
    ],
  },
];

const FLAT_1 = [
  { ...NODE_1A, deps: [ID_1A_2A, ID_1A_2B] },
  { ...NODE_1A_2A, deps: [ID_1A_2A_3A] },
  { ...NODE_1A_2B, deps: [ID_1A_2B_3A] },
  { ...NODE_1B, deps: [ID_1B_2A, ID_1B_2B] },
  { ...NODE_1B_2A, deps: [ID_1B_2A_3A] },
  { ...NODE_1B_2B, deps: [ID_1B_2B_3A] },
];

describe('sortDependencies', () => {
  it('ツリー形式', () => {
    const result = sortDependencies(TREE_1, {
      idProp: 'id',
      depsProp: 'deps',
      isTree: true,
    });
    expect(result.map((item) => item.id)).toEqual([
      ID_1A_2A_3A,
      ID_1A_2A,
      ID_1A_2B_3A,
      ID_1A_2B,
      ID_1A,
      ID_1B_2A_3A,
      ID_1B_2A,
      ID_1B_2B_3A,
      ID_1B_2B,
      ID_1B,
    ]);
  });

  it('フラット形式', () => {
    const result = sortDependencies(FLAT_1, {
      idProp: 'id',
      depsProp: 'deps',
      depsIdProp: (dep) => dep,
      ignoreNoSubstance: true,
    });
    expect(result.map((item) => item.id)).toEqual([
      ID_1A_2A,
      ID_1A_2B,
      ID_1A,
      ID_1B_2A,
      ID_1B_2B,
      ID_1B,
    ]);
  });

  it('nullを渡した場合はそのまま返す', () => {
    expect(sortDependencies(null)).toBeNull();
  });

  it('共有依存ノードがある場合でも正しくソートされる', () => {
    const data = [
      { id: 'A', deps: ['C'] },
      { id: 'B', deps: ['C'] },
      { id: 'C', deps: [] },
    ];
    const result = sortDependencies(data, {
      idProp: 'id',
      depsProp: 'deps',
      depsIdProp: (dep) => dep,
      ignoreNoSubstance: true,
    });
    expect(result.map((item) => item.id)).toEqual(['C', 'A', 'B']);
  });

  it('循環依存がある場合はエラーをスロー', () => {
    const data = [
      { id: 'A', deps: ['B'] },
      { id: 'B', deps: ['A'] },
    ];
    expect(() =>
      sortDependencies(data, {
        idProp: 'id',
        depsProp: 'deps',
        depsIdProp: (dep) => dep,
        ignoreNoSubstance: true,
      }),
    ).toThrow('Cyclic dependency');
  });

  it('存在しない依存先がある場合はエラーをスロー', () => {
    const data = [{ id: 'A', deps: ['B'] }];
    expect(() =>
      sortDependencies(data, {
        idProp: 'id',
        depsProp: 'deps',
        depsIdProp: (dep) => dep,
      }),
    ).toThrow('No substance');
  });

  it('desc: trueで逆順に並ぶ', () => {
    const data = [
      { id: 'A', deps: [] },
      { id: 'B', deps: ['A'] },
    ];
    const result = sortDependencies(data, {
      idProp: 'id',
      depsProp: 'deps',
      depsIdProp: (dep) => dep,
      ignoreNoSubstance: true,
      desc: true,
    });
    expect(result.map((item) => item.id)).toEqual(['B', 'A']);
  });

  it('idPropが関数の場合も動作する', () => {
    const data = [
      { id: 'A', deps: [] },
      { id: 'B', deps: ['A'] },
    ];
    const result = sortDependencies(data, {
      idProp: (item) => item.id,
      depsProp: 'deps',
      depsIdProp: (dep) => dep,
      ignoreNoSubstance: true,
    });
    expect(result.map((item) => item.id)).toEqual(['A', 'B']);
  });

  it('depsPropが関数の場合も動作する', () => {
    const data = [
      { id: 'A', deps: [] },
      { id: 'B', deps: ['A'] },
    ];
    const result = sortDependencies(data, {
      idProp: 'id',
      depsProp: (item: any) => item.deps,
      depsIdProp: (dep: any) => dep,
      ignoreNoSubstance: true,
    });
    expect(result.map((item) => item.id)).toEqual(['A', 'B']);
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = sortDependencies.dataLast<(typeof TREE_1)[number]>({
        idProp: 'id',
        depsProp: 'deps',
        isTree: true,
      })(TREE_1);
      expect(result.map((item) => item.id)).toEqual([
        ID_1A_2A_3A,
        ID_1A_2A,
        ID_1A_2B_3A,
        ID_1A_2B,
        ID_1A,
        ID_1B_2A_3A,
        ID_1B_2A,
        ID_1B_2B_3A,
        ID_1B_2B,
        ID_1B,
      ]);
    });
  });
});
