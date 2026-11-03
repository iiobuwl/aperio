// コードのパネルです。
// ステップが進むたびに1行ずつ表示を増やし、今の行だけ色つきの帯で強調します。
// まだ出ていない行も「見えない状態」で場所だけ確保して、パネルの高さが変わらないようにしています。

import type { CSSProperties, ReactNode } from 'react'

interface Props {
  label: string // パネル上部の見出し
  lines: string[] // コード全体
  shown: number // 何行目まで見せるか
  current?: number // 強調する行(1始まり)。なければ強調なし
  currentTo?: number // 指定すると current 〜 currentTo の範囲をまとめて強調
  tone: string // 帯の色
}

export function CodePanel({ label, lines, shown, current, currentTo, tone }: Props) {
  return (
    <section className="code" aria-label="対応するコード" style={{ '--tone': tone } as CSSProperties}>
      <div className="code-head">
        <span className="code-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {label}
      </div>
      <pre className="code-body">
        {lines.map((line, i) => {
          const no = i + 1
          const cls = ['code-line', no <= shown ? 'is-shown' : 'is-hidden', current !== undefined && no >= current && no <= (currentTo ?? current) && 'is-current']
            .filter(Boolean)
            .join(' ')
          return (
            <div key={i} className={cls} aria-hidden={no > shown}>
              <span className="code-no">{no}</span>
              <code>{highlight(line)}</code>
            </div>
          )
        })}
      </pre>
    </section>
  )
}

// ---- かんたんな色分け(コメント・文字列・変数・クラス名・キーワード・関数名) ----
const WORDS =
  'SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|OFFSET|INSERT INTO|VALUES|UPDATE|SET|DELETE|JOIN|INNER|LEFT|ON|AS|AND|OR|NOT|NULL|IS|DESC|ASC|' +
  'CREATE|ALTER|TABLE|ADD|INDEX|VIEW|PRIMARY KEY|FOREIGN KEY|REFERENCES|AUTO_INCREMENT|START TRANSACTION|COMMIT|ROLLBACK|FOR UPDATE|EXPLAIN|OVER|' +
  'function|class|return|if|else|foreach|for|new|use|namespace|public|try|catch|interface|implements|trait|declare|yield|require_once|require|include|echo|extends|static'
const TOKEN = new RegExp(
  `(\\/\\/.*$|--.*$)|('[^']*'|"[^"]*")|(\\$\\w+)|(\\b[A-Z]\\w*(?=::))|(\\b(?:${WORDS})\\b)|(\\b\\w+(?=\\())|(->|::|=>)`,
  'g',
)
const KINDS = ['comment', 'string', 'var', 'class', 'keyword', 'func', 'op']

export function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of line.matchAll(TOKEN)) {
    const start = m.index ?? 0
    if (start > last) out.push(line.slice(last, start)) // 色をつけない部分
    const kind = KINDS[m.slice(1).findIndex((g) => g !== undefined)]
    out.push(
      <span key={start} className={`tk-${kind}`}>
        {m[0]}
      </span>,
    )
    last = start + m[0].length
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}
