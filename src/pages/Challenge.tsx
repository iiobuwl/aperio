// チャレンジ(タブの2つ目): 質問に1つずつ答えて設定し、挑戦する。
//   質問の順番 … 範囲 → モード → 難易度 → 問題数 → 確認(はじめる)
//   モード     … コードの穴埋め(キーボードで入力) / 処理の説明(選択肢から選ぶ)
//   難易度     … やさしい / ふつう / むずかしい(出題する項目のレベルと、問題の手ごたえが変わる)
//   問題数     … 5 / 10 / 20 / 30 問(所要時間の目安が出る)
// 質問が変わるときは、iOS のような「押し出し」のアニメーションで切りかわります(動きを減らす設定では止まります)。
// 問題は challenge.ts が、解説のデータから自動で作ります。何も保存しません。

import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Language, SymbolName } from '../data/types'
import { GROUPS, LANGUAGES, colorOf } from '../data/languages'
import { CodePanel, highlight } from '../components/CodePanel'
import { LangSymbol } from '../components/LangSymbol'
import {
  collectExplain,
  collectFill,
  pick,
  sameAnswer,
  type Difficulty,
  type ExplainQuestion,
  type FillQuestion,
  type Mode,
} from '../challenge'
import { href } from '../router'

// テストのある項目を持つカテゴリ(分類の順)
const CATS = GROUPS.flatMap((g) => LANGUAGES.filter((l) => l.group === g.id)).filter((l) => l.items.some((i) => i.quiz))

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'fill', label: 'コードの穴埋め', desc: '空欄に入る言葉を、キーボードで入力' },
  { id: 'explain', label: '処理の説明', desc: 'コードの色のついた部分が何をしているか、選ぶ' },
]

const DIFFS: { id: Difficulty; label: string; color: string; desc: Record<Mode, string> }[] = [
  // 説明は「。」ごとに、タイルの中で1行ずつ表示される(短く書く)
  { id: 'easy', label: 'やさしい', color: 'var(--green)', desc: { fill: '基本の項目。空欄2つ。ヒントあり', explain: '基本の項目。選択肢3つ' } },
  { id: 'normal', label: 'ふつう', color: 'var(--orange)', desc: { fill: '全項目から。空欄最大3つ', explain: '全項目から。選択肢4つ' } },
  { id: 'hard', label: 'むずかしい', color: 'var(--red)', desc: { fill: '中級・応用。空欄最大5つ。ヒントなし', explain: '中級・応用。選択肢5つ。紛らわしい' } },
]

const COUNTS = [5, 10, 20, 30]

// 入力できる文字数の上限。入力欄の maxLength に加えて、受け取った値もここで切る(二重の防御)
const MAX_INPUT = 64

// 1問あたりの、かかる時間の目安(秒)
const SECONDS: Record<Mode, Record<Difficulty, number>> = {
  fill: { easy: 30, normal: 45, hard: 70 },
  explain: { easy: 20, normal: 30, hard: 45 },
}
const minutes = (mode: Mode, diff: Difficulty, n: number) => Math.max(1, Math.round((n * SECONDS[mode][diff]) / 60))

interface Round {
  mode: Mode
  diff: Difficulty
  scope: Language | null
  fill: FillQuestion[]
  explain: ExplainQuestion[]
  results: boolean[] | null // null = 挑戦中
}

type Dir = 'forward' | 'back'
const LAST = 4 // 確認画面の番号(0〜3 が質問)
const MODE_ICON: Record<Mode, SymbolName> = { fill: 'code', explain: 'book' }

