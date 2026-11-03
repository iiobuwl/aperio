// 「ITの仕組み」の図のページのデータです(「APIの裏側」と同じ作り)。
// キーは languages.ts の項目の id と同じ名前にします。
//   flow: 矢印と光る点。request は隣どうしを右向き・左向きにつなぎ、response は下のコの字の戻り道
//   badge: 登場人物の上に出る小さなふだ('response' なら戻り道の上)
//   memo: 登場人物の下に出るチェックリスト
//   code / codeTo: 光らせるコードの行(範囲指定もできる)

import type { Actor, Topic } from '../types'

const GREEN = '#34d399'
const BLUE = '#60a5fa'
const ORANGE = '#fb923c'
const RED = '#f87171'
const PURPLE = '#c084fc'
const CYAN = '#22d3ee'
const AMBER = '#fbbf24'

const ids = (actors: Actor[]) => actors.map((a) => a.id)

// ---------------------------------------------------------------------------
// HTTP
const httpActors: Actor[] = [
  { id: 'browser', label: 'ブラウザ', icon: 'browser', color: GREEN },
  { id: 'server', label: 'サーバー', icon: 'server', color: ORANGE },
  { id: 'db', label: 'データ', icon: 'database', color: RED },
]

const http: Topic = {
  title: 'HTTPの会話',
  subtitle: 'リクエスト と レスポンス',
  chips: [
    { label: 'メソッド', value: 'GET' },
    { label: 'ステータス', value: '200 OK', color: GREEN, fromStep: 5 },
  ],
  actors: httpActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'HTTPメッセージのイメージ',
    lines: [
      'GET /orders/42 HTTP/1.1',
      'Host: shop.example.com',
      'Accept: application/json',
      'HTTP/1.1 200 OK',
      'Content-Type: application/json',
      '{"id":42,"qty":2}',
    ],
  },
  steps: [
    { title: 'HTTPは「お願い」と「返事」の会話', note: 'ブラウザとサーバーは、決まった書き方で会話する', active: ['browser', 'server'] },
    {
      title: 'リクエストの1行目',
      note: '「何を」「どうしてほしいか」を1行で伝える',
      tone: 'browser',
      active: ['browser'],
      badge: { at: 'browser', text: 'GET /orders/42' },
      flow: { kind: 'request', from: 'browser', to: 'server' },
      code: 1,
    },
    {
      title: 'ヘッダー: 付け足しの情報',
      note: '宛先のサイト名や、欲しいデータの形式などを添える',
      tone: 'browser',
      active: ['browser'],
      badge: { at: 'browser', text: 'Host / Accept' },
      code: 2,
      codeTo: 3,
    },
    {
      title: 'サーバーが読み取る',
      note: '1行目とヘッダーから、お願いの中身を理解する',
      tone: 'server',
      active: ['server'],
      memo: { at: 'server', lines: ['GET = 取得したい', '/orders/42 = 42番の注文'] },
    },
    {
      title: 'データを取りに行く',
      tone: 'db',
      active: ['db'],
      badge: { at: 'db', text: '#42 あり' },
      flow: { kind: 'request', from: 'server', to: 'db' },
    },
    {
      title: 'レスポンスの1行目: 結果の報告',
      note: '数字(ステータスコード)で、うまくいったかを伝える',
      tone: 'response',
      active: [],
      badge: { at: 'response', text: '200 OK' },
      flow: { kind: 'response', from: 'db', to: 'browser' },
      code: 4,
    },
    {
      title: 'ボディ: 返事の中身',
      note: 'ヘッダーのあとに、本文(データ)が続く',
      tone: 'browser',
      active: ['browser'],
      badge: { at: 'browser', text: '{"id":42}' },
      code: 5,
      codeTo: 6,
    },
    { title: 'この往復が、HTTPのすべて', note: 'ページを開く・ボタンを押すたびに、この会話が起きている', active: ids(httpActors), pulse: true },
  ],
}

