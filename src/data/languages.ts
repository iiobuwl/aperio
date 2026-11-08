// 言語選択画面に並ぶ分類・言語と、それぞれの項目一覧です。
// ここに書き足すだけで、言語や項目が画面に増えます。
//   ・items が空の言語 → 「coming soon...」になる
//   ・topic(図のページ)か lesson(解説ページ)がある項目だけ開ける(それ以外は「準備中」)
//   ・PHP / SQL の解説ページは data/lessons/ にあり、項目の id が同じものが自動で結びつく

import type { GroupId, Kind, Language, Lesson, Quiz, Topic } from './types'
import { apiTopic } from './steps'
import { PHP_LESSONS } from './lessons/php'
import { SQL_LESSONS } from './lessons/sql'
import { IT_LESSONS } from './lessons/it'
import { IT_TOPICS } from './topics/it'
import { IT_QUIZZES } from './quizzes/it'
import { PHP_QUIZZES } from './quizzes/php'
import { SQL_QUIZZES } from './quizzes/sql'
import { PHP_EXTRA_LESSONS } from './lessons/php-extra'
import { PHP_EXTRA_QUIZZES } from './quizzes/php-extra'
import { HTML_LESSONS, JS_LESSONS } from './lessons/frontend'
import { HTML_QUIZZES, JS_QUIZZES } from './quizzes/frontend'
import { DBOPS_LESSONS, IT_EXTRA_LESSONS, OPS_LESSONS, SECURITY_LESSONS } from './lessons/infra'
import { DBOPS_QUIZZES, IT_EXTRA_QUIZZES, OPS_QUIZZES, SECURITY_QUIZZES } from './quizzes/infra'

/** 大きな分類。この順に上から並ぶ */
export const GROUPS: { id: GroupId; label: string; color: string }[] = [
  { id: 'concept', label: 'ITの仕組み', color: 'var(--purple)' },
  { id: 'frontend', label: 'フロントエンド系', color: 'var(--blue)' },
  { id: 'backend', label: 'バックエンド系', color: 'var(--green)' },
  { id: 'database', label: 'データベース系', color: 'var(--orange)' },
]

/** 分類の中の小見出し。この順に並ぶ */
export const KINDS: { id: Kind; label: string }[] = [
  { id: 'language', label: '言語' },
  { id: 'library', label: 'ライブラリ・フレームワーク' },
  { id: 'concept', label: 'テーマ' },
]

/** 言語の色 = 分類の色 */
export function colorOf(lang: Language) {
  return GROUPS.find((g) => g.id === lang.group)?.color ?? 'var(--text)'
}

