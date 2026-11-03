// 操作バーです(前へ・再生/一時停止・次へ・ステップを示す点)。
// 状態は持たず、押されたことを親(App.tsx)に知らせるだけです。

import type { CSSProperties } from 'react'

interface Props {
  count: number // ステップの総数
  index: number // 今のステップ(0始まり)
  playing: boolean
  stepMs: number // 1ステップの時間(点の中の進み具合の表示に使う)
  tone: string // 今の点の色
  onPrev: () => void
  onNext: () => void
  onToggle: () => void
  onJump: (i: number) => void
}

export function Controls({ count, index, playing, stepMs, tone, onPrev, onNext, onToggle, onJump }: Props) {
  return (
    <nav className="controls" aria-label="ステップの操作" style={{ '--tone': tone, '--step-ms': `${stepMs}ms` } as CSSProperties}>
      <div className="controls-buttons">
        <button type="button" className="btn" onClick={onPrev} disabled={index === 0} aria-label="前へ(←キー)">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5 L8 12 L15 19" />
          </svg>
        </button>
        <button
          type="button"
          className="btn btn-play"
          onClick={onToggle}
          aria-label={playing ? '一時停止(スペースキー)' : '再生(スペースキー)'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? (
              <>
                <rect x="7" y="6" width="3.5" height="12" rx="1" />
                <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
              </>
            ) : (
              <path d="M8 5.5 L18.5 12 L8 18.5 Z" />
            )}
          </svg>
        </button>
        <button type="button" className="btn" onClick={onNext} disabled={index === count - 1} aria-label="次へ(→キー)">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5 L16 12 L9 19" />
          </svg>
        </button>
      </div>

      <div className="dots">
        {Array.from({ length: count }, (_, i) => {
          const cls = ['dot', i === index && 'is-current', i < index && 'is-past', i === index && playing && 'is-running']
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => onJump(i)}
              aria-label={`ステップ ${i + 1}`}
              aria-current={i === index ? 'step' : undefined}
            >
              <span />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
