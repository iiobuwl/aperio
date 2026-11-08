// アプリの起動口です。index.html の <div id="root"> に App を描きます。
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

// クリックジャッキング対策: 他のサイトの <iframe> に埋め込まれているときは、何も表示しない。
// (ヘッダーの frame-ancestors / X-Frame-Options が使えない場所でも、これで守れる)
if (window.top === window.self) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}
