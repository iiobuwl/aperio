// フロントエンド(HTML / JavaScript)のテストの問題です。選択肢は「正解を先頭」に書く(画面でシャッフルされる)。

import type { Quiz } from '../types'
import { c, f } from './helpers'

// ===================== HTML =====================
export const HTML_QUIZZES: Record<string, Quiz> = {
  svg: {
    choice: [
      c('SVGの特徴は?', ['拡大してもぼやけないベクター形式', '写真に向いた形式', '動画の形式', '音声の形式'], '点の集まりではなく、図形の命令で作られています。'),
      c('ロゴやアイコンに SVG が向く理由は?', ['拡大縮小しても劣化せず、軽いことが多いから', '色が1色しか使えないから', '必ず大きいから', '編集できないから'], 'どんな大きさでも、きれいに表示できます。'),
    ],
    fill: [f(['<svg width="100" height="100">', '  <___ cx="50" cy="50" r="40" />', '</svg>'], ['circle', 'round', 'dot', 'ball'], '丸を描く要素は circle です。')],
  },

  favicon: {
    choice: [
      c('favicon とは?', ['ブラウザのタブなどに表示される、小さなアイコン', 'ページの背景画像', 'サイトの設計図', '検索結果の順位'], 'ブックマークや履歴にも表示されます。'),
      c('favicon を指定するHTMLは?', ['<link rel="icon" href="...">', '<img rel="favicon">', '<icon src="...">', '<meta icon="...">'], 'head の中に、link 要素で書きます。'),
    ],
    fill: [f(['<link rel="___" href="/favicon.ico">'], ['icon', 'image', 'logo', 'tab'], 'rel="icon" で、アイコンであることを示します。')],
  },
}

