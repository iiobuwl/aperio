// PHP のテストの問題です。キーは languages.ts の項目の id と同じ名前にします。
// 選択肢は「正解を先頭」に書く(画面に出すときにシャッフルされる)。
//   c(問題文, [正解, ×, ×, ×], 解説)          4択
//   f([コード…], [正解, ×, ×, ×], 解説)       穴埋め(コードの中の ___ が空欄)

import type { Quiz } from '../types'
import { c, f } from './helpers'

export const PHP_QUIZZES: Record<string, Quiz> = {
  // ===================== 必須 =====================
  echo: {
    choice: [
      c('画面に「こんにちは」と出す、正しい書き方はどれ?', ["echo 'こんにちは';", 'echo こんにちは;', "show 'こんにちは';", "echo 'こんにちは'"], '文字は引用符で囲み、文の終わりにはセミコロン(;)が必要です。'),
      c('echo 100 + 20; を実行すると、画面に出るのは?', ['120', '100 + 20', '10020', 'エラー'], 'echo は式を先に計算してから、その答えを出します。'),
    ],
    fill: [f(['<?php', "___ 'ようこそ';"], ['echo', 'return', 'var', 'use'], '画面に文字を出す命令は echo です。')],
  },

  variable: {
    choice: [
      c('PHPの変数の名前として、正しいのはどれ?', ['$name', 'name', '#name', '@name'], '変数は $ から始まります。'),
      c('$age = 25; $age = $age + 1; のあと、$age の中身は?', ['26', '25', '1', '$age + 1'], '右側を先に計算(25 + 1)して、その答えを $age に入れ直します。'),
    ],
    fill: [f(['$total = 100;', '$total = ___ + 50;', 'echo $total;  // 150'], ['$total', 'total', '50', "'$total'"], '今の中身(100)に 50 を足すので、右側にも $total を書きます。')],
  },

  concat: {
    choice: [
      c('文字と文字をつなげる演算子はどれ?', ['.(ピリオド)', '+', '&', ','], '足し算の + ではなく、ピリオドでつなぎます。'),
      c("echo '山田' . '太郎'; の出力は?", ['山田太郎', '山田 太郎', '山田.太郎', '太郎山田'], '2つの文字がすき間なくつながります。'),
    ],
    fill: [f(["$first = '山田';", "$last = '太郎';", 'echo $first ___ $last;'], ['.', '+', '&&', '->'], '文字をつなぐのはピリオドです。')],
  },

  array: {
    choice: [
      c("$fruits = ['りんご', 'みかん', 'ぶどう']; のとき、$fruits[1] は?", ['みかん', 'りんご', 'ぶどう', 'エラー'], '番号は 0 から始まるので、[1] は2番目の「みかん」です。'),
      c('配列の末尾に「もも」を追加する書き方は?', ["$fruits[] = 'もも';", "$fruits = 'もも';", "$fruits->add('もも');", "$fruits.push('もも');"], '[ ] の中を空にして代入すると、末尾に追加されます。'),
    ],
    fill: [f(["$fruits = ['A', 'B', 'C'];", 'echo ___($fruits);  // 3'], ['count', 'size', 'length', 'len'], '配列の個数を数える関数は count() です。')],
  },

  if: {
    choice: [
      c('$score が 80 のとき、if ($score >= 80) { A } else { B } で実行されるのは?', ['A(if の中)', 'B(else の中)', 'AとB両方', 'どちらも実行されない'], '>= は「以上」。80 は 80 以上なので true です。'),
      c('else の中が実行されるのは、どんなとき?', ['if の条件が false のとき', 'if の条件が true のとき', '毎回必ず', 'エラーが起きたとき'], 'if が当てはまらなかったときだけ実行されます。'),
    ],
    fill: [f(['$score = 72;', '___ ($score >= 80) {', "    echo '合格';", '}'], ['if', 'for', 'echo', 'else'], '条件によって処理を分けるのは if です。')],
  },

  foreach: {
    choice: [
      c('foreach の役割は?', ['配列の中身を1つずつ取り出して、処理をくり返す', '配列の個数を数える', '配列を並びかえる', '配列に値を追加する'], '配列の要素を先頭から順に1つずつ取り出します。'),
      c('foreach ($names as $name) で、$name に入るのは?', ['配列の要素(1周ごとに1つずつ)', '配列全体', '要素の個数', '最後の要素だけ'], '1周ごとに、次の要素が $name に入ります。'),
    ],
    fill: [f(["$names = ['A', 'B'];", 'foreach ($names ___ $name) {', '    echo $name;', '}'], ['as', 'in', 'of', 'to'], 'PHPでは「配列 as 変数」の形で書きます。')],
  },

  function: {
    choice: [
      c('PHPで関数を定義するキーワードは?', ['function', 'def', 'func', 'method'], 'function のあとに関数の名前を書きます。'),
      c('関数の中で、呼び出し元に値を返す命令は?', ['return', 'echo', 'exit', 'give'], 'echo は画面に出すだけ。値を返すのは return です。'),
    ],
    fill: [f(['function tax($price) {', '    ___ $price * 1.1;', '}', '$result = tax(1000);  // $result は 1100'], ['return', 'echo', 'print', 'yield'], '答えを $result に受け取るには、return で値を返す必要があります。')],
  },

  // ===================== 基礎 =====================
  assoc: {
    choice: [
      c('連想配列で、キーと値を結ぶ記号は?', ['=>', '->', '=', '::'], "'name' => 'ナオ' のように書きます。"),
      c("$user = ['name' => 'ナオ', 'age' => 25]; のとき、$user['age'] は?", ['25', "'age'", 'ナオ', 'エラー'], 'キー age に結びついた値が取り出されます。'),
    ],
    fill: [f(["$user = ['name' => 'ナオ'];", 'echo $user[___];  // ナオ'], ["'name'", '0', 'name', "'ナオ'"], 'キーは引用符で囲んで書きます。')],
  },

  compare: {
    choice: [
      c("'1' === 1 の結果は?", ['false', 'true', 'エラー', '1'], '=== は型まで比べます。文字の "1" と数字の 1 は型がちがいます。'),
      c('値だけでなく型も同じかを調べる演算子は?', ['===', '==', '=', '!='], '= は代入、== は型をゆるく見る比較です。'),
    ],
    fill: [f(["var_dump('5' ___ 5);  // false(型がちがう)"], ['===', '==', '=', '>='], '型までちがいを見るのは === です。')],
  },

  isset: {
    choice: [
      c("isset($user['age']) が true になるのは?", ['キー age があり、値が NULL でないとき', 'キー age の値が空のとき', 'キー age が無いとき', '常に true'], '「存在して、NULL ではない」ことを調べます。'),
      c("empty('') の結果は?", ['true', 'false', 'エラー', 'NULL'], '空の文字は「空」とみなされるので true です。'),
    ],
    fill: [f(["if (___($_GET['word'])) {", "    echo $_GET['word'];", '}'], ['isset', 'count', 'echo', 'list'], '無いキーを読んで警告が出るのを、isset で防ぎます。')],
  },

  request: {
    choice: [
      c('URL の ?word=php で送られた値を取り出すのは?', ["$_GET['word']", "$_POST['word']", "$_SESSION['word']", '$word'], 'URL の ? 以降は $_GET に入ります。'),
      c('フォームの送信内容(URLに出ない)を受け取るのは?', ['$_POST', '$_GET', '$_FILE', '$_URL'], 'フォームの本文は $_POST に入ります。'),
    ],
    fill: [f(['// URL: /search.php?page=2', "$page = ___['page'];"], ['$_GET', '$_POST', '$_SESSION', '$_COOKIE'], 'URL に付いた値は $_GET で取り出します。')],
  },

  escape: {
    choice: [
      c('利用者の入力を画面に出す前に使うべき関数は?', ['htmlspecialchars', 'count', 'strlen', 'trim'], '< や > を無害な文字に置きかえ、悪いプログラムが動くのを防ぎます。'),
      c('htmlspecialchars は、< をどう変える?', ['&lt;', '&gt;', '\\<', '(消える)'], '&lt; に置きかわるので、画面にはただの文字として表示されます。'),
    ],
    fill: [f(["$comment = '<script>alert(1)</script>';", 'echo ___($comment);'], ['htmlspecialchars', 'strtoupper', 'strlen', 'trim'], '危ない文字を無害にする関数です。')],
  },

  require: {
    choice: [
      c('require_once の特徴は?', ['同じファイルを2回目は読み込まない', 'ファイルが無くても続行する', 'ファイルを削除する', '必ず2回読み込む'], 'すでに読み込んだファイルは、2回目は読みません。'),
      c('ファイルが見つからなくても、警告だけで処理が続くのは?', ['include', 'require', 'require_once', 'どれも止まる'], 'require 系は見つからないと止まりますが、include は続行します。'),
    ],
    fill: [f(["___ 'config.php';  // 見つからなければ停止"], ['require', 'include', 'echo', 'use'], '無いと困るファイルには require を使います。')],
  },

  // ===================== 中級 =====================
  class: {
    choice: [
      c('クラスから実物(インスタンス)を作るキーワードは?', ['new', 'make', 'create', 'class'], 'new User() のように書きます。'),
      c('メソッドの中で、その実物自身を指すものは?', ['$this', '$self', '$me', 'this'], '$this->name のように使います。'),
    ],
    fill: [f(['class User {', '    public $name;', '}', '$u = ___ User();', "$u->name = 'ナオ';"], ['new', 'make', 'clone', 'class'], '設計図から実物を作るのは new です。')],
  },

  namespace: {
    choice: [
      c('同じ名前のクラスがぶつからないよう、住所で分けるのは?', ['namespace', 'include', 'interface', 'trait'], 'namespace で、名前を階層で区切ります。'),
      c('use App\\Models\\User; の効果は?', ['User という短い名前で呼べる', 'User クラスを削除する', 'User を2つに増やす', 'App を読み込まなくなる'], '長い住所に、短い呼び名をつけるイメージです。'),
    ],
    fill: [f(['// 別のファイル', '___ App\\Models\\User;', '$u = new User();'], ['use', 'new', 'echo', 'include'], '長い名前を短く呼ぶには use を使います。')],
  },

  exception: {
    choice: [
      c('エラーが起きたとき、それを受け止める構文は?', ['try / catch', 'if / else', 'foreach', 'switch'], 'try の中でエラーが起きたら、catch が受け取ります。'),
      c('try の中でエラーが起きると、続きの処理は?', ['実行されず、catch に移る', '最後まで実行される', 'もう一度最初から', 'catch が先に実行される'], 'エラーが起きた時点で、try の残りは飛ばされます。'),
    ],
    fill: [f(['___ {', '    $n = intdiv(10, 0);', '} catch (DivisionByZeroError $e) {', "    echo 'ゼロでは割れません';", '}'], ['try', 'if', 'do', 'for'], '試す処理は try { } に入れます。')],
  },

  pdo: {
    choice: [
      c('PDO を使うと、何ができる?', ['PHPからデータベースに接続して、SQLを実行できる', '画像を加工できる', 'メールを送れる', 'ファイルを圧縮できる'], 'PHP とデータベースの間に立つ連絡係です。'),
      c('prepare と execute に分けて値を渡す一番の利点は?', ['SQLインジェクションを防げる', 'SQLが速くなる', 'ファイルが小さくなる', 'DBが自動で消える'], '値をSQLに混ぜないので、悪意のある入力でSQLを書きかえられません。'),
    ],
    fill: [f(["$stmt = $pdo->prepare('SELECT * FROM orders WHERE id = :id');", "$stmt->___(['id' => 42]);"], ['execute', 'fetch', 'connect', 'run'], 'prepare で作った型に値を渡して実行するのは execute です。')],
  },

  session: {
    choice: [
      c('ログイン状態などを、ページをまたいで覚えるために使うのは?', ['$_SESSION', '$_GET', '$_POST', '$_SERVER'], 'サーバー側の自分専用の箱に保存されます。'),
      c('セッションを使う前に、最初に呼ぶ関数は?', ['session_start()', 'session_open()', 'start_session()', 'begin()'], 'これで整理番号(Cookie)と、サーバー側の箱が用意されます。'),
    ],
    fill: [f(['___();', "$_SESSION['user_id'] = 7;"], ['session_start', 'session_end', 'isset', 'echo'], '$_SESSION を使う前に、必ず session_start() を呼びます。')],
  },

  composer: {
    choice: [
      c('Composer は何をする道具?', ['外部のライブラリを入れて管理する', '画像を編集する', 'PHPを高速化する', 'データベースを作る'], '必要な部品をダウンロードして、バージョンも管理してくれます。'),
      c('入れた部品を自動で読み込めるようにするファイルは?', ['vendor/autoload.php', 'composer.json', 'index.php', 'config.php'], 'composer.json は「欲しい部品の一覧」で、読み込みは autoload.php が担当します。'),
    ],
    fill: [f(['// ターミナルで: composer require monolog/monolog', "require '___';", "$log = new Monolog\\Logger('app');"], ['vendor/autoload.php', 'composer.json', 'monolog.php', 'index.php'], 'autoload.php を1回読み込めば、入れた部品が使えます。')],
  },

  // ===================== 応用 =====================
  interface: {
    choice: [
      c('interface は何を決めるもの?', ['クラスが持つべきメソッドの約束', 'データベースの構造', '画面の見た目', 'ファイルの置き場所'], '中身は書かず、「このメソッドを持つこと」だけを決めます。'),
      c('interface の約束を守ると宣言するキーワードは?', ['implements', 'extends', 'use', 'include'], 'class Card implements Payable のように書きます。'),
    ],
    fill: [f(['trait Loggable {', '    public function log($m) { echo $m; }', '}', 'class Order { ___ Loggable; }'], ['use', 'implements', 'extends', 'new'], 'trait(共通の部品)は、クラスの中で use して取り込みます。')],
  },

  closure: {
    choice: [
      c('クロージャ(無名関数)とは?', ['名前のない関数を、値として扱えるもの', 'データベースを閉じる処理', 'クラスを閉じる記号', 'エラーを閉じる構文'], '変数に入れたり、他の関数に渡したりできます。'),
      c('function ($price) use ($tax) { … } の use の役割は?', ['外側の変数を、関数の中に持ち込む', 'クラスを読み込む', '名前空間を短くする', 'トレイトを取り込む'], 'そのままでは、関数の中から外の変数は見えません。'),
    ],
    fill: [f(['$tax = 0.1;', '$f = function ($p) ___ ($tax) {', '    return $p * (1 + $tax);', '};'], ['use', 'with', 'import', 'global'], 'クロージャでは use ( ) で外の変数を持ち込みます。')],
  },

  types: {
    choice: [
      c('declare(strict_types=1); を書くと?', ['型がちがう値を渡すと、エラーになる', '型が自動で変換される', '速度が2倍になる', '変数が使えなくなる'], '型のまちがいを、早い段階で見つけられます。'),
      c('function add(int $a, int $b): int の「: int」は?', ['戻り値の型', '引数の名前', 'クラス名', 'エラーの種類'], '「整数を返す」という約束です。'),
    ],
    fill: [f(['function add(int $a, int $b)___ {', '    return $a + $b;', '}'], [': int', '-> int', '= int', 'as int'], '戻り値の型は、引数の ) のあとに「: 型」で書きます。')],
  },

  yield: {
    choice: [
      c('yield の働きは?', ['値を1つ渡して、関数を一時停止する', '関数を終了して値を返す', 'エラーを投げる', '変数を消す'], '次に呼ばれると、止まった場所から再開します。'),
      c('ジェネレータ(yield)が省メモリな理由は?', ['全部をためこまず、1件ずつ作るから', 'データを圧縮するから', 'データベースに保存するから', '小さい型を使うから'], '100万件でも、1件ずつ作って捨てていきます。'),
    ],
    fill: [f(['function numbers() {', '    for ($i = 1; $i <= 3; $i++) {', '        ___ $i;', '    }', '}'], ['yield', 'return', 'echo', 'break'], 'return だと1回で終わってしまいます。yield なら1つずつ渡せます。')],
  },

  psr: {
    choice: [
      c('PSR とは?', ['PHPの書き方などの共通ルール', 'PHPのバージョン名', 'データベースの種類', 'ブラウザの名前'], '誰が書いても同じ見た目になるよう、コミュニティで決められています。'),
      c('OrderService のように、単語の頭を大文字にする書き方は?', ['UpperCamelCase', 'snake_case', 'kebab-case', 'UPPER_CASE'], 'クラス名はこの書き方にします。メソッド名は先頭だけ小文字(camelCase)です。'),
    ],
    fill: [f(['class ___', '{', '    public function findById(int $id) {}', '}'], ['OrderService', 'order_service', 'orderservice', 'Order-Service'], 'クラス名は UpperCamelCase で書きます。')],
  },
}
