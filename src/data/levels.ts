// 4つのレベルの表示名・色・説明です。並び順もこの配列の順になります。

import type { Level } from './types'

export interface LevelInfo {
  id: Level
  label: string // 見出しに出す名前
  description: string // 見出しの横に出す説明
  color: string
}

export const LEVELS: LevelInfo[] = [
  { id: 'must', label: '必須', description: '絶対に覚えておく', color: '#f87171' },
  { id: 'basic', label: '基礎', description: 'よく使う', color: '#34d399' },
  { id: 'middle', label: '中級', description: '使いこなすと便利', color: '#60a5fa' },
  { id: 'advanced', label: '応用', description: '必要になったら', color: '#c084fc' },
]
