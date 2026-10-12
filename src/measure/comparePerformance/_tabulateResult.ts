import type {
  ComparePerformanceResult,
  ComparePerformanceTarget,
  ElapsedTimes,
} from './types';

/**
 * 測定結果を集計する
 * @param targets 測定対象
 * @param rounds 測定回数
 * @param total 測定結果の合計
 * @returns
 */
export default function _tabulateResult<
  A extends Array<unknown> = Array<unknown>,
>(
  targets: ComparePerformanceTarget<A>[],
  results: ElapsedTimes[],
): Pick<ComparePerformanceResult<A>, 'average' | 'totalAverage' | 'order'> {
  // 平均値の計算を行う
  // 各測定対象毎の平均値
  const rounds = results.length;
  // 各測定対象の処理時間の合計
  const total = results.reduce<ElapsedTimes>((ttl, result) => {
    for (const [targetId, time] of Object.entries(result)) {
      ttl[targetId] = (ttl[targetId] || 0) + time;
    }
    return ttl;
  }, {});
  const average: ElapsedTimes = {};

  // 各測定対象の平均の合計
  for (const target of targets) {
    const targetId = target.id;
    // 測定対象毎の平均
    average[targetId] = (total[targetId] ?? 0) / rounds;
  }

  // 全体の平均(全測定結果の合計 / (測定対象数 * 測定回数))
  const totalAverage =
    Object.values(total).reduce((sum, value) => sum + value, 0) /
    (targets.length * rounds);
  // 順位
  const order = Object.entries(average)
    .sort((a, b) => a[1] - b[1])
    .map(([id]) =>
      targets.find((target) => target.id === id),
    ) as ComparePerformanceTarget<A>[];

  // 測定結果を返す
  return {
    average,
    totalAverage,
    order,
  };
}
