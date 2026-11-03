// トップページ: 「学ぶ」と「苦手リスト」のどちらかを選ぶ。

import type { CSSProperties } from 'react'
import { LANGUAGES } from '../data/languages'
import { href } from '../router'
import { useWeak } from '../weak'

export function Home() {
  const weakCount = useWeak().length
  const pages = LANGUAGES.flatMap((l) => l.items).filter((i) => i.topic || i.lesson).length

  return (
    <main className="page">
      <header className="hero">
        <h1>IT Visual</h1>
        <p className="lead">図とアニメで学ぶ。どちらから始めますか?</p>
      </header>

      <ul className="lang-list">
        <li>
          <a className="lang-card home-card" href={href('learn')} style={{ '--c': '#60a5fa' } as CSSProperties}>
            <span className="lang-mark" aria-hidden="true">
              学
            </span>
            <span className="lang-text">
              <span className="lang-name">学ぶ</span>
              <span className="lang-desc">言語を選んで、項目の解説とテストへ</span>
              <span className="home-meta">{pages}ページ</span>
            </span>
          </a>
        </li>
        <li>
          <a className="lang-card home-card" href={href('weak')} style={{ '--c': '#fbbf24' } as CSSProperties}>
            <span className="lang-mark" aria-hidden="true">
              ★
            </span>
            <span className="lang-text">
              <span className="lang-name">苦手リスト</span>
              <span className="lang-desc">自分で登録した項目を、もう一度見る</span>
              <span className="home-meta">{weakCount}件 登録中</span>
            </span>
          </a>
        </li>
      </ul>
    </main>
  )
}