export default function Challenge() {
  const [scopeId, setScopeId] = useState('all')
  const [mode, setMode] = useState<Mode>('fill')
  const [diff, setDiff] = useState<Difficulty>('normal')
  const [count, setCount] = useState(10)
  const [round, setRound] = useState<Round | null>(null)

  // ウィザード: cur=今の質問、prev=退場中の質問(アニメーションの間だけ残す)、dir=進む / 戻る
  const [wz, setWz] = useState<{ cur: number; prev: number | null; dir: Dir }>({ cur: 0, prev: null, dir: 'forward' })
  const [returnTo, setReturnTo] = useState<number | null>(null) // 確認画面から直しに来たとき、終わったら確認画面へ戻る
  const [launching, setLaunching] = useState(false)
  const locked = useRef(false) // 選んでから次へ進むまでの間、連打を無視する
  const timer = useRef<number | undefined>(undefined)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const scope = scopeId === 'all' ? null : (CATS.find((l) => l.id === scopeId) ?? null)

  // 出題できる問題の数(画面に出す用。難易度とモードで変わる)
  const pool = useMemo(
    () => (mode === 'fill' ? collectFill(LANGUAGES, scope, diff) : collectExplain(LANGUAGES, scope, diff)).length,
    [mode, scope, diff],
  )
  // 母数より多い問題数は選べない。選んでいた数が多すぎたら、選べる中でいちばん近いものにする
  const allowed = COUNTS.filter((c) => c <= pool)
  const options = allowed.length ? allowed : pool > 0 ? [pool] : []
  const effective = options.includes(count) ? count : ([...options].reverse().find((c) => c <= count) ?? options[0] ?? 0)

  useEffect(() => () => window.clearTimeout(timer.current), [])
  // 質問が変わったら、見出しにフォーカスを移す(画面読み上げでも、新しい質問が読まれる)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [wz.cur])
  // 退場アニメーションが終わらなくても、一定時間で退場中の質問を片づける
  useEffect(() => {
    if (wz.prev === null) return
    const t = window.setTimeout(() => setWz((w) => ({ ...w, prev: null })), 800)
    return () => window.clearTimeout(t)
  }, [wz.prev, wz.cur])

  const go = (n: number, dir: Dir) => {
    locked.current = false
    if (n === LAST) setReturnTo(null)
    setWz((w) => ({ cur: n, prev: w.cur, dir }))
  }
  /** 選んだら、選んだことが見えるように少し待ってから、次の質問へ進む(直しに来たときは、確認画面へ戻る) */
  const choose = (apply: () => void) => {
    if (locked.current) return
    locked.current = true
    apply()
    timer.current = window.setTimeout(() => go(returnTo ?? wz.cur + 1, 'forward'), 300)
  }
  const back = () => {
    if (wz.cur === 0 || locked.current) return
    setReturnTo(null)
    go(wz.cur - 1, 'back')
  }

  /** 問題を作って、はじめる(作るたびに、ランダムに選びなおす) */
  const start = (m = mode, d = diff, sc = scope, n = effective) => {
    if (m === 'fill') setRound({ mode: m, diff: d, scope: sc, fill: pick(collectFill(LANGUAGES, sc, d), n, d), explain: [], results: null })
    else setRound({ mode: m, diff: d, scope: sc, fill: [], explain: pick(collectExplain(LANGUAGES, sc, d), n, d), results: null })
  }
  const launch = () => {
    if (effective === 0 || launching) return
    setLaunching(true) // 設定が、すっと消えてから、問題が始まる
    timer.current = window.setTimeout(() => {
      setLaunching(false)
      start()
    }, 260)
  }

  const qsLength = round ? (round.mode === 'fill' ? round.fill.length : round.explain.length) : 0
  const diffLabel = (d: Difficulty) => DIFFS.find((x) => x.id === d)!.label
  const modeLabel = (m: Mode) => MODES.find((x) => x.id === m)!.label

  /** n番目の質問(または確認画面)。live=true のものが、今の画面 */
  const renderStep = (n: number, live: boolean) => {
    const heading = (title: string, sub?: string) => (
      <div>
        <h2 className="wz-title" tabIndex={-1} ref={live ? headingRef : undefined}>
          {title}
        </h2>
        {sub && <p className="wz-sub">{sub}</p>}
      </div>
    )
    switch (n) {
      case 0:
        return (
          <>
            {heading('どの範囲に挑戦しますか?')}
            <div className="wz-grid is-scope" role="radiogroup" aria-label="範囲">
              {[null, ...CATS].map((l, i) => {
                const id = l?.id ?? 'all'
                return (
                  <Opt key={id} i={i} tile wide={i === 0} active={scopeId === id} onClick={() => choose(() => setScopeId(id))}>
                    <span className="wz-mark" style={{ '--c': l ? colorOf(l) : 'var(--blue)' } as CSSProperties}>
                      <LangSymbol name={l?.symbol ?? 'sparkles'} />
                    </span>
                    <span className="wz-text">
                      <b>{(l?.name ?? 'すべて').replace('・', '・\u200b')}</b>
                      <small>{l ? `${l.items.length}項目` : `${CATS.length}カテゴリの全部から`}</small>
                    </span>
                  </Opt>
                )
              })}
            </div>
          </>
        )
      case 1:
        return (
          <>
            {heading('どちらに挑戦しますか?')}
            <div className="wz-grid" role="radiogroup" aria-label="モード">
              {MODES.map((m, i) => (
                <Opt key={m.id} i={i} tile active={mode === m.id} onClick={() => choose(() => setMode(m.id))}>
                  <span className="wz-mark" style={{ '--c': 'var(--blue)' } as CSSProperties}>
                    <LangSymbol name={MODE_ICON[m.id]} />
                  </span>
                  <span className="wz-text">
                    <b>{m.label}</b>
                    <small>{m.desc}</small>
                  </span>
                </Opt>
              ))}
            </div>
          </>
        )
      case 2:
        return (
          <>
            {heading('難易度を選んでください', modeLabel(mode))}
            <div className="wz-grid is-three" role="radiogroup" aria-label="難易度">
              {DIFFS.map((d, i) => (
                <Opt key={d.id} i={i} tile color={d.color} active={diff === d.id} onClick={() => choose(() => setDiff(d.id))}>
                  {/* 段階メーター: やさしい=1本 / ふつう=2本 / むずかしい=3本 が、その難易度の色になる */}
                  <span className="wz-meter" aria-hidden="true">
                    {[0, 1, 2].map((k) => (
                      <i key={k} className={k <= i ? 'is-on' : ''} />
                    ))}
                  </span>
                  <span className="wz-text">
                    <b>{d.label}</b>
                    {/* 「。」ごとに改行して、短い行にする(タイルの中でも読みやすい) */}
                    <small>
                      {d.desc[mode]
                        .split('。')
                        .filter(Boolean)
                        .map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                    </small>
                  </span>
                  <span className="wz-aside">10問で約{minutes(mode, d.id, 10)}分</span>
                </Opt>
              ))}
            </div>
          </>
        )
      case 3:
        return (
          <>
            {heading('何問に挑戦しますか?', `出題できる問題: ${pool}問${pool > 0 && pool < COUNTS[0] ? '(この範囲では、これで全部です)' : ''}`)}
            <div className="wz-grid" role="radiogroup" aria-label="問題数">
              {(options.length ? options : COUNTS).map((c, i) => (
                <Opt key={c} i={i} tile disabled={options.length === 0} active={effective === c} onClick={() => choose(() => setCount(c))}>
                  <span className="wz-text">
                    <b className="wz-big">{c}問</b>
                    <small>約{minutes(mode, diff, c)}分</small>
                  </span>
                </Opt>
              ))}
            </div>
          </>
        )
      default: {
        const rows: [string, string, number, string?][] = [
          ['範囲', scope?.name ?? 'すべて', 0],
          ['モード', modeLabel(mode), 1],
          ['難易度', diffLabel(diff), 2, DIFFS.find((d) => d.id === diff)!.color],
          ['問題数', `${effective}問`, 3],
        ]
        return (
          <>
            {heading('準備ができました', '内容を確認して、はじめましょう。')}
            <div className="wz-summary">
              {rows.map(([label, value, step, dot], i) => (
                <button
                  key={label}
                  type="button"
                  className="wz-row"
                  style={{ '--i': i } as CSSProperties}
                  onClick={() => {
                    setReturnTo(LAST) // 直したら、確認画面へ戻る
                    go(step, 'back')
                  }}
                  aria-label={`${label}: ${value}(変更する)`}
                >
                  <span>{label}</span>
                  {dot && <em className="wz-dot" style={{ background: dot }} aria-hidden="true" />}
                  <b>{value}</b>
                  <i aria-hidden="true">›</i>
                </button>
              ))}
              <div className="wz-row is-static" style={{ '--i': 4 } as CSSProperties}>
                <span>所要時間の目安</span>
                <b>約{minutes(mode, diff, effective)}分</b>
              </div>
            </div>
            <button type="button" className="quiz-next start wz-start" disabled={effective === 0} onClick={launch}>
              はじめる
            </button>
          </>
        )
      }
    }
  }

  return (
    <main className="page page-narrow">
      {!round ? (
        <h1 className="wz-eyebrow">チャレンジ</h1>
      ) : (
        <header className="hero">
          <h1>チャレンジ</h1>
          <p className="lead">{`${modeLabel(round.mode)} ・ ${round.scope?.name ?? 'すべて'} ・ ${diffLabel(round.diff)} ・ ${qsLength}問`}</p>
        </header>
      )}

      {!round ? (
        <section className={launching ? 'wz is-launching' : 'wz'} aria-label="チャレンジの設定">
          <div className="wz-top">
            <button type="button" className={wz.cur > 0 ? 'wz-back is-on' : 'wz-back'} tabIndex={wz.cur > 0 ? 0 : -1} onClick={back} aria-label="前の質問に戻る">
              ‹ 戻る
            </button>
            <div className="wz-progress" role="progressbar" aria-valuemin={1} aria-valuemax={LAST + 1} aria-valuenow={wz.cur + 1} aria-label="設定の進み具合">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={i <= wz.cur ? 'is-on' : ''} />
              ))}
            </div>
          </div>
          <div className="wz-stage">
            {wz.prev !== null && (
              <div
                className={`wz-layer is-leave is-${wz.dir}`}
                inert
                aria-hidden="true"
                onAnimationEnd={(e) => {
                  if (e.target === e.currentTarget) setWz((w) => ({ ...w, prev: null }))
                }}
              >
                {renderStep(wz.prev, false)}
              </div>
            )}
            <div key={wz.cur} className={`wz-layer is-enter is-${wz.dir}`}>
              {renderStep(wz.cur, true)}
            </div>
          </div>
        </section>
      ) : qsLength === 0 ? (
        // 問題を1つも作れなかったとき(ふつうは起きない)
        <section className="empty" role="alert">
          問題を作れませんでした。
          <br />
          <button type="button" className="quiz-next" onClick={() => setRound(null)}>
            設定にもどる
          </button>
        </section>
      ) : round.results ? (
        <Result round={round} onRetry={() => start(round.mode, round.diff, round.scope, qsLength)} onSetup={() => setRound(null)} />
      ) : round.mode === 'fill' ? (
        <FillPlay qs={round.fill} diff={round.diff} onFinish={(r) => setRound({ ...round, results: r })} />
      ) : (
        <ExplainPlay qs={round.explain} onFinish={(r) => setRound({ ...round, results: r })} />
      )}
    </main>
  )
}

