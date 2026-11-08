// チャレンジの問題を、既存の解説データ(コードとステップの説明)から自動で作る部分です。
//   fill    … コードの穴埋め(キーボードで入力)。空欄の組み合わせは、毎回かわる
//   explain … 「この部分は、どんな処理?」(選択肢から選ぶ)
// 新しく問題を書かなくても、解説(data/lessons・data/topics)を足せば、出題できる問題も増えます。
//
// 難易度(やさしい / ふつう / むずかしい)は、2つの形で効きます。
//   1. 出題する項目のレベル: やさしい=必須・基礎中心 / むずかしい=中級・応用中心(足りなければ、他のレベルも使う)
//   2. 問題そのものの手ごたえ: 穴埋め=空欄の数・種類 / 説明=選択肢の数・まぎらわしさ

import type { Item, Language, Level } from './data/types'

export type Mode = 'fill' | 'explain'
export type Difficulty = 'easy' | 'normal' | 'hard'

/** 難易度ごとに、優先して出題する項目のレベル(null = 全レベル) */
export const PREFERRED_LEVELS: Record<Difficulty, Level[] | null> = {
  easy: ['must', 'basic'],
  normal: null,
  hard: ['middle', 'advanced'],
}

/** コードとステップの説明を持つもの(解説ページも図のページも、この形を持っている) */
type Step = { title: string; note?: string; code?: number; codeTo?: number }
interface Source {
  lines: string[]
  steps: Step[]
}

