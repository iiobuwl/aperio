// URL の「#」より後ろ(ハッシュ)で画面を切り替える、小さな仕組みです。
//   #/          → 言語選択
//   #/css       → CSS の項目一覧
//   #/it/api    → 「ITの仕組み」の「APIの裏側」
// ハッシュが変わってもページの再読み込みは起きず、ブラウザの「戻る」も効きます。

import { useEffect, useState } from 'react'

/** 今の URL を ['it', 'api'] のような配列にして返す。変わったら自動で更新される */
export function useRoute(): string[] {
  const [parts, setParts] = useState(readHash)
  useEffect(() => {
    const onChange = () => {
      setParts(readHash())
      window.scrollTo(0, 0) // 画面が変わったら一番上から見せる
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return parts
}

/** リンク先の URL を作る。href('it', 'api') → '#/it/api' */
export function href(...parts: string[]) {
  return '#/' + parts.map(encodeURIComponent).join('/')
}

// URL の部品として受け付ける最大の長さと数(それより長いものは、無視して切り捨てる)
const MAX_PART_LENGTH = 64
const MAX_PARTS = 4

/** decodeURIComponent は、壊れた文字(例: %E0%A4%A)で例外を投げるので、そのときは元の文字のまま使う */
function safeDecode(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

function readHash() {
  return window.location.hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter(Boolean)
    .slice(0, MAX_PARTS)
    .map((p) => safeDecode(p.slice(0, MAX_PART_LENGTH * 3)).slice(0, MAX_PART_LENGTH))
}
