// 「APIの裏側」ページのデータです。
// 画面の部品(Diagram.tsx / App.tsx)は、ここに書いた内容を読んで描くだけです。
// 文言や順番を変えたいときは、このファイルだけ直せばOKです。

import type { Topic } from './types'

// 登場人物の色(styles.css の色とそろえています)
const GREEN = '#34d399' // アプリ
const BLUE = '#60a5fa' // API
const ORANGE = '#fb923c' // サーバー
const RED = '#f87171' // データベース

const ALL = ['app', 'api', 'server', 'db']

export const apiTopic: Topic = {
  title: 'APIの裏側',
  subtitle: 'GET /api/orders/42',
  chips: [
    { label: 'メソッド', value: 'GET' },
    { value: 'HTTPS' },
    // 8ステップ目(0始まりで7)から表示する
    { label: 'ステータス', value: '200 OK', color: GREEN, fromStep: 7 },
  ],
  actors: [
    { id: 'app', label: 'アプリ', icon: 'phone', color: GREEN },
    { id: 'api', label: 'API', icon: 'shield', color: BLUE },
    { id: 'server', label: 'サーバー', icon: 'server', color: ORANGE },
    { id: 'db', label: 'DB', icon: 'database', color: RED },
  ],
  requestColor: BLUE,
  responseColor: GREEN,
  code: {
    label: 'Laravel (PHP) のイメージ',
    lines: [
      '// GET /api/orders/42',
      "Route::middleware('auth:sanctum')",
      "$q = Order::where('user_id', $user->id);",
      '$order = $q->findOrFail(42);',
      'return response()->json($order);',
    ],
  },
  steps: [
    {
      title: 'ボタンを1回タップ',
      note: 'その裏で、何が起きている?',
      active: [],
    },
    {
      title: '登場人物はこの4つ',
      note: 'アプリ・API・サーバー・データベース',
      active: ALL,
    },
    {
      title: 'アプリがリクエストを送る',
      note: '「42番の注文を見せて」と、通行証(トークン)を添えて送る',
      tone: 'app',
      active: ['app'],
      badge: { at: 'app', text: 'Bearer ••••' },
      flow: { kind: 'request', from: 'app', to: 'api' },
      code: 1,
    },
    {
      title: 'APIが入口でチェック',
      note: '受付で、正しい相手かどうかを確かめる',
      tone: 'api',
      active: ['api'],
      badge: { at: 'api', text: '認証 OK' },
      memo: { at: 'api', lines: ['URLを照合', 'トークンを確認', '利用者を特定'] },
      code: 2,
    },
    {
      title: 'サーバーが処理する',
      note: '注文を取り出す手順を組み立てる',
      tone: 'server',
      active: ['server'],
      memo: { at: 'server', lines: ['本人の注文に絞る', 'SQLを組み立て'] },
      flow: { kind: 'request', from: 'api', to: 'server' },
      code: 3,
    },
    {
      title: 'DBが注文を探す',
      note: 'select * from orders where user_id = 7 and id = 42',
      noteIsCode: true,
      tone: 'db',
      active: ['db'],
      ring: 'db',
      badge: { at: 'db', text: '#42 あり' },
      flow: { kind: 'request', from: 'server', to: 'db' },
      code: 4,
    },
    {
      title: 'JSONにして返す',
      note: '見つけた注文を、決まった形(JSON)に包んで送り返す',
      tone: 'response',
      active: [],
      badge: { at: 'response', text: '{"id":42,"qty":2}' },
      flow: { kind: 'response', from: 'db', to: 'app' },
      code: 5,
    },
    {
      title: 'アプリが画面に表示',
      note: 'ステータス 200 OK',
      tone: 'app',
      active: ['app'],
    },
    {
      title: '1タップごとに、この往復',
      note: 'アプリ → API → サーバー → DB → アプリ',
      active: ALL,
      pulse: true,
    },
  ],
}
