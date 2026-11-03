// 図の部品です。登場人物・矢印・戻り道・光る点・バッジ・メモを SVG で描きます。
// 「今どのステップか(index)」を受け取り、steps.ts のデータどおりに描くだけで、
// 何をどう光らせるかの判断はデータ側に任せています。

import { useEffect, useRef, type CSSProperties } from 'react'
import type { Actor, Flow, Topic } from '../data/types'
import { ActorIcon } from './Icons'

// ---- 図の寸法(SVG の座標。実際の表示サイズは画面幅に合わせて自動で縮む) ----
const W = 400 // 図の横幅
const H = 218 // 図の高さ
const CY = 70 // アイコンの中心の高さ
const R = 24 // アイコンの円の半径
const LABEL_Y = CY + R + 18 // 名前の位置
const BADGE_Y = CY - R - 18 // バッジの位置(アイコンの上)
const MEMO_Y = LABEL_Y + 24 // メモの1行目の位置
const RET_TOP = LABEL_Y + 12 // 戻り道の上端
const RET_BOTTOM = 196 // 戻り道の底

type Point = [number, number]

interface Props {
  topic: Topic
  index: number // 今のステップ(0始まり)
  reducedMotion: boolean // 動きを減らす設定がオンか
}

export function Diagram({ topic, index, reducedMotion }: Props) {
  const { actors, steps } = topic
  const step = steps[index]

  // 登場人物 i の中心の x 座標(横幅を均等に分ける)
  const cx = (i: number) => (W / actors.length) * (i + 0.5)
  const posOf = (id: string) => cx(actors.findIndex((a) => a.id === id))

  // これまでのステップで通った線(済んだ線は薄く残す)
  // メモは、端にいる登場人物でも図からはみ出さないよう、位置を内側へ寄せる
  const memoW = step.memo ? Math.max(...step.memo.lines.map((t) => textWidth(`✓ ${t}`, 11))) : 0
  const memoX = step.memo ? Math.min(Math.max(posOf(step.memo.at), memoW / 2 + 4), W - memoW / 2 - 4) : 0

  const pastFlows = steps.slice(0, index).flatMap((s) => (s.flow ? [s.flow] : []))
  const currentFlow = step.flow

  // 線の形を計算する
  const requestLine = (f: Flow) => {
    // 右向きなら +1、左向きなら -1(左向きの矢印にも使える)
    const dir = posOf(f.to) >= posOf(f.from) ? 1 : -1
    const x1 = posOf(f.from) + dir * (R + 6)
    const x2 = posOf(f.to) - dir * (R + 6)
    return { points: [[x1, CY], [x2, CY]] as Point[] }
  }
  const responseLine = (f: Flow) => {
    const a = posOf(f.from)
    const b = posOf(f.to)
    return {
      points: [[a, RET_TOP], [a, RET_BOTTOM], [b, RET_BOTTOM], [b, RET_TOP]] as Point[],
    }
  }

  // 下に敷く薄い点線(道筋だけ先に見せておく)
  const first = actors[0].id
  const last = actors[actors.length - 1].id
  const trackRequest = actors.slice(1).map((a, i) => requestLine({ kind: 'request', from: actors[i].id, to: a.id }))
  const trackResponse = responseLine({ kind: 'response', from: last, to: first })

  return (
    <svg
      className="diagram"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`図: ${actors.map((a) => a.label).join(' → ')}`}
    >
      <defs>
        {/* 光る点や後光に使う「ぼかし」 */}
        <filter id="soft" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ① 道筋(薄い点線) */}
      <g className="track">
        {trackRequest.map((l, i) => (
          <path key={i} d={toPath(l.points)} />
        ))}
        <path d={toPath(trackResponse.points)} />
      </g>

      {/* ② 済んだ線(薄く残す) */}
      {pastFlows.map((f, i) => (
        <FlowLine key={`past-${i}`} flow={f} topic={topic} line={f.kind === 'request' ? requestLine(f) : responseLine(f)} done />
      ))}

      {/* ③ 今のステップの線(線を描くアニメーション + 光る点) */}
      {currentFlow && (
        <g key={`now-${index}`}>
          <FlowLine
            flow={currentFlow}
            topic={topic}
            line={currentFlow.kind === 'request' ? requestLine(currentFlow) : responseLine(currentFlow)}
          />
          {!reducedMotion && (
            <Traveler
              points={(currentFlow.kind === 'request' ? requestLine(currentFlow) : responseLine(currentFlow)).points}
              color={currentFlow.color ?? (currentFlow.kind === 'request' ? topic.requestColor : topic.responseColor)}
              duration={currentFlow.kind === 'request' ? 1100 : 1900}
              delay={150}
            />
          )}
        </g>
      )}

      {/* ④ 登場人物 */}
      {actors.map((a, i) => (
        <ActorNode
          key={a.id}
          actor={a}
          x={cx(i)}
          lit={step.active.includes(a.id)}
          pulse={!!step.pulse && step.active.includes(a.id)}
          pulseDelay={i * 0.3}
          ring={step.ring === a.id}
        />
      ))}

      {/* ⑤ メモ(登場人物の下にチェックリスト) */}
      {step.memo && (
        <g key={`memo-${index}`} className="memo">
          {step.memo.lines.map((text, i) => (
            <text
              key={i}
              x={memoX}
              y={MEMO_Y + i * 16}
              textAnchor="middle"
              style={{ animationDelay: `${0.3 + i * 0.35}s` }}
            >
              ✓ {text}
            </text>
          ))}
        </g>
      )}

      {/* ⑥ バッジ(登場人物の上、または戻り道の上) */}
      {step.badge && (
        <Badge
          key={`badge-${index}`}
          text={step.badge.text}
          x={
            step.badge.at === 'response' && step.flow
              ? (posOf(step.flow.from) + posOf(step.flow.to)) / 2
              : posOf(step.badge.at)
          }
          y={step.badge.at === 'response' ? RET_BOTTOM : BADGE_Y}
          color={
            step.badge.at === 'response'
              ? topic.responseColor
              : (actors.find((a) => a.id === step.badge!.at)?.color ?? '#fff')
          }
        />
      )}
    </svg>
  )
}

