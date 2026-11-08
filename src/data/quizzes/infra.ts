// 「ITの仕組み」(追加分)・「セキュリティ」・「ファイル処理・運用」・「データベース運用」のテストの問題です。
// 選択肢は「正解を先頭」に書く(画面でシャッフルされる)。

import type { Quiz } from '../types'
import { c, f } from './helpers'

// ===================== ITの仕組み(追加) =====================
export const IT_EXTRA_QUIZZES: Record<string, Quiz> = {
  multipart: {
    choice: [
      c('ファイルを含むフォームを送るときの enctype は?', ['multipart/form-data', 'text/plain', 'application/json', 'image/png'], 'ファイルの中身(バイナリ)は、multipart/form-data でしか送れません。'),
      c('multipart で、各パートの区切りに使われるのは?', ['boundary(境界文字列)', '改行1つだけ', 'カンマ', 'セミコロン'], 'Content-Type に書いた boundary の文字列で、パートを区切ります。'),
    ],
    fill: [f(['<form method="post" enctype="___">', '  <input type="file" name="file">', '</form>'], ['multipart/form-data', 'text/html', 'file/upload', 'binary/data'], 'ファイル入力を含むフォームには、multipart/form-data を指定します。')],
  },

  'user-agent': {
    choice: [
      c('ユーザーエージェント(User-Agent)とは?', ['ブラウザの種類などを表す文字列', '利用者の名前', 'サーバーの種類', 'パスワード'], 'リクエストのたびに、ブラウザが自分の種類を名乗ります。'),
      c('UA文字列に Trident が含まれていたら?', ['IE(Internet Explorer)の可能性が高い', 'Chrome', 'スマホ', 'サーバー'], 'Trident は IE の描画エンジンの名前です。'),
    ],
    fill: [f(["if (strpos($_SERVER['___'], 'Trident') !== false) {", '    // IE の場合の処理', '}'], ['HTTP_USER_AGENT', 'REQUEST_URI', 'REMOTE_ADDR', 'SCRIPT_NAME'], 'UA は $_SERVER の HTTP_USER_AGENT に入っています。')],
  },

  'browser-detect': {
    choice: [
      c('ブラウザ判定とは?', ['ブラウザの種類によって処理を分けること', 'ブラウザを自動で更新すること', 'ブラウザを閉じること', 'ブラウザの速度を測ること'], 'UA文字列などから、ブラウザの種類を見分けて分岐します。'),
      c('ブラウザ判定より、推奨されることが多い方法は?', ['機能検出(その機能が使えるかを調べる)', 'UAの文字を増やす', 'ブラウザごとに別サイトを作る', '判定をやめて古いブラウザを無視する'], '種類ではなく「できるか」を調べるほうが、壊れにくい書き方です。'),
    ],
    fill: [f(["$ua = $_SERVER['HTTP_USER_AGENT'];", "if (___($ua, 'Trident') !== false) {", "    echo 'IE';", '}'], ['strpos', 'count', 'trim', 'echo'], 'strpos は、文字が見つかった位置を返す関数です。')],
  },

  'robots-txt': {
    choice: [
      c('robots.txt の役割は?', ['検索エンジンのクローラーに、巡回ルールを伝える', 'パスワードを保存する', 'ページの見た目を決める', 'ログを記録する'], 'サイトの入口(/robots.txt)に置く、巡回の案内板です。'),
      c('robots.txt で「入らないでほしい」場所を指定する行は?', ['Disallow', 'Allow', 'Block', 'Hide'], 'Disallow: /admin/ のように書きます。'),
    ],
    fill: [f(['User-agent: *', '___: /admin/'], ['Disallow', 'Allow', 'Hide', 'Deny'], '巡回してほしくない場所は Disallow に書きます(強制力はなく、お願いです)。')],
  },

  'tag-manager': {
    choice: [
      c('タグマネージャーとは?', ['計測タグなどをまとめて管理する仕組み', 'HTMLのタグを自動で閉じる仕組み', 'データベースの管理画面', '画像の管理ツール'], 'アクセス解析や広告の計測コードを、管理画面で登録・変更できます。'),
      c('タグマネージャーの利点は?', ['計測の追加・変更を、サイトのHTMLを直さずにできる', 'サイトが必ず速くなる', 'セキュリティが不要になる', 'ブラウザが不要になる'], 'サイトにコードを1つ貼れば、あとは管理画面だけで済みます。'),
    ],
    fill: [f(['<!-- Google Tag Manager -->', '<script async src="https://www.googletagmanager.com/___.js?id=GTM-XXXX"></script>'], ['gtm', 'jquery', 'main', 'app'], 'GTM のコードは gtm.js を読み込みます。')],
  },

  'cookie-lifetime': {
    choice: [
      c('session.cookie_lifetime を 0 にすると?', ['ブラウザを閉じたら、ログインが切れる', '永久にログインが切れない', 'すぐにログインが切れる', 'Cookieが使えなくなる'], '期限のない「セッションCookie」になり、ブラウザを閉じると消えます。'),
      c('期限0のCookieと、期限のあるCookieのちがいは?', ['期限0はブラウザを閉じると消え、期限ありは閉じても残る', '期限0のほうが長く残る', 'ちがいはない', '期限0はサーバーに保存される'], '期限をつけると、その日数のあいだはブラウザに残ります。'),
    ],
    fill: [f(["ini_set('session.cookie_lifetime', ___);  // ブラウザを閉じたら切れる", 'session_start();'], ['0', '1', '3600', '86400'], '0 は「ブラウザを閉じるまで」の意味です。')],
  },

  'iso-2022-jp': {
    choice: [
      c('ISO-2022-JP とは?', ['日本語メールで昔から使われている文字コード', '画像の形式', '暗号方式', '日付の形式'], 'JISコードとも呼ばれ、7ビットの通信路でも日本語を送れます。'),
      c('ISO-2022-JP のメールを作るとき、本文に必要なことは?', ['UTF-8などから、ISO-2022-JP に文字コード変換する', '何もしなくてよい', '全部ローマ字にする', '画像にする'], '変換せずに送ると、文字化けすることがあります。'),
    ],
    fill: [f(["$body = mb_convert_encoding('こんにちは', '___', 'UTF-8');  // メール用(JISコード)"], ['ISO-2022-JP', 'ASCII', 'HTML', 'BASE'], 'mb_convert_encoding の第2引数が、変換後の文字コードです。')],
  },

  mime: {
    choice: [
      c('MIMEとは?', ['メールに添付ファイルや複数パートを含めるための規格', 'メールのパスワード', 'メールの送信速度', 'メールサーバーの名前'], '本文と添付ファイルなどを、1通のメールにまとめる取り決めです。'),
      c('メールで、添付ファイルの中身を文字として送るために使われる変換は?', ['Base64', 'gzip', 'SVG', 'JSON'], 'バイナリを、文字だけで表せる形に変えます。'),
    ],
    fill: [f(['Content-Type: ___/mixed; boundary="BOUNDARY"'], ['multipart', 'text', 'image', 'video'], '複数のパートを持つメールは、multipart/mixed と書きます。')],
  },
}

