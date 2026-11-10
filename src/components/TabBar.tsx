// 画面の上に出る、タブの切りかえ(学ぶ / チャレンジ)です。どの画面でも、同じ位置に出ます。
// (操作バーが画面の下にあるページがあるので、タブは上に置いています)

import { LangSymbol } from './LangSymbol'
import { href } from '../router'

export type Tab = 'learn' | 'challenge'

export function TabBar({ active }: { active: Tab }) {
  return (
    <header className="tabbar">
      <div className="tabbar-inner">
        <a className="tabbar-brand" href={href()} aria-label="Aperio(学ぶ)">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="28" height="28" />
          <span>Aperio</span>
        </a>
        <nav className="tabs" aria-label="メインメニュー">
          <a className="tab" href={href()} aria-current={active === 'learn' ? 'page' : undefined}>
            <LangSymbol name="book" />
            学ぶ
          </a>
          <a className="tab" href={href('challenge')} aria-current={active === 'challenge' ? 'page' : undefined}>
            <LangSymbol name="target" />
            チャレンジ
          </a>
        </nav>
      </div>
    </header>
  )
}
