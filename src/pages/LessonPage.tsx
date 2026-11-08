// 解説ページ(PHP / SQL の項目)です。
// 「APIの裏側」と同じ作りで、ステップが進むたびにコードが1行ずつ増え、
// 今の行が色つきの帯で光り、上の小さな図(変数・表など)が変わります。
// 中身は data/lessons/ のデータだけで決まります。

import type { CSSProperties } from 'react'
import type { Item, Language } from '../data/types'
import { LEVELS } from '../data/levels'
import { colorOf } from '../data/languages'
import { CodePanel } from '../components/CodePanel'
import { Controls } from '../components/Controls'
import { StarButton } from '../components/StarButton'
import { LessonVisual } from '../components/LessonVisual'
import { STEP_MS, useStepper } from '../useStepper'
import { href } from '../router'

export function LessonPage({ language, item }: { language: Language; item: Item }) {
  const lesson = item.lesson!
  const { index, playing, goTo, togglePlay } = useStepper(lesson.steps.length)
  const step = lesson.steps[index]
  const tone = colorOf(language)
  const level = LEVELS.find((l) => l.id === item.level)!

  // コード: ここまでのステップで出た一番大きい行番号まで表示
  const shownLines = Math.max(0, ...lesson.steps.slice(0, index + 1).map((s) => s.codeTo ?? s.code ?? 0))

  return (
    <main className="page page-split" style={{ '--tone': tone } as CSSProperties}>
      <a className="back" href={href(language.id)}>
        ‹ {language.name}
      </a>

      <header className="hero">
        <h1 className="lesson-title">{item.name}</h1>
        <p className="lead">{item.summary}</p>
        <ul className="chips">
          <li className="chip" style={{ color: level.color }}>
            <span className="chip-value">{level.label}</span>
          </li>
          <li className="chip">
            <span className="chip-value">{language.name}</span>
          </li>
        </ul>
      </header>

      {/* 小さな図 */}
      <div className="stage stage-lesson">
        {step.visuals && <LessonVisual visuals={step.visuals} stepKey={index} />}
      </div>

      {/* ステップの見出しと補足(key を変えると、切り替わるたびに登場アニメが走る) */}
      <section className="caption" aria-live="polite" key={index}>
        <p className="step-count">
          STEP {index + 1} / {lesson.steps.length}
        </p>
        <h2 className="step-title">{step.title}</h2>
        {step.note && <p className="step-note">{step.note}</p>}
      </section>

      <CodePanel
        label={lesson.code.label}
        lines={lesson.code.lines}
        shown={shownLines}
        current={step.code}
        currentTo={step.codeTo}
        tone={tone}
      />

      <div className="item-actions">
        <StarButton weakKey={`${language.id}/${item.id}`} />
        {item.quiz && (
          <a className="quiz-link" href={href(language.id, item.id, 'test')}>
            ✎ この項目のテスト
          </a>
        )}
      </div>

      <Controls
        count={lesson.steps.length}
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
