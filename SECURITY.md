# セキュリティポリシー / Security Policy

## 脆弱性を見つけたら / Reporting a vulnerability

公開の Issue には書かず、GitHub の **Security タブ → Report a vulnerability**(非公開の脆弱性報告)から連絡してください。
Please do **not** open a public issue. Use **Security → Report a vulnerability** (GitHub private vulnerability reporting).

## このサイトの構成と、守っていること

Aperio は、**サーバーを持たない静的な Web サイト**(Vite + React + TypeScript の SPA)です。
ログイン・パスワード・個人情報・外部サービスとの通信は、ありません。

### ブラウザでの防御

| 対策 | 内容 |
|---|---|
| **外部へ通信しない** | 外部のスクリプト・画像・フォント・API を、一切使いません |
| **CSP(厳しい読み込み制限)** | 自分のファイル以外は、読み込まない・実行しない。inline スクリプトと `eval` は不可。Trusted Types(`'none'`)で、DOM を使った XSS も防ぐ |
| **改ざん検知(SRI)** | 読み込む JS / CSS に、中身の指紋(sha384)をつける。配信の途中で書きかえられたら、ブラウザが実行しない |
| **危険な書き方をしない** | `innerHTML` / `dangerouslySetInnerHTML` / `eval` / `new Function` / 外部通信 / ページ遷移は使わない。画面に出す文字は、React が自動で無害化する |
| **セキュリティヘッダー** | `X-Content-Type-Options` `Referrer-Policy` `Permissions-Policy`(使わない機能をすべて禁止) `Cross-Origin-Opener/Embedder/Resource-Policy` `HSTS` など(`vite.config.ts`、`dist/_headers`) |
| **埋め込み禁止** | 他のサイトの `<iframe>` に入れない(`frame-ancestors` / `X-Frame-Options` / 画面側の検査) |
| **失敗しても安全** | 予想外のエラーでも、真っ白にならず案内を出す。エラーの詳しい内容は、画面に出さない |
| **URL と保存データの検査** | 壊れた URL でも落ちない。localStorage の中身は、読み込むたびに形と範囲を検査する(不正な値は無視) |

### 開発・公開の流れでの防御(サプライチェーン)

| 対策 | 内容 |
|---|---|
| **依存の固定** | バージョンを `^` なしで固定。ロックファイルは、公式レジストリ(https)と完全性の検証値だけ |
| **安全なインストール** | `npm ci --ignore-scripts`(インストール時のスクリプトを動かさない)。`npm audit` と `npm audit signatures`(署名・出所の検証) |
| **自動更新** | Dependabot(毎週。公開から7日待ってから提案)と Dependency Review(プルリクエスト時) |
| **Actions の固定** | GitHub Actions は、コミットのハッシュで固定(タグの付けかえで、中身をすりかえられない) |
| **最小権限の CI** | ワークフローの権限は、読み取りが基本。認証情報を、あとのステップに残さない |
| **コード解析** | CodeQL を毎週と、プルリクエストごとに実行。OpenSSF Scorecard で、リポジトリの安全性を採点 |
| **見張り番** | `npm run security-check`: 危険な書き方・依存の固定・Actions の固定・配布物の CSP と SRI を、CI のたびに検査する。将来の修正で、うっかり弱めても気づける |
| **厳格な TypeScript** | `strict` を有効にして、型の抜け穴を減らす |

## できないこと(限界)

- 保存先は、ブラウザの localStorage です。**利用者本人が書きかえられる**ため、「テストの結果で解放されるチャレンジ」は、
  学習の目安であって、セキュリティ上の制限ではありません。
- GitHub Pages では、HTTP ヘッダーを自由に足せません。CSP は `<meta>` で効きますが、`frame-ancestors` と HSTS は
  ヘッダーが必要です(HSTS は GitHub Pages 側が設定します)。ヘッダーを足せるホスティング(Netlify / Cloudflare Pages など)では、
  ビルドで出力される `dist/_headers` が使われます。

## 公開前のチェックリスト

- [ ] リポジトリの **Settings → Code security** で、次をオンにする
  - Dependency graph / Dependabot alerts / Dependabot security updates
  - Secret scanning と **Push protection**
  - Private vulnerability reporting
  - Code scanning(CodeQL。このリポジトリの workflow でも実行されます)
- [ ] **Settings → Branches** で、`main` にブランチ保護を設定する(プルリクエスト必須・CI の成功必須・強制プッシュ禁止)
- [ ] GitHub アカウントで **2要素認証** を有効にする
- [ ] **コミットの作者のメールアドレス**を確認する(`git log --format='%ae' | sort -u`)。本物のアドレスが入っていたら、公開前に GitHub の
      noreply アドレス(`<数字>+<ユーザー名>@users.noreply.github.com`)に直す。
      GitHub の **Settings → Emails** で「Keep my email addresses private」と
      「Block command line pushes that expose my email」をオンにする
- [ ] 公開前に `npm run check` を実行する(ビルド・`security-check`・`npm audit`・署名の検証をまとめて行う)