// ---------------------------------------------------------------------------

/** 点の並びを SVG の path 文字列にする */
function toPath(points: Point[]) {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
}

/** 矢印1本(リクエストは横向き、レスポンスはコの字で最後が上向き) */
function FlowLine({
  flow,
  topic,
  line,
  done = false,
}: {
  flow: Flow
  topic: Topic
  line: { points: Point[] }
  done?: boolean
}) {
  const color = flow.color ?? (flow.kind === 'request' ? topic.requestColor : topic.responseColor)
  const pts = line.points
  const [ex, ey] = pts[pts.length - 1]
  const dir = ex >= pts[0][0] ? 1 : -1 // 矢印の向き(右向き=1、左向き=-1)

  // 矢じり(三角形)。線の終わりに少し重ねて描く
  const head =
    flow.kind === 'request'
      ? `${ex},${ey} ${ex - 8 * dir},${ey - 4.5} ${ex - 8 * dir},${ey + 4.5}`
      : `${ex},${ey} ${ex - 4.5},${ey + 8} ${ex + 4.5},${ey + 8}`
  // 線本体は矢じりの手前で止める
  const body = [...pts.slice(0, -1), (flow.kind === 'request' ? [ex - 6 * dir, ey] : [ex, ey + 6]) as Point]

  return (
    <g className={done ? 'flow is-done' : 'flow is-drawing'} style={{ color }}>
      {/* pathLength=1 にすると「線の長さ=1」として扱えるので、描くアニメが作りやすい */}
      <path d={toPath(body)} pathLength={1} className={flow.kind === 'response' ? 'flow-line is-long' : 'flow-line'} />
      <polygon points={head} className={flow.kind === 'response' ? 'flow-head is-long' : 'flow-head'} />
    </g>
  )
}