// ---------------------------------------------------------------------------
// DNS
const dnsActors: Actor[] = [
  { id: 'dns', label: 'DNS', icon: 'globe', color: PURPLE },
  { id: 'browser', label: 'ブラウザ', icon: 'browser', color: GREEN },
  { id: 'server', label: 'Webサーバー', icon: 'server', color: ORANGE },
]

const dns: Topic = {
  title: 'DNSで住所を調べる',
  subtitle: 'shop.example.com → 203.0.113.10',
  chips: [
    { label: '名前', value: 'shop.example.com' },
    { label: '住所', value: '203.0.113.10', color: PURPLE, fromStep: 3 },
  ],
  actors: dnsActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'ターミナルのイメージ',
    lines: [
      '$ dig shop.example.com',
      ';; QUESTION  shop.example.com  A ?',
      ';; ANSWER    shop.example.com  300  IN  A  203.0.113.10',
      '$ curl http://203.0.113.10/',
    ],
  },
  steps: [
    { title: '名前では、通信できない', note: 'コンピュータは数字の住所(IPアドレス)で通信する。ドメイン名は人間用', tone: 'browser', active: ['browser'] },
    {
      title: 'DNSに住所を聞く',
      note: '「shop.example.com の住所は?」',
      tone: 'dns',
      active: ['browser'],
      badge: { at: 'browser', text: 'shop.example.com は?' },
      flow: { kind: 'request', from: 'browser', to: 'dns', color: PURPLE },
      code: 1,
      codeTo: 2,
    },
    {
      title: 'DNSが調べる',
      note: '電話帳をたどるように、上から順に探す',
      tone: 'dns',
      active: ['dns'],
      memo: { at: 'dns', lines: ['まず手元の記憶を確認', '無ければ上位のDNSへ', '.com → example.com の順'] },
    },
    {
      title: '住所が返ってくる',
      tone: 'dns',
      active: ['dns', 'browser'],
      badge: { at: 'browser', text: '203.0.113.10' },
      flow: { kind: 'request', from: 'dns', to: 'browser', color: PURPLE },
      code: 3,
    },
    {
      title: 'しばらく覚えておく',
      note: '期限(TTL)のあいだは、聞き直さずに済む',
      tone: 'browser',
      active: ['browser'],
      memo: { at: 'browser', lines: ['300秒は記憶する', '次は即答できる'] },
    },
    {
      title: 'その住所に接続',
      tone: 'request',
      active: ['browser', 'server'],
      badge: { at: 'server', text: '203.0.113.10' },
      flow: { kind: 'request', from: 'browser', to: 'server' },
      code: 4,
    },
    {
      title: 'サーバーが応答',
      tone: 'response',
      active: [],
      badge: { at: 'response', text: 'ページ(HTML)' },
      flow: { kind: 'response', from: 'server', to: 'browser' },
    },
    { title: '名前 → 住所 → 接続', note: 'ページを開く前に、毎回この「住所調べ」が先に行われている', active: ids(dnsActors), pulse: true },
  ],
}

// ---------------------------------------------------------------------------
// HTTPS
const httpsActors: Actor[] = [
  { id: 'browser', label: 'ブラウザ', icon: 'browser', color: GREEN },
  { id: 'server', label: 'サーバー', icon: 'server', color: ORANGE },
  { id: 'ca', label: '認証局', icon: 'key', color: PURPLE },
]

