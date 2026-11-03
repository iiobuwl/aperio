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

/** 大きな分類。この順に上から並ぶ */
export const GROUPS: { id: GroupId; label: string; color: string }[] = [
  { id: 'concept', label: 'ITの仕組み', color: '#fbbf24' },
  { id: 'frontend', label: 'フロントエンド系', color: '#60a5fa' },
  { id: 'backend', label: 'バックエンド系', color: '#34d399' },
  { id: 'database', label: 'データベース系', color: '#fb923c' },
]

/** 分類の中の小見出し。この順に並ぶ */
export const KINDS: { id: Kind; label: string }[] = [
  { id: 'language', label: '言語' },
  { id: 'library', label: 'ライブラリ・フレームワーク' },
  { id: 'concept', label: 'テーマ' },
]

/** 言語の色 = 分類の色 */
export function colorOf(lang: Language) {
  return GROUPS.find((g) => g.id === lang.group)?.color ?? '#f1f5f9'
}

const RAW_LANGUAGES: Language[] = [
  // ---- フロントエンド系(これから追加) ----
  { id: 'html', name: 'HTML', description: 'Webページの構造を作る', mark: 'HTML', group: 'frontend', kind: 'language', extensions: ['.html'], items: [] },
  { id: 'css', name: 'CSS', description: 'Webページの見た目を整える', mark: 'CSS', group: 'frontend', kind: 'language', extensions: ['.css'], items: [] },
  { id: 'javascript', name: 'JavaScript', description: 'Webページに動きをつける', mark: 'JS', group: 'frontend', kind: 'language', extensions: ['.js', '.jsx'], items: [] },
  { id: 'typescript', name: 'TypeScript', description: 'JavaScriptに型チェックを追加したもの', mark: 'TS', group: 'frontend', kind: 'language', extensions: ['.ts', '.tsx'], items: [] },
  { id: 'react', name: 'React', description: 'UI部品(コンポーネント)を組み合わせるライブラリ', mark: 'Re', group: 'frontend', kind: 'library', extensions: ['.jsx', '.tsx'], items: [] },
  { id: 'nextjs', name: 'Next.js', description: 'ReactをベースにしたWebアプリ開発フレームワーク', mark: 'N', group: 'frontend', kind: 'library', extensions: ['.jsx', '.tsx'], items: [] },

  // ---- バックエンド系 ----
  { id: 'python', name: 'Python', description: 'Webアプリのサーバー処理・データ分析・AI開発', mark: 'Py', group: 'backend', kind: 'language', extensions: ['.py'], items: [] },
  {
    id: 'php',
    name: 'PHP',
    description: 'Webサイトのサーバー側処理',
    mark: 'PHP',
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
      { id: 'escape', name: 'htmlspecialchars', summary: '画面に出す前に危ない文字を無害にする', level: 'basic' },
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
      { id: 'closure', name: 'クロージャ', summary: '名前のない関数を値として渡す', level: 'advanced' },
      { id: 'types', name: '型宣言 / strict_types', summary: '引数や戻り値の型を決めて間違いを防ぐ', level: 'advanced' },
      { id: 'yield', name: 'yield (ジェネレータ)', summary: '大量のデータを少しずつ作って返す', level: 'advanced' },
      { id: 'psr', name: 'PSR', summary: 'PHPの書き方の共通ルール', level: 'advanced' },
    ],
  },
  { id: 'java', name: 'Java', description: '大規模な業務システム・Webアプリ開発', mark: 'Java', group: 'backend', kind: 'language', extensions: ['.java'], items: [] },
  { id: 'csharp', name: 'C#', description: '業務システム・Windowsアプリ・ゲーム(Unity)開発', mark: 'C#', group: 'backend', kind: 'language', extensions: ['.cs'], items: [] },

  // ---- データベース系 ----
  {
    id: 'sql',
    name: 'SQL',
    description: 'データベースの検索・追加・更新・削除',
    mark: 'SQL',
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
    mark: 'IT',
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
    ],
  },
]

// 言語ごとの図のページ・解説ページ・テスト(id が同じ項目に topic / lesson / quiz として取りつける)
const TOPICS: Record<string, Record<string, Topic>> = { it: { api: apiTopic, ...IT_TOPICS } }
const LESSONS: Record<string, Record<string, Lesson>> = { php: PHP_LESSONS, sql: SQL_LESSONS, it: IT_LESSONS }
const QUIZZES: Record<string, Record<string, Quiz>> = { php: PHP_QUIZZES, sql: SQL_QUIZZES, it: IT_QUIZZES }

export const LANGUAGES: Language[] = RAW_LANGUAGES.map((lang) => ({
  ...lang,
  items: lang.items.map((item) => {
    const topic = TOPICS[lang.id]?.[item.id]
    const lesson = LESSONS[lang.id]?.[item.id]
    const quiz = QUIZZES[lang.id]?.[item.id]
    return { ...item, ...(topic && { topic }), ...(lesson && { lesson }), ...(quiz && { quiz }) }
  }),
}))
