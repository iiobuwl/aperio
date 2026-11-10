# Aperio

ITの用語や仕組みを、図とアニメーションで学ぶ個人用の学習サイト。名前は、ラテン語の「開く・明らかにする」から(仕組みの裏側を開いて見る)。

## 方針

- 個人用。公開・SEOは考えず、表示速度と操作感を最優先
- Vite + React + TypeScript の SPA。ライブラリは増やさない(アニメは CSS / SVG / Web Animations API)
- スマホ幅基準・最大幅600pxで中央寄せ。デザインは Apple の HIG 風(余白・やわらかい角・すりガラス)。ライト/ダークは端末の設定に自動で合わせる
- 広い画面: 720px以上で幅を広げ、1000px以上は「図と解説 | コード」の2列・カード一覧は2列(`styles.css` の `@media`、`.page-split` / `.page-narrow`)
- 色: アプリ=緑、API=青、サーバー=橙、DB=赤。色は CSS 変数(`--green` など。`src/styles.css` の `:root`)で持ち、データ側(`data/`)も `'var(--green)'` のように変数名で書く
- `prefers-reduced-motion` を守る
- 利用者は初心者。コードには日本語のコメントを入れる
- git 操作はしない(コミットは利用者が SourceTree で行う)

## セキュリティの決まり(GitHub で公開するため。詳しくは SECURITY.md)

- 外部のスクリプト・画像・フォント・通信は使わない(CSP が `'self'` だけを許可している。`vite.config.ts`)
- `innerHTML` / `dangerouslySetInnerHTML` / `eval` / `new Function` / `fetch` / `window.open` / `location.href =` / `javascript:` は使わない(`npm run security-check` が検出して失敗にする)
- ブラウザへの保存(localStorage・Cookie など)は使わない(履歴機能は削除済み。`security-check` が検出する)
- URL(ハッシュ)から受け取った値は、データの id と照らすだけにする(`router.ts` で長さと壊れた文字を処理済み)
- 型チェックを無効にしない(`any` / `as never` / `@ts-ignore` は禁止。見張り番が検出する)
- ユーザーの入力は、長さを必ず制限する(`Challenge.tsx` の `MAX_INPUT`)。入力欄の `maxLength` だけに頼らない
- 依存ライブラリは、`^` なしの正確なバージョンで固定する(`.npmrc` の `save-exact`)。足すときは `npm audit` を確認する。インストールのスクリプトは止めてある
- GitHub Actions は、タグではなく、コミットのハッシュで固定する(Dependabot が更新してくれる)
- 公開前・大きな変更のあとは `npm run check` を通す
- 秘密情報(鍵・トークン・`.env`)を、リポジトリに入れない

## 画面と URL(ハッシュ方式、`src/router.ts`)

- 画面の上の**タブ**(学ぶ / チャレンジ)で切りかえる。トップページはない
- `#/` 学ぶ(言語選択) → `#/言語` 項目一覧(必須 / 基礎 / 中級 / 応用) → `#/言語/項目` 中身のページ → `#/言語/項目/test` テスト
- `#/challenge` チャレンジ。**質問を1つずつ答えるウィザード**(範囲 → モード(穴埋め入力 / 処理の説明を選ぶ) → 難易度(やさしい / ふつう / むずかしい) → 問題数(5 / 10 / 20 / 30) → 確認)。確認画面で、各項目をタップして直せる。範囲・モードはタイルのグリッド、難易度は色分け(緑・橙・赤)と段階メーターのタイル。質問の切りかえは iOS 風の押し出しアニメーション(`prefers-reduced-motion` では止まる)。学ぶ・チャレンジのページが開くときの入場アニメーションは共通(`.enter-slide` = 見出しの滑り込み、`.enter-rise` = 順番にふわっと現れる。`styles.css`)。設定は画面の中だけで持ち、保存しない
- 履歴・進捗・苦手リストなど、**ブラウザに何かを保存する機能は持たない**(端末間の同期ができないため、あえて削除した。`security-check` が localStorage などの追加を検出する)

## 構成

