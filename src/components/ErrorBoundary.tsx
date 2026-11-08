// 画面の描画中に、予想外のエラーが起きたとき、真っ白にならずに案内を出す部品です。
// エラーの詳しい内容(ファイルの場所や中身)は、画面に出しません(情報を見せない)。

import { Component, type ReactNode } from 'react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="page page-narrow">
        <section className="empty" role="alert">
          表示中に問題が起きました。
          <br />
          <button
            type="button"
            className="quiz-next"
            onClick={() => {
              window.location.hash = '#/'
              window.location.reload()
            }}
          >
            最初から読み込み直す
          </button>
        </section>
      </main>
    )
  }
}
