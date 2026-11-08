// トップページ: 「学ぶ」と「苦手リスト」のどちらかを選ぶ。

import type { CSSProperties } from 'react'
import { GROUPS, LANGUAGES } from '../data/languages'
import { LangSymbol } from '../components/LangSymbol'
import { href } from '../router'
import { useWeak } from '../weak'
import { categoryStatus, useProgress } from '../progress'

export function Home() {
  const weakCount = useWeak().length
  const progress = useProgress()
  // チャレンジが解放されたカテゴリの数
  const cats = GROUPS.flatMap((g) => LANGUAGES.filter((l) => l.group === g.id)).filter((l) => l.items.some((i) => i.quiz))
  const unlocked = cats.filter((l) => categoryStatus(l, progress).unlocked).length
  const pages = LANGUAGES.flatMap((l) => l.items).filter((i) => i.topic || i.lesson).length

  return (
    <main className="page">
      <header className="hero brand">
        <img className="brand-icon" src="/favicon.svg" alt="" width="64" height="64" />
        <div>
          <h1>Aperio</h1>
          <p className="lead">仕組みの裏側を、開いて見る。</p>
        </div>
      </header>

      <ul className="lang-list">
        <li>
          <a className="lang-card home-card" href={href('learn')} style={{ '--c': 'var(--blue)' } as CSSProperties}>
            <span className="lang-mark" aria-hidden="true">
              <LangSymbol name="book" />
            </span>
            <span className="lang-text">
              <span className="lang-name">学ぶ</span>
              <span className="lang-desc">言語を選んで、項目の解説とテストへ</span>
              <span className="home-meta">{pages}ページ</span>
            </span>
          </a>
        </li>
        <li>
          <a className="lang-card home-card" href={href('challenge')} style={{ '--c': 'var(--green)' } as CSSProperties}>
            <span className="lang-mark" aria-hidden="true">
              <LangSymbol name="target" />
            </span>
            <span className="lang-text">
              <span className="lang-name">チャレンジ</span>
              <span className="lang-desc">コードの穴埋めと、処理の説明。テストが進むと解放</span>
              <span className="home-meta">
                {unlocked} / {cats.length} カテゴリ 解放
              </span>
            </span>
          </a>
        </li>
        <li>
          <a className="lang-card home-card" href={href('weak')} style={{ '--c': 'var(--orange)' } as CSSProperties}>
            <span className="lang-mark" aria-hidden="true">
              <LangSymbol name="star" />
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
