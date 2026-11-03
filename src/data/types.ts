// ステップデータの「型」(データの形のルール)です。
// 新しいテーマのページを作るときも、この形に合わせてデータを書けば
// Diagram や CodePanel がそのまま動きます。

/** 図に描けるアイコンの種類(Icons.tsx に絵があります) */
export type IconKind =
  | 'phone'
  | 'shield'
  | 'server'
  | 'database'
  | 'browser'
  | 'globe'
  | 'lock'
  | 'cloud'
  | 'key'
  | 'queue'
  | 'balancer'
  | 'mail'

/** 登場人物(図に並ぶアイコン1つ分) */
export interface Actor {
  id: string // ステップから指すための名前(例: 'app')
  label: string // 図の下に出る名前
  icon: IconKind
  color: string // テーマ色(例: '#34d399')
}

/** 上部に並ぶ小さなチップ */
export interface Chip {
  label?: string // 薄い文字の部分(例: 'メソッド')
  value: string // 太い文字の部分(例: 'GET')
  color?: string // 文字色(省略すると白)
  fromStep?: number // このステップ番号(0始まり)以降だけ表示する
}

/** ステップ中に流れる「動き」 */
export type Flow =
  // リクエスト: 上の段を from → to へ、青い矢印と光る点が進む
  // 右向きでも左向きでもよい(隣どうしをつなぐ)。color を書くとその色になる
  | { kind: 'request'; from: string; to: string; color?: string }
  // レスポンス: 下のコの字の戻り道を from → to へ、緑の線と光る点が進む
  | { kind: 'response'; from: string; to: string; color?: string }

/** 1ステップ分の内容 */
export interface Step {
  title: string // 大きな見出し
  note?: string // 見出しの下の小さな補足
  noteIsCode?: boolean // 補足を等幅フォントで出す(SQLなど)
  tone?: string // 見出しの色。登場人物の id か 'request' / 'response'
  active: string[] // 明るく光らせる登場人物の id
  pulse?: boolean // true なら active の登場人物が順番に脈打つ
  ring?: string // 丸い枠を光らせる登場人物の id
  flow?: Flow
  badge?: { at: string; text: string } // at は登場人物の id か 'response'(戻り道の上)
  memo?: { at: string; lines: string[] } // 登場人物の下に出るチェックリスト
  code?: number // このステップで追加・強調するコードの行番号(1始まり)
  codeTo?: number // 指定すると code〜codeTo の範囲をまとめて強調
}

/** 1ページ分のテーマ */
export interface Topic {
  title: string
  subtitle: string
  chips: Chip[]
  actors: Actor[]
  requestColor: string
  responseColor: string
  code: { label: string; lines: string[] }
  steps: Step[]
}

// ---------------------------------------------------------------------------
// 言語選択と項目一覧のための型

/** 覚える優先度のレベル(levels.ts に表示名と色があります) */
export type Level = 'must' | 'basic' | 'middle' | 'advanced'

/** 一覧に並ぶ項目1つ分(プロパティ・要素・関数など) */
export interface Item {
  id: string // URL に使う名前(例: 'api' → #/it/api)
  name: string // カードに出す名前(例: 'display')
  summary: string // 1行の説明
  level: Level
  topic?: Topic // 図のページ(「APIの裏側」など)
  lesson?: Lesson // 解説ページ(コード + 変数・表などの小さな図)。topic も lesson もないものは「準備中」
  quiz?: Quiz // 項目ごとのテスト(解説ページに「テスト」ボタンが出る)
}

/** 言語選択画面の大きな分類(例: フロントエンド系)。languages.ts の GROUPS に表示名と色があります */
export type GroupId = 'frontend' | 'backend' | 'database' | 'concept'

/** 分類の中の小見出し(言語 / ライブラリ・フレームワーク / 仕組み) */
export type Kind = 'language' | 'library' | 'concept'

/** 言語(またはテーマのまとまり)1つ分 */
export interface Language {
  id: string // URL に使う名前(例: 'php' → #/php)
  name: string // 表示名
  description: string // 主な用途
  mark: string // カードの四角に出す短い文字(例: 'PHP')
  group: GroupId
  kind: Kind
  extensions?: string[] // 拡張子(例: ['.php'])
  items: Item[] // 空なら「coming soon...」になる
}

// ---------------------------------------------------------------------------
// 解説ページ(Lesson)のための型: PHP / SQL の項目はこの形でデータだけ書く

/** 表のマス。null は NULL(値がない)として表示する */
export type Cell = string | number | null

/** 表の行の状態(色・動きが変わる) */
export type RowMark =
  | 'hot' // 注目している行
  | 'dim' // 対象外(薄くする)
  | 'new' // 追加された行
  | 'edit' // 書きかえられた行
  | 'gone' // 消された行
  | 'g1' // グループ分けの色 1〜3
  | 'g2'
  | 'g3'

/** ステップごとに出す小さな図 */
export type Visual =
  // 変数の箱(PHP): 名前と中身
  | { kind: 'vars'; vars: { name: string; value: string }[]; label?: string }
  // 画面への出力(PHP の実行結果)。lines が空なら「まだ何も出ていない」
  | { kind: 'output'; lines: string[]; label?: string }
  // 表(SQL・PHPの配列)。marks は「行番号(0始まり) → 状態」
  | {
      kind: 'table'
      name: string
      cols: string[]
      rows: Cell[][]
      marks?: Record<number, RowMark>
      hotCols?: number[] // 目立たせる列(0始まり)
      label?: string
    }
  // 矢印でつながった流れ。active は光らせる番号
  | { kind: 'chain'; nodes: string[]; active?: number[]; label?: string }

/** 解説ページの1ステップ */
export interface LessonStep {
  title: string
  note?: string
  code?: number // 強調するコードの行(1始まり)。codeTo があれば code〜codeTo の範囲
  codeTo?: number
  visuals?: Visual[]
}

/** 解説ページ1つ分 */
export interface Lesson {
  code: { label: string; lines: string[] }
  steps: LessonStep[]
}

// ---------------------------------------------------------------------------
// テスト(Quiz)のための型

/** 選択肢は4つ。データには「正解を先頭」に書く(画面に出すときに並びをシャッフルする) */
export type Options4 = [string, string, string, string]

/** 4択問題 */
export interface ChoiceQ {
  q: string // 問題文
  options: Options4 // [正解, まちがい, まちがい, まちがい]
  why: string // 答え合わせのあとに出す解説
}

/** コードの穴埋め問題(選択式)。code の中の「___」が空欄になる */
export interface FillQ {
  code: string[]
  options: Options4 // [正解, まちがい, まちがい, まちがい]
  why: string
}

/** 1つの項目のテスト */
export interface Quiz {
  choice: ChoiceQ[]
  fill: FillQ[]
}
