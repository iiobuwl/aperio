// 最初の画面: 言語を選ぶ。
// languages.ts の GROUPS(フロントエンド系など)ごとに枠を作り、
// その中を KINDS(言語 / ライブラリ・フレームワーク)の小見出しで分けて並べます。

import type { CSSProperties } from 'react'
import type { Language } from '../data/types'
import { GROUPS, KINDS } from '../data/languages'
import { LangSymbol } from '../components/LangSymbol'
import { href } from '../router'

export function LanguageSelect({ languages }: { languages: Language[] }) {
  return (
    <main className="page">
      <a className="back" href={href()}>
        ‹ トップ
      </a>

      <header className="hero">
        <h1>学ぶ</h1>
        <p className="lead">言語を選んでください。</p>
      </header>

      {GROUPS.map((group) => {
        const inGroup = languages.filter((l) => l.group === group.id)
        if (inGroup.length === 0) return null
        return (
          <section key={group.id} className="group" style={{ '--c': group.color } as CSSProperties}>
            <h2 className="group-head">{group.label}</h2>

            {KINDS.map((kind) => {
              const list = inGroup.filter((l) => l.kind === kind.id)
              if (list.length === 0) return null
              return (
                <div key={kind.id} className="kind">
                  <h3 className="kind-head">
                    <span aria-hidden="true">{'</>'}</span>
                    {kind.label}
                  </h3>
                  <ul className="lang-list">
                    {list.map((lang) => (
                      <li key={lang.id}>
                        <LanguageCard lang={lang} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </section>
        )
      })}
    </main>
  )
}

function LanguageCard({ lang }: { lang: Language }) {
  const soon = lang.items.length === 0 // 項目がまだない → coming soon
  const ready = lang.items.filter((i) => i.topic || i.lesson).length // 中身のある項目の数
  return (
    <a className={soon ? 'lang-card is-soon' : 'lang-card'} href={href(lang.id)}>
      <span className="lang-mark" aria-hidden="true">
        <LangSymbol name={lang.symbol} />
      </span>
      <span className="lang-text">
        {/* 名前の行: 左に名前、右に項目数(または coming soon) */}
        <span className="lang-top">
          <span className="lang-name">{lang.name}</span>
          <span className="lang-count">
            {soon ? (
              <span className="coming">coming soon...</span>
            ) : (
              <>
                {lang.items.length}項目
                {ready > 0 && <small>{ready}ページ</small>}
              </>
            )}
          </span>
        </span>
        <span className="lang-desc">{lang.description}</span>
        {lang.extensions && (
          <span className="exts">
            {lang.extensions.map((ext) => (
              <span key={ext} className="ext">
                {ext}
              </span>
            ))}
          </span>
        )}
      </span>
    </a>
  )
}
