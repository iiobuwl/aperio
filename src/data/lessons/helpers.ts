// 解説データを短く書くための小さな道具です(PHP / SQL 共通)。

import type { Cell, RowMark, Visual } from '../types'

/** 変数の箱: vars(['$a', '1'], ['$b', '2']) */
export const vars = (...v: [string, string][]): Visual => ({
  kind: 'vars',
  vars: v.map(([name, value]) => ({ name, value })),
})

/** 画面の出力: out('こんにちは', '120')。引数なしなら「まだ何も出ていない」 */
export const out = (...lines: string[]): Visual => ({ kind: 'output', lines })

/** 矢印の流れ: chain(['A', 'B', 'C'], [1]) → B だけ光る */
export const chain = (nodes: string[], active?: number[], label?: string): Visual => ({
  kind: 'chain',
  nodes,
  active,
  label,
})

/** 表: table('products', cols, rows, { marks: { 2: 'hot' }, hotCols: [1] }) */
export const table = (
  name: string,
  cols: string[],
  rows: Cell[][],
  opt: { marks?: Record<number, RowMark>; hotCols?: number[]; label?: string } = {},
): Visual => ({ kind: 'table', name, cols, rows, ...opt })

/** すべての行に同じ状態をつけた marks を作る: all(5, 'dim') */
export const all = (n: number, mark: RowMark): Record<number, RowMark> =>
  Object.fromEntries(Array.from({ length: n }, (_, i) => [i, mark]))
