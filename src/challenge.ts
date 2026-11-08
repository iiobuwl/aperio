// チャレンジの問題を、既存の解説データ(コードとステップの説明)から自動で作る部分です。
//   buildFill    … コードの穴埋め(キーボードで入力)。空欄の位置は、毎回かわる
//   buildExplain … 「この部分は、どんな処理?」(選択肢から選ぶ)
// 新しく問題を書かなくても、解説(data/lessons・data/topics)を足せば、チャレンジの出題も増えます。

import type { Item, Language } from './data/types'

/** コードとステップの説明を持つもの(解説ページも図のページも、この形を持っている) */
interface Source {
  lines: string[]
  steps: { title: string; note?: string; code?: number; codeTo?: number }[]
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

// ===================== コードの穴埋め =====================

/** 穴埋めのコードの1片: ふつうの文字、または空欄(blank は答えの番号) */
export type Seg = { text: string } | { blank: number }

export interface FillQuestion {
  language: Language
  item: Item
  lines: Seg[][]
  answers: string[] // 空欄の答え(番号順)
}

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

function makeFill(language: Language, item: Item): FillQuestion | null {
  const src = sourceOf(item)
  if (!src) return null
  const lines = src.lines.slice(0, 14)
  // 種類の良い順(キーワード → 関数名 → 変数)に、ランダムに選ぶ。できるだけ別の行から
  const all = shuffle(candidates(lines))
  const good = all.filter((c) => c.tier <= 3).sort((a, b) => a.tier - b.tier)
  const picked: Cand[] = []
  for (const c of good) if (picked.length < 3 && !picked.some((p) => p.line === c.line)) picked.push(c)
  for (const c of good) if (picked.length < 3 && !picked.includes(c)) picked.push(c)
  // 足りないときだけ、ふつうの名前(タグ名・属性名など)で、2つまで補う
  for (const c of all.filter((c) => c.tier === 4)) if (picked.length < 2) picked.push(c)
  if (picked.length < 2) return null

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
  return { language, item, lines: segLines, answers: ordered.map((c) => c.text) }
}

/** 答え合わせ: 大文字・小文字と、変数の頭の $ は、ちがっていてもよい */
export function sameAnswer(input: string, answer: string): boolean {
  const norm = (s: string) => s.trim().replace(/^\$/, '').toLowerCase()
  return norm(input) !== '' && norm(input) === norm(answer)
}

export function buildFill(language: Language, count: number): FillQuestion[] {
  const out: FillQuestion[] = []
  for (const item of shuffle(language.items)) {
    if (out.length >= count) break
    const q = makeFill(language, item)
    if (q) out.push(q)
  }
  return out
}

// ===================== 処理の説明(選択式) =====================

export interface ExplainOption {
  title: string
  note: string
}

export interface ExplainQuestion {
  language: Language
  item: Item
  lines: string[] // 表示するコード(先頭 〜 強調の終わりまで)
  from: number // 強調する範囲(1始まり)
  to: number
  options: ExplainOption[]
  answer: number
}

type Step = Source['steps'][number]

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

function makeExplain(language: Language, item: Item): ExplainQuestion | null {
  const src = sourceOf(item)
  if (!src) return null
  const all = src.steps.filter((s) => s.code !== undefined)
  // 同じ(または重なる)コードを説明しているステップがある場合は、答えがあいまいなので使わない
  const targets = shuffle(src.steps.filter((s) => usable(s, src.lines.length) && hasCode(src.lines, s) && !all.some((o) => o !== s && overlaps(o, s))))
  const target = targets[0]
  if (!target) return null

  // まちがいの選択肢: 同じ項目の別の場所の説明 → 同じカテゴリの別の項目の説明
  const same = shuffle(src.steps.filter((s) => s !== target && usable(s, src.lines.length) && !overlaps(s, target)))
  const others: Step[] = shuffle(
    language.items.filter((i) => i !== item).flatMap((i) => (sourceOf(i)?.steps ?? []).filter((s) => usable(s, 99))),
  )
  const wrong: Step[] = []
  const seen = new Set([target.title])
  // 同じ項目の説明は、1つだけ混ぜる(2つ以上だと、どれも正解に見えやすい)
  for (const s of [...same.slice(0, 1), ...others, ...same.slice(1)]) {
    if (wrong.length >= 3) break
    if (!seen.has(s.title)) {
      seen.add(s.title)
      wrong.push(s)
    }
  }
  if (wrong.length < 3) return null

  const options = shuffle([target, ...wrong])
  const to = rangeOf(target)[1]
  return {
    language,
    item,
    lines: src.lines.slice(0, to),
    from: rangeOf(target)[0],
    to,
    options: options.map((s) => ({ title: s.title, note: s.note! })),
    answer: options.indexOf(target),
  }
}

export function buildExplain(language: Language, count: number): ExplainQuestion[] {
  const out: ExplainQuestion[] = []
  for (const item of shuffle(language.items)) {
    if (out.length >= count) break
    const q = makeExplain(language, item)
    if (q) out.push(q)
  }
  return out
}