```
src/
  main.tsx              起動口(他サイトの iframe では表示しない・エラー画面で囲む)
  App.tsx               上のタブと、URL に応じたページ
  router.ts             useRoute(今の URL)と href(リンク作成)
  challenge.ts          チャレンジの問題を、解説データ(コード+ステップの説明)から自動で作る。難易度で、項目のレベルと問題の手ごたえが変わる
  useStepper.ts         ステップ送り(自動再生3秒・キー操作 ←→/Space)。2種類のページで共通
  pages/
    Challenge.tsx       チャレンジ(設定ウィザード・穴埋め・処理の説明・結果)
    QuizPage.tsx        項目のテスト(4択 / 穴埋め / 両方。選択肢はシャッフル)
    LanguageSelect.tsx  学ぶ: 言語選択(分類の枠 → 言語 / ライブラリの小見出し → カード)
    ItemList.tsx        項目一覧(レベル見出し・絞り込みチップ・準備中)。項目0件なら coming soon オーバーレイ
    TopicPage.tsx       図のページ(「APIの裏側」など)
    LessonPage.tsx      解説ページ(PHP / SQL。コード1行ずつ + 小さな図)
  components/
    Diagram.tsx         図(登場人物・矢印・戻り道・光る点・バッジ・メモ)
    Icons.tsx           アイコンのSVG(phone / shield / server / database / browser / globe / lock / cloud / key / queue / balancer / mail)
    CodePanel.tsx       コード表示(1行ずつ増える・今の行を強調)
    Controls.tsx        操作バー(前へ・再生/一時停止・次へ・点)
    ErrorBoundary.tsx   描画中のエラーで真っ白にならず、案内を出す
    TabBar.tsx          画面上のタブ(学ぶ / チャレンジ)
    LangSymbol.tsx      カードに出す線画アイコン(book / code / cylinder / shield など)
    LessonVisual.tsx    解説ページの小さな図(変数の箱・画面・表・矢印の流れ)
  data/
    types.ts            型(Topic / Lesson / Language / Item / Level など)
    levels.ts           4レベルの表示名・色・説明
    languages.ts        分類(GROUPS。ITの仕組みが先頭)・言語と項目の一覧(約105項目)。項目の無い言語は coming soon
    quizzes/            テストの問題: php.ts・php-extra.ts・sql.ts・it.ts・frontend.ts・infra.ts(1項目 = 4択2問 + 穴埋め1問。正解を先頭に書く)
    lessons/            解説ページのデータ: php.ts・php-extra.ts・sql.ts・it.ts・frontend.ts(HTML/JS)・infra.ts(ITの仕組み追加・セキュリティ・ファイル処理・運用・DB運用)・helpers.ts
    steps.ts            「APIの裏側」の9ステップ
    topics/it.ts        「ITの仕組み」の図のページ(HTTP・DNS・HTTPS・Cookie・キャッシュ・CDN・ログイン・負荷分散・キュー)
  styles.css            色・レイアウト・アニメーション
```

## 増やすとき

- 言語や項目: `data/languages.ts` に書き足すだけ(新しいカテゴリは、分類 `group` と `kind` を決めてカードを足す)。`items: []` の言語は「coming soon...」、`topic` がない項目は「準備中」になる
- 解説ページ: `data/lessons/` に、項目の id と同じキーで `Lesson`(コード + ステップ)を書く。自動で結びつく
- テスト: `data/quizzes/` に、項目の id と同じキーで `Quiz` を書く。選択肢は「正解を先頭」に書けば、画面で自動シャッフルされる
- 図のページ: `data/topics/` に、項目の id と同じキーで `Topic` を書く(矢印は右向き・左向き、`color` で色を変えられる)
- 部品側にテーマ固有の内容を書かない(データと部品を分ける)

## 公開(GitHub Pages)

- `.github/workflows/deploy-pages.yml` が、main への push のたびに、ビルド → 検査 → 公開を行う。公開先は `https://ユーザー名.github.io/aperio/`
- 公開先は `/aperio/` というフォルダの下なので、workflow が `BASE_PATH` で渡し、`vite.config.ts` の `base` に使う(普通のビルド・開発サーバーは `/` のまま)。画像などを指すときは `/favicon.svg` ではなく `import.meta.env.BASE_URL` を使う
- GitHub Pages はヘッダーを足せないので、`_headers` は効かない。CSP は `<meta>` で効く(`frame-ancestors` などヘッダーだけの指令は効かず、`main.tsx` の枠組みチェックが代わりになる)

## コマンド

- `npm install` / `npm run dev`(開発) / `npm run build`(型チェック + ビルド)
- `npm run security-check`(セキュリティの見張り番。先に build が必要) / `npm run check`(ビルド + 見張り番 + 脆弱性・署名の検査)
