// 「ITの仕組み」の解説ページ(図ではなく、コードと表で見せる項目)のデータです。

import type { Lesson } from '../types'
import { chain, table } from './helpers'

const URL_PARTS = ['https://', 'shop.example.com', ':443', '/orders/42', '?lang=ja&page=2', '#reviews']

const STATUS_COLS = ['番号', '意味', 'だれの問題?']
const STATUS_ROWS = [
  ['2xx', '成功', '—'],
  ['3xx', '別の場所へ移動', '—'],
  ['4xx', 'リクエストがまちがい', '利用者側'],
  ['5xx', 'サーバーの失敗', 'サーバー側'],
]
const status = (hot: number, name: string) =>
  table(name, STATUS_COLS, STATUS_ROWS, { marks: Object.fromEntries(STATUS_ROWS.map((_, i) => [i, i === hot ? 'hot' : 'dim'])) })

export const IT_LESSONS: Record<string, Lesson> = {
  url: {
    code: {
      label: 'URL を部品に分けたイメージ',
      lines: [
        'https://            // どう通信するか(スキーム)',
        'shop.example.com    // どのサーバーか(ホスト名)',
        ':443                // どの入口か(ポート)',
        '/orders/42          // 何を取るか(パス)',
        '?lang=ja&page=2     // 条件(クエリ)',
        '#reviews            // ページ内の位置(フラグメント)',
      ],
    },
    steps: [
      { title: 'スキーム: 通信の方法', note: 'https は暗号化あり、http は暗号化なし', code: 1, visuals: [chain(URL_PARTS, [0])] },
      { title: 'ホスト名: サーバーの名前', note: 'DNSで、数字の住所(IPアドレス)に変えられる', code: 2, visuals: [chain(URL_PARTS, [1])] },
      { title: 'ポート: 入口の番号', note: 'https は 443、http は 80 が標準。標準なら省略できる', code: 3, visuals: [chain(URL_PARTS, [2])] },
      { title: 'パス: 欲しいもの', note: 'サーバーの中の、どのページ・どのデータか', code: 4, visuals: [chain(URL_PARTS, [3])] },
      { title: 'クエリ: 条件', note: '?名前=値&名前=値 の形。PHPでは $_GET で受け取る', code: 5, visuals: [chain(URL_PARTS, [4])] },
      { title: 'フラグメント: ページ内の位置', note: 'ブラウザだけが使う部分。サーバーには送られない', code: 6, visuals: [chain(URL_PARTS, [5])] },
      {
        title: '6つの部品で、1つの住所',
        visuals: [
          table('部品のまとめ', ['部品', '役目'], [
            ['スキーム', '通信の方法'],
            ['ホスト名', 'どのサーバーか'],
            ['ポート', 'どの入口か'],
            ['パス', '何を取るか'],
            ['クエリ', '条件'],
            ['フラグメント', 'ページ内の位置'],
          ]),
        ],
      },
    ],
  },

  'status-code': {
    code: {
      label: 'HTTPレスポンスの1行目',
      lines: [
        'HTTP/1.1 200 OK',
        'HTTP/1.1 301 Moved Permanently',
        'HTTP/1.1 400 Bad Request',
        'HTTP/1.1 401 Unauthorized',
        'HTTP/1.1 404 Not Found',
        'HTTP/1.1 500 Internal Server Error',
      ],
    },
    steps: [
      { title: '200 OK: 成功', note: '2xx は「うまくいった」の仲間', code: 1, visuals: [status(0, '2xx')] },
      { title: '301: 引っ越しました', note: '3xx は「別の場所を見て」。ブラウザは自動で移動する', code: 2, visuals: [status(1, '3xx')] },
      { title: '400: リクエストがおかしい', note: '4xx は、お願いの出し方に原因がある', code: 3, visuals: [status(2, '4xx')] },
      { title: '401: 本人確認ができていない', note: 'ログインしていない、トークンが無い・まちがい、など', code: 4, visuals: [status(2, '4xx')] },
      { title: '404: 見つからない', note: 'URLがまちがっているか、データが存在しない', code: 5, visuals: [status(2, '4xx')] },
      { title: '500: サーバーの失敗', note: '5xx は、サーバー側の不具合。利用者には直せない', code: 6, visuals: [status(3, '5xx')] },
      { title: '最初の数字で、だいたい分かる', note: '2=成功 / 3=移動 / 4=あなたのミス / 5=サーバーのミス', visuals: [table('まとめ', STATUS_COLS, STATUS_ROWS)] },
    ],
  },
}