/**
 * 光る点。points の上を順番に進みます。
 * Web Animations API(ブラウザ標準の機能)で動かすので、ライブラリは不要です。
 */
function Traveler({
  points,
  color,
  duration,
  delay,
}: {
  points: Point[]
  color: string
  duration: number
  delay: number
}) {
  const ref = useRef<SVGGElement>(null)
  // 配列は毎回新しく作られるので、文字列にして「中身が変わったときだけ」動かし直す
  const key = points.join(' ')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // 各区間の長さから「全体の何%の地点で角を曲がるか」を計算する
    const lens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]))
    const total = lens.reduce((a, b) => a + b, 0)
    let acc = 0
    const frames = points.map((p, i) => {
      if (i > 0) acc += lens[i - 1]
      return { transform: `translate(${p[0]}px, ${p[1]}px)`, offset: acc / total }
    })
    const anim = el.animate(frames, { duration, delay, easing: 'ease-in-out', fill: 'both' })
    return () => anim.cancel() // ステップが変わったら止める
  }, [key, duration, delay])

  return (
    <g ref={ref} className="traveler" style={{ color }}>
      <circle r={9} fill="currentColor" opacity={0.35} filter="url(#soft)" />
      <circle r={4.5} fill="currentColor" filter="url(#glow)" />
      <circle r={2} fill="#fff" />
    </g>
  )
}

/** 登場人物1人分(アイコン + 名前 + 後光 + 丸い枠) */
function ActorNode({
  actor,
  x,
  lit,
  pulse,
  pulseDelay,
  ring,
}: {
  actor: Actor
  x: number
  lit: boolean
  pulse: boolean
  pulseDelay: number
  ring: boolean
}) {
  const cls = ['actor', lit && 'is-lit', pulse && 'is-pulse'].filter(Boolean).join(' ')
  return (
    <g transform={`translate(${x} ${CY})`}>
      <g className={cls} style={{ color: actor.color, '--d': `${pulseDelay}s` } as CSSProperties}>
        {/* 外側の g は位置、内側の g は脈打ち(拡大縮小)を担当 */}
        <g className="actor-body">
          <circle className="halo" r={R + 4} fill="currentColor" filter="url(#soft)" />
          <circle r={R} className="actor-bg" />
          <ActorIcon kind={actor.icon} />
        </g>
        <text className="actor-label" y={R + 18} textAnchor="middle">
          {actor.label}
        </text>
      </g>
      {ring && (
        <g style={{ color: actor.color }}>
          <circle className="ring" r={R + 8} />
          <circle className="ring is-wave" r={R + 8} />
        </g>
      )}
    </g>
  )
}

/** 文字の幅をざっくり計算(半角は 0.62 文字分、全角は 1 文字分) */
function textWidth(text: string, fontSize: number) {
  return [...text].reduce((w, ch) => w + (ch.charCodeAt(0) < 0x2000 ? 0.62 : 1) * fontSize, 0)
}

/** 小さな吹き出し(丸い枠つきのラベル) */
function Badge({ text, x, y, color }: { text: string; x: number; y: number; color: string }) {
  const fontSize = 11
  const w = textWidth(text, fontSize) + 18
  // 図の端からはみ出さないように位置を調整
  const bx = Math.min(Math.max(x, w / 2 + 2), W - w / 2 - 2)
  return (
    <g className="badge" transform={`translate(${bx} ${y})`} style={{ color }}>
      <g className="badge-inner">
        <rect x={-w / 2} y={-10} width={w} height={20} rx={10} />
        <text textAnchor="middle" dominantBaseline="central" fontSize={fontSize}>
          {text}
        </text>
      </g>
    </g>
  )
}
