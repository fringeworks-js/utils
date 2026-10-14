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
      id: 'id',
      dependencies: 'deps',
      tree: true,
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
      id: 'id',
      dependencies: 'deps',
      dependencyId: (dep) => dep,
      ignoreMissing: true,
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

  it('nullを渡した場合は空配列を返す', () => {
    expect(sortDependencies(null)).toEqual([]);
  });

  it('共有依存ノードがある場合でも正しくソートされる', () => {
    const data = [
      { id: 'A', deps: ['C'] },
      { id: 'B', deps: ['C'] },
      { id: 'C', deps: [] },
    ];
    const result = sortDependencies(data, {
      id: 'id',
      dependencies: 'deps',
      dependencyId: (dep) => dep,
      ignoreMissing: true,
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
        id: 'id',
        dependencies: 'deps',
        dependencyId: (dep) => dep,
        ignoreMissing: true,
      }),
    ).toThrow('Cyclic dependency');
  });

  it('存在しない依存先がある場合はエラーをスロー', () => {
    const data = [{ id: 'A', deps: ['B'] }];
    expect(() =>
      sortDependencies(data, {
        id: 'id',
        dependencies: 'deps',
        dependencyId: (dep) => dep,
      }),
    ).toThrow('No substance');
  });

  it('reverse: trueで逆順に並ぶ', () => {
    const data = [
      { id: 'A', deps: [] },
      { id: 'B', deps: ['A'] },
    ];
    const result = sortDependencies(data, {
      id: 'id',
      dependencies: 'deps',
      dependencyId: (dep) => dep,
      ignoreMissing: true,
      reverse: true,
    });
    expect(result.map((item) => item.id)).toEqual(['B', 'A']);
  });

  it('idが関数の場合も動作する', () => {
    const data = [
      { id: 'A', deps: [] },
      { id: 'B', deps: ['A'] },
    ];
    const result = sortDependencies(data, {
      id: (item) => item.id,
      dependencies: 'deps',
      dependencyId: (dep) => dep,
      ignoreMissing: true,
    });
    expect(result.map((item) => item.id)).toEqual(['A', 'B']);
  });

  it('dependenciesが関数の場合も動作する', () => {
    const data = [
      { id: 'A', deps: [] },
      { id: 'B', deps: ['A'] },
    ];
    const result = sortDependencies(data, {
      id: 'id',
      dependencies: (item: any) => item.deps,
      dependencyId: (dep: any) => dep,
      ignoreMissing: true,
    });
    expect(result.map((item) => item.id)).toEqual(['A', 'B']);
  });
  it('デフォルトのタプル形式で依存先をIDで持てる', () => {
    const result = sortDependencies([
      ['foo', ['bar']],
      ['bar', []],
    ]);
    expect(result).toEqual([
      ['bar', []],
      ['foo', ['bar']],
    ]);
  });

  it('デフォルトのタプル形式で依存先を要素で持てる', () => {
    const c = ['c', []];
    const b = ['b', [c]];
    const a = ['a', [b, c]];
    expect(sortDependencies([a, b, c])).toEqual([c, b, a]);
  });

  it('要素が数値1つの場合もそのまま返す', () => {
    const result = sortDependencies([3], {
      id: (item) => item,
      dependencies: () => [],
    });
    expect(result).toEqual([3]);
  });

  it('ツリー形式で共有されたノードは1度だけたどる', () => {
    type Node = { id: string; deps: Node[] };
    let node: Node = { id: 'n0', deps: [] };
    for (let i = 1; i <= 30; i++) {
      node = { id: `n${i}`, deps: [node, node] };
    }
    const result = sortDependencies([node], {
      id: 'id',
      dependencies: 'deps',
      tree: true,
    });
    expect(result.map((item) => item.id)).toEqual(
      Array.from({ length: 31 }, (_, i) => `n${i}`),
    );
  });

  it('ツリー形式で循環がある場合はエラーをスロー', () => {
    type Node = { id: string; deps: Node[] };
    const a: Node = { id: 'a', deps: [] };
    const b: Node = { id: 'b', deps: [a] };
    a.deps.push(b);
    expect(() =>
      sortDependencies([a], { id: 'id', dependencies: 'deps', tree: true }),
    ).toThrow('Cyclic dependency');
  });
});
