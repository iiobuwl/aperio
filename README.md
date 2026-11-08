# Aperio

PHPやITの用語を、図とアニメーションで理解するための学習サイト。

## 起動

```bash
npm install
npm run dev
```

## メモ

- 開発は dev ブランチで行い、確認できたら main にマージする

## セキュリティ

- 外部へ通信しない静的サイトです。厳しい CSP とセキュリティヘッダー、URL・保存データの検査、依存の自動検査を入れています。
- 詳しくは [SECURITY.md](SECURITY.md) を見てください(脆弱性の報告方法・公開前のチェックリストもあります)。
- `npm run check` で、ビルド・セキュリティ検査(`security-check`)・脆弱性検査(`npm audit`)・署名の検証をまとめて実行できます。