// ===================== JavaScript =====================
export const JS_QUIZZES: Record<string, Quiz> = {
  json: {
    choice: [
      c('JSON.stringify の役割は?', ['オブジェクトを、JSONの文字列に変える', 'JSONの文字列を、オブジェクトに戻す', 'JSONを削除する', 'JSONを暗号化する'], '通信や保存では、文字列にして渡します。'),
      c('JSON.parse(\'{"a":1}\').a の値は?', ['1', '"a"', '{"a":1}', 'undefined'], 'parse でオブジェクトに戻すと、.a で 1 が取り出せます。'),
    ],
    fill: [f(['const text = \'{"id":42}\';', 'const obj = JSON.___(text);', 'console.log(obj.id);  // 42'], ['parse', 'stringify', 'split', 'join'], '文字列をオブジェクトに戻すのは JSON.parse です。')],
  },

  selector: {
    choice: [
      c('document.querySelector の役割は?', ['CSSセレクタで、最初に一致する要素を1つ取得する', '全部の要素を取得する', '要素を削除する', '要素を作る'], '複数ほしいときは querySelectorAll を使います。'),
      c('.item に一致する全要素を取得するのは?', ["document.querySelectorAll('.item')", "document.querySelector('.item')", "document.getAll('.item')", "document.find('item')"], 'querySelectorAll は、一致するものをすべて返します。'),
    ],
    fill: [f(["const title = document.___('#title');", "title.textContent = 'こんにちは';"], ['querySelector', 'getElement', 'select', 'findAll'], 'CSSと同じ書き方で、要素を1つ探します。')],
  },

  'event-listener': {
    choice: [
      c('addEventListener の役割は?', ['操作(イベント)に反応する処理を登録する', '要素を追加する', 'イベントを削除する', 'ページを再読み込みする'], '登録しておくと、操作が起きたときに呼ばれます。'),
      c('入力欄に文字を入力するたびに起きるイベントは?', ['input', 'click', 'submit', 'load'], 'click はクリック、submit はフォーム送信のときです。'),
    ],
    fill: [f(["btn.___('click', () => {", "  alert('押されました');", '});'], ['addEventListener', 'onClickAdd', 'listen', 'bindEvent'], 'イベントの処理を登録するのは addEventListener です。')],
  },

  timer: {
    choice: [
      c('setTimeout の役割は?', ['指定時間後に、処理を1回だけ実行する', '処理をくり返す', '処理を削除する', '時刻を表示する'], 'くり返したいときは setInterval を使います。'),
      c('setInterval を止める関数は?', ['clearInterval', 'stopInterval', 'endTimer', 'killTimer'], 'setInterval が返す番号を渡して止めます。'),
    ],
    fill: [f(["setTimeout(() => console.log('hi'), ___);  // 3秒後"], ['3000', '3', '30', '300'], '時間はミリ秒で指定します。1000 が 1秒です。')],
  },

  navigation: {
    choice: [
      c("location.href = '/orders' は?", ['ページを /orders へ移動する', 'ページを閉じる', 'ページを印刷する', 'ページを保存する'], 'リンクをクリックしたときと同じ動きです。'),
      c('前のページに戻るのは?', ['history.back()', 'history.next()', 'location.prev()', 'window.back()'], 'ブラウザの「戻る」ボタンと同じです。'),
    ],
    fill: [f(["window.___('/help', '_blank');  // 別ウィンドウで開く"], ['open', 'move', 'show', 'goto'], '別のウィンドウやタブで開くのは window.open です。')],
  },

  'fetch-api': {
    choice: [
      c('Fetch API とは?', ['新しい方式の Ajax(通信)', '画面描画の機能', 'データベース', 'CSSの機能'], 'XMLHttpRequest より、短く読みやすく書けます。'),
      c('fetch(...).then((res) => res.json()) の res.json() は?', ['レスポンスの中身を、JSONとして読み取る', 'JSONを送信する', 'JSONを削除する', 'JSONを暗号化する'], '届いたデータを、オブジェクトに変えます。'),
    ],
    fill: [f(["fetch('/api/orders/42')", '  .then((res) => res.___())  // JSONとして読む', '  .then((order) => console.log(order));'], ['json', 'csv', 'xml', 'list'], 'JSONとして読み取るのは res.json() です。')],
  },

  'async-await': {
    choice: [
      c('await の役割は?', ['Promiseの結果が出るまで待って、値を受け取る', '処理を止める', '処理を削除する', 'エラーを無視する'], '待っている間も、画面は固まりません。'),
      c('async / await を使う利点は?', ['通信などを待つ処理を、順番に読みやすく書ける', '通信が速くなる', 'エラーが出なくなる', 'HTMLが不要になる'], 'then を何本もつなぐより、普通のプログラムのように読めます。'),
    ],
    fill: [f(['___ function load() {', "  const res = await fetch('/api');", '}'], ['async', 'await', 'promise', 'defer'], 'await を使う関数には、async をつけます。')],
  },

  minify: {
    choice: [
      c('ミニファイとは?', ['空白やコメントを取り除いて、ファイルを小さくすること', 'ファイルを暗号化すること', 'ファイルを大きくすること', 'ファイルを削除すること'], '変数の名前も短くすることがあります。'),
      c('app.min.js を使う一番の目的は?', ['読み込みを速くする', '読みやすくする', '編集しやすくする', 'エラーを増やす'], '小さいほど、早くダウンロードできます。'),
    ],
    fill: [f(['<script src="/js/app.___.js"></script>  <!-- 縮めたファイル -->'], ['min', 'big', 'small', 'tiny'], '縮めたファイルには、.min がつくのが慣習です。')],
  },

  sourcemap: {
    choice: [
      c('ソースマップの役割は?', ['ミニファイしたコードを、元のコードに対応づける', 'コードを暗号化する', 'コードを実行する', 'コードを削除する'], 'エラーの場所を、元のコードの位置に直して表示できます。'),
      c('ソースマップを本番に置くときの注意は?', ['元のコードが見られてしまう', 'サイトが必ず遅くなる', 'エラーが増える', '文字化けする'], '公開するかどうかは、よく考えて決めます。'),
    ],
    fill: [f(['//# ___=app.min.js.map'], ['sourceMappingURL', 'sourceURL', 'mapFile', 'debugFile'], 'ミニファイしたファイルの最後に、この行で対応表の場所を書きます。')],
  },

  'xhr-activex': {
    choice: [
      c('ActiveX(Microsoft.XMLHTTP)は、何のために使われた?', ['古いIEで、Ajax通信を行うため', '画像を表示するため', '音を鳴らすため', '印刷するため'], '古い IE には XMLHttpRequest がありませんでした。'),
      c('XMLHttpRequest で readyState が 4 のとき?', ['通信が完了した', '通信を開始した', '通信が失敗した', '通信が中断された'], '4 は「完了」です。成功かどうかは status で確かめます。'),
    ],
    fill: [f(['var xhr = new ___();', "xhr.open('GET', '/api/orders/42');", 'xhr.send();'], ['XMLHttpRequest', 'Fetch', 'Request', 'Ajax'], '古い方式の Ajax は、XMLHttpRequest を作って使います。')],
  },

  autocomplete: {
    choice: [
      c('オートコンプリートとは?', ['入力中に候補を表示する機能', '入力を自動で消す機能', '入力を暗号化する機能', '入力を禁止する機能'], '入力のたびに、候補をサーバーに聞いて表示します。'),
      c('候補の取得を、入力のたびにではなく、少し待ってから行う理由は?', ['サーバーへの問い合わせを減らすため', '見た目をよくするため', '入力できなくするため', '文字化けを防ぐため'], 'この工夫を、デバウンスと呼びます。'),
    ],
    fill: [f(["input.addEventListener('___', async () => {", '  // 入力のたびに候補を取りに行く', '});'], ['input', 'load', 'submit', 'blur'], '入力するたびに起きるイベントは input です。')],
  },

  datepicker: {
    choice: [
      c('デートピッカーとは?', ['カレンダーから日付を選ぶ部品', '日付を自動で消す部品', '時計の部品', '天気の部品'], '入力ミスを減らし、選ぶだけで日付が入ります。'),
      c('input type="date" の value の形式は?', ['2026-11-07 のような 年-月-日', '11/07/2026', '07-11-2026', '2026年11月7日'], '表示は国によって変わりますが、value はいつもこの形です。'),
    ],
    fill: [f(['<input type="___" id="birthday">'], ['date', 'day', 'calendar', 'picker'], 'type="date" で、カレンダーつきの入力欄になります。')],
  },
}
