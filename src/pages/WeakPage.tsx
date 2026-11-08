// 苦手リスト: ★で登録した項目を、新しい順に並べる。見る / テスト / 解除ができる。

import type { CSSProperties } from 'react'
import { LANGUAGES } from '../data/languages'
import { LEVELS } from '../data/levels'
import { href } from '../router'
import { toggleWeak, useWeak } from '../weak'

export function WeakPage() {
  const keys = useWeak()

  // "php/echo" → 言語と項目を探す。もう無い項目は飛ばす
  const entries = [...keys]
    .reverse()
    .flatMap((key) => {
      const [langId, itemId] = key.split('/')
      const language = LANGUAGES.find((l) => l.id === langId)
      const item = language?.items.find((i) => i.id === itemId)
      return language && item ? [{ key, language, item }] : []
    })

  return (
    <main className="page">
      <a className="back" href={href()}>
        ‹ トップ
      </a>

      <header className="hero">
        <h1>苦手リスト</h1>
        <p className="lead">★で登録した項目です。{entries.length}件</p>
      </header>

      {entries.length === 0 ? (
        <p className="empty">
          まだ登録がありません。
          <br />
          項目のページで「☆ 苦手に登録」を押すと、ここに並びます。
          <br />
          <a className="empty-link" href={href('learn')}>
            学ぶへ →
          </a>
        </p>
      ) : (
        <ul className="item-list">
          {entries.map(({ key, language, item }) => {
            const level = LEVELS.find((l) => l.id === item.level)!
            return (
              <li key={key} className="weak-card" style={{ '--c': level.color } as CSSProperties}>
                <span className="item-text">
                  <span className="item-name">{item.name}</span>
                  <span className="item-summary">{item.summary}</span>
                  <span className="weak-tags">
                    <span className="weak-tag">{language.name}</span>
                    <span className="weak-tag is-level">{level.label}</span>
                  </span>
                </span>
                <span className="weak-actions">
                  {(item.topic || item.lesson) && <a href={href(language.id, item.id)}>見る</a>}
                  {item.quiz && <a href={href(language.id, item.id, 'test')}>テスト</a>}
                  <button type="button" onClick={() => toggleWeak(key)} aria-label={`${item.name}を苦手から外す`}>
                    ★ 解除
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
