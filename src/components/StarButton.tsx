// 「★ 苦手に登録」ボタンです。押すたびに登録 / 解除が切り替わります。

import { toggleWeak, useWeak } from '../weak'

export function StarButton({ weakKey }: { weakKey: string }) {
  const on = useWeak().includes(weakKey)
  return (
    <button type="button" className={on ? 'star-btn is-on' : 'star-btn'} aria-pressed={on} onClick={() => toggleWeak(weakKey)}>
      <span aria-hidden="true">{on ? '★' : '☆'}</span>
      {on ? '苦手に登録済み' : '苦手に登録'}
    </button>
  )
}