const https: Topic = {
  title: 'HTTPSと暗号化',
  subtitle: '通信を鍵で守る(TLS)',
  chips: [
    { label: 'ポート', value: '443' },
    { value: 'TLS' },
  ],
  actors: httpsActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'TLSの流れ(イメージ)',
    lines: [
      'Client Hello    使える暗号の一覧',
      'Server Hello    証明書を添えて返事',
      '証明書を検証    OK なら続ける',
      '共通の鍵を作る  以降はこの鍵で暗号化',
      'GET /orders/42  ← 暗号文で送信',
    ],
  },
  steps: [
    { title: 'HTTPのままだと、丸見え', note: 'Wi-Fi や途中の機器で、通信の中身を読まれてしまう', active: ['browser', 'server'] },
    {
      title: '準備: 認証局が身元を保証',
      note: 'サイトの持ち主を確認して、「本物の印」(証明書)を渡す',
      tone: 'ca',
      active: ['ca', 'server'],
      badge: { at: 'server', text: '証明書' },
      memo: { at: 'ca', lines: ['持ち主を確認', '証明書を発行'] },
      flow: { kind: 'request', from: 'ca', to: 'server', color: PURPLE },
    },
    {
      title: 'ブラウザがあいさつ',
      tone: 'browser',
      active: ['browser'],
      badge: { at: 'browser', text: 'Client Hello' },
      flow: { kind: 'request', from: 'browser', to: 'server' },
      code: 1,
    },
    {
      title: 'サーバーが証明書を見せる',
      tone: 'server',
      active: ['server'],
      badge: { at: 'browser', text: '証明書' },
      flow: { kind: 'request', from: 'server', to: 'browser', color: ORANGE },
      code: 2,
    },
    {
      title: 'ブラウザが証明書を調べる',
      tone: 'browser',
      active: ['browser'],
      memo: { at: 'browser', lines: ['発行元は信頼できる?', '期限は切れていない?', 'ドメインは一致?'] },
      code: 3,
    },
    {
      title: '2人だけの共通の鍵を作る',
      note: 'この鍵を知っているのは、ブラウザとサーバーだけ',
      tone: 'server',
      active: ['browser', 'server'],
      badge: { at: 'server', text: '共通鍵 ••••' },
      code: 4,
    },
    {
      title: '暗号化して通信',
      note: '途中で盗み見られても、中身は読めない',
      tone: 'request',
      active: ['browser', 'server'],
      badge: { at: 'browser', text: '暗号文 x8#k…' },
      flow: { kind: 'request', from: 'browser', to: 'server', color: AMBER },
      code: 5,
    },
    { title: 'アドレスバーの鍵マークが目印', note: 'https:// で始まるサイトは、この手順で守られている', active: ids(httpsActors), pulse: true },
  ],
}

// ---------------------------------------------------------------------------
// Cookie とセッション
const cookieActors: Actor[] = [
  { id: 'browser', label: 'ブラウザ', icon: 'browser', color: GREEN },
  { id: 'server', label: 'サーバー', icon: 'server', color: ORANGE },
  { id: 'session', label: 'セッション', icon: 'database', color: RED },
]

const cookie: Topic = {
  title: 'Cookie とセッション',
  subtitle: 'ログイン状態を覚える仕組み',
  chips: [{ label: 'Cookie', value: 'session=abc123', color: GREEN, fromStep: 3 }],
  actors: cookieActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'HTTPのイメージ',
    lines: [
      'POST /login   email=nao@example.com',
      'Set-Cookie: session=abc123',
      'GET /mypage',
      'Cookie: session=abc123',
    ],
  },
  steps: [
    { title: 'HTTPは、すぐ忘れる', note: '1回ごとの会話は、前のことを覚えていない。誰が誰か分からない', active: ['browser', 'server'] },
    {
      title: 'ログインを送る',
      tone: 'browser',
      active: ['browser'],
      badge: { at: 'browser', text: 'メール + パスワード' },
      flow: { kind: 'request', from: 'browser', to: 'server' },
      code: 1,
    },
    {
      title: 'サーバーが「箱」を作る',
      note: '本人と確認できたら、その人専用の箱を用意する',
      tone: 'server',
      active: ['server', 'session'],
      badge: { at: 'session', text: 'abc123 → 利用者7' },
      memo: { at: 'server', lines: ['本人を確認', '整理番号を発行'] },
      flow: { kind: 'request', from: 'server', to: 'session' },
    },
    {
      title: '整理番号をブラウザへ',
      tone: 'server',
      active: ['server', 'browser'],
      badge: { at: 'browser', text: 'abc123' },
      flow: { kind: 'request', from: 'server', to: 'browser', color: ORANGE },
      code: 2,
    },
    {
      title: 'ブラウザが保管',
      tone: 'browser',
      active: ['browser'],
      memo: { at: 'browser', lines: ['Cookie として保存', '同じサイトへ自動で添える'] },
    },
    {
      title: '次のリクエストに添える',
      tone: 'browser',
      active: ['browser'],
      badge: { at: 'browser', text: 'Cookie: abc123' },
      flow: { kind: 'request', from: 'browser', to: 'server' },
      code: 3,
      codeTo: 4,
    },
    {
      title: 'サーバーが箱を開ける',
      tone: 'session',
      active: ['server', 'session'],
      badge: { at: 'session', text: '#7 ナオ' },
      memo: { at: 'server', lines: ['番号を照合', '利用者7だと分かる'] },
      flow: { kind: 'request', from: 'server', to: 'session' },
    },
    {
      title: '本人として返事',
      tone: 'response',
      active: [],
      badge: { at: 'response', text: 'ようこそ ナオさん' },
      flow: { kind: 'response', from: 'session', to: 'browser' },
    },
    { title: 'これがログイン状態', note: 'ブラウザが番号を見せ続けるから、ログインが続く', active: ids(cookieActors), pulse: true },
  ],
}