// ===================== セキュリティ =====================
export const SECURITY_QUIZZES: Record<string, Quiz> = {
  acl: {
    choice: [
      c('ACL(アクセス制御リスト)とは?', ['誰が何にアクセスできるかを、表で管理する仕組み', '画像の圧縮形式', 'データのバックアップ方法', 'ブラウザの種類'], '「誰が・何に・何ができるか」を表にして持ちます。'),
      c('ACLの利点は?', ['権限の変更を、プログラムを書きかえずに表の更新で行える', 'サーバーが速くなる', '通信が暗号化される', 'データが減る'], 'CakePHP の DbAcl は、表をデータベースに入れて管理します。'),
    ],
    fill: [f(["$ok = $this->Acl->___('営業', 'orders', 'update');", 'if ($ok) { /* 変更できる */ }'], ['check', 'allow', 'get', 'login'], 'check で、その権限が許されているかを調べます。')],
  },

  'md5-sha1': {
    choice: [
      c('MD5やSHA-1が、パスワードの保存に向かない理由は?', ['古い方式で、総当たりなどで破られやすい', '文字数が長すぎる', '日本語が使えない', 'PHPで使えない'], '計算が速すぎて、元の文字を短時間で当てられてしまいます。'),
      c('PHPでパスワードを保存するときに使うべき関数は?', ['password_hash', 'md5', 'sha1', 'crc32'], '塩(ソルト)を混ぜ、わざと遅くして、総当たりに強くしてあります。'),
    ],
    fill: [f(["$hash = ___('password', PASSWORD_DEFAULT);"], ['password_hash', 'md5', 'sha1', 'base64_encode'], 'パスワードの保存には password_hash を使います。')],
  },

  'random-string': {
    choice: [
      c('初期パスワードなどで、l(エル)・o・0・1 などを外す理由は?', ['見間違えやすく、入力ミスの原因になるから', 'PHPで使えない文字だから', '長すぎるから', '危険な文字だから'], '利用者が読んで入力するときの、まちがいを減らすためです。'),
      c('安全な乱数を得るために使う関数は?', ['random_int', 'rand', 'mt_rand', 'time'], 'rand や mt_rand は予測されることがあり、パスワードには向きません。'),
    ],
    fill: [f(['$n = ___(0, 9);  // 0〜9 の安全な乱数'], ['random_int', 'time', 'count', 'strlen'], 'random_int(最小, 最大) で、安全な乱数が得られます。')],
  },

  'unique-id': {
    choice: [
      c('UUIDの特徴は?', ['世界中でほぼ重複しない識別子', '必ず連番になる', '4文字固定', '日本語で書く'], '8-4-4-4-12 文字の形で、別々のシステムが作ってもぶつかりません。'),
      c('セッションIDやトークンに uniqid() だけを使うのが危険な理由は?', ['時刻がもとなので、予測されやすいから', '文字が多すぎるから', 'PHPで遅いから', 'データベースが対応しないから'], '秘密の値には、random_bytes のような安全な乱数を使います。'),
    ],
    fill: [f(['$token = bin2hex(___(16));  // 安全なランダム値'], ['random_bytes', 'uniqid', 'time', 'rand'], 'random_bytes は、安全なランダムのバイト列を作ります。')],
  },
}