const sourceOf = (item: Item): Source | null => {
  const s = item.lesson ?? item.topic
  return s ? { lines: s.code.lines, steps: s.steps } : null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 出題の候補1つ。make() で、実際の問題を作る(作れなければ null) */
export interface Candidate<Q> {
  item: Item
  make: () => Q | null
}

/**
 * 候補から、count 問を選ぶ。
 *  - 項目をばらけさせる(同じ項目ばかりにならないよう、1項目ずつ順番に選ぶ)
 *  - 難易度に合うレベルの項目を先に使い、足りなければ他のレベルも使う
 */
export function pick<Q>(cands: Candidate<Q>[], count: number, diff: Difficulty): Q[] {
  const pref = PREFERRED_LEVELS[diff]
  const byItem = new Map<Item, Candidate<Q>[]>()
  for (const c of shuffle(cands)) byItem.set(c.item, [...(byItem.get(c.item) ?? []), c])
  const groups = shuffle([...byItem.values()])
  const preferred = (g: Candidate<Q>[]) => !pref || pref.includes(g[0].item.level)
  const out: Q[] = []
  for (const tier of [groups.filter(preferred), groups.filter((g) => !preferred(g))]) {
    let moved = true
    while (out.length < count && moved) {
      moved = false
      for (const g of tier) {
        if (out.length >= count) break
        const c = g.shift()
        if (!c) continue
        const q = c.make()
        if (q) out.push(q)
        moved = true
      }
    }
  }
  return shuffle(out)
}

// ===================== コードの穴埋め =====================

/** 穴埋めのコードの1片: ふつうの文字、または空欄(blank は答えの番号) */
export type Seg = { text: string } | { blank: number }

export interface FillQuestion {
  language: Language
  item: Item
  difficulty: Difficulty
  lines: Seg[][]
  answers: string[] // 空欄の答え(番号順)
}

/** 難易度ごとの、空欄の数と、空欄にしてよい言葉の種類(tier の大きさ) */
const FILL_RULES: Record<Difficulty, { blanks: number; maxTier: number }> = {
  easy: { blanks: 2, maxTier: 2 }, // キーワードと関数名だけ
  normal: { blanks: 3, maxTier: 3 }, // 変数も
  hard: { blanks: 5, maxTier: 4 }, // タグ名や属性名なども
}
const VARIANTS = 5 // 1つの項目から作る、空欄の組み合わせの数

// 空欄にしてよい「キーワード」(小文字で書く)
const KEYWORDS = new Set(
  (
    'select from where order group by having limit offset insert into values update set delete join inner left on as and or not null is desc asc ' +
    'create alter table add index view primary foreign key references start transaction commit rollback explain over distinct ' +
    'function class return if else foreach for while new use namespace public private protected try catch throw interface implements trait declare yield ' +
    'require require_once include include_once echo extends static abstract const let var async await import export instanceof finally default'
  ).split(' '),
)

const STOP = new Set(['php', 'the', 'and'])

/** 文字列とコメントを空白にした行を返す(文字の位置は、そのまま) */
function mask(line: string): string {
  const chars = line.split('')
  for (const m of line.matchAll(/'[^']*'|"[^"]*"/g)) {
    for (let i = m.index; i < m.index + m[0].length; i++) chars[i] = ' '
  }
  const masked = chars.join('')
  const c = masked.search(/(^|\s)(\/\/|--\s|#\s)/)
  return c >= 0 ? masked.slice(0, c) + ' '.repeat(masked.length - c) : masked
}

interface Cand {
  line: number
  start: number
  text: string
  tier: number // 1=キーワード 2=関数名 3=変数 4=その他
}

function candidates(lines: string[]): Cand[] {
  const masked = lines.map(mask)
  // 同じ言葉が何度も出てくると、ほかの場所が答えのヒントになるので、1回しか出ないものだけを使う
  const count = new Map<string, number>()
  for (const m of masked) for (const t of m.matchAll(/[A-Za-z_$][\w$]*/g)) count.set(t[0].toLowerCase(), (count.get(t[0].toLowerCase()) ?? 0) + 1)

  const out: Cand[] = []
  masked.forEach((m, line) => {
    for (const t of m.matchAll(/[A-Za-z_$][\w$]*/g)) {
      const text = t[0]
      const lower = text.toLowerCase()
      const isKw = KEYWORDS.has(lower)
      if ((text.length < 3 && !isKw) || STOP.has(lower) || count.get(lower) !== 1) continue
      const next = m.slice(t.index + text.length).trimStart()[0]
      const tier = isKw ? 1 : next === '(' ? 2 : text.startsWith('$') ? 3 : 4
      out.push({ line, start: t.index, text, tier })
    }
  })
  return out
}

function toQuestion(language: Language, item: Item, lines: string[], picked: Cand[], difficulty: Difficulty): FillQuestion {
  const ordered = [...picked].sort((a, b) => a.line - b.line || a.start - b.start)
  const segLines: Seg[][] = lines.map((line, li) => {
    const here = ordered.filter((c) => c.line === li)
    const segs: Seg[] = []
    let pos = 0
    for (const c of here) {
      if (c.start > pos) segs.push({ text: line.slice(pos, c.start) })
      segs.push({ blank: ordered.indexOf(c) })
      pos = c.start + c.text.length
    }
    if (pos < line.length) segs.push({ text: line.slice(pos) })
    return segs
  })
  return { language, item, difficulty, lines: segLines, answers: ordered.map((c) => c.text) }
}

/** 1つの項目から、空欄の組み合わせがちがう問題を、最大 VARIANTS 個作る */
function fillVariants(language: Language, item: Item, diff: Difficulty): FillQuestion[] {
  const src = sourceOf(item)
  if (!src) return []
  const lines = src.lines.slice(0, 14)
  const rule = FILL_RULES[diff]
  const all = candidates(lines)
  // 使える言葉が2つに満たないときは、種類をゆるめて探す
  let usable: Cand[] = []
  for (let t = rule.maxTier; t <= 4 && usable.length < 2; t++) usable = all.filter((c) => c.tier <= t)
  if (usable.length < 2) return []

  const seen = new Set<string>()
  const out: FillQuestion[] = []
  for (let attempt = 0; attempt < 24 && out.length < VARIANTS; attempt++) {
    // 種類の良いものを先に、ただし毎回少しゆらして選ぶ。できるだけ別の行から
    const noisy = usable.map((c) => ({ c, k: c.tier + Math.random() * 1.6 })).sort((a, b) => a.k - b.k).map((x) => x.c)
    const picked: Cand[] = []
    const plain = () => picked.filter((p) => p.tier === 4).length
    for (const c of noisy) if (picked.length < rule.blanks && !picked.some((p) => p.line === c.line) && (c.tier < 4 || plain() < 2)) picked.push(c)
    for (const c of noisy) if (picked.length < rule.blanks && !picked.includes(c) && (c.tier < 4 || plain() < 2)) picked.push(c)
    if (picked.length < 2) continue
    const key = picked.map((c) => `${c.line}:${c.start}`).sort().join('|')
    if (seen.has(key)) continue
    seen.add(key)
    out.push(toQuestion(language, item, lines, picked, diff))
  }
  return out
}

/** 答え合わせ: 大文字・小文字と、変数の頭の $ は、ちがっていてもよい */
export function sameAnswer(input: string, answer: string): boolean {
  const norm = (s: string) => s.trim().replace(/^\$/, '').toLowerCase()
  return norm(input) !== '' && norm(input) === norm(answer)
}

/** 範囲(scope)の項目。scope が null なら、全カテゴリ */
const itemsOf = (languages: Language[], scope: Language | null): { language: Language; item: Item }[] =>
  (scope ? [scope] : languages).flatMap((language) => language.items.map((item) => ({ language, item })))

export function collectFill(languages: Language[], scope: Language | null, diff: Difficulty): Candidate<FillQuestion>[] {
  return itemsOf(languages, scope).flatMap(({ language, item }) => fillVariants(language, item, diff).map((q) => ({ item, make: () => q })))
}

// ===================== 処理の説明(選択式) =====================

export interface ExplainOption {
  title: string
  note: string
}

export interface ExplainQuestion {
  language: Language
  item: Item
  difficulty: Difficulty
  lines: string[] // 表示するコード(先頭 〜 強調の終わりまで)
  from: number // 強調する範囲(1始まり)
  to: number
  options: ExplainOption[]
  answer: number
}

/** 難易度ごとの、まちがいの選択肢の数と、同じ項目の別の説明を混ぜる数(多いほど、まぎらわしい) */
const EXPLAIN_RULES: Record<Difficulty, { wrong: number; same: number }> = {
  easy: { wrong: 2, same: 0 }, // 選択肢3つ。ちがう項目の説明だけ
  normal: { wrong: 3, same: 1 }, // 選択肢4つ
  hard: { wrong: 4, same: 3 }, // 選択肢5つ。同じ項目の説明を多く混ぜる
}

const rangeOf = (s: Step) => [s.code!, s.codeTo ?? s.code!] as const
const overlaps = (a: Step, b: Step) => {
  const [a1, a2] = rangeOf(a)
  const [b1, b2] = rangeOf(b)
  return a1 <= b2 && b1 <= a2
}
const usable = (s: Step, lineCount: number): boolean => s.code !== undefined && !!s.note && s.note.length >= 8 && (s.codeTo ?? s.code) <= lineCount

/** 強調する範囲が、コメントや空行だけではないか */
const hasCode = (lines: string[], s: Step) =>
  lines.slice(rangeOf(s)[0] - 1, rangeOf(s)[1]).some((l) => l.trim() !== '' && !/^\s*(\/\/|--\s|#\s)/.test(l))

interface Pooled {
  language: Language
  item: Item
  step: Step
}

export function collectExplain(languages: Language[], scope: Language | null, diff: Difficulty): Candidate<ExplainQuestion>[] {
  // まちがいの選択肢に使う説明(全カテゴリのすべて)
  const global: Pooled[] = languages.flatMap((language) =>
    language.items.flatMap((item) => (sourceOf(item)?.steps ?? []).filter((s) => usable(s, 99)).map((step) => ({ language, item, step }))),
  )
  const rule = EXPLAIN_RULES[diff]

  const out: Candidate<ExplainQuestion>[] = []
  for (const { language, item } of itemsOf(languages, scope)) {
    const src = sourceOf(item)
    if (!src) continue
    const withCode = src.steps.filter((s) => s.code !== undefined)
    // 同じ(または重なる)コードを説明しているステップがある場合は、答えがあいまいなので使わない
    const targets = src.steps.filter((s) => usable(s, src.lines.length) && hasCode(src.lines, s) && !withCode.some((o) => o !== s && overlaps(o, s)))

    for (const target of targets) {
      out.push({
        item,
        make: () => {
          // まちがいの選択肢: 同じ項目の別の場所の説明(まぎらわしい) → 同じカテゴリの別の項目 → ほかのカテゴリ
          const same = shuffle(src.steps.filter((s) => s !== target && usable(s, src.lines.length) && !overlaps(s, target))).slice(0, rule.same)
          const others = shuffle(global.filter((g) => g.item !== item)).sort((a, b) => Number(b.language === language) - Number(a.language === language))
          const wrong: Step[] = []
          const seen = new Set([target.title, target.note])
          for (const s of [...same, ...others.map((o) => o.step)]) {
            if (wrong.length >= rule.wrong) break
            if (!seen.has(s.title) && !seen.has(s.note!)) {
              seen.add(s.title)
              seen.add(s.note!)
              wrong.push(s)
            }
          }
          if (wrong.length < rule.wrong) return null
          const options = shuffle([target, ...wrong])
          const to = rangeOf(target)[1]
          return {
            language,
            item,
            difficulty: diff,
            lines: src.lines.slice(0, to),
            from: rangeOf(target)[0],
            to,
            options: options.map((s) => ({ title: s.title, note: s.note! })),
            answer: options.indexOf(target),
          }
        },
      })
    }
  }
  return out
}