// ---------------------------------------------------------------------------
// キャッシュ
const cacheActors: Actor[] = [
  { id: 'browser', label: 'ブラウザ', icon: 'browser', color: GREEN },
  { id: 'cache', label: 'キャッシュ', icon: 'cloud', color: AMBER },
  { id: 'server', label: 'サーバー', icon: 'server', color: ORANGE },
]

const cache: Topic = {
  title: 'キャッシュで速くする',
  subtitle: '作り置きを使い回す',
  chips: [{ label: '有効期間', value: '60秒' }],
  actors: cacheActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'HTTPヘッダのイメージ',
    lines: [
      'Cache-Control: max-age=60',
      'ETag: "v7"',
      'If-None-Match: "v7"',
      'HTTP/1.1 304 Not Modified',
    ],
  },
  steps: [
    {
      title: '毎回つくると、遅い',
      note: 'DBに聞いてHTMLを組み立てるのに、300ミリ秒かかる',
      tone: 'server',
      active: ['server'],
      memo: { at: 'server', lines: ['DBに問い合わせ', 'HTMLを組み立てる'] },
    },
    { title: 'キャッシュは「作り置き」', note: '1度つくった答えを、近くに置いて使い回す', tone: 'cache', active: ['cache'] },
    {
      title: '1回目: 作り置きは無い',
      tone: 'browser',
      active: ['browser', 'cache'],
      badge: { at: 'cache', text: '空っぽ (miss)' },
      flow: { kind: 'request', from: 'browser', to: 'cache' },
    },
    {
      title: 'サーバーに取りに行く',
      tone: 'server',
      active: ['server'],
      badge: { at: 'server', text: '300ms' },
      flow: { kind: 'request', from: 'cache', to: 'server' },
    },
    {
      title: '作り置きして返す',
      note: '「60秒は使い回してよい」という約束つきで返す',
      tone: 'cache',
      active: ['cache'],
      badge: { at: 'cache', text: '60秒 保存' },
      flow: { kind: 'request', from: 'server', to: 'cache', color: GREEN },
      code: 1,
    },
    {
      title: 'ブラウザへ返す',
      tone: 'browser',
      active: ['browser'],
      badge: { at: 'browser', text: 'ページ' },
      flow: { kind: 'request', from: 'cache', to: 'browser', color: GREEN },
    },
    {
      title: '2回目: 作り置きがある',
      tone: 'cache',
      active: ['browser', 'cache'],
      badge: { at: 'cache', text: 'ヒット! (hit)' },
      flow: { kind: 'request', from: 'browser', to: 'cache' },
    },
    {
      title: 'すぐ返事が返る',
      note: 'サーバーは何もしない。待ち時間もほとんどない',
      tone: 'browser',
      active: ['browser', 'cache'],
      badge: { at: 'browser', text: '5ms' },
      flow: { kind: 'request', from: 'cache', to: 'browser', color: GREEN },
    },
    {
      title: '古くなったら「変わってない?」と確認',
      note: '変わっていなければ、中身は送り直さない(304)',
      tone: 'server',
      active: ['browser', 'server'],
      memo: { at: 'server', lines: ['ETag が同じ?', '同じなら 304 だけ返す'] },
      code: 2,
      codeTo: 4,
    },
  ],
}

