// 項目の中身のページ(「APIの裏側」など)です。「今どのステップか」「再生中か」をここで管理し、
// 図・コード・操作バーの部品に配ります。
// 中身(文言や動き)は data/ に書いてあり、ここはテーマに依存しません。

import { useEffect, useState, type CSSProperties } from 'react'
import type { Topic } from '../data/types'
import { Diagram } from '../components/Diagram'
import { CodePanel } from '../components/CodePanel'
import { Controls } from '../components/Controls'
import { StarButton } from '../components/StarButton'
import { STEP_MS, useStepper } from '../useStepper'

interface Props {
  topic: Topic
  backHref: string // 「‹ 戻る」の行き先
  backLabel: string // 「‹ 戻る」に出す名前(例: 'ITの仕組み')
  weakKey: string // 「苦手」に登録するときの名前(例: 'it/api')
  quizHref?: string // テストがある項目だけ渡す(「✎ この項目のテスト」のリンク先)
}

export function TopicPage({ topic, backHref, backLabel, weakKey, quizHref }: Props) {
  const { index, playing, goTo, togglePlay } = useStepper(topic.steps.length)
  const reducedMotion = usePrefersReducedMotion()
  const step = topic.steps[index]

  // ---- 表示用の値 ----
  // 見出しの色: 登場人物の id → その色、'request' / 'response' → 線の色
  const tone =
    step.tone === 'request'
      ? topic.requestColor
      : step.tone === 'response'
        ? topic.responseColor
        : (topic.actors.find((a) => a.id === step.tone)?.color ?? 'var(--text)')

  // コード: ここまでのステップで出た一番大きい行番号まで表示
  const shownLines = Math.max(0, ...topic.steps.slice(0, index + 1).map((s) => s.codeTo ?? s.code ?? 0))

  const chips = topic.chips.filter((c) => (c.fromStep ?? 0) <= index)

  return (
    <main className="page page-split" style={{ '--tone': tone } as CSSProperties}>
      <a className="back" href={backHref}>
        ‹ {backLabel}
      </a>

      {/* 1. タイトル */}
      <header className="hero">
        <h1>{topic.title}</h1>
        <p className="subtitle">{topic.subtitle}</p>
        <ul className="chips">
          {chips.map((c) => (
            <li key={c.value} className={c.fromStep ? 'chip is-new' : 'chip'} style={{ color: c.color }}>
              {c.label && <span className="chip-label">{c.label}</span>}
              <span className="chip-value">{c.value}</span>
            </li>
          ))}
        </ul>
      </header>

      {/* 2〜3. 図(行き道と戻り道) */}
      <div className="stage">
        <Diagram topic={topic} index={index} reducedMotion={reducedMotion} />
      </div>

      {/* 4. ステップの見出しと補足。key を変えると、切り替わるたびに登場アニメが走る */}
      <section className="caption" aria-live="polite" key={index}>
        <p className="step-count">
          STEP {index + 1} / {topic.steps.length}
        </p>
        <h2 className="step-title">{step.title}</h2>
        {step.note && <p className={step.noteIsCode ? 'step-note is-code' : 'step-note'}>{step.note}</p>}
      </section>

      {/* 5. コード */}
      <CodePanel label={topic.code.label} lines={topic.code.lines} shown={shownLines} current={step.code} currentTo={step.codeTo} tone={tone} />

      <div className="item-actions">
        <StarButton weakKey={weakKey} />
        {quizHref && (
          <a className="quiz-link" href={quizHref}>
            ✎ この項目のテスト
          </a>
        )}
      </div>

      {/* 6. 操作バー */}
      <Controls
        count={topic.steps.length}
        index={index}
        playing={playing}
        stepMs={STEP_MS}
        tone={tone}
        onPrev={() => goTo(index - 1)}
        onNext={() => goTo(index + 1)}
        onToggle={togglePlay}
        onJump={goTo}
      />
    </main>
  )
}

/** 「動きを減らす」設定がオンかどうか(設定を変えたらすぐ反映) */
function usePrefersReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
