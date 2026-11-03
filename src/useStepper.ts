// ステップ送りの仕組み(今のステップ・自動再生・キーボード操作)をまとめた部品です。
// 「APIの裏側」のような図のページも、PHP / SQL の解説ページも、これを使います。

import { useCallback, useEffect, useState } from 'react'

export const STEP_MS = 3000 // 自動再生で1ステップを見せる時間(ミリ秒)

export function useStepper(count: number) {
  const last = count - 1
  const [index, setIndex] = useState(0) // 今のステップ(0始まり)
  const [playing, setPlaying] = useState(true) // 自動再生中か

  // ---- 操作 ----
  const goTo = useCallback((i: number) => setIndex(Math.min(Math.max(i, 0), last)), [last])

  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false)
    } else {
      if (index === last) setIndex(0) // 最後で再生したら最初から
      setPlaying(true)
    }
  }, [playing, index, last])

  // ---- 自動再生: 3秒たったら次へ。最後のステップを見せ終えたら止まる ----
  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => {
      if (index < last) setIndex(index + 1)
      else setPlaying(false)
    }, STEP_MS)
    return () => window.clearTimeout(id) // ステップが変わったらタイマーを取り直す
  }, [playing, index, last])

  // ---- キーボード: ←→ で前後、スペースで再生/一時停止 ----
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goTo(index + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goTo(index - 1)
      } else if (e.key === ' ') {
        e.preventDefault() // ページのスクロールを止める
        if (!e.repeat) togglePlay()
      }
    }
    // ボタンにフォーカスがあると、スペースでそのボタンも押されてしまうので止める
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') e.preventDefault()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [index, goTo, togglePlay])

  return { index, playing, goTo, togglePlay }
}