const RAW_LANGUAGES: Language[] = [
  // ---- フロントエンド系(これから追加) ----
  { id: 'html', name: 'HTML', description: 'Webページの構造を作る', symbol: 'code', group: 'frontend', kind: 'language', extensions: ['.html'],
    items: [
      { id: 'svg', name: 'SVG', summary: '拡大しても劣化しないベクター形式の画像', level: 'basic' },
      { id: 'favicon', name: 'favicon', summary: 'ブラウザのタブに出る小さなアイコン', level: 'basic' },
    ],
  },
  { id: 'css', name: 'CSS', description: 'Webページの見た目を整える', symbol: 'palette', group: 'frontend', kind: 'language', extensions: ['.css'], items: [] },
  { id: 'javascript', name: 'JavaScript', description: 'Webページに動きをつける', symbol: 'bolt', group: 'frontend', kind: 'language', extensions: ['.js', '.jsx'],
    items: [
      // 必須
      { id: 'json', name: 'JSON.parse / stringify', summary: 'JSONとオブジェクトの相互変換', level: 'must' },
      { id: 'selector', name: 'セレクタ(querySelector)', summary: 'HTMLの要素を探して取得する', level: 'must' },
      { id: 'event-listener', name: 'イベントリスナー', summary: '操作に反応する処理を登録する', level: 'must' },
      // 基礎
      { id: 'timer', name: 'タイマー(setTimeout / setInterval)', summary: '遅らせて実行・くり返し実行', level: 'basic' },
      { id: 'navigation', name: '画面遷移', summary: 'ページの移動・別ウィンドウ・戻る', level: 'basic' },
      { id: 'fetch-api', name: 'Fetch API', summary: '新しい方式の Ajax(通信)', level: 'basic' },
      // 中級
      { id: 'async-await', name: '非同期処理(async / await)', summary: '通信の完了を待つ処理を読みやすく書く', level: 'middle' },
      { id: 'minify', name: 'ミニファイ(.min.js)', summary: '空白などを取り除いてファイルを小さくする', level: 'middle' },
      { id: 'sourcemap', name: 'ソースマップ(.map)', summary: '縮めたコードを元のコードに対応づける', level: 'middle' },
      // 応用
      { id: 'xhr-activex', name: 'XMLHttpRequest / ActiveX', summary: 'Ajax の古い実装(古いIE向け)', level: 'advanced' },
      { id: 'autocomplete', name: 'オートコンプリート', summary: '入力中に候補を表示する機能', level: 'advanced' },
      { id: 'datepicker', name: 'デートピッカー', summary: 'カレンダーから日付を選ぶ部品', level: 'advanced' },
    ],
  },
  { id: 'typescript', name: 'TypeScript', description: 'JavaScriptに型チェックを追加したもの', symbol: 'typeT', group: 'frontend', kind: 'language', extensions: ['.ts', '.tsx'], items: [] },
  { id: 'react', name: 'React', description: 'UI部品(コンポーネント)を組み合わせるライブラリ', symbol: 'atom', group: 'frontend', kind: 'library', extensions: ['.jsx', '.tsx'], items: [] },
  { id: 'nextjs', name: 'Next.js', description: 'ReactをベースにしたWebアプリ開発フレームワーク', symbol: 'arrowCircle', group: 'frontend', kind: 'library', extensions: ['.jsx', '.tsx'], items: [] },

  // ---- バックエンド系 ----
  { id: 'python', name: 'Python', description: 'Webアプリのサーバー処理・データ分析・AI開発', symbol: 'sparkles', group: 'backend', kind: 'language', extensions: ['.py'], items: [] },
  {
    id: 'php',
    name: 'PHP',
    description: 'Webサイトのサーバー側処理',
    symbol: 'server',
    group: 'backend',
    kind: 'language',
    extensions: ['.php'],
    items: [
      // 必須
      { id: 'echo', name: 'echo', summary: '文字や値を画面に出す', level: 'must' },
      { id: 'variable', name: '$変数', summary: '値に名前をつけて入れておく', level: 'must' },
      { id: 'concat', name: '. (文字列の連結)', summary: '文字と文字をつなげる', level: 'must' },
      { id: 'array', name: '配列 [ ]', summary: '複数の値をまとめて持つ', level: 'must' },
      { id: 'if', name: 'if / else', summary: '条件によって処理を分ける', level: 'must' },
      { id: 'foreach', name: 'foreach', summary: '配列の中身を1つずつ取り出す', level: 'must' },
      { id: 'function', name: 'function', summary: '処理をひとまとめにして名前をつける', level: 'must' },
      // 基礎
      { id: 'assoc', name: '連想配列', summary: '「名前 => 値」の組で持つ配列', level: 'basic' },
      { id: 'compare', name: '== と ===', summary: 'ゆるい比較と、型まで見る比較', level: 'basic' },
      { id: 'isset', name: 'isset / empty', summary: '値があるか、空かを調べる', level: 'basic' },
      { id: 'request', name: '$_GET / $_POST', summary: 'フォームやURLから届いた値', level: 'basic' },
      { id: 'escape', name: 'XSS対策(htmlspecialchars / h)', summary: '画面に出す前に危ない文字を無害にする', level: 'basic' },
      { id: 'require', name: 'require / include', summary: '別のファイルを読み込む', level: 'basic' },
      // 中級
      { id: 'class', name: 'class / new', summary: 'データと処理をまとめた設計図と実物', level: 'middle' },
      { id: 'namespace', name: 'namespace / use', summary: '同じ名前のクラスがぶつからないように分ける', level: 'middle' },
      { id: 'exception', name: 'try / catch', summary: 'エラーを受け止めて対処する', level: 'middle' },
      { id: 'pdo', name: 'PDO', summary: 'PHPからデータベースにつなぐ', level: 'middle' },
      { id: 'session', name: '$_SESSION', summary: 'ログイン状態などをページをまたいで覚える', level: 'middle' },
      { id: 'composer', name: 'Composer', summary: '外部のライブラリを入れて管理する', level: 'middle' },
      // 応用
      { id: 'interface', name: 'interface / trait', summary: 'クラスに「約束」や「共通の部品」を持たせる', level: 'advanced' },
      { id: 'closure', name: 'クロージャ(無名関数)', summary: '名前のない関数を、その場で値として渡す', level: 'advanced' },
      { id: 'types', name: '型宣言 / strict_types', summary: '引数や戻り値の型を決めて間違いを防ぐ', level: 'advanced' },
      { id: 'yield', name: 'yield (ジェネレータ)', summary: '大量のデータを少しずつ作って返す', level: 'advanced' },
      { id: 'psr', name: 'PSR', summary: 'PHPの書き方の共通ルール', level: 'advanced' },
      // ---- 追加分 ----
      { id: 'mb-string', name: 'マルチバイト文字列(mb_strlen など)', summary: '日本語の長さや切り出しを正しく扱う', level: 'basic' },
      { id: 'mb-convert-kana', name: '全角・半角変換', summary: 'カナや英数字の全角と半角の相互変換', level: 'basic' },
      { id: 'datetime', name: '日時処理(DateTime / strtotime)', summary: '日付の計算や変換、タイムゾーン', level: 'basic' },
      { id: 'number-format', name: '数値の書式化・丸め', summary: 'カンマ区切り・四捨五入・切り捨て・切り上げ', level: 'basic' },
      { id: 'array-utils', name: '配列操作ユーティリティ', summary: 'array_merge や Hash:: で配列を扱う', level: 'basic' },
      { id: 'abstract', name: '抽象クラス(abstract)', summary: '直接は使わず、継承して使う親クラス', level: 'middle' },
      { id: 'static', name: '静的メソッド(static / self::)', summary: 'インスタンスを作らずに呼べるメソッド', level: 'middle' },
      { id: 'instanceof', name: '型の判定(instanceof)', summary: 'オブジェクトがどのクラスのものかの確認', level: 'middle' },
    ],
  },
  { id: 'java', name: 'Java', description: '大規模な業務システム・Webアプリ開発', symbol: 'coffee', group: 'backend', kind: 'language', extensions: ['.java'], items: [] },
  { id: 'csharp', name: 'C#', description: '業務システム・Windowsアプリ・ゲーム(Unity)開発', symbol: 'hash', group: 'backend', kind: 'language', extensions: ['.cs'], items: [] },

  // ---- データベース系 ----
  {
    id: 'sql',
    name: 'SQL',
    description: 'データベースの検索・追加・更新・削除',
    symbol: 'cylinder',
    group: 'database',
    kind: 'language',
    extensions: ['.sql'],
    items: [
      // 必須
      { id: 'select', name: 'SELECT', summary: 'データを取り出す', level: 'must' },
      { id: 'where', name: 'WHERE', summary: '条件に合う行だけに絞る', level: 'must' },
      { id: 'order-by', name: 'ORDER BY', summary: '並び順を決める', level: 'must' },
      { id: 'insert', name: 'INSERT', summary: '行を追加する', level: 'must' },
      { id: 'update', name: 'UPDATE', summary: '行の中身を書きかえる', level: 'must' },
      { id: 'delete', name: 'DELETE', summary: '行を消す', level: 'must' },
      // 基礎
      { id: 'limit', name: 'LIMIT / OFFSET', summary: '取り出す件数と開始位置を決める', level: 'basic' },
      { id: 'aggregate', name: 'COUNT / SUM / AVG', summary: '件数や合計、平均を出す', level: 'basic' },
      { id: 'group-by', name: 'GROUP BY', summary: '同じ値ごとにまとめて集計する', level: 'basic' },
      { id: 'join', name: 'INNER JOIN', summary: '2つの表を、共通の値でつなげる', level: 'basic' },
      { id: 'left-join', name: 'LEFT JOIN', summary: '片方にしかない行も残してつなげる', level: 'basic' },
      { id: 'keys', name: '主キー / 外部キー', summary: '行を見分ける印と、表どうしのつながり', level: 'basic' },
      // 中級
      { id: 'having', name: 'HAVING', summary: '集計した結果に条件をつける', level: 'middle' },
      { id: 'subquery', name: 'サブクエリ', summary: 'SQLの中に別のSQLを入れる', level: 'middle' },
      { id: 'null', name: 'NULL と IS NULL', summary: '「値がない」ことの扱い方', level: 'middle' },
      { id: 'index', name: 'インデックス', summary: '本の索引のように検索を速くする', level: 'middle' },
      { id: 'transaction', name: 'トランザクション', summary: '複数の処理を「全部成功か、全部取り消し」にする', level: 'middle' },
      { id: 'create-table', name: 'CREATE / ALTER TABLE', summary: '表を作る・形を変える', level: 'middle' },
      // 応用
      { id: 'window', name: 'ウィンドウ関数', summary: '行をまとめずに順位や累計を出す', level: 'advanced' },
      { id: 'explain', name: 'EXPLAIN', summary: 'SQLがどう実行されるかを見て、遅い原因を探す', level: 'advanced' },
      { id: 'normalize', name: '正規化', summary: '重複のない表の分け方', level: 'advanced' },
      { id: 'lock', name: 'ロック', summary: '同時に書きかえてデータが壊れるのを防ぐ', level: 'advanced' },
      { id: 'view', name: 'ビュー', summary: 'よく使うSELECTに名前をつけて表のように使う', level: 'advanced' },
    ],
  },

  // ---- ITの仕組み ----
  {
    id: 'it',
    name: 'ITの仕組み',
    description: 'Webの裏側で何が起きているか',
    symbol: 'network',
    group: 'concept',
    kind: 'concept',
    items: [
      // 必須
      { id: 'api', name: 'APIの裏側', summary: 'ボタン1回の裏で起きる往復', level: 'must' },
      { id: 'http', name: 'HTTPの会話', summary: 'リクエストとレスポンスの形', level: 'must' },
      { id: 'url', name: 'URLの読み方', summary: '住所を6つの部品に分けて読む', level: 'must' },
      // 基礎
      { id: 'dns', name: 'DNS', summary: 'ドメイン名から住所(IP)を調べる', level: 'basic' },
      { id: 'https', name: 'HTTPSと暗号化', summary: '通信を鍵で守る仕組み(TLS)', level: 'basic' },
      { id: 'status-code', name: 'ステータスコード', summary: '200・404・500 の意味', level: 'basic' },
      { id: 'cookie', name: 'Cookie とセッション', summary: 'ログイン状態を覚える仕組み', level: 'basic' },
      // 中級
      { id: 'cache', name: 'キャッシュ', summary: '作り置きで速くする', level: 'middle' },
      { id: 'cdn', name: 'CDN', summary: '近くの拠点から届ける', level: 'middle' },
      { id: 'login', name: 'ログインとトークン', summary: 'パスワードのかわりに通行証', level: 'middle' },
      // 応用
      { id: 'load-balancer', name: 'ロードバランサ', summary: 'アクセスを複数のサーバーに配る', level: 'advanced' },
      { id: 'queue', name: 'キューと非同期処理', summary: '重い仕事を後ろに回す', level: 'advanced' },
      // ---- 追加分 ----
      { id: 'user-agent', name: 'ユーザーエージェント', summary: 'ブラウザの種類を表す文字列', level: 'basic' },
      { id: 'robots-txt', name: 'robots.txt', summary: '検索エンジンのクローラーに巡回ルールを伝える', level: 'basic' },
      { id: 'multipart', name: 'multipart/form-data', summary: 'ファイルを含むフォームを送る形式', level: 'middle' },
      { id: 'browser-detect', name: 'ブラウザ判定', summary: 'ブラウザの種類で処理を分ける', level: 'middle' },
      { id: 'tag-manager', name: 'タグマネージャー(GTM)', summary: '計測タグをまとめて管理する仕組み', level: 'middle' },
      { id: 'cookie-lifetime', name: 'セッションCookieの有効期限', summary: '0にして、ブラウザを閉じたらログアウトにする', level: 'middle' },
      { id: 'iso-2022-jp', name: 'ISO-2022-JP(JISコード)', summary: '日本語メールで昔から使われる文字コード', level: 'advanced' },
      { id: 'mime', name: 'MIME', summary: 'メールに添付ファイルや複数パートを入れる規格', level: 'advanced' },
    ],
  },

  // ---- セキュリティ ----
  {
    id: 'security',
    name: 'セキュリティ',
    description: 'アクセス制御・ハッシュ・乱数・ID',
    symbol: 'shield',
    group: 'concept',
    kind: 'concept',
    items: [
      { id: 'unique-id', name: '一意ID(uniqid / UUID)', summary: '重複しない識別子の作り方', level: 'basic' },
      { id: 'acl', name: 'ACL(アクセス制御リスト)', summary: '誰が何にアクセスできるかを表で管理する', level: 'middle' },
      { id: 'md5-sha1', name: 'MD5 / SHA-1', summary: '古いハッシュ方式。今は安全性が低い', level: 'middle' },
      { id: 'random-string', name: 'ランダム文字列の生成', summary: '見間違えやすい文字を外して、安全に作る', level: 'middle' },
    ],
  },

  // ---- ファイル処理・運用 ----
  {
    id: 'ops',
    name: 'ファイル処理・運用',
    description: 'ファイル操作・デバッグ・ログ',
    symbol: 'folder',
    group: 'concept',
    kind: 'concept',
    items: [
      { id: 'debug-output', name: 'デバッグ出力(debug / print_r / var_dump)', summary: '変数の中身を表示して調べる', level: 'must' },
      { id: 'error-log', name: 'エラーログ', summary: 'エラーを記録するファイル', level: 'basic' },
      { id: 'filesystem', name: 'ファイルシステム操作', summary: '読み書き・削除・作成・権限・一覧', level: 'basic' },
      { id: 'serialize', name: 'シリアライズ(serialize)', summary: '配列やオブジェクトを文字列にして保存し、元に戻す', level: 'middle' },
      { id: 'php-stream', name: 'PHPストリーム(php://output)', summary: '出力先をファイルのように扱う。CSV出力に使う', level: 'middle' },
    ],
  },

  // ---- データベース運用 ----
  {
    id: 'dbops',
    name: 'データベース運用',
    description: 'バックアップ・接続・SQLログ',
    symbol: 'archive',
    group: 'database',
    kind: 'concept',
    items: [
      { id: 'mysqldump', name: 'バックアップ(mysqldump)', summary: 'DBの中身をSQLファイルとして書き出す', level: 'must' },
      { id: 'gzip', name: 'gzip 圧縮', summary: 'バックアップファイルを小さくする', level: 'basic' },
      { id: 'sql-log', name: 'SQLログ', summary: '実行したSQLの記録', level: 'basic' },
      { id: 'multi-db-schema', name: '複数データベース / スキーマ', summary: '1つのサーバーで複数のDBを分けて運用する', level: 'basic' },
      { id: 'single-transaction', name: '--single-transaction', summary: '書き込みを止めずに、矛盾なくバックアップする', level: 'middle' },
      { id: 'persistent-connection', name: '持続的接続', summary: 'DB接続を使い回す設定', level: 'advanced' },
      { id: 'custom-datasource', name: 'カスタムデータソース', summary: 'DB接続部分を拡張して、SQLのログを取る', level: 'advanced' },
    ],
  },
]

