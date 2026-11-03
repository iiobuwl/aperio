# IT Visual

ITの用語や仕組みを、図とアニメーションで学ぶ個人用の学習サイト。

## 方針

- 個人用。公開・SEOは考えず、表示速度と操作感を最優先
- Vite + React + TypeScript の SPA。ライブラリは増やさない(アニメは CSS / SVG / Web Animations API)
- スマホ幅基準・最大幅600pxで中央寄せ。背景は濃紺、文字は白
- 色: アプリ=緑、API=青、サーバー=橙、DB=赤(`src/styles.css` の `:root`)
- `prefers-reduced-motion` を守る
- 利用者は初心者。コードには日本語のコメントを入れる
- git 操作はしない(コミットは利用者が SourceTree で行う)

## 画面と URL(ハッシュ方式、`src/router.ts`)

- `#/` トップ(学ぶ / 苦手リスト) → `#/learn` 言語選択 → `#/言語` 項目一覧(必須 / 基礎 / 中級 / 応用) → `#/言語/項目` 中身のページ → `#/言語/項目/test` テスト
- `#/weak` 苦手リスト(項目ページの ★ で手動登録。ブラウザの localStorage に保存。`src/weak.ts`)

## 構成

```
src/
  main.tsx              起動口
  App.tsx               URL を見て3つの画面を切り替える
  router.ts             useRoute(今の URL)と href(リンク作成)
  weak.ts               苦手の保存(localStorage + useWeak)
  useStepper.ts         ステップ送り(自動再生3秒・キー操作 ←→/Space)。2種類のページで共通
  pages/
    Home.tsx            トップ(学ぶ / 苦手リスト)
    WeakPage.tsx        苦手リスト(見る・テスト・解除)
    QuizPage.tsx        項目のテスト(4択 / 穴埋め / 両方。選択肢はシャッフル)
    LanguageSelect.tsx  言語選択(分類の枠 → 言語 / ライブラリの小見出し → カード)
    ItemList.tsx        項目一覧(レベル見出し・絞り込みチップ・準備中)。項目0件なら coming soon オーバーレイ
    TopicPage.tsx       図のページ(「APIの裏側」など)
    LessonPage.tsx      解説ページ(PHP / SQL。コード1行ずつ + 小さな図)
  components/
    Diagram.tsx         図(登場人物・矢印・戻り道・光る点・バッジ・メモ)
    Icons.tsx           アイコンのSVG(phone / shield / server / database / browser / globe / lock / cloud / key / queue / balancer / mail)
    CodePanel.tsx       コード表示(1行ずつ増える・今の行を強調)
    Controls.tsx        操作バー(前へ・再生/一時停止・次へ・点)
    StarButton.tsx      ★ 苦手に登録ボタン
    LessonVisual.tsx    解説ページの小さな図(変数の箱・画面・表・矢印の流れ)
  data/
    types.ts            型(Topic / Lesson / Language / Item / Level など)
    levels.ts           4レベルの表示名・色・説明
    languages.ts        分類(GROUPS。ITの仕組みが先頭)・言語と項目の一覧。今は PHP と SQL のみ項目あり
    quizzes/            テストの問題: php.ts・sql.ts・it.ts(1項目 = 4択2問 + 穴埋め1問。正解を先頭に書く)
    lessons/            解説ページのデータ: php.ts(24項目)・sql.ts(23項目)・it.ts(URL・ステータスコード)・helpers.ts
    steps.ts            「APIの裏側」の9ステップ
    topics/it.ts        「ITの仕組み」の図のページ(HTTP・DNS・HTTPS・Cookie・キャッシュ・CDN・ログイン・負荷分散・キュー)
  styles.css            色・レイアウト・アニメーション
```

## 増やすとき

- 言語や項目: `data/languages.ts` に書き足すだけ。`items: []` の言語は「coming soon...」、`topic` がない項目は「準備中」になる
- 解説ページ: `data/lessons/` に、項目の id と同じキーで `Lesson`(コード + ステップ)を書く。自動で結びつく
- テスト: `data/quizzes/` に、項目の id と同じキーで `Quiz` を書く。選択肢は「正解を先頭」に書けば、画面で自動シャッフルされる
- 図のページ: `data/topics/` に、項目の id と同じキーで `Topic` を書く(矢印は右向き・左向き、`color` で色を変えられる)
- 部品側にテーマ固有の内容を書かない(データと部品を分ける)

## コマンド

- `npm install` / `npm run dev`(開発) / `npm run build`(型チェック + ビルド)
