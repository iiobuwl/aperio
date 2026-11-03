// 2つ目の画面: 選んだ言語の項目一覧。
// 項目をレベル(必須 / 基礎 / 中級 / 応用)ごとに見出しで分けて並べます。
// 上のチップで、1つのレベルだけに絞り込めます。
// 項目がまだない言語は、画面全体に「coming soon...」のオーバーレイをかけます。

import { useState, type CSSProperties } from 'react'
import type { Language, Level } from '../data/types'
import { LEVELS } from '../data/levels'
import { colorOf } from '../data/languages'
import { href } from '../router'
import { useWeak } from '../weak'

export function ItemList({ language }: { language: Language }) {
  // 絞り込み中のレベル。'all' ならすべて表示
  const [filter, setFilter] = useState<Level | 'all'>('all')
  const weak = useWeak() // 苦手に登録した項目には ★ をつける

  if (language.items.length === 0) return <ComingSoon language={language} />

  // 項目が1つ以上あるレベルだけを、LEVELS の順に並べる
  const groups = LEVELS.map((level) => ({
    level,
    items: language.items.filter((i) => i.level === level.id),
  })).filter((g) => g.items.length > 0 && (filter === 'all' || g.level.id === filter))

  return (
    <main className="page" style={{ '--c': colorOf(language) } as CSSProperties}>
      <a className="back" href={href('learn')}>
        ← 言語を選ぶ
      </a>

      <header className="hero">
        <h1>{language.name}</h1>
        <p className="lead">{language.description}</p>
      </header>

      {/* レベルの絞り込みチップ */}
      <div className="filters" role="group" aria-label="レベルで絞り込む">
        <FilterChip label="すべて" active={filter === 'all'} onClick={() => setFilter('all')} />
        {LEVELS.map((l) => (
          <FilterChip
            key={l.id}
            label={l.label}
            color={l.color}
            active={filter === l.id}
            onClick={() => setFilter(l.id)}
          />
        ))}
      </div>

      {groups.map(({ level, items }) => (
        <section key={level.id} className="level" style={{ '--c': level.color } as CSSProperties}>
          <h2 className="level-head">
            <span className="level-label">{level.label}</span>
            <span className="level-desc">{level.description}</span>
          </h2>
          <ul className="item-list">
            {items.map((item) => (
              <li key={item.id}>
                {item.topic || item.lesson ? (
                  // 中身があるものはリンク
                  <a className="item-card" href={href(language.id, item.id)}>
                    <ItemText name={item.name} summary={item.summary} star={weak.includes(`${language.id}/${item.id}`)} />
                    <span className="item-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                ) : (
                  // 中身がまだないものは押せないカード
                  <div className="item-card is-soon" aria-disabled="true">
                    <ItemText name={item.name} summary={item.summary} />
                    <span className="soon">準備中</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}

function ItemText({ name, summary, star = false }: { name: string; summary: string; star?: boolean }) {
  return (
    <span className="item-text">
      <span className="item-name">
        {name}
        {star && (
          <span className="item-star" aria-label="苦手に登録済み">
            {' ★'}
          </span>
        )}
      </span>
      <span className="item-summary">{summary}</span>
    </span>
  )
}

function FilterChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string
  color?: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={active ? 'filter is-active' : 'filter'}
      style={color ? ({ '--c': color } as CSSProperties) : undefined}
      aria-pressed={active}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

/** 項目がまだない言語の画面。後ろに一覧の「下書き」を薄く描き、その上を覆う */
function ComingSoon({ language }: { language: Language }) {
  return (
    <main className="page" style={{ '--c': colorOf(language) } as CSSProperties}>
      <header className="hero">
        <h1>{language.name}</h1>
        <p className="lead">{language.description}</p>
      </header>

      {/* 後ろに見える、ぼかした仮のカード */}
      <div className="skeleton" aria-hidden="true">
        {LEVELS.map((l) => (
          <div key={l.id} className="skeleton-card" style={{ '--c': l.color } as CSSProperties} />
        ))}
      </div>

      <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="coming-title">
        <p className="overlay-mark" aria-hidden="true">
          {language.mark}
        </p>
        <p id="coming-title" className="overlay-title">
          coming soon...
        </p>
        <p className="overlay-text">{language.name} の項目は準備中です</p>
        <a className="overlay-back" href={href('learn')}>
          ← 言語を選ぶ
        </a>
      </div>
    </main>
  )
}