// 言語ごとの図のページ・解説ページ・テスト(id が同じ項目に topic / lesson / quiz として取りつける)
const TOPICS: Record<string, Record<string, Topic>> = { it: { api: apiTopic, ...IT_TOPICS } }
const LESSONS: Record<string, Record<string, Lesson>> = {
  php: { ...PHP_LESSONS, ...PHP_EXTRA_LESSONS },
  sql: SQL_LESSONS,
  it: { ...IT_LESSONS, ...IT_EXTRA_LESSONS },
  html: HTML_LESSONS,
  javascript: JS_LESSONS,
  security: SECURITY_LESSONS,
  ops: OPS_LESSONS,
  dbops: DBOPS_LESSONS,
}
const QUIZZES: Record<string, Record<string, Quiz>> = {
  php: { ...PHP_QUIZZES, ...PHP_EXTRA_QUIZZES },
  sql: SQL_QUIZZES,
  it: { ...IT_QUIZZES, ...IT_EXTRA_QUIZZES },
  html: HTML_QUIZZES,
  javascript: JS_QUIZZES,
  security: SECURITY_QUIZZES,
  ops: OPS_QUIZZES,
  dbops: DBOPS_QUIZZES,
}

export const LANGUAGES: Language[] = RAW_LANGUAGES.map((lang) => ({
  ...lang,
  items: lang.items.map((item) => {
    const topic = TOPICS[lang.id]?.[item.id]
    const lesson = LESSONS[lang.id]?.[item.id]
    const quiz = QUIZZES[lang.id]?.[item.id]
    return { ...item, ...(topic && { topic }), ...(lesson && { lesson }), ...(quiz && { quiz }) }
  }),
}))
