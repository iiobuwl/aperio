// チャレンジの入口: カテゴリごとの進み具合と、解放されているかを見せる。
// カテゴリの項目の8割で、テストが「概ね正解」になると、そのカテゴリのチャレンジ(穴埋め・説明)が解放される。

import type { CSSProperties } from 'react'
import { GROUPS, LANGUAGES, colorOf } from '../data/languages'
import { LangSymbol } from '../components/LangSymbol'
import { categoryStatus, useProgress } from '../progress'
import { href } from '../router'

export function ChallengeHome() {
  const progress = useProgress()
  // 分類の順に並べる。テストのある項目を持つカテゴリだけ
  const langs = GROUPS.flatMap((g) => LANGUAGES.filter((l) => l.group === g.id)).filter((l) => l.items.some((i) => i.quiz))

  return (
    <main className="page page-narrow">
      <a className="back" href={href()}>
        ‹ トップ
      </a>

      <header className="hero">
        <h1>チャレンジ</h1>
        <p className="lead">穴埋めと説明に挑戦。テストが進むと解放されます。</p>
      </header>

      <ul className="lang-list ch-list">
        {langs.map((lang) => {
          const st = categoryStatus(lang, progress)
          const pct = Math.min(100, Math.round((st.done / Math.max(st.need, 1)) * 100))
          const best = (mode: string) => {
            const r = progress[`ch:${lang.id}:${mode}`]
            return r ? `ベスト ${r.c}/${r.t}` : '未挑戦'
          }
          return (
            <li key={lang.id} className={st.unlocked ? 'ch-card' : 'ch-card is-locked'} style={{ '--c': colorOf(lang) } as CSSProperties}>
              <div className="ch-top">
                <span className="lang-mark" aria-hidden="true">
                  <LangSymbol name={lang.symbol} />
                </span>
                <span className="lang-text">
                  <span className="lang-name">{lang.name}</span>
                  <span className="lang-desc">
                    合格 {st.done} / {st.total} 項目（{st.need} 項目で解放）
                  </span>
                </span>
                {st.unlocked ? (
                  <span className="ch-state is-open">解放済み</span>
                ) : (
                  <span className="ch-state">
                    <LangSymbol name="lock" /> ロック中
                  </span>
                )}
              </div>

              <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="解放までの進み具合">
                <span style={{ width: `${pct}%` }} />
              </div>

              {st.unlocked ? (
                <div className="ch-actions">
                  <a href={href('challenge', lang.id, 'fill')}>
                    コードの穴埋め<small>{best('fill')}</small>
                  </a>
                  <a href={href('challenge', lang.id, 'explain')}>
                    処理の説明<small>{best('explain')}</small>
                  </a>
                </div>
              ) : (
                <p className="ch-hint">
                  あと {Math.max(st.need - st.done, 0)} 項目、テストで概ね正解すると解放されます。
                  <a href={href(lang.id)}> 項目を見る ›</a>
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
