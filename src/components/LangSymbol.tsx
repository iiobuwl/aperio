// 言語やカテゴリのカードに出す、線画のアイコンです(SF Symbols のような、細い線の絵)。
// 24 × 24 の枠の中に描き、線の色は currentColor(親の color)を使います。
// 新しいカテゴリを足すときは、SYMBOLS に1つ描き足して、types.ts の SymbolName に名前を足します。

import type { ReactNode } from 'react'
import type { SymbolName } from '../data/types'

const SYMBOLS: Record<SymbolName, ReactNode> = {
  // 学ぶ: 開いた本
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.5 4 5v12.5c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" />
      <path d="M12 6.5V19" />
    </>
  ),
  // 苦手リスト: 星
  star: <path d="m12 4.2 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8Z" fill="currentColor" />,
  // ITの仕組み: つながった3つの点
  network: (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <circle cx="12" cy="4.6" r="1.8" />
      <circle cx="5" cy="17.6" r="1.8" />
      <circle cx="19" cy="17.6" r="1.8" />
      <path d="M12 9.6V6.4M10 13.3l-3.6 3.2M14 13.3l3.6 3.2" />
    </>
  ),
  // HTML: </>
  code: <path d="M8.5 8 4 12l4.5 4M15.5 8l4.5 4-4.5 4M13.5 5.5l-3 13" />,
  // CSS: 絵の具のパレット
  palette: (
    <>
      <path d="M12 3.5c-5 0-8.5 3.5-8.5 8 0 4.5 3.5 8 8 8 1.4 0 2-1 1.6-2-.5-1.3.1-2.5 1.6-2.5h2.3c2 0 3-1.3 3-3.2C20 7 16.8 3.5 12 3.5Z" />
      <circle cx="7.8" cy="11.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="10.6" cy="7.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.2" cy="7.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // JavaScript: いなずま
  bolt: <path d="M13 3.5 5.5 13.2h5.2L10 20.5l8-10h-5.4Z" />,
  // TypeScript: 型の「T」
  typeT: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M8.5 9.5h7M12 9.5V16" />
    </>
  ),
  // React: 原子
  atom: (
    <>
      <ellipse cx="12" cy="12" rx="9" ry="3.6" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  // Next.js: 円の中の矢印
  arrowCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9.5 14.5 5-5M10.2 9.5h4.3v4.3" />
    </>
  ),
  // Python(データ分析・AI): きらめき
  sparkles: (
    <>
      <path d="m10 4.5 1.7 4.6 4.6 1.7-4.6 1.7L10 17.1l-1.7-4.6-4.6-1.7 4.6-1.7Z" />
      <path d="m18 3.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z" />
      <path d="m18 15.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z" />
    </>
  ),
  // PHP(サーバー側の処理): 2段のサーバー
  server: (
    <>
      <rect x="4" y="4.5" width="16" height="6" rx="2" />
      <rect x="4" y="13.5" width="16" height="6" rx="2" />
      <circle cx="7.6" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="7.6" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  // Java: コーヒーカップ
  coffee: (
    <>
      <path d="M5 9h11v5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 14Z" />
      <path d="M16 10.5h1.2a2.3 2.3 0 0 1 0 4.6H16" />
      <path d="M8.5 3.5c-.8 1 .8 1.6 0 2.8M12 3.5c-.8 1 .8 1.6 0 2.8" />
    </>
  ),
  // C#: シャープ記号
  hash: <path d="m9.5 4.5-1.5 15M16 4.5l-1.5 15M5 9h15M4 15h15" />,
  // SQL: データベースの円柱
  cylinder: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="2.8" />
      <path d="M5 6.5v11c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-11" />
      <path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" />
    </>
  ),
  // セキュリティ: 鍵穴のある盾
  shield: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.3 7 9 4.1-1.7 7-4.8 7-9V6Z" />
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M12 12.2v3" />
    </>
  ),
  // ファイル処理・運用: フォルダ
  folder: <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" />,
  // チャレンジ: 的(まと)
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  // ロック中: 錠前
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.4" />
      <path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" />
    </>
  ),
  // データベース運用(バックアップ): 下向き矢印のついた箱
  archive: (
    <>
      <rect x="3.5" y="4.5" width="17" height="4.5" rx="1.5" />
      <path d="M5 9v8.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" />
      <path d="M12 11.5v5m-2-2 2 2 2-2" />
    </>
  ),
}

export function LangSymbol({ name }: { name: SymbolName }) {
  return (
    <svg
      className="symbol"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SYMBOLS[name]}
    </svg>
  )
}