// ---------------------------------------------------------------------------

/** ウィザードの選択肢1つ。i は、順番にふわっと現れるための番号 */
function Opt({ i, active, disabled, tile, wide, color, onClick, children }: { i: number; active: boolean; disabled?: boolean; tile?: boolean; wide?: boolean; color?: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      disabled={disabled}
      className={`wz-opt${tile ? ' is-tile' : ''}${wide ? ' is-wide' : ''}${color ? ' has-color' : ''}${active ? ' is-active' : ''}`}
      style={{ '--i': i, ...(color ? { '--c': color } : {}) } as CSSProperties}
      onClick={onClick}
    >
      {children}
      <svg className="wz-check" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M7.5 12.5 10.6 15.5 16.5 9" />
      </svg>
    </button>
  )
}

function Progress({ now, total }: { now: number; total: number }) {
  return (
    <div className="quiz-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={now} aria-label="進み具合">
      <span style={{ width: `${(now / total) * 100}%` }} />
    </div>
  )
}

/** コードの穴埋め(入力式) */
function FillPlay({ qs, diff, onFinish }: { qs: FillQuestion[]; diff: Difficulty; onFinish: (r: boolean[]) => void }) {
  const [i, setI] = useState(0)
  const [values, setValues] = useState<string[]>(() => qs[0].answers.map(() => ''))
  const [checked, setChecked] = useState<boolean[] | null>(null) // 空欄ごとの ○×(答え合わせの後)
  const [results, setResults] = useState<boolean[]>([])
  const nextRef = useRef<HTMLButtonElement>(null)
  const q = qs[i]

  // 答え合わせの後は「次へ」にフォーカスを移す(Enter で進める)
  useEffect(() => {
    if (checked) nextRef.current?.focus()
  }, [checked])

  const check = () => {
    const ok = q.answers.map((a, n) => sameAnswer(values[n] ?? '', a))
    setChecked(ok)
    setResults((r) => [...r, ok.every(Boolean)])
  }
  const next = () => {
    if (i + 1 < qs.length) {
      setI(i + 1)
      setValues(qs[i + 1].answers.map(() => ''))
      setChecked(null)
    } else {
      onFinish(results)
    }
  }

  return (
    <section className="quiz-q" key={i} style={{ '--tone': colorOf(q.language) } as CSSProperties}>
      <Progress now={i} total={qs.length} />
      <p className="step-count">
        問 {i + 1} / {qs.length} ・ {q.item.name}（{q.language.name}）
      </p>
      <h2 className="quiz-text">空欄に入る言葉を、入力してください</h2>

      <section className="code">
        <div className="code-head">{q.item.name} のコード</div>
        <pre className="code-body">
          {q.lines.map((segs, li) => (
            <div key={li} className="code-line is-shown">
              <span className="code-no">{li + 1}</span>
              <code>
                {segs.map((s, k) =>
                  'blank' in s ? (
                    checked ? (
                      <span key={k} className={checked[s.blank] ? 'blank is-ok' : 'blank is-ng'}>
                        {q.answers[s.blank]}
                      </span>
                    ) : (
                      <input
                        key={k}
                        className="fill-input"
                        // やさしい・ふつう: 答えの長さが、枠の長さのヒントになる。むずかしい: 全部同じ長さ
                        style={{ width: diff === 'hard' ? '10ch' : `${Math.max(q.answers[s.blank].length + 1, 4)}ch` }}
                        // やさしい: 最初の1文字がヒント
                        placeholder={diff === 'easy' ? q.answers[s.blank].replace(/^\$/, '').slice(0, 1) : undefined}
                        value={values[s.blank] ?? ''}
                        aria-label={`空欄 ${s.blank + 1}`}
                        autoFocus={s.blank === 0}
                        maxLength={MAX_INPUT}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        onChange={(e) => setValues((v) => v.map((x, n) => (n === s.blank ? e.target.value.slice(0, MAX_INPUT) : x)))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            check()
                          }
                        }}
                      />
                    )
                  ) : (
                    <Fragment key={k}>{highlight(s.text)}</Fragment>
                  ),
                )}
              </code>
            </div>
          ))}
        </pre>
      </section>

      {checked ? (
        <div className={checked.every(Boolean) ? 'quiz-why is-ok' : 'quiz-why is-ng'} aria-live="polite">
          <p className="quiz-verdict">{checked.every(Boolean) ? '全問正解!' : `${checked.filter(Boolean).length} / ${checked.length} 個 正解`}</p>
          <ul className="fill-review">
            {q.answers.map((a, n) => (
              <li key={n} className={checked[n] ? 'is-ok' : 'is-ng'}>
                空欄{n + 1}: {checked[n] ? '○' : `× あなた「${values[n] || '(未入力)'}」→ 正解「${a}」`}
              </li>
            ))}
          </ul>
          <button ref={nextRef} type="button" className="quiz-next" onClick={next}>
            {i + 1 < qs.length ? '次の問題へ →' : '結果を見る →'}
          </button>
        </div>
      ) : (
        <button type="button" className="quiz-next" onClick={check}>
          答え合わせ
        </button>
      )}
    </section>
  )
}

