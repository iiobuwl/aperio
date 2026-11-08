// 項目ごとのテストの画面です。
//   1. はじめに形式(4択 / 穴埋め / 両方)を選ぶ
//   2. 1問ずつ答える。答えたらすぐ、正解と解説が出る
//   3. 結果を見て、もう一度やる / 苦手に登録する
// 問題はデータ(data/quizzes/)に「正解を先頭」で書いてあり、ここで選択肢をシャッフルします。

import { Fragment, useEffect, useState, type CSSProperties } from 'react'
import { record } from '../progress'
import type { ChoiceQ, FillQ, Item, Language, Quiz } from '../data/types'
import { colorOf } from '../data/languages'
import { highlight } from '../components/CodePanel'
import { StarButton } from '../components/StarButton'
import { href } from '../router'

type Mode = 'choice' | 'fill' | 'both'

/** 画面に出す1問(選択肢はシャッフル済みで、answer は正解の位置) */
interface Q {
  kind: 'choice' | 'fill'
  text?: string // 4択の問題文
  code?: string[] // 穴埋めのコード
  options: string[]
  answer: number
  why: string
}

const MODES: { id: Mode; label: string; desc: string }[] = [
  { id: 'choice', label: '4択', desc: '問題文を読んで、正しいものを選ぶ' },
  { id: 'fill', label: 'コードの穴埋め', desc: '空欄に入る言葉を選ぶ' },
  { id: 'both', label: '両方', desc: '4択のあとに、穴埋めが続く' },
]

export function QuizPage({ language, item }: { language: Language; item: Item }) {
  const quiz = item.quiz!
  const [mode, setMode] = useState<Mode | null>(null) // null = 形式を選ぶ前
  const [qs, setQs] = useState<Q[]>([])
  const [i, setI] = useState(0) // 今の問題(0始まり)
  const [picked, setPicked] = useState<number | null>(null) // 選んだ選択肢
  const [results, setResults] = useState<boolean[]>([]) // 問題ごとの○×
  const tone = colorOf(language)

  const finished = mode !== null && results.length === qs.length && qs.length > 0 && picked === null

  const start = (m: Mode) => {
    setQs(build(quiz, m))
    setMode(m)
    setI(0)
    setPicked(null)
    setResults([])
  }
  const answer = (n: number) => {
    if (picked !== null || mode === null || finished) return
    setPicked(n)
    setResults((r) => [...r, n === qs[i].answer])
  }
  const next = () => {
    if (picked === null) return
    if (i + 1 < qs.length) setI(i + 1)
    setPicked(null) // 最後の問題なら、picked が null になって結果画面へ
  }

  // キーボード: 1〜4 で選ぶ、Enter か → で次へ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || mode === null || finished) return
      if (/^[1-4]$/.test(e.key)) answer(Number(e.key) - 1)
      else if (e.key === 'Enter' || e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <main className="page page-narrow" style={{ '--tone': tone } as CSSProperties}>
      <a className="back" href={href(language.id, item.id)}>
        ‹ {item.name}
      </a>

      <header className="hero">
        <h1 className="lesson-title">{item.name}</h1>
        <p className="lead">{language.name} のテスト</p>
      </header>

      {mode === null && <Setup quiz={quiz} onStart={start} />}

      {mode !== null && !finished && qs[i] && (
        <Question q={qs[i]} no={i + 1} total={qs.length} picked={picked} language={language} onPick={answer} onNext={next} />
      )}

      {finished && <Result qs={qs} results={results} language={language} item={item} onRetry={() => setMode(null)} />}
    </main>
  )
}

// ---------------------------------------------------------------------------

/** 問題を出題用に組み立てる(選択肢をシャッフルして、正解の位置を覚える) */
function build(quiz: Quiz, mode: Mode): Q[] {
  const out: Q[] = []
  if (mode !== 'fill') quiz.choice.forEach((c) => out.push(make('choice', c)))
  if (mode !== 'choice') quiz.fill.forEach((f) => out.push(make('fill', f)))
  return out
}

