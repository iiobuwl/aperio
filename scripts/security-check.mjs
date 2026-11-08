// セキュリティの「見張り番」です。`npm run security-check` で実行します(CI でも毎回動きます)。
// 今の安全な状態が、将来の修正でうっかり崩れないように、次のことを自動で確かめます。
//   1. ソースに、危険な書き方(innerHTML・eval・外部通信など)が入っていないか
//   2. 依存ライブラリが、固定されていて、公式レジストリから取得されているか
//   3. GitHub Actions が、コミットのハッシュで固定されているか
//   4. ビルドした配布物の CSP が弱くなっていないか、読み込むファイルの指紋(SRI)が正しいか
// 1つでも問題があれば、失敗(終了コード 1)にします。事前に `npm run build` が必要です。

import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const rel = (p) => relative(root, p).split(sep).join('/')
const read = (p) => readFileSync(join(root, p), 'utf8')
const problems = []
const fail = (msg) => problems.push(msg)

/** ディレクトリの中の、すべてのファイルを集める */
function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

// ---------------------------------------------------------------------------
// 1. ソースの検査(data/ は、画面に出す説明の文字なので対象外)
// ---------------------------------------------------------------------------
const BANNED = [
  [/\binnerHTML\b|\bouterHTML\b|insertAdjacentHTML|dangerouslySetInnerHTML|document\.write|\.srcdoc\b/, 'HTML を文字列で差し込む書き方(XSS の入口)'],
  [/\beval\s*\(|new\s+Function\s*\(|\bsetTimeout\s*\(\s*['"`]|\bsetInterval\s*\(\s*['"`]/, '文字列をコードとして実行する書き方'],
  [/javascript:/i, 'javascript: の URL'],
  [/target\s*=\s*["']_blank["']/, 'target="_blank"(使うなら rel="noopener noreferrer" を付けて、この検査を見直す)'],
  [/\bfetch\s*\(|XMLHttpRequest|\bWebSocket\b|\bEventSource\b|sendBeacon|\bimport\s*\(/, '外部との通信・動的な読み込み'],
  [/document\.cookie/, 'Cookie の直接操作'],
  [/window\.open|location\.(?:href|assign|replace)\s*(?:=|\()/, 'ページ遷移(オープンリダイレクトの元になりやすい)'],
  [/postMessage|addEventListener\s*\(\s*['"]message['"]/, 'postMessage(他のウィンドウとのやりとり)'],
]
const STORAGE = /\blocalStorage\b|\bsessionStorage\b|\bindexedDB\b/
const STORAGE_ALLOWED = new Set(['src/weak.ts', 'src/progress.ts']) // 保存データの検査を、この2つに集めている

const sources = walk(join(root, 'src')).filter((p) => /\.(ts|tsx)$/.test(p) && !rel(p).startsWith('src/data/'))
for (const file of sources) {
  const path = rel(file)
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const code = line.replace(/\/\/.*$/, '') // 行末のコメントは、見ない
      for (const [re, why] of BANNED) if (re.test(code)) fail(`${path}:${i + 1}  ${why}`)
      if (STORAGE.test(code) && !STORAGE_ALLOWED.has(path)) fail(`${path}:${i + 1}  localStorage は weak.ts / progress.ts 以外では使わない(読み込み時の検査を集めているため)`)
    })
}

// 外部のURLを読み込んでいないか(index.html・CSS・コード)
for (const file of [join(root, 'index.html'), ...walk(join(root, 'src')).filter((p) => /\.(css|ts|tsx)$/.test(p) && !rel(p).startsWith('src/data/'))]) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/https?:\/\/|@import|url\(\s*['"]?\s*\/\//.test(line)) fail(`${rel(file)}:${i + 1}  外部のURLや @import(外部との通信は使わない方針)`)
    })
}

// ---------------------------------------------------------------------------
// 2. 依存ライブラリ
// ---------------------------------------------------------------------------
const pkg = JSON.parse(read('package.json'))
for (const kind of ['dependencies', 'devDependencies']) {
  for (const [name, ver] of Object.entries(pkg[kind] ?? {})) {
    if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(ver)) fail(`package.json: ${name}@${ver} は、正確なバージョンで固定されていない(^ ~ * latest や、git / file の指定は不可)`)
  }
}
if (pkg.scripts) {
  for (const hook of ['preinstall', 'install', 'postinstall', 'prepare']) if (pkg.scripts[hook]) fail(`package.json: scripts.${hook} は、インストール時に勝手に動くので使わない`)
}
const lock = JSON.parse(read('package-lock.json'))
for (const [key, v] of Object.entries(lock.packages ?? {})) {
  if (!key) continue
  if (!v.resolved?.startsWith('https://registry.npmjs.org/')) fail(`package-lock.json: ${key} が、公式レジストリ(https)以外から取得される: ${v.resolved}`)
  if (!v.integrity) fail(`package-lock.json: ${key} に、完全性の検証値(integrity)がない`)
}
const npmrc = read('.npmrc')
if (!/^ignore-scripts\s*=\s*true/m.test(npmrc)) fail('.npmrc: ignore-scripts=true がない')

// ---------------------------------------------------------------------------
// 3. GitHub Actions(コミットのハッシュで固定されているか)
// ---------------------------------------------------------------------------
for (const file of walk(join(root, '.github')).filter((p) => /\.ya?ml$/.test(p))) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const m = line.match(/^\s*-?\s*uses:\s*(\S+)/)
      if (!m || m[1].startsWith('./')) return
      if (!/@[0-9a-f]{40}$/.test(m[1])) fail(`${rel(file)}:${i + 1}  ${m[1]} が、コミットのハッシュ(40桁)で固定されていない`)
    })
}

// ---------------------------------------------------------------------------
// 4. 設定ファイル
// ---------------------------------------------------------------------------
if (!/"strict"\s*:\s*true/.test(read('tsconfig.app.json'))) fail('tsconfig.app.json: "strict": true がない')
if (!/^\.env$/m.test(read('.gitignore'))) fail('.gitignore: .env が入っていない')

// ---------------------------------------------------------------------------
// 5. ビルドした配布物(dist)
// ---------------------------------------------------------------------------
const dist = join(root, 'dist')
if (!existsSync(join(dist, 'index.html'))) {
  fail('dist/ がない。先に npm run build を実行してください')
} else {
  const html = read('dist/index.html')

  // CSP
  const meta = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/)
  if (!meta) fail('dist/index.html: CSP の <meta> がない')
  else {
    const csp = meta[1].replaceAll('&#39;', "'")
    const dirs = Object.fromEntries(csp.split(';').map((s) => s.trim().split(/\s+/)).map(([k, ...v]) => [k, v]))
    const need = { 'default-src': ["'none'"], 'script-src': ["'self'"], 'style-src': ["'self'"], 'connect-src': ["'none'"], 'object-src': ["'none'"], 'base-uri': ["'none'"], 'form-action': ["'none'"], 'require-trusted-types-for': ["'script'"], 'trusted-types': ["'none'"] }
    for (const [k, v] of Object.entries(need)) if (JSON.stringify(dirs[k]) !== JSON.stringify(v)) fail(`CSP: ${k} が ${v.join(' ')} になっていない(今: ${dirs[k]?.join(' ') ?? 'なし'})`)
    if (/'unsafe-inline'|'unsafe-eval'|'unsafe-hashes'|\*|data:|blob:|https?:/.test(csp)) fail(`CSP に、弱める指定(unsafe-* / * / data: / blob: / 外部URL)が入っている: ${csp}`)
  }

  // inline のスクリプト・イベント属性・inline のスタイルが、ない
  for (const m of html.matchAll(/<script\b([^>]*)>/g)) if (!/\bsrc="/.test(m[1])) fail('dist/index.html: src のない(inline の) <script> がある')
  if (/\son[a-z]+\s*=/i.test(html)) fail('dist/index.html: onclick などのイベント属性がある')
  if (/<style\b|\sstyle\s*=/i.test(html)) fail('dist/index.html: inline のスタイルがある(CSP の style-src \'self\' と合わない)')

  // SRI: 読み込むファイルすべてに指紋があり、実ファイルと一致する
  let sriCount = 0
  for (const m of html.matchAll(/<(?:script|link)\b[^>]*?(?:src|href)="(\/assets\/[^"]+)"[^>]*>/g)) {
    sriCount++
    const integrity = m[0].match(/integrity="sha384-([^"]+)"/)
    if (!integrity) { fail(`dist/index.html: ${m[1]} に integrity(SRI)がない`); continue }
    const actual = createHash('sha384').update(readFileSync(join(dist, m[1]))).digest('base64')
    if (actual !== integrity[1]) fail(`dist/index.html: ${m[1]} の integrity が、実ファイルの指紋と合わない`)
  }
  if (sriCount === 0) fail('dist/index.html: 読み込むファイルが見つからない(検査できない)')

  // _headers
  if (!existsSync(join(dist, '_headers'))) fail('dist/_headers がない')
  else {
    const h = read('dist/_headers')
    for (const name of ['Content-Security-Policy', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy', 'Cross-Origin-Opener-Policy', 'Cross-Origin-Embedder-Policy', 'Cross-Origin-Resource-Policy', 'Strict-Transport-Security']) {
      if (!h.includes(`${name}:`)) fail(`dist/_headers: ${name} がない`)
    }
    if (!/frame-ancestors 'none'/.test(h)) fail("dist/_headers: frame-ancestors 'none' がない")
  }

  // ソースマップや、不要なファイルを公開していない
  for (const f of walk(dist)) {
    const r = rel(f)
    if (/\.map$/.test(r)) fail(`${r}: ソースマップが公開される`)
    if (/(^|\/)\.(DS_Store|env)/.test(r) || /\.(pem|key)$/.test(r)) fail(`${r}: 公開してはいけないファイルが入っている`)
  }
}

// ---------------------------------------------------------------------------
if (problems.length) {
  console.error(`\n✗ セキュリティ検査で ${problems.length} 件の問題が見つかりました\n`)
  for (const p of problems) console.error(`  - ${p}`)
  console.error('')
  process.exit(1)
}
console.log(`✓ セキュリティ検査: 問題なし(ソース ${sources.length} ファイル、依存 ${Object.keys(lock.packages).length - 1} 件、配布物)`)
