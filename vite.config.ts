import { createHash } from 'node:crypto'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// ---------------------------------------------------------------------------
// セキュリティヘッダーと、配布物の改ざん検知(SRI)
//
// このサイトは、自分のファイルだけで動く(外部のスクリプト・画像・フォント・通信は使わない)ので、
// 「自分のファイル以外は、いっさい読み込まない・実行しない」という厳しいルール(CSP)にできます。
// 万が一、悪意のあるコードが紛れ込んでも、ブラウザが実行を止めてくれます。
//   ・ビルドしたファイルには、CSP を <meta> で埋め込む(GitHub Pages のように、ヘッダーを足せない所でも効く)
//   ・読み込む JS / CSS には、中身の指紋(SRI)をつける。配信の途中で書きかえられたら、ブラウザが実行しない
//   ・同じ内容のヘッダーを、`dist/_headers` にも書き出す(Netlify / Cloudflare Pages では、これが使われる)
//   ・`npm run preview` でも、同じヘッダーを付けて確認できる
// 開発サーバー(npm run dev)は、更新の仕組みが inline のスクリプトを使うため、CSP を付けません。
// ---------------------------------------------------------------------------

type Directives = Record<string, string[]>

/** <meta> でも効く指令 */
const CSP: Directives = {
  'default-src': ["'none'"], // 何も許可しない、から始める
  'script-src': ["'self'"], // 自分のスクリプトだけ(inline や eval は不可)
  'style-src': ["'self'"], // 自分のCSSだけ
  'img-src': ["'self'"],
  'font-src': ["'self'"],
  'connect-src': ["'none'"], // 外部との通信(fetch など)はしない
  'manifest-src': ["'self'"],
  'worker-src': ["'none'"],
  'frame-src': ["'none'"],
  'media-src': ["'none'"],
  'object-src': ["'none'"], // Flash などのプラグインは使わない
  'base-uri': ["'none'"], // <base> で、リンク先をすりかえられない
  'form-action': ["'none'"], // フォームの送信先は、ない
  'require-trusted-types-for': ["'script'"], // DOM を使ったXSSを、仕組みで防ぐ
  'trusted-types': ["'none'"], // 「信頼する変換のルール」を、あとから作らせない
}

/** ヘッダーでだけ効く指令(<meta> では無視される) */
const CSP_HEADER_ONLY: Directives = {
  'frame-ancestors': ["'none'"], // 他のサイトの <iframe> に埋め込めない(クリックジャッキング対策)
  'upgrade-insecure-requests': [],
}

const toPolicy = (d: Directives) =>
  Object.entries(d)
    .map(([k, v]) => [k, ...v].join(' '))
    .join('; ')

// ブラウザの機能のうち、このサイトが使わないものは、すべて禁止する
const PERMISSIONS = [
  'accelerometer', 'bluetooth', 'camera', 'clipboard-read', 'display-capture', 'geolocation', 'gyroscope',
  'hid', 'magnetometer', 'microphone', 'midi', 'payment', 'publickey-credentials-get', 'screen-wake-lock',
  'serial', 'usb', 'xr-spatial-tracking',
]
  .map((f) => `${f}=()`)
  .join(', ')

const HEADERS: Record<string, string> = {
  'Content-Security-Policy': toPolicy({ ...CSP, ...CSP_HEADER_ONLY }),
  'X-Content-Type-Options': 'nosniff', // ファイルの種類を、ブラウザが推測しない
  'X-Frame-Options': 'DENY', // 古いブラウザ向けの、埋め込み禁止
  'Referrer-Policy': 'no-referrer', // 遷移先に、元のURLを知らせない
  'Permissions-Policy': PERMISSIONS,
  'Cross-Origin-Opener-Policy': 'same-origin', // 他のウィンドウと、情報を共有しない
  'Cross-Origin-Embedder-Policy': 'require-corp', // 同じ出どころのファイルだけを読み込む
  'Cross-Origin-Resource-Policy': 'same-origin', // 他のサイトから、このサイトのファイルを読ませない
  'Origin-Agent-Cluster': '?1', // サイトごとに、実行環境を分ける
  'X-Permitted-Cross-Domain-Policies': 'none', // 古いプラグインが、データを読むのを禁止
  'X-DNS-Prefetch-Control': 'off',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains', // HTTPS で配信されるときだけ有効
}

function security(): Plugin {
  return {
    name: 'aperio-security',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        // 読み込む自分の JS / CSS に、中身の指紋(SRI: sha384)をつける
        const withSri = html.replace(/<(?:script|link)\b[^>]*?(?:src|href)="([^"]+)"[^>]*>/g, (tag, url: string) => {
          const file = ctx.bundle?.[url.replace(/^\//, '')]
          if (!file) return tag
          const data = file.type === 'chunk' ? file.code : file.source
          const hash = createHash('sha384').update(data).digest('base64')
          return tag.replace(/\s*\/?>$/, ` integrity="sha384-${hash}">`)
        })
        return {
          html: withSri,
          // CSP は、スクリプトを読み込む前に効かせるため、head の先頭に入れる
          tags: [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: toPolicy(CSP) }, injectTo: 'head-prepend' }],
        }
      },
    },
    // ヘッダーを足せるホスティング向けに、_headers を書き出す
    generateBundle() {
      const body = Object.entries(HEADERS)
        .map(([k, v]) => `  ${k}: ${v}`)
        .join('\n')
      this.emitFile({ type: 'asset', fileName: '_headers', source: `/*\n${body}\n` })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), security()],
  build: {
    sourcemap: false, // 元のコードを、公開しない
    assetsInlineLimit: 0, // 小さい画像などを data: URL に埋め込まない(CSP と合わせる)
  },
  // 開発中も、ヘッダーのうち CSP と COEP 以外は付けて、動作を確かめられるようにする
  server: {
    host: 'localhost', // 同じネットワークの他の端末からは、見えない(必要なときだけ --host を付ける)
    cors: false, // 他のサイトのページから、開発サーバーのファイルを読ませない
    headers: Object.fromEntries(Object.entries(HEADERS).filter(([k]) => !['Content-Security-Policy', 'Cross-Origin-Embedder-Policy'].includes(k))),
  },
  // `npm run preview` では、本番と同じヘッダーを付ける
  preview: { cors: false, headers: HEADERS },
})
