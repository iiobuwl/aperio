// テストの結果(どの項目を「概ね正解」できたか)を、ブラウザの localStorage に記録する仕組みです。
// チャレンジ(穴埋め・説明)の解放は、ここの記録をもとに決まります。
//   キー "php/echo"        → その項目のテストの、いちばん良かった結果
//   キー "ch:php:fill"     → チャレンジのベスト結果
// localStorage が使えない環境でも、画面が壊れないように try/catch で守っています。

import { useSyncExternalStore } from 'react'
import type { Language } from './data/types'

const KEY = 'it-visual:progress'

/** 1回の結果: c 問正解 / t 問中 */
export interface Result {
  c: number
  t: number
}
type Store = Record<string, Result>

// 保存してよいキーの形("言語/項目" か "ch:言語:fill|explain")と、結果の範囲。
// localStorage は、利用者(や、ブラウザの拡張機能)が書きかえられるので、読み込むときに必ず検査する。
// ("__proto__" のような特別な名前も、この形に合わないので、はじかれる)
const KEY_RE = /^(?:[a-z0-9-]{1,40}\/[a-z0-9-]{1,60}|ch:[a-z0-9-]{1,40}:(?:fill|explain))$/
const MAX_ENTRIES = 1000
const MAX_QUESTIONS = 100

const validResult = (r: unknown): r is Result => {
  if (!r || typeof r !== 'object') return false
  const { c, t } = r as Record<string, unknown>
  return Number.isInteger(c) && Number.isInteger(t) && (c as number) >= 0 && (t as number) > 0 && (c as number) <= (t as number) && (t as number) <= MAX_QUESTIONS
}

function read(): Store {
  try {
    const v: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '{}')
    if (!v || typeof v !== 'object' || Array.isArray(v)) return {}
    const out: Store = {}
    for (const [k, r] of Object.entries(v).slice(0, MAX_ENTRIES)) {
      if (KEY_RE.test(k) && validResult(r)) out[k] = { c: r.c, t: r.t }
    }
    return out
  } catch {
    return {}
  }
}

let current: Store = read() // 変わるたびに新しいオブジェクトに置きかえる
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

/** 結果を記録する。いちばん良い結果(正解の割合が高いもの)だけを残す */
export function record(key: string, c: number, t: number) {
  if (!KEY_RE.test(key) || !validResult({ c, t })) return
  const old = current[key]
  const better = !old || c * old.t > old.c * t || (c * old.t === old.c * t && t > old.t)
  if (!better) return
  current = { ...current, [key]: { c, t } }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(current))
  } catch {
    // 保存できなくても、この画面を開いている間は有効にしておく
  }
  notify()
}

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

/** 記録の一覧。変わると画面が自動で更新される */
export function useProgress(): Store {
  return useSyncExternalStore(subscribe, () => current)
}

/** 「概ね正解」= 3問中2問以上(割合が 2/3 以上) */
export const isPassed = (r?: Result) => !!r && r.t > 0 && r.c * 3 >= r.t * 2

/** カテゴリのチャレンジが解放される、合格した項目の割合 */
export const UNLOCK_RATE = 0.8

/** カテゴリごとの進み具合と、チャレンジが解放されているか */
export function categoryStatus(lang: Language, store: Store) {
  const items = lang.items.filter((i) => i.quiz)
  const total = items.length
  const need = Math.ceil(total * UNLOCK_RATE)
  const done = items.filter((i) => isPassed(store[`${lang.id}/${i.id}`])).length
  return { total, need, done, unlocked: total > 0 && done >= need }
}