// ---------------------------------------------------------------------------
// CDN
const cdnActors: Actor[] = [
  { id: 'browser', label: 'あなた', icon: 'browser', color: GREEN },
  { id: 'cdn', label: 'CDN', icon: 'cloud', color: CYAN },
  { id: 'origin', label: 'オリジン', icon: 'server', color: ORANGE },
]

const cdn: Topic = {
  title: 'CDNで近くから届ける',
  subtitle: '世界中の「倉庫」に預けておく',
  chips: [{ label: '距離', value: '約50km', color: CYAN, fromStep: 2 }],
  actors: cdnActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'CDNのイメージ',
    lines: [
      'cdn.shop.example.com  →  東京の拠点',
      'Cache: MISS   (1回目)',
      'Cache: HIT    (2回目以降)',
    ],
  },
  steps: [
    { title: '遠いと、それだけ遅い', note: '海外のサーバーまで往復すると、通信の時間がかかる', tone: 'origin', active: ['browser', 'origin'] },
    {
      title: 'CDNは、世界中の倉庫',
      tone: 'cdn',
      active: ['cdn'],
      memo: { at: 'cdn', lines: ['各地に拠点を持つ', '画像・CSS・JSを預かる'] },
    },
    {
      title: 'いちばん近い拠点へ',
      tone: 'browser',
      active: ['browser', 'cdn'],
      badge: { at: 'cdn', text: '東京の拠点' },
      flow: { kind: 'request', from: 'browser', to: 'cdn' },
      code: 1,
    },
    {
      title: '1回目: 倉庫には無い',
      tone: 'cdn',
      active: ['cdn'],
      badge: { at: 'cdn', text: 'MISS' },
      code: 2,
    },
    {
      title: 'オリジンへ取りに行く',
      note: 'オリジン = 元のファイルを持つ本当のサーバー',
      tone: 'origin',
      active: ['origin'],
      memo: { at: 'origin', lines: ['元のファイルを渡す'] },
      flow: { kind: 'request', from: 'cdn', to: 'origin' },
    },
    {
      title: '倉庫に預けて、返す',
      tone: 'cdn',
      active: ['cdn'],
      badge: { at: 'cdn', text: '保存' },
      flow: { kind: 'request', from: 'origin', to: 'cdn', color: GREEN },
    },
    {
      title: 'あなたに届く',
      tone: 'browser',
      active: ['browser'],
      badge: { at: 'browser', text: '画像' },
      flow: { kind: 'request', from: 'cdn', to: 'browser', color: GREEN },
    },
    {
      title: '2回目以降: 近くから即答',
      note: 'オリジンまで行かないので、速い',
      tone: 'cdn',
      active: ['browser', 'cdn'],
      badge: { at: 'cdn', text: 'HIT' },
      flow: { kind: 'request', from: 'browser', to: 'cdn' },
      code: 3,
    },
    { title: 'オリジンも楽になる', note: '大量のアクセスを拠点が受け止めるので、元のサーバーは落ちにくい', active: ids(cdnActors), pulse: true },
  ],
}

// ---------------------------------------------------------------------------
// ログインとトークン
const loginActors: Actor[] = [
  { id: 'auth', label: '認証', icon: 'key', color: PURPLE },
  { id: 'app', label: 'アプリ', icon: 'phone', color: GREEN },
  { id: 'api', label: 'API', icon: 'shield', color: BLUE },
]