// ===================== ファイル処理・運用 =====================
export const OPS_QUIZZES: Record<string, Quiz> = {
  'debug-output': {
    choice: [
      c('変数の中身を表示して調べることを何という?', ['デバッグ出力', 'コンパイル', 'ログイン', 'キャッシュ'], 'うまく動かないとき、まず中身を見て確かめます。'),
      c('var_dump が print_r より詳しく表示するものは?', ['型や長さ', '色', '日付', 'ファイル名'], 'string(6) や int(25) のように、型や長さまで出ます。'),
    ],
    fill: [f(['$user = [1, 2, 3];', '___($user);  // 中身を見やすく表示'], ['print_r', 'count', 'echo', 'trim'], '配列の中身を見やすく表示するには print_r を使います。')],
  },

  'error-log': {
    choice: [
      c('本番環境で display_errors を Off にする理由は?', ['エラーの内容を、利用者や攻撃者に見せないため', 'エラーを無くすため', '速度を上げるため', 'ログを増やすため'], 'エラー文は、内部の構造のヒントになります。'),
      c('PHPで、任意のメッセージをエラーログに書く関数は?', ['error_log()', 'print_r()', 'echo', 'log_in()'], 'ログファイルに1行書き足します。'),
    ],
    fill: [f(['___ = On', 'error_log = /var/log/php_errors.log'], ['log_errors', 'display_error', 'debug_mode', 'verbose'], 'エラーを記録するかどうかは log_errors で決めます。')],
  },

  filesystem: {
    choice: [
      c('ファイルを削除する関数は?', ['unlink', 'delete', 'remove', 'erase'], '削除したファイルは、元に戻せません。'),
      c("chmod('a.txt', 0644) は、何を変える?", ['ファイルの権限', 'ファイルの名前', 'ファイルの中身', 'ファイルの場所'], '誰が読める・書けるか、を決めます。'),
    ],
    fill: [f(["___('memo.txt', 'こんにちは');  // ファイルに書き込む"], ['file_put_contents', 'file_name', 'print', 'read'], 'file_put_contents は、ファイルに文字を書き込みます。')],
  },

  serialize: {
    choice: [
      c('serialize の役割は?', ['配列やオブジェクトを文字列にして、保存できる形にする', '配列を並びかえる', '文字を暗号化する', 'ファイルを圧縮する'], '元に戻すときは unserialize を使います。'),
      c('信頼できない入力に unserialize を使うと危険なのはなぜ?', ['不正なオブジェクトを作られ、悪用される恐れがあるから', '遅いから', '日本語が壊れるから', 'メモリを使うから'], '外から届くデータには、JSON を使うほうが安全です。'),
    ],
    fill: [f(['$text = ___($data);  // 文字列にする', '$back = unserialize($text);'], ['serialize', 'json_decode', 'implode', 'trim'], '配列を文字列にするのは serialize です。')],
  },

  'php-stream': {
    choice: [
      c('php://output は何を指す?', ['画面(ブラウザへの出力)', 'ログファイル', 'データベース', 'メモリ上の一時ファイル'], 'ファイルと同じ書き方で、出力先へ書き込めます。'),
      c('php://temp は?', ['メモリなどに作られる、一時的なファイル', 'インターネット上のファイル', 'データベースの名前', '画像'], '本物のファイルを作らずに、ファイルのように使えます。'),
    ],
    fill: [f(["$out = fopen('___', 'w');  // 画面へ出力", "fputcsv($out, ['id', 'name']);"], ['php://output', 'php://input', 'php://stdin', 'php://memory'], '画面への出力は php://output です。')],
  },
}

