import { rotateArray } from '../../array/rotateArray';
import { measure } from '../measure';
import _tabulateResult from './_tabulateResult';
import type {
  ComparePerformanceOptions,
  ComparePerformanceResult,
  ElapsedTimes,
} from './types';

/**
 * 任意の関数の実行時間を測定し比較する
 * @param agenda
 * @returns
 */
export default function comparePerformance<
  A extends unknown[] = unknown[],
  R = unknown,
>(agenda: ComparePerformanceOptions<A>): ComparePerformanceResult<A, R> {
  // 開始日時
  const start = new Date();
  const {
    id = String(start.getTime()),
    targets,
    args,
    getArgs,
    iterations = 10,
    rounds = 10,
    warmUp,
  } = agenda;
  // measure関数の引数
  const opts = { args, getArgs, iterations };
  // 各測定回の結果
  const results: ElapsedTimes[] = [];
  // 各測定対象の戻り値
  const returnValues = {};

  if (warmUp) {
    // ウォーミングアップ
    const warmingUpOpts = { ...opts, iterations: 1 };
    for (const target of targets) {
      measure(target.fn, warmingUpOpts);
    }
  }

  // 測定する順番を変えながら測定を行う
  let processingOrder = targets;
  for (let i = 0; i < rounds; i++) {
    // 指定回数分測定する
    // このループ1回分が測定結果を一覧にした際の1行分
    const result = {};
    for (const target of processingOrder) {
      // 計測
      const { time, returnValue } = measure(target.fn, opts);
      const targetId = target.id;

      // 計測結果
      result[targetId] = time;
      // 戻り値
      returnValues[targetId] = returnValue;
    }
    // 1回分の測定結果
    results.push(result);
    // 測定する順番を入れ替え
    processingOrder = rotateArray(processingOrder);
  }

  // 平均値の計算を行う
  const averageResult = _tabulateResult(targets, results);
  // 終了日時
  const end = new Date();

  // 測定結果を返す
  return {
    id,
    results,
    returnValues,
    start,
    end,
    ...averageResult,
  };
}
