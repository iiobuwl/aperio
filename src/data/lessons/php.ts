// PHP の解説ページのデータです。キーは languages.ts の項目の id と同じ名前にします。
// 1つの項目 = コード(lines)+ ステップの配列。
//   code: 今のステップで光らせる行(1始まり)。codeTo を足すと範囲で光る
//   コードは「ここまでのステップで出た一番下の行」まで表示される(1行ずつ増える)

import type { Lesson } from '../types'
import { chain, out, table, vars } from './helpers'

const php = (lines: string[]) => ({ label: 'PHP', lines })

export const PHP_LESSONS: Record<string, Lesson> = {
  // ===================== 必須 =====================
  echo: {
    code: php(['<?php', "echo 'こんにちは';", 'echo 100 + 20;', 'echo "<p>ようこそ</p>";']),
    steps: [
      { title: '<?php でPHPの始まり', note: 'ここから先はPHPとして実行される、という目印', code: 1, visuals: [out()] },
      { title: '文字をそのまま出す', note: '引用符で囲んだ文字が、画面に出る', code: 2, visuals: [out('こんにちは')] },
      { title: '計算の結果も出せる', note: '先に 100 + 20 を計算して、答えの 120 を出す', code: 3, visuals: [out('こんにちは', '120')] },
      {
        title: 'HTMLも出せる',
        note: 'PHPは文字を作って返しているだけ。<p> はブラウザへの「段落です」という合図',
        code: 4,
        visuals: [out('こんにちは', '120', 'ようこそ')],
      },
    ],
  },

  variable: {
    code: php(['<?php', "$name = 'ナオ';", '$age = 25;', '$age = $age + 1;', 'echo "{$name}さん {$age}歳";']),
    steps: [
      { title: '箱に名前をつけて入れる', note: '$ から始まる名前が変数。= は「等しい」ではなく「入れる」', code: 2, visuals: [vars(['$name', 'ナオ'])] },
      { title: '数字も入れられる', note: '箱はいくつでも作れる', code: 3, visuals: [vars(['$name', 'ナオ'], ['$age', '25'])] },
      { title: '中身を入れかえる', note: '右側を先に計算(25 + 1)して、答えを $age に入れ直す', code: 4, visuals: [vars(['$name', 'ナオ'], ['$age', '26'])] },
      {
        title: '文字の中に変数を埋め込む',
        note: '"…" の中では {$変数} が中身に置きかわる',
        code: 5,
        visuals: [vars(['$name', 'ナオ'], ['$age', '26']), out('ナオさん 26歳')],
      },
    ],
  },

  concat: {
    code: php(['<?php', "$first = '山田';", "$last = '太郎';", 'echo $first . $last;', "echo $first . ' ' . $last . 'さん';"]),
    steps: [
      { title: '2つの文字を用意', code: 2, codeTo: 3, visuals: [vars(['$first', '山田'], ['$last', '太郎'])] },
      {
        title: '「.」でつなぐ',
        note: '文字と文字をつなぐのはピリオド。足し算の + ではない',
        code: 4,
        visuals: [chain(['山田', '.', '太郎'], [0, 1, 2]), out('山田太郎')],
      },
      {
        title: 'いくつでもつなげる',
        note: 'すき間がほしいときは、空白の文字もつなぐ',
        code: 5,
        visuals: [chain(['山田', ' ', '太郎', 'さん']), out('山田太郎', '山田 太郎さん')],
      },
    ],
  },

  array: {
    code: php(['<?php', "$fruits = ['りんご', 'みかん', 'ぶどう'];", 'echo $fruits[0];', "$fruits[] = 'もも';", 'echo count($fruits);']),
    steps: [
      {
        title: '複数の値をまとめて持つ',
        note: '[ ] で囲んで、カンマで区切る。値には番号がつく',
        code: 2,
        visuals: [table('$fruits', ['番号', '値'], [[0, 'りんご'], [1, 'みかん'], [2, 'ぶどう']])],
      },
      {
        title: '番号で取り出す',
        note: '番号は 1 ではなく 0 から始まる',
        code: 3,
        visuals: [table('$fruits', ['番号', '値'], [[0, 'りんご'], [1, 'みかん'], [2, 'ぶどう']], { marks: { 0: 'hot', 1: 'dim', 2: 'dim' } }), out('りんご')],
      },
      {
        title: '[] = で末尾に追加',
        code: 4,
        visuals: [table('$fruits', ['番号', '値'], [[0, 'りんご'], [1, 'みかん'], [2, 'ぶどう'], [3, 'もも']], { marks: { 3: 'new' } })],
      },
      {
        title: 'count() で個数',
        code: 5,
        visuals: [table('$fruits', ['番号', '値'], [[0, 'りんご'], [1, 'みかん'], [2, 'ぶどう'], [3, 'もも']]), out('4')],
      },
    ],
  },

  if: {
    code: php(['<?php', '$score = 72;', 'if ($score >= 80) {', "    echo '合格';", '} else {', "    echo '再挑戦';", '}']),
    steps: [
      { title: '調べたい値を用意', code: 2, visuals: [vars(['$score', '72'])] },
      {
        title: 'if で条件を調べる',
        note: '( ) の中が true(正しい)なら { } の中を実行する',
        code: 3,
        visuals: [chain(['72 >= 80 ?', 'false(いいえ)']), vars(['$score', '72'])],
      },
      {
        title: '条件が false なら飛ばす',
        note: '{ } の中の echo \'合格\' は実行されない',
        code: 4,
        visuals: [chain(['72 >= 80 ?', 'false', "'合格' は飛ばす"], [0, 1]), out()],
      },
      {
        title: 'else が代わりに動く',
        note: 'if が当てはまらなかったときだけ、else の中が実行される',
        code: 5,
        codeTo: 7,
        visuals: [out('再挑戦')],
      },
    ],
  },

  foreach: {
    code: php(['<?php', "$names = ['A', 'B', 'C'];", 'foreach ($names as $name) {', "    echo $name . 'さん';", '}']),
    steps: [
      { title: '配列を用意', code: 2, visuals: [table('$names', ['番号', '値'], [[0, 'A'], [1, 'B'], [2, 'C']])] },
      {
        title: '1周目: 先頭を取り出す',
        note: '$name に 1つずつ入れて、{ } の中を実行する',
        code: 3,
        codeTo: 5,
        visuals: [vars(['$name', 'A']), table('$names', ['番号', '値'], [[0, 'A'], [1, 'B'], [2, 'C']], { marks: { 0: 'hot' } }), out('Aさん')],
      },
      {
        title: '2周目',
        code: 3,
        codeTo: 5,
        visuals: [vars(['$name', 'B']), table('$names', ['番号', '値'], [[0, 'A'], [1, 'B'], [2, 'C']], { marks: { 1: 'hot' } }), out('Aさん', 'Bさん')],
      },
      {
        title: '3周目で終わり',
        note: '最後まで取り出したら、自動でくり返しが終わる',
        code: 3,
        codeTo: 5,
        visuals: [vars(['$name', 'C']), table('$names', ['番号', '値'], [[0, 'A'], [1, 'B'], [2, 'C']], { marks: { 2: 'hot' } }), out('Aさん', 'Bさん', 'Cさん')],
      },
    ],
  },

  function: {
    code: php(['<?php', 'function tax($price) {', '    return $price * 1.1;', '}', 'echo tax(1000);', 'echo tax(200);']),
    steps: [
      {
        title: '処理に名前をつける',
        note: '定義しただけでは動かない。呼ばれるのを待っている',
        code: 2,
        codeTo: 4,
        visuals: [chain(['tax($price)', '呼ばれるのを待つ'], [0])],
      },
      {
        title: '呼ぶと動く',
        note: '( ) の中の 1000 が $price に入り、return で答えが返る',
        code: 5,
        visuals: [vars(['$price', '1000']), chain(['tax(1000)', '1000 × 1.1', 'return 1100']), out('1100')],
      },
      {
        title: '何度でも使える',
        note: '同じ処理を、値を変えて使い回せるのが関数の良いところ',
        code: 6,
        visuals: [vars(['$price', '200']), chain(['tax(200)', '200 × 1.1', 'return 220']), out('1100', '220')],
      },
    ],
  },

  // ===================== 基礎 =====================
  assoc: {
    code: php(['<?php', '$user = [', "    'name' => 'ナオ',", "    'age'  => 25,", '];', "echo $user['name'];", "$user['age'] = 26;"]),
    steps: [
      {
        title: '「名前 => 値」の組',
        note: '番号の代わりに、名前(キー)で値を持てる',
        code: 2,
        codeTo: 5,
        visuals: [table('$user', ['キー', '値'], [['name', 'ナオ'], ['age', 25]])],
      },
      {
        title: 'キーで取り出す',
        code: 6,
        visuals: [table('$user', ['キー', '値'], [['name', 'ナオ'], ['age', 25]], { marks: { 0: 'hot', 1: 'dim' } }), out('ナオ')],
      },
      {
        title: 'キーを指定して書きかえ',
        code: 7,
        visuals: [table('$user', ['キー', '値'], [['name', 'ナオ'], ['age', 26]], { marks: { 1: 'edit' } })],
      },
    ],
  },

  compare: {
    code: php(['<?php', "var_dump('1' == 1);", "var_dump('1' === 1);", "var_dump('1' === '1');"]),
    steps: [
      {
        title: '== は型をゆるく見る',
        note: '文字の "1" と数字の 1 を、同じ値とみなす',
        code: 2,
        visuals: [chain(["'1'(文字)", '==', '1(数字)', 'true']), out('true')],
      },
      {
        title: '=== は型まで見る',
        note: '文字と数字は別物なので false',
        code: 3,
        visuals: [chain(["'1'(文字)", '===', '1(数字)', 'false']), out('true', 'false')],
      },
      {
        title: '型も値も同じなら true',
        code: 4,
        visuals: [chain(["'1'(文字)", '===', "'1'(文字)", 'true']), out('true', 'false', 'true')],
      },
      { title: '迷ったら ===', note: 'ゆるい比較は思わぬ結果になることがある。基本は === を使う', visuals: [out('true', 'false', 'true')] },
    ],
  },

  isset: {
    code: php(['<?php', "$user = ['name' => 'ナオ', 'memo' => ''];", "var_dump(isset($user['name']));", "var_dump(isset($user['age']));", "var_dump(empty($user['memo']));"]),
    steps: [
      { title: '調べる対象', code: 2, visuals: [table('$user', ['キー', '値'], [['name', 'ナオ'], ['memo', '']])] },
      {
        title: 'isset: 値があるか',
        note: '「その名前の値が存在して、NULL でない」なら true',
        code: 3,
        visuals: [table('$user', ['キー', '値'], [['name', 'ナオ'], ['memo', '']], { marks: { 0: 'hot', 1: 'dim' } }), out('true')],
      },
      {
        title: '無いキーは false',
        note: 'age というキーは見つからない。エラーにならず false が返る',
        code: 4,
        visuals: [chain(["'age' を探す", '見つからない', 'false'], [0, 1, 2]), out('true', 'false')],
      },
      {
        title: 'empty: 空っぽか',
        note: '空の文字・0・NULL・空の配列は「空」とみなされる',
        code: 5,
        visuals: [table('$user', ['キー', '値'], [['name', 'ナオ'], ['memo', '']], { marks: { 0: 'dim', 1: 'hot' } }), out('true', 'false', 'true')],
      },
    ],
  },

  request: {
    code: php([
      '<?php',
      '// URL: /search.php?word=php&page=2',
      "$word = $_GET['word'];",
      "$page = $_GET['page'];",
      '// フォームの送信(POST)',
      "$email = $_POST['email'];",
    ]),
    steps: [
      {
        title: 'URLの「?」以降が届く',
        note: '?名前=値&名前=値 の形で、ブラウザからPHPへ値が渡される',
        code: 2,
        visuals: [chain(['ブラウザ', '?word=php&page=2', '$_GET'])],
      },
      { title: '名前で取り出す', code: 3, visuals: [vars(['$word', 'php'])] },
      {
        title: '届く値は文字',
        note: '2 も数字ではなく文字の "2" として届く',
        code: 4,
        visuals: [vars(['$word', 'php'], ['$page', '"2"'])],
      },
      {
        title: 'フォームの送信は $_POST',
        note: 'URLには出ず、送信の本体に入って届く。パスワードなどはこちら',
        code: 5,
        codeTo: 6,
        visuals: [chain(['フォーム', '送信の本体(URLに出ない)', '$_POST'])],
      },
    ],
  },

  escape: {
    code: php(['<?php', "$comment = '<script>alert(1)</script>';", 'echo $comment;', 'echo htmlspecialchars($comment);']),
    steps: [
      { title: '利用者が入力した文字', note: '悪意のあるプログラムが混ざっているかもしれない', code: 2, visuals: [vars(['$comment', '<script>alert(1)</script>'])] },
      {
        title: 'そのまま出すと危険',
        note: 'ブラウザは <script> をプログラムとして実行してしまう',
        code: 3,
        visuals: [{ kind: 'output', lines: ['⚠ 他人のプログラムが動いてしまう'], label: '画面(危険)' }],
      },
      {
        title: 'htmlspecialchars で無害に',
        note: '< や > を &lt; &gt; に置きかえる。画面にはただの文字として見える',
        code: 4,
        visuals: [chain(['<', '→', '&lt;']), { kind: 'output', lines: ['<script>alert(1)</script>'], label: '画面(安全)' }],
      },
    ],
  },

  require: {
    code: php(['<?php', "require 'config.php';", "require_once 'functions.php';", "include 'banner.php';"]),
    steps: [
      {
        title: 'require: ファイルを読み込む',
        note: 'その場所に、ファイルの中身を貼りつけたのと同じ動きをする',
        code: 2,
        visuals: [chain(['index.php', 'config.php', 'functions.php', 'banner.php'], [0, 1])],
      },
      {
        title: 'require_once: 1回だけ',
        note: 'すでに読み込んだファイルなら、2回目は読まない(関数の二重定義を防ぐ)',
        code: 3,
        visuals: [chain(['index.php', 'config.php', 'functions.php', 'banner.php'], [0, 2])],
      },
      {
        title: 'include: 無くても続行',
        note: 'ファイルが見つからないとき、require は止まるが include は警告だけで進む',
        code: 4,
        visuals: [chain(['index.php', 'config.php', 'functions.php', 'banner.php'], [0, 3])],
      },
    ],
  },

  // ===================== 中級 =====================
  class: {
    code: php([
      '<?php',
      'class User {',
      '    public $name;',
      '    public function hello() {',
      "        return $this->name . 'です';",
      '    }',
      '}',
      '$u = new User();',
      "$u->name = 'ナオ';",
      'echo $u->hello();',
    ]),
    steps: [
      {
        title: 'class は設計図',
        note: '持つデータ($name)と、できること(hello)をまとめて書く。まだ実物はない',
        code: 2,
        codeTo: 7,
        visuals: [chain(['class User', '設計図だけ(実物なし)'], [0])],
      },
      {
        title: 'new で実物を作る',
        note: '設計図から作った実物を「インスタンス」と呼ぶ',
        code: 8,
        visuals: [chain(['class User(設計図)', 'new', '$u(実物)'], [0, 1, 2])],
      },
      { title: '実物にデータを入れる', note: '-> で、実物の中身にアクセスする', code: 9, visuals: [vars(['$u->name', 'ナオ'])] },
      {
        title: '実物のメソッドを呼ぶ',
        note: '$this は「この実物自身」。$this->name は $u->name のこと',
        code: 10,
        visuals: [vars(['$u->name', 'ナオ']), out('ナオです')],
      },
    ],
  },

  namespace: {
    code: php(['<?php', 'namespace App\\Models;', '', 'class User {}', '', '// 別のファイルから使う', 'use App\\Models\\User;', '$u = new User();']),
    steps: [
      {
        title: '名前に「住所」をつける',
        note: 'フォルダのように、名前を階層で区切る',
        code: 2,
        visuals: [chain(['App', 'Models', 'User'])],
      },
      {
        title: '本当の名前は住所つき',
        note: 'このクラスの正式名は App\\Models\\User。別の場所の Shop\\Cart\\User とは別物になる',
        code: 4,
        visuals: [chain(['App\\Models\\User', '≠', 'Shop\\Cart\\User'], [0])],
      },
      {
        title: 'use で短く呼べる',
        note: '長い住所を、いつもの名前 User で使えるようにする',
        code: 6,
        codeTo: 7,
        visuals: [chain(['use App\\Models\\User', 'User だけで呼べる'])],
      },
      { title: '使う', code: 8, visuals: [chain(['new User()', '= new App\\Models\\User()'])] },
    ],
  },

  exception: {
    code: php([
      '<?php',
      'try {',
      '    $n = intdiv(10, 0);',
      "    echo '計算できた';",
      '} catch (DivisionByZeroError $e) {',
      "    echo 'ゼロでは割れません';",
      '}',
    ]),
    steps: [
      { title: 'try: 試してみる', note: '失敗するかもしれない処理を { } の中に入れる', code: 2, visuals: [chain(['try { … }', '失敗するかも?'], [0])] },
      {
        title: 'エラーが起きる',
        note: '10 をゼロで割るのは不可能。エラーが「投げられる」',
        code: 3,
        visuals: [chain(['intdiv(10, 0)', '⚠ エラー発生', '投げる(throw)'], [0, 1, 2])],
      },
      {
        title: '残りは飛ばされる',
        note: 'エラーが起きた時点で、try の中の続きは実行されない',
        code: 4,
        visuals: [chain(["echo '計算できた'", 'スキップ'], [1]), out()],
      },
      {
        title: 'catch が受け止める',
        note: 'catch がなければ、エラーでページが止まってしまう',
        code: 5,
        codeTo: 7,
        visuals: [chain(['⚠ エラー', 'catch で受け止める', '処理を続ける'], [0, 1, 2]), out('ゼロでは割れません')],
      },
    ],
  },

  pdo: {
    code: php([
      '<?php',
      "$pdo = new PDO('mysql:host=localhost;dbname=shop', 'user', 'pass');",
      "$stmt = $pdo->prepare('SELECT * FROM orders WHERE id = :id');",
      "$stmt->execute(['id' => 42]);",
      '$order = $stmt->fetch();',
    ]),
    steps: [
      { title: 'DBにつなぐ', note: 'PDO は、PHP とデータベースの間に立つ連絡係', code: 2, visuals: [chain(['PHP', 'PDO', 'データベース'])] },
      {
        title: 'prepare: SQLの「型」を送る',
        note: '値の部分は :id という穴にしておく',
        code: 3,
        visuals: [chain(['PHP', 'select … where id = :id', 'DB(型を受け取る)'], [0, 1, 2])],
      },
      {
        title: 'execute: 値を別便で送る',
        note: '値を SQL に混ぜないので、悪意のある入力でSQLを書きかえられない(SQLインジェクション対策)',
        code: 4,
        visuals: [vars([':id', '42']), chain(['値 42', '穴に入れて実行', 'DB'])],
      },
      {
        title: 'fetch: 結果の1行を受け取る',
        code: 5,
        visuals: [table('$order', ['id', 'user_id', 'total'], [[42, 7, 1500]], { marks: { 0: 'hot' } })],
      },
    ],
  },

  session: {
    code: php(['<?php', 'session_start();', "$_SESSION['user_id'] = 7;", "echo $_SESSION['user_id'];"]),
    steps: [
      {
        title: 'session_start: 整理番号を渡す',
        note: 'ブラウザに整理番号(Cookie)を預け、サーバー側に自分専用の箱を用意する',
        code: 2,
        visuals: [chain(['ブラウザ(整理番号 abc123)', 'サーバー(箱 abc123)'])],
      },
      { title: '箱に保存', note: '値はブラウザではなくサーバー側に残る', code: 3, visuals: [vars(["$_SESSION['user_id']", '7'])] },
      {
        title: '次のページでも取り出せる',
        note: 'ブラウザが整理番号を見せるたび、同じ箱が開く。だからログイン状態が続く',
        code: 4,
        visuals: [chain(['別のページ', '整理番号 abc123', '箱を開ける'], [0, 1, 2]), out('7')],
      },
    ],
  },

  composer: {
    code: php(['<?php', '// ターミナルで: composer require monolog/monolog', "require 'vendor/autoload.php';", "$log = new Monolog\\Logger('app');"]),
    steps: [
      {
        title: 'composer require で入れる',
        note: '配布所(Packagist)から部品をダウンロードして、vendor/ フォルダに置く',
        code: 2,
        visuals: [chain(['composer require', '配布所 Packagist', 'vendor/ フォルダ'])],
      },
      {
        title: 'autoload.php を読み込む',
        note: 'これ1行で、vendor 内の部品が必要なときに自動で読み込まれる',
        code: 3,
        visuals: [chain(['vendor/autoload.php', '必要なクラスだけ自動で読む'])],
      },
      { title: 'そのまま使える', code: 4, visuals: [chain(['new Monolog\\Logger', '入れた部品が動く'])] },
      {
        title: '何を入れたかは記録される',
        note: 'composer.json に「欲しい部品」、composer.lock に「入れた版」が残る',
        visuals: [table('記録ファイル', ['ファイル', '役目'], [['composer.json', '欲しい部品の一覧'], ['composer.lock', '実際に入れた版の記録']])],
      },
    ],
  },

  // ===================== 応用 =====================
  interface: {
    code: php([
      '<?php',
      'interface Payable {',
      '    public function pay(int $yen);',
      '}',
      'class Card implements Payable {',
      '    public function pay(int $yen) { /* 支払い */ }',
      '}',
      'trait Loggable {',
      '    public function log($m) { echo $m; }',
      '}',
      'class Order { use Loggable; }',
    ]),
    steps: [
      {
        title: 'interface は「約束」',
        note: '中身は書かず、「pay() を持つこと」だけを決める',
        code: 2,
        codeTo: 4,
        visuals: [chain(['Payable', 'pay() を持つ約束'])],
      },
      {
        title: 'implements で約束を守る',
        note: '約束した pay() を書かないと、エラーになる',
        code: 5,
        codeTo: 7,
        visuals: [chain(['Card', 'implements', 'Payable ✓'])],
      },
      {
        title: 'trait は「共通の部品」',
        note: '複数のクラスで使い回したい処理を、別に切り出しておく',
        code: 8,
        codeTo: 10,
        visuals: [chain(['Loggable', 'log() を持つ部品'])],
      },
      {
        title: 'use で部品を取り込む',
        code: 11,
        visuals: [chain(['Order', 'use Loggable', 'log() が使える'])],
      },
    ],
  },

  closure: {
    code: php([
      '<?php',
      '$tax = 0.1;',
      '$addTax = function ($price) use ($tax) {',
      '    return $price * (1 + $tax);',
      '};',
      'echo $addTax(1000);',
      '$prices = array_map($addTax, [100, 200]);',
    ]),
    steps: [
      { title: '外にある変数', code: 2, visuals: [vars(['$tax', '0.1'])] },
      {
        title: '名前のない関数を、変数に入れる',
        note: 'use ($tax) で、外の変数を関数の中へ持ち込む',
        code: 3,
        codeTo: 5,
        visuals: [vars(['$tax', '0.1'], ['$addTax', 'function'])],
      },
      { title: '変数の名前で呼べる', code: 6, visuals: [vars(['$addTax', 'function']), out('1100')] },
      {
        title: '関数を「値」として渡す',
        note: 'array_map は、配列の全部の要素に、渡された関数を使う',
        code: 7,
        visuals: [chain(['100', '$addTax', '110']), chain(['200', '$addTax', '220'])],
      },
    ],
  },

  types: {
    code: php([
      '<?php',
      'declare(strict_types=1);',
      'function add(int $a, int $b): int {',
      '    return $a + $b;',
      '}',
      'echo add(1, 2);',
      "echo add('1', 2);",
    ]),
    steps: [
      { title: 'strict_types で厳しく', note: '型がちがう値を、勝手に変換させない', code: 2, visuals: [chain(['strict_types=1', '型のまちがいを見逃さない'])] },
      {
        title: '引数と戻り値の型を決める',
        note: 'int は整数。(int $a, int $b): int は「整数2つを受け取り、整数を返す」',
        code: 3,
        codeTo: 5,
        visuals: [chain(['int $a', 'int $b', 'add()', '→ int'])],
      },
      { title: '正しい型なら動く', code: 6, visuals: [out('3')] },
      {
        title: '型がちがうと、すぐエラー',
        note: "'1' は文字なので受け付けない。バグを早く見つけられる",
        code: 7,
        visuals: [{ kind: 'output', lines: ['TypeError: $a は int である必要があります'], label: 'エラー' }],
      },
    ],
  },

  yield: {
    code: php([
      '<?php',
      'function numbers() {',
      '    for ($i = 1; $i <= 3; $i++) {',
      '        yield $i;',
      '    }',
      '}',
      'foreach (numbers() as $n) {',
      '    echo $n;',
      '}',
    ]),
    steps: [
      {
        title: 'yield を使う関数',
        note: '呼んでも、すぐには最後まで走らない',
        code: 2,
        codeTo: 6,
        visuals: [chain(['numbers()', '呼ばれるのを待つ'], [0])],
      },
      {
        title: '1つ渡して、一時停止',
        note: 'yield は「値を1つ渡して、ここで止まる」',
        code: 7,
        codeTo: 9,
        visuals: [vars(['$n', '1']), chain(['yield 1', '一時停止中'], [0, 1]), out('1')],
      },
      {
        title: '続きから再開',
        note: '止まった場所から、次の1つを作る',
        code: 7,
        codeTo: 9,
        visuals: [vars(['$n', '2']), chain(['yield 2', '一時停止中'], [0, 1]), out('1', '2')],
      },
      {
        title: '全部をためこまない',
        note: '100万件でも、1件ずつ作って捨てるので、メモリをほとんど使わない',
        code: 7,
        codeTo: 9,
        visuals: [vars(['$n', '3']), out('1', '2', '3')],
      },
    ],
  },

  psr: {
    code: php([
      '<?php',
      'namespace App\\Services;',
      '',
      'class OrderService',
      '{',
      '    public function findById(int $id): ?Order',
      '    {',
      '        // ...',
      '    }',
      '}',
    ]),
    steps: [
      {
        title: 'PSR は共通の書き方ルール',
        note: '誰が書いても同じ見た目になるよう、PHPコミュニティで決められている',
        code: 2,
        visuals: [chain(['App\\Services\\OrderService', '=', 'app/Services/OrderService.php'], undefined, 'PSR-4: 名前とフォルダを対応させる')],
      },
      {
        title: 'クラス名は大文字ではじめる',
        note: 'OrderService のように単語の頭を大文字に(UpperCamelCase)。ファイル名もクラス名と同じ',
        code: 4,
        codeTo: 5,
        visuals: [table('クラス名のルール', ['書き方', '判定'], [['OrderService', 'OK'], ['order_service', 'NG']], { marks: { 0: 'hot', 1: 'dim' } })],
      },
      {
        title: 'メソッド名は小文字ではじめる',
        note: 'findById のように(camelCase)。インデントは半角スペース4つ',
        code: 6,
        codeTo: 10,
        visuals: [table('メソッド名のルール', ['書き方', '判定'], [['findById', 'OK'], ['FindById', 'NG']], { marks: { 0: 'hot', 1: 'dim' } })],
      },
      {
        title: '自動で整える道具もある',
        note: 'Laravel Pint などで、ルールに合わせて自動で整形できる',
        visuals: [chain(['書いたコード', 'Laravel Pint', 'PSR-12 にそろう'])],
      },
    ],
  },
}
