import type { PropertyPath } from '../parsePropertyPath';

/**
 * マッピングの定義
 * - パスで取り出すルール — `to` を省略した場合は `from` と同じパスに設定する
 * - 関数で取り出すルール — `to` は必須
 */
export type TransformObjectRule<S extends object, T extends object> =
  | {
      /**
       * 取得元のパス
       */
      from: PropertyPath;

      /**
       * 設定先のパスまたは値を設定する関数。省略時は from と同じパス
       */
      to?: TransformObjectTarget<T>;

      /**
       * 抽出後に元のオブジェクト（source）から削除するかどうか（sourceを直接変更する）
       * 削除はすべてのルールで値を取り出した後に行う
       * 未指定の場合はオプションのremoveFromSourceに従う
       */
      removeFromSource?: boolean;
    }
  | {
      /**
       * 値を抽出する関数
       */
      from: (source: S) => unknown;

      /**
       * 設定先のパスまたは値を設定する関数
       */
      to: TransformObjectTarget<T>;

      /**
       * 関数で取り出すルールでは削除しない
       * （union の過剰プロパティチェックでは弾かれないため、明示的に禁止する）
       */
      removeFromSource?: never;
    };

/**
 * 設定先のパス、または値を設定したオブジェクトを返す関数
 */
type TransformObjectTarget<T extends object> =
  | PropertyPath
  | ((target: T, value: unknown) => T);

/**
 * オプション設定
 */
export type TransformObjectOptions = {
  /**
   * パスで指定したルールについて、抽出後に元のオブジェクト（source）から削除するか（sourceを直接変更する）
   * 削除はすべてのルールで値を取り出した後に行う
   * ルールでremoveFromSourceを指定した場合はルールの指定が優先される
   * @default false
   */
  removeFromSource?: boolean;
};