const login: Topic = {
  title: 'ログインとトークン',
  subtitle: 'パスワードのかわりに通行証',
  chips: [{ label: '方式', value: 'Bearer' }],
  actors: loginActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'HTTPのイメージ',
    lines: [
      'POST /login  {"email": …, "password": …}',
      '{"token": "eyJhbGciOi…"}',
      'GET /api/orders/42',
      'Authorization: Bearer eyJhbGciOi…',
    ],
  },
  steps: [
    { title: '毎回パスワードは送りたくない', note: '何度も送ると、盗まれる危険が増える。かわりに「通行証」を使う', tone: 'app', active: ['app'] },
    {
      title: 'ログイン: 本人確認の依頼',
      tone: 'auth',
      active: ['app'],
      badge: { at: 'app', text: 'メール + パスワード' },
      flow: { kind: 'request', from: 'app', to: 'auth', color: PURPLE },
      code: 1,
    },
    {
      title: '認証サーバーが確認',
      tone: 'auth',
      active: ['auth'],
      memo: { at: 'auth', lines: ['パスワードを照合', '期限つきの通行証を作る', '改ざん防止の署名をつける'] },
    },
    {
      title: '通行証(トークン)を渡す',
      tone: 'auth',
      active: ['auth', 'app'],
      badge: { at: 'app', text: 'token eyJ…' },
      flow: { kind: 'request', from: 'auth', to: 'app', color: PURPLE },
      code: 2,
    },
    {
      title: 'アプリがしまっておく',
      tone: 'app',
      active: ['app'],
      memo: { at: 'app', lines: ['トークンを保存', '次から、これを見せる'] },
    },
    {
      title: 'APIに通行証を見せる',
      tone: 'request',
      active: ['app', 'api'],
      badge: { at: 'app', text: 'Bearer ••••' },
      flow: { kind: 'request', from: 'app', to: 'api' },
      code: 3,
      codeTo: 4,
    },
    {
      title: 'APIが通行証を検査',
      tone: 'api',
      active: ['api'],
      badge: { at: 'api', text: '認証 OK' },
      memo: { at: 'api', lines: ['署名を確認', '期限を確認', '利用者を特定'] },
    },
    {
      title: '本人として処理して返す',
      tone: 'response',
      active: [],
      badge: { at: 'response', text: '{"id":42,"qty":2}' },
      flow: { kind: 'response', from: 'api', to: 'app' },
    },
    {
      title: '期限が切れたら、また発行',
      note: '通行証は短い期限つき。盗まれても、悪用できる時間が短い',
      active: ['auth', 'app'],
      pulse: true,
    },
  ],
}

// ---------------------------------------------------------------------------
// ロードバランサ
const lbActors: Actor[] = [
  { id: 'users', label: '利用者', icon: 'browser', color: GREEN },
  { id: 'lb', label: 'ロードバランサ', icon: 'balancer', color: CYAN },
  { id: 'servers', label: 'サーバー群', icon: 'server', color: ORANGE },
]

const loadBalancer: Topic = {
  title: 'ロードバランサ',
  subtitle: 'アクセスを複数のサーバーに配る',
  chips: [{ label: '方式', value: 'ラウンドロビン' }],
  actors: lbActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'nginx 設定のイメージ',
    lines: [
      'upstream app {',
      '    server 10.0.0.1;  # A',
      '    server 10.0.0.2;  # B',
      '    server 10.0.0.3;  # C',
      '}',
      'location / { proxy_pass http://app; }',
    ],
  },
  steps: [
    {
      title: '1台だと、限界がある',
      note: 'アクセスが集中すると、処理しきれなくなって止まる',
      tone: 'server',
      active: ['servers'],
      memo: { at: 'servers', lines: ['同時に何千人も…', '処理が追いつかない'] },
    },
    {
      title: 'サーバーを並べて、受付を置く',
      note: '利用者は受付(ロードバランサ)だけを知っていればよい',
      tone: 'lb',
      active: ['lb'],
      code: 1,
      codeTo: 5,
    },
    {
      title: 'リクエストが来る',
      tone: 'users',
      active: ['users', 'lb'],
      badge: { at: 'users', text: 'リクエスト #1' },
      flow: { kind: 'request', from: 'users', to: 'lb' },
    },
    {
      title: '#1 は サーバーA へ',
      tone: 'server',
      active: ['lb', 'servers'],
      badge: { at: 'servers', text: 'A が処理' },
      flow: { kind: 'request', from: 'lb', to: 'servers' },
      code: 6,
    },
    {
      title: '#2 は サーバーB へ',
      note: '順番に配る(ラウンドロビン)',
      tone: 'server',
      active: ['lb', 'servers'],
      badge: { at: 'servers', text: 'B が処理' },
      flow: { kind: 'request', from: 'lb', to: 'servers' },
    },
    {
      title: '#3 は サーバーC へ',
      note: '次は、また A から',
      tone: 'server',
      active: ['lb', 'servers'],
      badge: { at: 'servers', text: 'C が処理' },
      flow: { kind: 'request', from: 'lb', to: 'servers' },
    },
    {
      title: '故障したら、外す',
      tone: 'lb',
      active: ['lb', 'servers'],
      memo: { at: 'lb', lines: ['定期的に生存確認', '応答のない B を外す', 'AとCだけで配る'] },
    },
    { title: '足りなければ、台数を増やす', note: 'サーバーを足すだけで、より多くのアクセスに耐えられる', active: ids(lbActors), pulse: true },
  ],
}