// ===================== データベース運用 =====================
export const DBOPS_QUIZZES: Record<string, Quiz> = {
  mysqldump: {
    choice: [
      c('mysqldump は何をする?', ['DBの中身をSQLファイルとして書き出す', 'DBを削除する', 'DBを高速化する', 'DBに接続するだけ'], 'バックアップに使われます。'),
      c('backup.sql から復元するコマンドは?', ['mysql -u user -p shop < backup.sql', 'mysqldump < backup.sql', 'rm backup.sql', 'mysql > backup.sql'], '< で、ファイルの中身を mysql に読み込ませます。'),
    ],
    fill: [f(['$ ___ -u user -p shop > backup.sql'], ['mysqldump', 'mysqld', 'mysqlshow', 'cp'], 'バックアップを書き出すコマンドは mysqldump です。')],
  },

  'single-transaction': {
    choice: [
      c('--single-transaction の目的は?', ['書き込みを止めずに、矛盾のない状態でバックアップする', 'バックアップを圧縮する', 'バックアップを暗号化する', 'バックアップを高速に削除する'], '開始時点の状態を保ったまま、書き出します。'),
      c('このオプションが有効に働くのは、主にどのエンジン?', ['InnoDB', 'MyISAM', 'CSV', 'MEMORY'], 'トランザクションに対応している InnoDB で有効です。'),
    ],
    fill: [f(['$ mysqldump ___ -u user -p shop > backup.sql'], ['--single-transaction', '--drop', '--help', '--version'], '書き込みを止めずに取るためのオプションです。')],
  },

  gzip: {
    choice: [
      c('バックアップを gzip で圧縮する利点は?', ['ファイルサイズが小さくなる', 'データが暗号化される', '復元が不要になる', 'データが増える'], 'SQLは同じ言葉のくり返しが多く、よく縮みます。'),
      c('パイプ「|」の意味は?', ['前のコマンドの出力を、次のコマンドの入力に渡す', 'ファイルを削除する', 'コメントを書く', 'コマンドを終了する'], 'mysqldump | gzip のように、つなげて使います。'),
    ],
    fill: [f(['$ mysqldump -u user -p shop | ___ > backup.sql.gz'], ['gzip', 'cat', 'ls', 'echo'], '出力を圧縮するコマンドは gzip です。')],
  },

  'sql-log': {
    choice: [
      c('SQLログを見る目的は?', ['どのSQLが実行され、どれが遅いかを調べる', 'SQLを自動で書く', 'DBを暗号化する', '表を作る'], '遅いSQLや、同じSQLの連発を見つけるのに役立ちます。'),
      c('SQLログを取るときに注意することは?', ['個人情報やパスワードが記録に残る可能性がある', 'SQLが実行されなくなる', 'DBが消える', '必ず速くなる'], '保管場所や、見られる人に気をつけます。'),
    ],
    fill: [f(["SET GLOBAL general_log = ___;  -- 実行したSQLの記録を始める"], ["'ON'", "'OFF'", "'DEL'", "'SQL'"], 'general_log を ON にすると、実行したSQLが記録されます。')],
  },

  'multi-db-schema': {
    choice: [
      c('1つのDBサーバーで、複数のデータベースを使う利点は?', ['システムごとにデータを分けて管理できる', '必ず速くなる', 'バックアップが不要になる', 'SQLが短くなる'], '権限やバックアップも、データベースごとに分けられます。'),
      c('別のデータベースの表を指定する書き方は?', ['blog.posts', 'blog->posts', 'blog::posts', 'blog/posts'], 'データベース名.表名 の形で書きます。'),
    ],
    fill: [f(['___ shop;', 'SELECT * FROM orders;'], ['USE', 'OPEN', 'SELECT', 'LOGIN'], 'USE で、これから使うデータベースを選びます。')],
  },

  'persistent-connection': {
    choice: [
      c('持続的接続とは?', ['DB接続を切らずに、使い回す設定', 'DBを永久保存する設定', 'DBを暗号化する設定', 'DBを複製する設定'], '接続のたびにかかる時間を、節約できます。'),
      c('持続的接続の注意点は?', ['前の状態が残ったり、接続数が増えすぎたりすることがある', '必ず遅くなる', 'SQLが使えなくなる', 'データが消える'], '接続数の上限に達すると、つなげなくなることがあります。'),
    ],
    fill: [f(['$pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_PERSISTENT => ___]);  // 無効にする'], ['false', 'true', '0.5', 'null'], '持続的接続を使わないときは false にします。')],
  },

  'custom-datasource': {
    choice: [
      c('カスタムデータソースとは?', ['DB接続部分を、独自に拡張したもの', '独自のデータベースソフト', '画面の部品', 'CSVファイル'], '元の部品を継承して、処理を足します。'),
      c('SQLのログを取るために拡張する利点は?', ['アプリ側を変えずに、すべてのSQLを記録できる', 'SQLが速くなる', 'SQLが短くなる', 'DBが不要になる'], 'SQLが通る入口で記録するので、アプリを書きかえなくて済みます。'),
    ],
    fill: [f(['class MysqlLog ___ Mysql {', '    // SQLの実行を拡張する', '}'], ['extends', 'implements', 'use', 'new'], '元のクラスを引き継いで拡張するには extends を使います。')],
  },
}
