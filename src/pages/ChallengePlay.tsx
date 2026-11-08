// チャレンジの出題画面。
//   fill    … コードの穴埋め(キーボードで入力。空欄は毎回かわる)
//   explain … ハイライトされた部分が、どんな処理かを、選択肢から選ぶ
// 問題は challenge.ts が、解説のデータから自動で作ります。

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import type { Language } from '../data/types'
import { colorOf } from '../data/languages'
import { CodePanel, highlight } from '../components/CodePanel'
import { StarButton } from '../components/StarButton'
import { buildExplain, buildFill, sameAnswer, type ExplainQuestion, type FillQuestion } from '../challenge'
import { categoryStatus, record, useProgress } from '../progress'
import { href } from '../router'

const COUNT = 5 // 1回に出す問題数

export type Mode = 'fill' | 'explain'

const TITLE: Record<Mode, string> = { fill: 'コードの穴埋め', explain: '処理の説明' }

export function ChallengePlay({ language, mode }: { language: Language; mode: Mode }) {
  const progress = useProgress()
  const unlocked = categoryStatus(language, progress).unlocked
  const [round, setRound] = useState(0) // 「もう一度」で問題を作りなおす
  const [finished, setFinished] = useState<boolean[] | null>(null)

  // 問題は、round が変わったときだけ作りなおす
  const fillQs = useState(() => (mode === 'fill' ? buildFill(language, COUNT) : []))
  const explainQs = useState(() => (mode === 'explain' ? buildExplain(language, COUNT) : []))
  void round

  const retry = () => {
    fillQs[1](mode === 'fill' ? buildFill(language, COUNT) : [])
    explainQs[1](mode === 'explain' ? buildExplain(language, COUNT) : [])
    setFinished(null)
    setRound((r) => r + 1)
  }

  const qs = mode === 'fill' ? fillQs[0] : explainQs[0]

  return (
    <main className="page page-narrow" style={{ '--tone': colorOf(language) } as CSSProperties}>
      <a className="back" href={href('challenge')}>
        ‹ チャレンジ
      </a>
      <header className="hero">
        <h1>{TITLE[mode]}</h1>
        <p className="lead">{language.name}</p>
      </header>

      {!unlocked ? (
        <p className="empty">
          このチャレンジは、まだ解放されていません。
          <br />
          <a className="empty-link" href={href('challenge')}>
            チャレンジへ ›
          </a>
        </p>
      ) : qs.length === 0 ? (
        <p className="empty">問題を作れませんでした。</p>
      ) : finished ? (
        <Result key={round} language={language} mode={mode} qs={qs} results={finished} onRetry={retry} />
      ) : mode === 'fill' ? (
        <FillPlay key={round} language={language} qs={fillQs[0]} onFinish={setFinished} />
      ) : (
        <ExplainPlay key={round} language={language} qs={explainQs[0]} onFinish={setFinished} />
      )}
    </main>
  )
}

// ---------------------------------------------------------------------------

/** コードの穴埋め(入力式) */
function FillPlay({ language, qs, onFinish }: { language: Language; qs: FillQuestion[]; onFinish: (r: boolean[]) => void }) {
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
    <section className="quiz-q" key={i}>
      <p className="step-count">
        問 {i + 1} / {qs.length} ・ {q.item.name}
      </p>
      <h2 className="quiz-text">空欄に入る言葉を、入力してください</h2>

      <section className="code" style={{ '--tone': colorOf(language) } as CSSProperties}>
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
                        style={{ width: `${Math.max(q.answers[s.blank].length + 1, 4)}ch` }}
                        value={values[s.blank] ?? ''}
                        aria-label={`空欄 ${s.blank + 1}`}
                        autoFocus={s.blank === 0}
                        maxLength={64}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        onChange={(e) => setValues((v) => v.map((x, n) => (n === s.blank ? e.target.value : x)))}
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
function ExplainPlay({ language, qs, onFinish }: { language: Language; qs: ExplainQuestion[]; onFinish: (r: boolean[]) => void }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const q = qs[i]
  const answered = picked !== null

  const pick = (n: number) => {
    if (answered) return
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

  // キーボード: 1〜4 で選ぶ、Enter か → で次へ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (/^[1-4]$/.test(e.key)) pick(Number(e.key) - 1)
      else if ((e.key === 'Enter' || e.key === 'ArrowRight') && answered) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="quiz-q" key={i}>
      <p className="step-count">
        問 {i + 1} / {qs.length} ・ {q.item.name}
      </p>
      <h2 className="quiz-text">色のついた部分は、どんな処理をしている?</h2>

      <CodePanel label={`${q.item.name} のコード`} lines={q.lines} shown={q.lines.length} current={q.from} currentTo={q.to} tone={colorOf(language)} />

      <ul className="quiz-options">
        {q.options.map((o, n) => {
          const state = !answered ? '' : n === q.answer ? ' is-correct' : n === picked ? ' is-wrong' : ' is-dim'
          return (
            <li key={n}>
              <button type="button" className={`quiz-option opt-explain${state}`} disabled={answered} onClick={() => pick(n)}>
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
function Result({
  language,
  mode,
  qs,
  results,
  onRetry,
}: {
  language: Language
  mode: Mode
  qs: (FillQuestion | ExplainQuestion)[]
  results: boolean[]
  onRetry: () => void
}) {
  const score = results.filter(Boolean).length
  // ベストの結果を記録する(チャレンジの入口に出る)
  useEffect(() => {
    record(`ch:${language.id}:${mode}`, score, qs.length)
  }, [language.id, mode, score, qs.length])

  return (
    <section className="quiz-result">
      <p className="quiz-score">
        <b>{score}</b> / {qs.length} 問 正解
      </p>
      <p className="lead">{score === qs.length ? 'ぜんぶ正解です。' : 'まちがえた項目は、解説を見直したり、★で苦手に登録したりできます。'}</p>

      <ul className="quiz-review">
        {qs.map((q, n) => (
          <li key={n} className={results[n] ? 'is-ok' : 'is-ng'}>
            <span className="quiz-mark">{results[n] ? '○' : '×'}</span>
            <span className="quiz-review-text">
              {q.item.name}
              {!results[n] && (
                <small>
                  <a href={href(language.id, q.item.id)}>この項目を見直す ›</a>
                </small>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="item-actions">
        <button type="button" className="quiz-link" onClick={onRetry}>
          もう一度
        </button>
        <a className="quiz-link" href={href('challenge')}>
          チャレンジへ
        </a>
      </div>
      {qs.some((_, n) => !results[n]) && (
        <div className="item-actions">
          {qs.map((q, n) => !results[n] && <StarButton key={n} weakKey={`${language.id}/${q.item.id}`} />)}
        </div>
      )}
    </section>
  )
}
