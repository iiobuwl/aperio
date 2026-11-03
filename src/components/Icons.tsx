// 登場人物のアイコン(SVGで自作)。
// どれも中心が (0, 0) で、だいたい縦横 30 の大きさに収まるように描いています。
// 線の色は currentColor(親の color)を使うので、色はここでは決めません。

import type { IconKind } from '../data/types'

export function ActorIcon({ kind }: { kind: IconKind }) {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === 'phone' && <Phone />}
      {kind === 'shield' && <ShieldKey />}
      {kind === 'server' && <ServerBox />}
      {kind === 'database' && <Cylinder />}
      {kind === 'browser' && <Browser />}
      {kind === 'globe' && <Globe />}
      {kind === 'lock' && <Lock />}
      {kind === 'cloud' && <Cloud />}
      {kind === 'key' && <Key />}
      {kind === 'queue' && <Queue />}
      {kind === 'balancer' && <Balancer />}
      {kind === 'mail' && <Mail />}
    </g>
  )
}

/** アプリ: スマホ */
function Phone() {
  return (
    <>
      <rect x={-9} y={-15} width={18} height={30} rx={3.5} />
      <line x1={-3} y1={-11} x2={3} y2={-11} />
      <circle cx={0} cy={10.5} r={1.4} fill="currentColor" stroke="none" />
    </>
  )
}

/** API: 盾と鍵 */
function ShieldKey() {
  return (
    <>
      <path d="M0 -15 L12 -10 V-1 C12 7 6.5 12.5 0 15 C-6.5 12.5 -12 7 -12 -1 V-10 Z" />
      {/* 鍵: 丸い持ち手 + 軸 + 歯 */}
      <circle cx={0} cy={-4} r={3.2} />
      <line x1={0} y1={-0.8} x2={0} y2={8} />
      <line x1={0} y1={4.5} x2={3} y2={4.5} />
      <line x1={0} y1={7.5} x2={2.2} y2={7.5} />
    </>
  )
}

/** サーバー: 3段の箱 */
function ServerBox() {
  return (
    <>
      {[-14, -4, 6].map((y) => (
        <g key={y}>
          <rect x={-13} y={y} width={26} height={8} rx={2} />
          <circle cx={-8} cy={y + 4} r={1.2} fill="currentColor" stroke="none" />
          <line x1={1} y1={y + 4} x2={8} y2={y + 4} />
        </g>
      ))}
    </>
  )
}

/** データベース: 円柱 */
function Cylinder() {
  return (
    <>
      <ellipse cx={0} cy={-10} rx={12} ry={4.5} />
      <path d="M-12 -10 V10 A12 4.5 0 0 0 12 10 V-10" />
      <path d="M-12 0 A12 4.5 0 0 0 12 0" />
    </>
  )
}

/** ブラウザ: 上にバーのある窓 */
function Browser() {
  return (
    <>
      <rect x={-14} y={-11} width={28} height={22} rx={3.5} />
      <line x1={-14} y1={-4} x2={14} y2={-4} />
      <circle cx={-9.5} cy={-7.5} r={0.9} fill="currentColor" stroke="none" />
      <circle cx={-6} cy={-7.5} r={0.9} fill="currentColor" stroke="none" />
      <line x1={-8} y1={3} x2={8} y2={3} />
      <line x1={-8} y1={7} x2={2} y2={7} />
    </>
  )
}

/** 地球(DNS・インターネット) */
function Globe() {
  return (
    <>
      <circle cx={0} cy={0} r={13} />
      <ellipse cx={0} cy={0} rx={5.5} ry={13} />
      <line x1={-13} y1={0} x2={13} y2={0} />
      <path d="M-11 -6.5 H11 M-11 6.5 H11" />
    </>
  )
}

/** 鍵つきの錠前(暗号化) */
function Lock() {
  return (
    <>
      <rect x={-10} y={-2} width={20} height={15} rx={3} />
      <path d="M-5.5 -2 V-6 a5.5 5.5 0 0 1 11 0 V-2" />
      <circle cx={0} cy={5} r={1.6} fill="currentColor" stroke="none" />
    </>
  )
}

/** 雲(CDN・キャッシュの拠点) */
function Cloud() {
  return <path d="M-9 10 H8 a6.5 6.5 0 0 0 1.2 -12.9 A9 9 0 0 0 -8 -4.5 A6.8 6.8 0 0 0 -9 10 Z" />
}

/** 鍵(認証) */
function Key() {
  return (
    <>
      <circle cx={-7} cy={0} r={5.5} />
      <line x1={-1.5} y1={0} x2={13} y2={0} />
      <line x1={9} y1={0} x2={9} y2={5} />
      <line x1={13} y1={0} x2={13} y2={4} />
    </>
  )
}

/** キュー: 順番待ちの箱が並ぶ */
function Queue() {
  return (
    <>
      <rect x={-14} y={-6} width={8} height={12} rx={2} />
      <rect x={-4} y={-6} width={8} height={12} rx={2} />
      <rect x={6} y={-6} width={8} height={12} rx={2} />
      <path d="M-11 -11 H11 M8 -14 L11 -11 L8 -8" />
    </>
  )
}

/** ロードバランサ: 1本が3本に分かれる */
function Balancer() {
  return (
    <>
      <circle cx={-10} cy={0} r={3.5} />
      <circle cx={10} cy={-9} r={3} />
      <circle cx={10} cy={0} r={3} />
      <circle cx={10} cy={9} r={3} />
      <path d="M-6.5 0 L7 0 M-6.5 -1.5 L7 -9 M-6.5 1.5 L7 9" />
    </>
  )
}

/** 手紙(メール) */
function Mail() {
  return (
    <>
      <rect x={-13} y={-9} width={26} height={18} rx={3} />
      <path d="M-13 -7 L0 3 L13 -7" />
    </>
  )
}
