// 「苦手」に登録した項目を、ブラウザの localStorage に保存する仕組みです。
// 登録は "言語id/項目id"(例: 'php/echo')の文字列で持ちます。
// localStorage が使えない環境(プライベートモードなど)でも、画面が壊れないように try/catch で守っています。

import { useSyncExternalStore } from 'react'

const KEY = 'it-visual:weak'

function read(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

let current = read() // 今の登録一覧(変わるたびに新しい配列に置きかえる)
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

/** 登録 / 解除を切り替える */
export function toggleWeak(key: string) {
  current = current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
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
