// 解説ページの小さな図です。変数の箱・画面の出力・表・矢印の流れの4種類を描きます。
// どれも「データ(Visual)を渡すと描く」だけで、PHP / SQL の内容は知りません。
// key を固定しているので、ステップが変わると色や位置がなめらかに変わります。

import { Fragment } from 'react'
import type { Cell, Visual } from '../data/types'

export function LessonVisual({ visuals, stepKey }: { visuals: Visual[]; stepKey: number }) {
  return (
    <div className="vis">
      {visuals.map((v, i) => (
        <section key={i} className="vis-block">
          {v.label && <p className="vis-label">{v.label}</p>}
          {v.kind === 'vars' && <Vars vars={v.vars} stepKey={stepKey} />}
          {v.kind === 'output' && <Output lines={v.lines} stepKey={stepKey} />}
          {v.kind === 'table' && <Table v={v} />}
          {v.kind === 'chain' && <Chain nodes={v.nodes} active={v.active} stepKey={stepKey} />}
        </section>
      ))}
    </div>
  )
}

/** 変数の箱。名前のふだと、中身 */
function Vars({ vars, stepKey }: { vars: { name: string; value: string }[]; stepKey: number }) {
  return (
    <div className="vars">
      {vars.map((v) => (
        // 中身が変わったら key も変わり、ポンと弾むアニメが走る
        <div key={`${v.name}:${v.value}:${stepKey === 0 ? 0 : 1}`} className="var">
          <span className="var-name">{v.name}</span>
          <span className="var-value">{v.value}</span>
        </div>
      ))}
    </div>
  )
}

/** 画面(ブラウザ)に出た文字 */
function Output({ lines, stepKey }: { lines: string[]; stepKey: number }) {
  return (
    <div className="output" aria-label="画面の表示">
      <div className="output-bar" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="output-body">
        {lines.length === 0 ? (
          <span className="output-empty">(まだ何も出ていない)</span>
        ) : (
          lines.map((l, i) => (
            // 最後の1行だけ「今出た」アニメをつける
            <p key={`${i}:${l}`} className={i === lines.length - 1 ? 'is-last' : undefined} data-step={stepKey}>
              {l}
            </p>
          ))
        )}
      </div>
    </div>
  )
}

/** 表。行ごとに「注目・薄い・追加・書きかえ・削除・グループ色」の状態をつけられる */
function Table({ v }: { v: Extract<Visual, { kind: 'table' }> }) {
  return (
    <div className="tbl-wrap">
      <p className="tbl-name">{v.name}</p>
      <table className="tbl">
        <thead>
          <tr>
            {v.cols.map((c, i) => (
              <th key={c} className={v.hotCols?.includes(i) ? 'is-hotcol' : undefined}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {v.rows.length === 0 && (
            <tr className="tbl-empty">
              <td colSpan={v.cols.length}>(行はまだない)</td>
            </tr>
          )}
          {v.rows.map((row, r) => (
            <tr key={r} className={v.marks?.[r] ? `is-${v.marks[r]}` : undefined}>
              {row.map((cell, c) => (
                <td key={c} className={[v.hotCols?.includes(c) && 'is-hotcol', cell === null && 'is-null'].filter(Boolean).join(' ') || undefined}>
                  {show(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function show(cell: Cell) {
  if (cell === null) return 'NULL'
  if (cell === '') return '(空)'
  return String(cell)
}

/** 矢印でつながった流れ */
function Chain({ nodes, active, stepKey }: { nodes: string[]; active?: number[]; stepKey: number }) {
  return (
    <div className="chain" data-step={stepKey}>
      {nodes.map((n, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className="chain-arrow" aria-hidden="true">
              →
            </span>
          )}
          <span className={!active || active.includes(i) ? 'chain-node is-on' : 'chain-node'}>{n}</span>
        </Fragment>
      ))}
    </div>
  )
}