// ---------------------------------------------------------------------------
// キューと非同期処理
const queueActors: Actor[] = [
  { id: 'web', label: 'Webサーバー', icon: 'server', color: ORANGE },
  { id: 'queue', label: 'キュー', icon: 'queue', color: AMBER },
  { id: 'worker', label: 'ワーカー', icon: 'server', color: BLUE },
  { id: 'mail', label: 'メール', icon: 'mail', color: GREEN },
]

const queue: Topic = {
  title: 'キューと非同期処理',
  subtitle: '重い仕事を後ろに回す',
  chips: [{ label: 'Laravel', value: 'Queue' }],
  actors: queueActors,
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'Laravel のイメージ',
    lines: [
      '// 注文を保存して、すぐ返事する',
      '$order = Order::create($data);',
      'SendReceipt::dispatch($order);',
      'return response()->json($order, 201);',
      '// ワーカー側(あとで実行される)',
      'public function handle() { Mail::to($user)->send(…); }',
    ],
  },
  steps: [
    {
      title: '重い処理で、待たせたくない',
      note: '注文のたびにメールを送ると、利用者の画面が3秒止まる',
      tone: 'web',
      active: ['web'],
      memo: { at: 'web', lines: ['メール送信に3秒', '利用者は待つだけ…'] },
    },
    {
      title: '注文を保存',
      tone: 'web',
      active: ['web'],
      memo: { at: 'web', lines: ['DBに保存', 'ここまでは一瞬'] },
      code: 2,
    },
    {
      title: '「仕事」をキューに入れる',
      note: 'キュー = 順番待ちの行列。仕事の札を置いておく',
      tone: 'queue',
      active: ['web', 'queue'],
      badge: { at: 'queue', text: '仕事: メール送信' },
      flow: { kind: 'request', from: 'web', to: 'queue' },
      code: 3,
    },
    {
      title: '利用者には、すぐ返事',
      note: '重い仕事は後ろで。待たせない',
      tone: 'web',
      active: ['web'],
      badge: { at: 'web', text: '201 Created' },
      code: 4,
    },
    {
      title: 'ワーカーが仕事を取り出す',
      note: 'ワーカー = 裏で動き続ける係',
      tone: 'worker',
      active: ['queue', 'worker'],
      badge: { at: 'worker', text: '仕事を受け取り' },
      flow: { kind: 'request', from: 'queue', to: 'worker' },
      code: 5,
      codeTo: 6,
    },
    {
      title: 'メールを送る',
      tone: 'mail',
      active: ['worker', 'mail'],
      badge: { at: 'mail', text: '送信中…' },
      flow: { kind: 'request', from: 'worker', to: 'mail' },
    },
    {
      title: '失敗したら、再試行',
      tone: 'queue',
      active: ['queue', 'worker'],
      memo: { at: 'worker', lines: ['失敗したら少し後に再実行', '何度もだめなら失敗リストへ'] },
    },
    { title: '利用者には影響しない', note: '裏で時間がかかっても、画面は待たない', active: ids(queueActors), pulse: true },
  ],
}

export const IT_TOPICS: Record<string, Topic> = {
  http,
  dns,
  https,
  cookie,
  cache,
  cdn,
  login,
  'load-balancer': loadBalancer,
  queue,
}
