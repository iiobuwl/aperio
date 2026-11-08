// 「苦手」に登録した項目を、ブラウザの localStorage に保存する仕組みです。
// 登録は "言語id/項目id"(例: 'php/echo')の文字列で持ちます。
// localStorage が使えない環境(プライベートモードなど)でも、画面が壊れないように try/catch で守っています。

import { useSyncExternalStore } from 'react'

const KEY = 'it-visual:weak'

// 保存してよい名前の形(英小文字・数字・ハイフンだけ。"言語/項目")と、保存できる最大の数。
// localStorage は、利用者(や、ブラウザの拡張機能)が書きかえられるので、読み込むときに必ず検査する。
const KEY_RE = /^[a-z0-9-]{1,40}\/[a-z0-9-]{1,60}$/
const MAX_ITEMS = 500

function read(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    if (!Array.isArray(v)) return []
    return [...new Set(v.filter((x): x is string => typeof x === 'string' && KEY_RE.test(x)))].slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

let current = read() // 今の登録一覧(変わるたびに新しい配列に置きかえる)
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

/** 登録 / 解除を切り替える */
export function toggleWeak(key: string) {
  if (!KEY_RE.test(key)) return
  current = current.includes(key) ? current.filter((k) => k !== key) : [...current, key].slice(-MAX_ITEMS)
  try {
    window.localStorage.setItem(KEY, JSON.stringify(current))
  } catch {
    // 保存できなくても、この画面を開いている間は有効にしておく
  }
  notify()
}

// 別のタブで変更されたら、こちらも更新する
window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    current = read()
    notify()
  }
})

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** 登録済みの一覧。変わると画面が自動で更新される */
export function useWeak(): string[] {
  return useSyncExternalStore(subscribe, () => current)
}

/** 項目の登録キーを作る */
export const weakKey = (langId: string, itemId: string) => `${langId}/${itemId}`
