// フロントエンド(HTML / JavaScript)の解説ページのデータです。
// キーは languages.ts の項目の id と同じ名前にします。

import type { Lesson } from '../types'
import { chain, out, table, vars } from './helpers'

const code = (label: string, lines: string[]) => ({ label, lines })

// ===================== HTML =====================
export const HTML_LESSONS: Record<string, Lesson> = {
  svg: {
    code: code('HTML のイメージ', [
      '<svg width="100" height="100" viewBox="0 0 100 100">',
      '  <circle cx="50" cy="50" r="40" fill="tomato" />',
      '  <rect x="35" y="35" width="30" height="30" fill="white" />',
      '</svg>',
    ]),
    steps: [
      { title: '<svg> で、描く場所を用意', note: 'width / height は表示の大きさ、viewBox は「内側の座標の広さ」', code: 1, visuals: [table('キャンバス', ['項目', '値'], [['表示の大きさ', '100 × 100'], ['内側の座標', '0〜100']])] },
      { title: '<circle>: 丸を描く', note: 'cx, cy は中心の位置、r は半径', code: 2, visuals: [table('円の設定', ['属性', '値'], [['cx, cy', '50, 50(真ん中)'], ['r', '40(半径)'], ['fill', 'tomato(色)']], { hotCols: [1] })] },
      { title: '<rect>: 四角を重ねる', note: '後ろに書いたものが、手前に重なる', code: 3, visuals: [table('四角の設定', ['属性', '値'], [['x, y', '35, 35(左上の位置)'], ['width, height', '30, 30']], { hotCols: [1] })] },
      {
        title: '拡大しても、ぼやけない',
        note: '点の集まりではなく、「丸を描け」という命令だから。ロゴやアイコンに向く',
        code: 4,
        visuals: [table('画像の形式', ['形式', '拡大'], [['PNG・JPEG(点の集まり)', 'ぼやける'], ['SVG(図形の命令)', 'きれいなまま']], { marks: { 0: 'dim', 1: 'hot' } })],
      },
    ],
  },

  favicon: {
    code: code('HTML のイメージ', [
      '<head>',
      '  <link rel="icon" href="/favicon.ico">',
      '  <link rel="icon" type="image/svg+xml" href="/favicon.svg">',
      '  <link rel="apple-touch-icon" href="/apple-touch-icon.png">',
      '</head>',
    ]),
    steps: [
      { title: 'タブに出る、小さな絵', note: 'ブックマークや履歴、検索結果にも出ることがある', visuals: [chain(['[★] 商品一覧 | Shop', 'ブラウザのタブ'], [0])] },
      { title: '.ico: 昔からの形式', note: '指定がなくても、ブラウザは /favicon.ico を探しに来る', code: 2, visuals: [chain(['ブラウザ', '/favicon.ico を探す', '見つけたら表示'])] },
      { title: 'SVG も使える', note: '拡大してもきれい。ダークモードで色を変えることもできる', code: 3, visuals: [chain(['favicon.svg', 'どんな大きさでもきれい'], [1])] },
      { title: 'スマホのホーム画面用', note: 'ホーム画面に追加したときのアイコン。180×180 くらいの PNG を用意する', code: 4, codeTo: 5, visuals: [table('アイコンの種類', ['rel', '使われる場所'], [['icon', 'タブ・ブックマーク'], ['apple-touch-icon', 'iPhoneのホーム画面']])] },
    ],
  },
}