function make(kind: 'choice' | 'fill', src: ChoiceQ | FillQ): Q {
  // データは「正解が 0 番目」。並びの順番だけを入れかえ、正解が今どこにあるかを記録する
  const order = shuffle([0, 1, 2, 3])
  return {
    kind,
    text: 'q' in src ? src.q : undefined,
    code: 'code' in src ? src.code : undefined,
    options: order.map((n) => src.options[n]),
    answer: order.indexOf(0),
    why: src.why,
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 形式を選ぶ画面 */
function Setup({ quiz, onStart }: { quiz: Quiz; onStart: (m: Mode) => void }) {
  const count = (m: Mode) => (m === 'choice' ? quiz.choice.length : m === 'fill' ? quiz.fill.length : quiz.choice.length + quiz.fill.length)
  return (
    <section className="quiz-setup">
      <h2 className="quiz-h">形式を選んでください</h2>
      <ul className="item-list">
        {MODES.map((m) => (
          <li key={m.id}>
            <button type="button" className="quiz-mode" onClick={() => onStart(m.id)}>
              <span className="item-text">
                <span className="item-name">{m.label}</span>
                <span className="item-summary">{m.desc}</span>
              </span>
              <span className="quiz-count">{count(m.id)}問</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 1問分の画面 */
function Question({
  q,
  no,
  total,
  picked,
  language,
  onPick,
  onNext,
}: {
  q: Q
  no: number
  total: number
  picked: number | null
  language: Language
  onPick: (n: number) => void
  onNext: () => void
}) {
  const answered = picked !== null
  const ok = picked === q.answer
  return (
    // key で、問題が変わるたびに登場アニメを走らせる
    <section className="quiz-q" key={no}>
      <p className="step-count">
        問 {no} / {total} ・ {q.kind === 'choice' ? '4択' : '穴埋め'}
      </p>

      {q.kind === 'choice' ? (
        <h2 className="quiz-text">{q.text}</h2>
      ) : (
        <>
          <h2 className="quiz-text">空欄に入るものはどれ?</h2>
          <section className="code">
            <div className="code-head">{language.name}</div>
            <pre className="code-body">
              {q.code!.map((line, n) => (
                <div key={n} className="code-line is-shown">
                  <span className="code-no">{n + 1}</span>
                  <code>
                    {line.split('___').map((part, k, arr) => (
                      <Fragment key={k}>
                        {highlight(part)}
                        {k < arr.length - 1 && (
                          <span className={answered ? (ok ? 'blank is-ok' : 'blank is-ng') : 'blank'}>
                            {answered ? q.options[q.answer] : '？？？'}
                          </span>
                        )}
                      </Fragment>
                    ))}
                  </code>
                </div>
              ))}
            </pre>
          </section>
        </>
      )}

      <ul className="quiz-options">
        {q.options.map((o, n) => {
          const state = !answered ? '' : n === q.answer ? ' is-correct' : n === picked ? ' is-wrong' : ' is-dim'
          return (
            <li key={n}>
              <button type="button" className={`quiz-option${state}`} disabled={answered} onClick={() => onPick(n)}>
                <span className="quiz-key">{n + 1}</span>
                <span className="quiz-opt-text">{o}</span>
                {answered && n === q.answer && <span aria-hidden="true">○</span>}
                {answered && n === picked && n !== q.answer && <span aria-hidden="true">×</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <div className={ok ? 'quiz-why is-ok' : 'quiz-why is-ng'} aria-live="polite">
          <p className="quiz-verdict">{ok ? '正解!' : `ざんねん。正解は「${q.options[q.answer]}」`}</p>
          <p>{q.why}</p>
          <button type="button" className="quiz-next" onClick={onNext}>
            {no < total ? '次の問題へ →' : '結果を見る →'}
          </button>
        </div>
      )}
    </section>
  )
}

/** 結果の画面 */
function Result({
  qs,
  results,
  language,
  item,
  onRetry,
}: {
  qs: Q[]
  results: boolean[]
  language: Language
  item: Item
  onRetry: () => void
}) {
  const score = results.filter(Boolean).length
  // 結果を記録する(いちばん良い結果だけが残る。チャレンジの解放に使われる)
  useEffect(() => {
    record(`${language.id}/${item.id}`, score, qs.length)
  }, [language.id, item.id, score, qs.length])
  return (
    <section className="quiz-result">
      <p className="quiz-score">
        <b>{score}</b> / {qs.length} 問 正解
      </p>
      <p className="lead">{score === qs.length ? 'ぜんぶ正解です。' : 'まちがえた問題は、解説を読み返してみましょう。'}</p>

      <ul className="quiz-review">
        {qs.map((q, n) => (
          <li key={n} className={results[n] ? 'is-ok' : 'is-ng'}>
            <span className="quiz-mark">{results[n] ? '○' : '×'}</span>
            <span className="quiz-review-text">
              {q.kind === 'choice' ? q.text : `穴埋め: ${q.code!.find((l) => l.includes('___'))?.trim()}`}
              {!results[n] && (
                <small>
                  正解: {q.options[q.answer]} ― {q.why}
                </small>
              )}
            </span>
          </li>
        ))}
      </ul>

      {score < qs.length && <p className="quiz-hint">苦手だと感じたら、★で登録して、あとで見直せます。</p>}

      <div className="item-actions">
        <StarButton weakKey={`${language.id}/${item.id}`} />
        <button type="button" className="quiz-link" onClick={onRetry}>
          もう一度
        </button>
        <a className="quiz-link" href={href(language.id, item.id)}>
          解説にもどる
        </a>
      </div>
    </section>
  )
}
