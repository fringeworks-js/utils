import { describe, expect, it } from 'vitest';
import distribute from './distribute';

// ---------------------------------------------------------------------------
// テスト用フィクスチャ
// ---------------------------------------------------------------------------

type User = {
  id: number;
  name: string;
  age: number;
  role: string;
  email: string;
};

const user: User = {
  id: 1,
  name: 'Alice',
  age: 30,
  role: 'admin',
  email: 'alice@example.com',
};

describe('distribute', () => {
  // ---------------------------------------------------------------------------
  // DistributePropertyList
  // ---------------------------------------------------------------------------
  describe('rules: プロパティ名の配列 (DistributePropertyList)', () => {
    it('指定したプロパティが対象グループに含まれる', () => {
      const result = distribute(user, {
        identity: ['id', 'name'] as const,
      });

      expect(result.identity).toEqual({ id: 1, name: 'Alice' });
    });

    it('指定したプロパティが元のオブジェクトのキー/値と一致する', () => {
      const result = distribute(user, {
        contact: ['email'] as const,
      });

      expect(result.contact).toEqual({ email: 'alice@example.com' });
    });

    it('dataに存在しないプロパティを指定してもエラーにならず無視される', () => {
      const result = distribute(user, {
        // @ts-expect-error 存在しないプロパティを意図的に渡す
        group: ['nonExistent'] as const,
      });

      expect(result.group).toEqual({});
    });

    it('空配列を指定すると空オブジェクトになる', () => {
      const result = distribute(user, {
        empty: [] as const,
      });

      expect(result.empty).toEqual({});
    });

    it('指定したプロパティが元のオブジェクトに存在しない', () => {
      const result = distribute(user, {
        identity: ['id', 'name', 'none' as any] as const,
      });

      expect(result.identity).toEqual({ id: 1, name: 'Alice' });
    });
  });

  // ---------------------------------------------------------------------------
  // null（残余グループ）
  // ---------------------------------------------------------------------------

  describe('rules: null（残余グループ）', () => {
    it('他グループで分配されなかったプロパティが残余グループに入る', () => {
      const result = distribute(user, {
        identity: ['id', 'name'] as const,
        rest: null,
      });

      expect(result.identity).toEqual({ id: 1, name: 'Alice' });
      expect(result.rest).toEqual({
        age: 30,
        role: 'admin',
        email: 'alice@example.com',
      });
      expect(result.rest).not.toHaveProperty('id');
      expect(result.rest).not.toHaveProperty('name');
    });

    it('全プロパティが分配済みの場合、残余グループは空オブジェクトになる', () => {
      const result = distribute(user, {
        all: ['id', 'name', 'age', 'role', 'email'] as const,
        rest: null,
      });

      expect(result.rest).toEqual({});
    });

    it('何も分配しない場合、残余グループにはdataの全プロパティが入る', () => {
      const result = distribute(user, {
        rest: null,
      });

      expect(result.rest).toEqual(user);
    });

    it('nullグループが複数ある場合、それぞれに同じ残余が設定される', () => {
      const result = distribute(user, {
        identity: ['id'] as const,
        restA: null,
        restB: null,
      });

      const expectedRest = {
        name: 'Alice',
        age: 30,
        role: 'admin',
        email: 'alice@example.com',
      };
      expect(result.restA).toEqual(expectedRest);
      expect(result.restB).toEqual(expectedRest);
    });
  });

  // ---------------------------------------------------------------------------
  // 複数グループの組み合わせ
  // ---------------------------------------------------------------------------

  describe('複数グループの組み合わせ', () => {
    it('複数のグループとnullを同時に使用できる', () => {
      const result = distribute(user, {
        identity: ['id', 'name'] as const,
        meta: ['role'] as const,
        rest: null,
      });

      expect(result.identity).toEqual({ id: 1, name: 'Alice' });
      expect(result.meta).toEqual({ role: 'admin' });
      expect(result.rest).toEqual({ age: 30, email: 'alice@example.com' });
    });

    it('同一プロパティを複数グループで指定すると両グループに分配され、残余からは除外される', () => {
      const result = distribute(user, {
        groupA: ['id'] as const,
        groupB: ['id'] as const,
        rest: null,
      });

      // 指定した全グループに分配される
      expect(result.groupA).toEqual({ id: 1 });
      expect(result.groupB).toEqual({ id: 1 });
      // restからは除外される
      expect(result.rest).not.toHaveProperty('id');
    });
  });

  // ---------------------------------------------------------------------------
  // options.cloneValue
  // ---------------------------------------------------------------------------

  describe('options: cloneValue', () => {
    type WithNested = { meta: { score: number }; label: string };
    const nested: WithNested = { meta: { score: 42 }, label: 'test' };

    it('cloneValue=false（デフォルト）の場合、参照が共有される', () => {
      const result = distribute(nested, { group: ['meta'] as const });

      expect(result.group.meta).toBe(nested.meta);
    });

    it('cloneValue=true の場合、値が複製されて参照が切れる', () => {
      const result = distribute(
        nested,
        { group: ['meta'] as const },
        { cloneValue: true },
      );

      expect(result.group.meta).toEqual(nested.meta);
      expect(result.group.meta).not.toBe(nested.meta);
    });

    it('cloneValue=true で複製した値を変更しても元データに影響しない', () => {
      const result = distribute(
        nested,
        { group: ['meta'] as const },
        { cloneValue: true },
      );

      result.group.meta.score = 999;
      expect(nested.meta.score).toBe(42);
    });
  });

  // ---------------------------------------------------------------------------
  // options.includeInherited
  // ---------------------------------------------------------------------------

  describe('options: includeInherited', () => {
    const proto = { inherited: 'fromProto' };
    const child = Object.assign(Object.create(proto), { own: 'ownProp' }) as {
      inherited: string;
      own: string;
    };

    it('includeInherited=false（デフォルト）では継承プロパティは分配されない', () => {
      const result = distribute(child, {
        group: ['inherited', 'own'] as const,
      });

      expect(result.group).not.toHaveProperty('inherited');
      expect(result.group).toHaveProperty('own', 'ownProp');
    });

    it('includeInherited=true では継承プロパティも分配される', () => {
      const result = distribute(
        child,
        { group: ['inherited', 'own'] as const },
        { includeInherited: true },
      );

      expect(result.group).toEqual({ inherited: 'fromProto', own: 'ownProp' });
    });
  });

  // ---------------------------------------------------------------------------
  // エッジケース
  // ---------------------------------------------------------------------------

  describe('エッジケース', () => {
    it('空のdataを渡しても正常に動作する', () => {
      const result = distribute({}, { rest: null });

      expect(result.rest).toEqual({});
    });

    it('空のrulesを渡すと空オブジェクトが返る', () => {
      const result = distribute(user, {});

      expect(result).toEqual({});
    });

    it('値がundefinedのプロパティも分配対象になる', () => {
      const data = { id: 1, optional: undefined };
      const result = distribute(data, { group: ['optional'] as const });

      expect(result.group).toHaveProperty('optional', undefined);
    });

    it('値がnullのプロパティも分配対象になる', () => {
      const data = { id: 1, nullable: null };
      const result = distribute(data, { group: ['nullable'] as const });

      expect(result.group).toHaveProperty('nullable', null);
    });
  });

  describe('dataLast', () => {
    it('基本動作', () => {
      const result = distribute.dataLast({ identity: ['id', 'name'] as const })(user);
      expect(result.identity).toEqual({ id: 1, name: 'Alice' });
    });
  });
});