// ===================== JavaScript =====================
export const JS_LESSONS: Record<string, Lesson> = {
  json: {
    code: code('JavaScript のイメージ', [
      'const obj = { id: 42, qty: 2 };',
      'const text = JSON.stringify(obj);',
      'console.log(text);',
      'const back = JSON.parse(text);',
      'console.log(back.qty);',
    ]),
    steps: [
      { title: 'オブジェクトを用意', code: 1, visuals: [table('obj', ['キー', '値'], [['id', 42], ['qty', 2]])] },
      { title: 'stringify: JSON(文字列)にする', note: '通信やファイル保存では、文字にして渡す必要がある', code: 2, codeTo: 3, visuals: [chain(['オブジェクト', 'JSON.stringify', '文字列'], [1, 2]), out('{"id":42,"qty":2}')] },
      { title: 'parse: オブジェクトに戻す', note: '文字列のままでは、back.qty のように中身を取り出せない', code: 4, visuals: [chain(['文字列', 'JSON.parse', 'オブジェクト'], [1, 2]), table('back', ['キー', '値'], [['id', 42], ['qty', 2]], { marks: { 0: 'hot', 1: 'hot' } })] },
      { title: '中身を取り出す', code: 5, visuals: [out('2')] },
      { title: '⚠ 壊れた文字列は、エラーになる', note: "JSON.parse('{id:42}') のように、書き方がまちがっていると例外が起きる。try / catch で守る", visuals: [out('SyntaxError: Unexpected token i in JSON')] },
    ],
  },

  selector: {
    code: code('JavaScript のイメージ', [
      "const title = document.querySelector('#title');",
      "const items = document.querySelectorAll('.item');",
      "title.textContent = 'こんにちは';",
      "items.forEach((el) => el.classList.add('active'));",
    ]),
    steps: [
      {
        title: 'CSSと同じ書き方で、要素を探す',
        note: '#名前 は id、.名前 は class、div p は「div の中の p」',
        visuals: [table('セレクタの例', ['書き方', '対象'], [['#title', 'id が title の要素'], ['.item', 'class が item の要素'], ['div p', 'div の中の p']])],
      },
      { title: 'querySelector: 最初の1つ', code: 1, visuals: [table('HTML の要素', ['要素'], [['<h1 id="title">'], ['<li class="item">'], ['<li class="item">']], { marks: { 0: 'hot', 1: 'dim', 2: 'dim' } })] },
      { title: 'querySelectorAll: 一致するもの全部', code: 2, visuals: [table('HTML の要素', ['要素'], [['<h1 id="title">'], ['<li class="item">'], ['<li class="item">']], { marks: { 0: 'dim', 1: 'hot', 2: 'hot' } })] },
      { title: '見つけた要素を、書きかえる', code: 3, visuals: [table('HTML の要素', ['要素'], [['<h1 id="title">こんにちは'], ['<li class="item">'], ['<li class="item">']], { marks: { 0: 'edit' } })] },
      { title: 'class を足して、見た目を変える', note: '全部に classList.add する。CSSで .active の見た目を決めておく', code: 4, visuals: [table('HTML の要素', ['要素'], [['<h1 id="title">こんにちは'], ['<li class="item active">'], ['<li class="item active">']], { marks: { 1: 'edit', 2: 'edit' } })] },
    ],
  },

  'event-listener': {
    code: code('JavaScript のイメージ', [
      "const btn = document.querySelector('#btn');",
      "btn.addEventListener('click', () => {",
      "  alert('押されました');",
      '});',
      "$('#btn').on('click', function () { /* jQuery の書き方 */ });",
    ]),
    steps: [
      { title: '対象のボタンを取り出す', code: 1, visuals: [vars(['btn', '<button id="btn">'])] },
      { title: '「押されたら、これをして」と登録', note: '登録しただけでは動かない。操作が起きたときに呼ばれる', code: 2, codeTo: 4, visuals: [chain(['登録', '待つ', 'クリック!', '処理が動く'], [0])] },
      { title: 'クリックされると動く', visuals: [chain(['登録', '待つ', 'クリック!', '処理が動く'], [2, 3]), out('押されました')] },
      {
        title: 'イベントの種類',
        visuals: [table('よく使うイベント', ['名前', 'いつ起きる'], [['click', 'クリックしたとき'], ['input', '入力するたび'], ['submit', 'フォームを送るとき'], ['keydown', 'キーを押したとき']])],
      },
      { title: 'jQuery では .on()', note: '昔のコードでは、$(…).on("click", …) がよく使われている。やっていることは同じ', code: 5, visuals: [chain(["addEventListener('click', …)", '=', "$(…).on('click', …)"], [1])] },
    ],
  },

  timer: {
    code: code('JavaScript のイメージ', [
      "setTimeout(() => console.log('3秒後'), 3000);",
      "const id = setInterval(() => console.log('1秒ごと'), 1000);",
      'clearInterval(id);',
    ]),
    steps: [
      { title: 'setTimeout: 1回だけ、遅らせて実行', note: '時間はミリ秒(1000 = 1秒)。3000 は3秒', code: 1, visuals: [chain(['今', '(3秒待つ)', '「3秒後」を表示'], [2])] },
      { title: 'setInterval: くり返し実行', note: '止めない限り、1秒ごとに動き続ける', code: 2, visuals: [out('1秒ごと', '1秒ごと', '1秒ごと', '…')] },
      { title: 'clearInterval: 止める', note: 'setInterval が返す番号(id)を渡す。止め忘れると、ずっと動いてしまう', code: 3, visuals: [vars(['id', '7']), out('1秒ごと', '1秒ごと', '(止まった)')] },
      { title: '画面が変わっても、止まらない', note: '別の画面に切りかえるときには、タイマーを止めておく', visuals: [table('タイマーの注意', ['場面', 'やること'], [['画面を離れる', 'clearInterval / clearTimeout'], ['何度も押される', '前のタイマーを止めてから作る']])] },
    ],
  },

  navigation: {
    code: code('JavaScript のイメージ', [
      "location.href = '/orders';",
      "window.open('/help', '_blank');",
      'history.back();',
      'location.reload();',
    ]),
    steps: [
      { title: 'location.href: ページを移動', note: 'リンクをクリックしたときと同じ。履歴にも残る', code: 1, visuals: [chain(['/cart', '→', '/orders'], [2])] },
      { title: 'window.open: 別のウィンドウで開く', note: "'_blank' で、新しいタブ。ブラウザによっては、ポップアップとして止められる", code: 2, visuals: [chain(['このページ', '新しいタブで /help'], [1])] },
      { title: 'history.back: 前のページに戻る', note: 'ブラウザの「戻る」ボタンと同じ動き', code: 3, visuals: [chain(['/orders', '←', '/cart'], [2])] },
      { title: 'location.reload: 再読み込み', code: 4, visuals: [chain(['/orders', '→', '/orders(もう一度)'], [2])] },
    ],
  },

  'fetch-api': {
    code: code('JavaScript のイメージ', [
      "fetch('/api/orders/42')",
      '  .then((res) => res.json())',
      '  .then((order) => console.log(order.qty))',
      '  .catch((err) => console.error(err));',
    ]),
    steps: [
      { title: 'fetch: 通信を始める', note: '返事はすぐには来ない。「あとで届く約束(Promise)」が返る', code: 1, visuals: [chain(['fetch', 'Promise(約束)', 'レスポンス'], [0, 1])] },
      { title: 'res.json(): 中身を取り出す', note: '届いたレスポンスから、JSONをオブジェクトに変える', code: 2, visuals: [chain(['レスポンス', 'res.json()', 'オブジェクト'], [1, 2])] },
      { title: 'then: 結果を使う', code: 3, visuals: [table('order', ['キー', '値'], [['id', 42], ['qty', 2]]), out('2')] },
      { title: 'catch: 失敗したとき', note: '通信できなかったとき。サーバーが 404 や 500 を返しても、fetch 自体は成功扱いなので res.ok を確認する', code: 4, visuals: [chain(['通信できない', 'catch が動く'], [0, 1])] },
      { title: 'Ajax の新しい方式', note: '昔の XMLHttpRequest より、短く読みやすく書ける', visuals: [table('Ajax の書き方', ['方式', '時代'], [['XMLHttpRequest', '昔(長くなりがち)'], ['fetch', '今']], { marks: { 0: 'dim', 1: 'hot' } })] },
    ],
  },

  'async-await': {
    code: code('JavaScript のイメージ', [
      'async function loadOrder() {',
      '  try {',
      "    const res = await fetch('/api/orders/42');",
      '    const order = await res.json();',
      '    console.log(order.qty);',
      '  } catch (e) {',
      "    console.error('失敗', e);",
      '  }',
      '}',
    ]),
    steps: [
      { title: 'async: 中で await が使える関数', note: '前につけるだけ。この関数は、Promise を返すようになる', code: 1, visuals: [chain(['async function', '中で await が使える'], [0])] },
      { title: 'await: 結果が届くまで、待つ', note: '待っている間も、画面は固まらない。ほかの処理が進む', code: 3, visuals: [chain(['fetch を始める', '(待つ)', '結果を受け取る'], [1])] },
      { title: '上から順に、読める', note: 'then を何本もつなぐより、普通のプログラムのように読める', code: 4, codeTo: 5, visuals: [vars(['res', 'Response'], ['order', '{ id: 42, qty: 2 }'])] },
      { title: 'try / catch で、失敗を受け止める', code: 2, codeTo: 2, visuals: [out('失敗 TypeError: Failed to fetch')] },
      {
        title: 'then との書き比べ',
        code: 6,
        codeTo: 9,
        visuals: [table('同じ処理', ['書き方', '読みやすさ'], [['fetch().then().then().catch()', '横にどんどん続く'], ['async / await', '上から下に読める']], { marks: { 0: 'dim', 1: 'hot' } })],
      },
    ],
  },

  minify: {
    code: code('JavaScript のイメージ', [
      '// app.js(人が読むためのコード)',
      'function add(first, second) {',
      '  return first + second; // 足す',
      '}',
      '// app.min.js(縮めたコード)',
      'function add(n,t){return n+t}',
    ]),
    steps: [
      { title: '人が読むためのコード', note: '空白・改行・コメント・わかりやすい名前が、たくさん入っている', code: 1, codeTo: 4, visuals: [table('app.js', ['内容', '大きさ'], [['読みやすいコード', '120KB']])] },
      { title: '空白・コメントを取り除き、名前を短く', note: 'first → n、second → t のように、変数の名前も縮める', code: 5, codeTo: 6, visuals: [chain(['空白を削る', 'コメントを削る', '名前を短くする'], [0, 1, 2])] },
      { title: 'ファイルが小さくなる', note: '小さいほど、早くダウンロードできる', visuals: [table('ファイルの大きさ', ['ファイル', '大きさ'], [['app.js', '120KB'], ['app.min.js', '45KB']], { marks: { 0: 'dim', 1: 'hot' } })] },
      { title: 'ただし、読みにくくなる', note: '縮めたコードでエラーが出ると、元のどこかが分からない。そこで、ソースマップが使われる', visuals: [chain(['app.min.js のエラー', '1行目 2043文字目', 'どこ?'], [2])] },
    ],
  },

  sourcemap: {
    code: code('ミニファイしたコードのイメージ', [
      '// app.min.js の最後の行',
      '//# sourceMappingURL=app.min.js.map',
      '// 開発者ツールのエラー表示',
      '// app.min.js:1:2043  →  app.js:3:5',
    ]),
    steps: [
      { title: '縮めたコードは、読めない', note: 'エラーが出た場所は「1行目の2043文字目」のような表示になる', visuals: [chain(['エラー', 'app.min.js:1:2043', '何のこと?'], [1, 2])] },
      { title: '最後の行に、「地図」の場所を書く', note: '.map ファイルが、縮めたコードと元のコードの対応表になっている', code: 1, codeTo: 2, visuals: [chain(['app.min.js', '→ 最後の行', 'app.min.js.map'], [1, 2])] },
      { title: '開発者ツールが、元の位置に直す', note: '.map を読んで、元のファイルの何行目かを表示してくれる', code: 3, codeTo: 4, visuals: [chain(['app.min.js:1:2043', '.map で変換', 'app.js:3:5'], [0, 1, 2])] },
      { title: '⚠ 本番に置くときは注意', note: '.map を公開すると、元のコードが誰にでも読めてしまう', visuals: [table('.map の置き場', ['場所', 'ふつうの扱い'], [['開発環境', '置く'], ['本番', '限定する・置かない']])] },
    ],
  },

  'xhr-activex': {
    code: code('JavaScript(古い書き方)のイメージ', [
      'var xhr = window.XMLHttpRequest',
      '  ? new XMLHttpRequest()',
      "  : new ActiveXObject('Microsoft.XMLHTTP');",
      "xhr.open('GET', '/api/orders/42');",
      'xhr.onreadystatechange = function () {',
      '  if (xhr.readyState === 4 && xhr.status === 200) {',
      '    console.log(xhr.responseText);',
      '  }',
      '};',
      'xhr.send();',
    ]),
    steps: [
      { title: '古いIEには、XMLHttpRequest がなかった', note: 'そのため ActiveX(IE専用の仕組み)で代わりに通信していた', code: 1, codeTo: 3, visuals: [table('ブラウザごとの違い', ['ブラウザ', '使うもの'], [['新しいブラウザ', 'XMLHttpRequest'], ['古いIE(6など)', 'ActiveXObject']], { marks: { 0: 'hot', 1: 'dim' } })] },
      { title: 'open: 準備', note: 'メソッドとURLを決める。この時点では、まだ送らない', code: 4, visuals: [chain(['GET', '/api/orders/42'], [0, 1])] },
      {
        title: '状態が変わるたびに呼ばれる',
        note: 'readyState が 4 = 通信の完了。status が 200 = 成功',
        code: 5,
        codeTo: 9,
        visuals: [table('readyState', ['値', '状態'], [[0, '準備前'], [1, '接続した'], [2, '送信した'], [3, '受信中'], [4, '完了']], { marks: { 4: 'hot' } })],
      },
      { title: 'send: 送信', code: 10, visuals: [chain(['send()', '(通信)', '完了すると、上の関数が動く'], [0])] },
      { title: '今は fetch が基本', note: '新しく書くなら fetch。古いシステムを読むときのために、形を知っておく', visuals: [table('Ajax の書き方', ['方式', '時代'], [['ActiveX + XMLHttpRequest', '昔(IE対応)'], ['fetch', '今']], { marks: { 0: 'dim', 1: 'hot' } })] },
    ],
  },

  autocomplete: {
    code: code('JavaScript のイメージ', [
      "input.addEventListener('input', async () => {",
      "  const res = await fetch('/api/suggest?q=' + input.value);",
      '  const list = await res.json();',
      '  showSuggestions(list);',
      '});',
    ]),
    steps: [
      { title: '1文字入力するたびに、動く', note: '入力欄の「input」イベントを使う', code: 1, visuals: [out('東')] },
      { title: 'サーバーに「候補は?」と聞く', code: 2, visuals: [chain(['入力欄「東」', '/api/suggest?q=東', 'サーバー'], [0, 1, 2])] },
      { title: '候補を表示する', code: 3, codeTo: 5, visuals: [out('東', '・東京', '・東京都', '・東京駅')] },
      {
        title: '聞きすぎない工夫',
        note: '入力が止まってから(例: 0.3秒後)聞くようにする。これを「デバウンス」と呼ぶ',
        visuals: [table('問い合わせの回数', ['方式', '「東京都」と打つと'], [['毎回聞く', '3回'], ['止まってから聞く', '1回']], { marks: { 0: 'dim', 1: 'hot' } })],
      },
    ],
  },

  datepicker: {
    code: code('HTML / JavaScript のイメージ', [
      '<input type="date" id="birthday">',
      '<script>',
      "  const input = document.querySelector('#birthday');",
      "  input.addEventListener('change', () => console.log(input.value));",
      '</script>',
    ]),
    steps: [
      { title: 'type="date" で、カレンダーが出る', note: 'ブラウザが用意してくれる日付の選択部品。書くのは1行だけ', code: 1, visuals: [table('2026年 11月', ['日', '月', '火', '水', '木', '金', '土'], [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14]], { marks: { 0: 'hot' } })] },
      { title: '選んだ日付は、value に入る', note: '形式は、いつも 2026-11-07 のように 年-月-日', code: 3, codeTo: 4, visuals: [vars(['input.value', '2026-11-07'])] },
      { title: '変えたときに、反応する', note: 'change イベントは、日付が選ばれたときに起きる', code: 4, codeTo: 5, visuals: [out('2026-11-07')] },
      { title: '部品(ライブラリ)を使う場合', note: '古いブラウザや、見た目をそろえたいときは、jQuery UI などの部品を使う。考え方は同じ', visuals: [table('日付の入力方法', ['方法', 'ひとこと'], [['input type="date"', '標準。手軽'], ['デートピッカーの部品', '見た目や動きを細かく決められる']])] },
    ],
  },
}