/** 処理の説明(選択式) */
function ExplainPlay({ qs, onFinish }: { qs: ExplainQuestion[]; onFinish: (r: boolean[]) => void }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const q = qs[i]
  const answered = picked !== null

  const pickOption = (n: number) => {
    if (answered || n < 0 || n >= q.options.length) return
    setPicked(n)
    setResults((r) => [...r, n === q.answer])
  }
  const next = () => {
    if (i + 1 < qs.length) {
      setI(i + 1)
      setPicked(null)
    } else {
      onFinish(results)
    }
  }

  // キーボード: 数字キーで選ぶ、Enter か → で次へ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (/^[1-5]$/.test(e.key)) pickOption(Number(e.key) - 1)
      else if ((e.key === 'Enter' || e.key === 'ArrowRight') && answered) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="quiz-q" key={i} style={{ '--tone': colorOf(q.language) } as CSSProperties}>
      <Progress now={i} total={qs.length} />
      <p className="step-count">
        問 {i + 1} / {qs.length} ・ {q.item.name}（{q.language.name}）
      </p>
      <h2 className="quiz-text">色のついた部分は、どんな処理をしている?</h2>

      <CodePanel label={`${q.item.name} のコード`} lines={q.lines} shown={q.lines.length} current={q.from} currentTo={q.to} tone={colorOf(q.language)} />

      <ul className="quiz-options">
        {q.options.map((o, n) => {
          const state = !answered ? '' : n === q.answer ? ' is-correct' : n === picked ? ' is-wrong' : ' is-dim'
          return (
            <li key={n}>
              <button type="button" className={`quiz-option opt-explain${state}`} disabled={answered} onClick={() => pickOption(n)}>
                <span className="quiz-key">{n + 1}</span>
                <span className="opt-body">
                  <b className="opt-title">{o.title}</b>
                  <span className="opt-note">{o.note}</span>
                </span>
                {answered && n === q.answer && <span aria-hidden="true">○</span>}
                {answered && n === picked && n !== q.answer && <span aria-hidden="true">×</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <div className={picked === q.answer ? 'quiz-why is-ok' : 'quiz-why is-ng'} aria-live="polite">
          <p className="quiz-verdict">{picked === q.answer ? '正解!' : `ざんねん。正解は「${q.options[q.answer].title}」`}</p>
          <p>{q.options[q.answer].note}</p>
          <button type="button" className="quiz-next" onClick={next}>
            {i + 1 < qs.length ? '次の問題へ →' : '結果を見る →'}
          </button>
        </div>
      )}
    </section>
  )
}

/** 結果 */
function Result({ round, onRetry, onSetup }: { round: Round; onRetry: () => void; onSetup: () => void }) {
  const results = round.results!
  const qs = round.mode === 'fill' ? round.fill : round.explain
  const score = results.filter(Boolean).length
  return (
    <section className="quiz-result">
      <p className="quiz-score">
        <b>{score}</b> / {qs.length} 問 正解
      </p>
      <p className="lead">{score === qs.length ? 'ぜんぶ正解です。' : 'まちがえた項目は、解説を見直してみましょう。'}</p>

      <ul className="quiz-review">
        {qs.map((q, n) => (
          <li key={n} className={results[n] ? 'is-ok' : 'is-ng'}>
            <span className="quiz-mark">{results[n] ? '○' : '×'}</span>
            <span className="quiz-review-text">
              {q.item.name}（{q.language.name}）
              {!results[n] && (
                <small>
                  <a href={href(q.language.id, q.item.id)}>この項目を見直す ›</a>
                </small>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="item-actions">
        <button type="button" className="quiz-link" onClick={onRetry}>
          もう一度(同じ設定)
        </button>
        <button type="button" className="quiz-link" onClick={onSetup}>
          設定を変える
        </button>
      </div>
    </section>
  )
}
