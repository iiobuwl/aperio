// 「ITの仕組み」(追加分)・「セキュリティ」・「ファイル処理・運用」・「データベース運用」の解説ページのデータです。
// キーは languages.ts の項目の id と同じ名前にします。

import type { Lesson } from '../types'
import { all, chain, out, table, vars } from './helpers'

const code = (label: string, lines: string[]) => ({ label, lines })

// ===================== ITの仕組み(追加) =====================
export const IT_EXTRA_LESSONS: Record<string, Lesson> = {
  multipart: {
    code: code('HTTPリクエストのイメージ', [
      'POST /upload HTTP/1.1',
      'Content-Type: multipart/form-data; boundary=----X',
      '------X',
      'Content-Disposition: form-data; name="title"',
      '申請書',
      '------X',
      'Content-Disposition: form-data; name="file"; filename="a.pdf"',
      '(PDFの中身)',
      '------X--',
    ]),
    steps: [
      { title: 'ふつうのフォームは、文字だけ', note: 'name=値&name=値 の形。ファイルの中身(バイナリ)は入れられない', code: 1, visuals: [chain(['title=申請書&memo=…', '文字だけ', 'ファイルは送れない'], [0, 1])] },
      { title: 'multipart: 境界線で区切る', note: '複数の「パート」を、boundary という目印で区切って1つにまとめる', code: 2, visuals: [chain(['パート1', 'boundary', 'パート2', 'boundary'])] },
      { title: 'パート1: 文字の項目', note: '項目の名前(name)と、その値が入る', code: 3, codeTo: 5, visuals: [table('パート1', ['name', '値'], [['title', '申請書']], { marks: { 0: 'hot' } })] },
      {
        title: 'パート2: ファイル',
        note: 'filename と、ファイルの中身そのものが入る。PHPでは $_FILES で受け取る',
        code: 6,
        codeTo: 9,
        visuals: [table('パート2', ['name', 'filename', '中身'], [['file', 'a.pdf', '(PDFのバイト列)']], { marks: { 0: 'hot' } })],
      },
    ],
  },

  'user-agent': {
    code: code('HTTPヘッダのイメージ', [
      'GET / HTTP/1.1',
      'User-Agent: Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko',
      '// Trident = IE(Internet Explorer)の描画エンジン名',
    ]),
    steps: [
      { title: 'ブラウザは名乗ってアクセスする', note: 'リクエストごとに、自分の種類を示す文字列を添える', code: 1, visuals: [chain(['ブラウザ', 'User-Agent を添えて', 'サーバー'])] },
      { title: 'UA文字列には、ヒントが並ぶ', note: 'OSや描画エンジンの名前が、決まりのない順番で入っている', code: 2, visuals: [chain(['Mozilla/5.0', 'Windows NT 10.0', 'Trident/7.0', 'rv:11.0'], [2])] },
      { title: 'Trident があれば IE', note: 'IE11 は「MSIE」ではなく「Trident」と名乗る', code: 3, visuals: [chain(['Trident/7.0', '=', 'IE の描画エンジン'])] },
      {
        title: 'UAは自己申告',
        note: '偽装もできるので、判定の決め手にし過ぎない',
        visuals: [table('UAに含まれる名前', ['含まれる語', '主な意味'], [['Trident', 'IE'], ['Chrome', 'Chrome系'], ['Safari', 'Safari / Chrome系'], ['Mobile', 'スマホ']])],
      },
    ],
  },

  'browser-detect': {
    code: code('PHP のイメージ', [
      "$ua = $_SERVER['HTTP_USER_AGENT'];",
      "if (strpos($ua, 'Trident') !== false) {",
      "    echo 'IE用の画面';",
      '} else {',
      "    echo '通常の画面';",
      '}',
    ]),
    steps: [
      { title: 'UAを取り出す', note: 'ブラウザが送ってきた名乗りが、$_SERVER に入っている', code: 1, visuals: [vars(['$ua', 'Mozilla/5.0 … Trident/7.0 …'])] },
      { title: '文字を探して、種類を判定', note: 'strpos は、文字が見つかった位置を返す(無ければ false)', code: 2, visuals: [chain(['$ua の中に', "'Trident' がある?", 'ある → IE'], [0, 1, 2])] },
      { title: 'IEなら、専用の処理へ', code: 3, visuals: [out('IE用の画面')] },
      { title: 'それ以外は、通常の処理', code: 4, codeTo: 6, visuals: [out('通常の画面')] },
      { title: '今は「機能検出」が基本', note: '種類ではなく「その機能が使えるか」を調べるほうが、壊れにくい', visuals: [chain(['ブラウザ判定', '種類で分ける'], [0]), chain(['機能検出', 'できるかで分ける'], [0])] },
    ],
  },

  'robots-txt': {
    code: code('robots.txt のイメージ', ['User-agent: *', 'Disallow: /admin/', 'Allow: /', 'Sitemap: https://example.com/sitemap.xml']),
    steps: [
      { title: 'サイトの入口に置く案内板', note: 'クローラー(巡回ロボット)は、まず /robots.txt を読む', visuals: [chain(['クローラー', '/robots.txt を読む', 'ルールに従って巡回'])] },
      { title: 'User-agent: 誰への指示か', note: '* は「すべてのクローラー」', code: 1, visuals: [chain(['User-agent', '*', 'すべてのロボット'], [1])] },
      { title: 'Disallow: 入らないでほしい場所', code: 2, visuals: [table('巡回ルール', ['パス', '結果'], [['/admin/', '巡回しない'], ['/products/', '巡回する']], { marks: { 0: 'gone', 1: 'hot' } })] },
      { title: 'Allow: 入ってよい場所', code: 3, visuals: [table('巡回ルール', ['パス', '結果'], [['/admin/', '巡回しない'], ['/products/', '巡回する']], { marks: { 0: 'dim', 1: 'hot' } })] },
      { title: 'Sitemap: ページの一覧の場所', note: '巡回してほしいページの一覧を、教えておける', code: 4, visuals: [chain(['robots.txt', 'sitemap.xml', 'ページの一覧'])] },
      { title: '⚠ 鍵ではなく、お願い', note: '守るかどうかはクローラー次第。見られたくない情報は、ログインなどで守る', visuals: [chain(['robots.txt', 'お願い(強制力なし)'], [1])] },
    ],
  },

  'tag-manager': {
    code: code('Google Tag Manager のイメージ', [
      '<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"></script>',
      '// 管理画面: タグ = アクセス解析を動かす',
      '// 管理画面: トリガー = 全ページの表示',
      '// 管理画面: 「公開」で、サイトに反映される',
    ]),
    steps: [
      { title: 'コードは、サイトに1つだけ貼る', note: '計測の追加や変更のたびに、HTMLを直さなくてよくなる', code: 1, visuals: [chain(['サイトのHTML', 'GTMのコード(1つ)', 'タグマネージャー'])] },
      { title: 'タグ: 動かしたい計測コード', note: 'アクセス解析や広告の計測などを、管理画面でまとめて登録する', code: 2, visuals: [table('登録したタグ', ['タグ', '役目'], [['アクセス解析', '訪問数を数える'], ['広告の計測', '成果を数える']], { hotCols: [0] })] },
      { title: 'トリガー: いつ動かすか', note: '全ページ・購入完了ページだけ、など条件を決める', code: 3, visuals: [table('タグとトリガー', ['タグ', 'トリガー'], [['アクセス解析', '全ページの表示'], ['広告の計測', '購入完了ページ']], { hotCols: [1] })] },
      { title: '公開すると、反映される', note: 'サイトのHTMLを直さずに、計測を変えられる', code: 4, visuals: [chain(['管理画面で編集', '公開', 'サイトで動く'], [1, 2])] },
      { title: '入れすぎると、重くなる', note: 'タグが増えるほど読み込みが遅くなる。必要なものだけにする', visuals: [chain(['タグ 5個', '速い'], [1]), chain(['タグ 50個', '遅くなる'], [1])] },
    ],
  },

  'cookie-lifetime': {
    code: code('PHP のイメージ', [
      '// 有効期限を 0 にする',
      "ini_set('session.cookie_lifetime', 0);",
      'session_start();',
      '// 有効期限を 30日にする',
      'session_set_cookie_params(60 * 60 * 24 * 30);',
    ]),
    steps: [
      { title: '期限 0 =「ブラウザを閉じるまで」', note: '期限のないCookieを「セッションCookie」と呼ぶ', code: 1, codeTo: 3, visuals: [chain(['ログイン', 'Cookie(期限なし)', 'ブラウザを閉じる', 'Cookieが消える'], [1, 2, 3])] },
      { title: '閉じると、ログインが切れる', note: '共用のパソコンでも安心。次に開いたときは、ログインし直し', visuals: [out('ログインしてください')] },
      { title: '期限をつけると、閉じても残る', note: '60 × 60 × 24 × 30 = 30日(秒で数える)', code: 4, codeTo: 5, visuals: [chain(['ログイン', 'Cookie(30日)', 'ブラウザを閉じる', 'Cookieは残る'], [1, 2, 3])] },
      {
        title: '設定のちがい',
        note: 'サーバー側のセッションの寿命(gc_maxlifetime)は、別の設定',
        visuals: [table('cookie_lifetime', ['値', 'ふるまい'], [['0', 'ブラウザを閉じるまで'], ['2592000', '30日間']])],
      },
    ],
  },

  'iso-2022-jp': {
    code: code('PHP でメールを送るイメージ', [
      "mb_language('Japanese');",
      "mb_internal_encoding('UTF-8');",
      "$subject = mb_encode_mimeheader('お知らせ', 'ISO-2022-JP');",
      "$body = mb_convert_encoding('こんにちは', 'ISO-2022-JP', 'UTF-8');",
      'mail($to, $subject, $body);',
    ]),
    steps: [
      { title: '日本語メールの昔からの文字コード', note: 'メールは昔、7ビットの文字しか通せなかった。そのため JISコード(ISO-2022-JP)が使われた', code: 1, codeTo: 2, visuals: [chain(['UTF-8(PHPの中)', '→', 'ISO-2022-JP', '→', 'メール'], [0, 2, 4])] },
      { title: '件名も、変換が必要', note: 'mb_encode_mimeheader が、ヘッダー用の形に包んでくれる', code: 3, visuals: [chain(['お知らせ', 'ISO-2022-JP に変換', '=?ISO-2022-JP?B?…?='], [0, 1, 2])] },
      { title: '本文を変換する', code: 4, visuals: [chain(['こんにちは(UTF-8)', 'mb_convert_encoding', 'JISコードの本文'], [0, 1, 2])] },
      { title: '送信', note: '変換せずに送ると、受け取る側で文字化けすることがある', code: 5, visuals: [out('(文字化けせずに届く)')] },
      {
        title: '今は UTF-8 が主流',
        note: '古いシステムのメールには、まだ ISO-2022-JP が残っている',
        visuals: [table('文字コード', ['名前', 'ひとこと'], [['UTF-8', '今の主流'], ['ISO-2022-JP', '日本語メールの昔からの形式']])],
      },
    ],
  },

  mime: {
    code: code('メールの中身のイメージ', [
      'MIME-Version: 1.0',
      'Content-Type: multipart/mixed; boundary="BOUNDARY"',
      '--BOUNDARY',
      'Content-Type: text/plain; charset=ISO-2022-JP',
      '(本文)',
      '--BOUNDARY',
      'Content-Type: application/pdf',
      'Content-Disposition: attachment; filename="a.pdf"',
      '(PDFの中身を Base64 に変えたもの)',
      '--BOUNDARY--',
    ]),
    steps: [
      { title: 'メールは、もともと文字だけ', note: 'MIME は、添付ファイルや複数のパートを入れるための取り決め', code: 1, codeTo: 2, visuals: [chain(['本文', '添付ファイル', 'MIME で1通にまとめる'], [2])] },
      { title: 'パート1: 本文', note: 'Content-Type で、中身の種類と文字コードを伝える', code: 3, codeTo: 5, visuals: [table('メールのパート', ['パート', '種類'], [['1', 'text/plain(本文)'], ['2', 'application/pdf(添付)']], { marks: { 0: 'hot', 1: 'dim' } })] },
      {
        title: 'パート2: 添付ファイル',
        note: 'ファイルは文字ではないので、Base64 という方法で文字に変えて入れる',
        code: 6,
        codeTo: 9,
        visuals: [table('メールのパート', ['パート', '種類'], [['1', 'text/plain(本文)'], ['2', 'application/pdf(添付)']], { marks: { 0: 'dim', 1: 'hot' } })],
      },
      { title: '終わりの印', note: '最後の境界線は、末尾に -- がつく', code: 10, visuals: [chain(['--BOUNDARY', 'パート', '--BOUNDARY', 'パート', '--BOUNDARY--'], [4])] },
    ],
  },
}

// ===================== セキュリティ =====================
const PERMS_COLS = ['誰が', '何に', 'できること']
const PERMS = [
  ['管理者', '注文', '見る・変更・削除'],
  ['営業', '注文', '見る・変更'],
  ['閲覧者', '注文', '見る'],
]

export const SECURITY_LESSONS: Record<string, Lesson> = {
  acl: {
    code: code('ACL のイメージ(表)', [
      '// 誰が・何に・何ができるかを、表で管理する',
      '管理者  | 注文 | 見る・変更・削除',
      '営業    | 注文 | 見る・変更',
      '閲覧者  | 注文 | 見る',
      '// CakePHP の DbAcl: この表はデータベースに保存される',
      "$ok = $this->Acl->check('営業', 'orders', 'update');",
    ]),
    steps: [
      { title: '権限を「表」で管理する', note: 'ACL = Access Control List(アクセス制御リスト)', code: 1, visuals: [table('権限の表', PERMS_COLS, PERMS)] },
      { title: '誰が・何に・何ができるか', code: 2, codeTo: 4, visuals: [table('権限の表', PERMS_COLS, PERMS, { marks: { 0: 'hot', 1: 'hot', 2: 'hot' }, hotCols: [2] })] },
      { title: '表はデータベースに入れる', note: 'CakePHP の DbAcl では、この表を DB で持つ。画面から権限を変えられる', code: 5, visuals: [chain(['権限の表', 'データベース(DbAcl)'], [1])] },
      { title: 'check で、許されているか調べる', note: '営業は注文を「変更」できる → true', code: 6, visuals: [table('権限の表', PERMS_COLS, PERMS, { marks: { 0: 'dim', 1: 'hot', 2: 'dim' } }), out('true')] },
      { title: '許されていなければ false', note: "$this->Acl->check('閲覧者', 'orders', 'update') は false", visuals: [table('権限の表', PERMS_COLS, PERMS, { marks: { 0: 'dim', 1: 'dim', 2: 'gone' } }), out('false')] },
    ],
  },

  'md5-sha1': {
    code: code('PHP のイメージ', [
      "echo md5('password');",
      "echo sha1('password');",
      '// どちらも古い方式。パスワード保存には使わない',
      "echo password_hash('password', PASSWORD_DEFAULT);",
    ]),
    steps: [
      { title: 'ハッシュ: 元に戻せない「指紋」', note: '同じ入力からは、いつも同じ指紋(32文字)ができる', code: 1, visuals: [chain(['password', 'md5', '5f4dcc3b5aa765d6…'], [1, 2]), out('5f4dcc3b5aa765d61d8327deb882cf99')] },
      { title: 'SHA-1 は 40文字', code: 2, visuals: [out('5f4dcc3b5aa765d61d8327deb882cf99', '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8')] },
      {
        title: '古い方式は、破られやすい',
        note: '計算が速すぎて、総当たりで元の文字を当てられてしまう',
        code: 3,
        visuals: [table('方式の安全性', ['方式', 'パスワード保存'], [['MD5', '×'], ['SHA-1', '×'], ['password_hash', '○']], { marks: { 0: 'gone', 1: 'gone', 2: 'hot' } })],
      },
      { title: 'パスワードは password_hash で', note: '毎回ちがう「塩」を混ぜ、わざと遅くして、総当たりに強くしてある', code: 4, visuals: [out('$2y$10$k3j…(毎回ちがう文字)')] },
    ],
  },

  'random-string': {
    code: code('PHP のイメージ', [
      "$chars = 'abcdefghjkmnpqrstuvwxyz23456789';  // l, o, 0, 1 を外す",
      '$len = strlen($chars);',
      "$pass = '';",
      'for ($i = 0; $i < 8; $i++) {',
      '    $pass .= $chars[random_int(0, $len - 1)];',
      '}',
    ]),
    steps: [
      { title: '使う文字を決める', note: 'l(エル)と 1、o と 0 は見間違えやすい。入力ミスの原因なので外す', code: 1, visuals: [table('外す文字', ['見間違い', '理由'], [['l と 1 と I', '形が似ている'], ['o と 0', '形が似ている']])] },
      { title: '文字数を数える', code: 2, codeTo: 3, visuals: [vars(['$len', '31'], ['$pass', '(空)'])] },
      { title: '8回くり返して、1文字ずつ選ぶ', note: 'random_int で 0〜30 のどれかを選び、その位置の文字を足していく', code: 4, codeTo: 6, visuals: [vars(['$pass', 'k7mqz3xa']), chain(['乱数 11', '→', "$chars[11]", '→', 'q'], [0, 2, 4])] },
      { title: 'rand() ではなく random_int()', note: 'rand() は先の数を予測されることがある。パスワードには安全な random_int を使う', visuals: [table('乱数の関数', ['関数', 'パスワードに'], [['rand()', '×'], ['mt_rand()', '×'], ['random_int()', '○']], { marks: { 0: 'gone', 1: 'gone', 2: 'hot' } })] },
    ],
  },

  'unique-id': {
    code: code('PHP のイメージ', [
      'echo uniqid();',
      'echo bin2hex(random_bytes(16));',
      '// UUID の形: 8-4-4-4-12 文字',
      'echo "550e8400-e29b-41d4-a716-446655440000";',
    ]),
    steps: [
      { title: 'uniqid: 時刻をもとにしたID', note: '重複しにくいが、時刻から予測されやすい', code: 1, visuals: [out('65a1b2c3d4e5f')] },
      { title: 'random_bytes: 安全なランダム値', note: '16バイトを 16進数の文字にして、32文字のIDにする', code: 2, visuals: [chain(['random_bytes(16)', 'bin2hex', '32文字の文字列'], [0, 1, 2]), out('3f9a1c07b2d84e56a0c1e7d9f2b43a68')] },
      { title: 'UUID: 世界中でほぼ重複しない形式', note: '8-4-4-4-12 の形。複数のシステムが別々に作っても、ぶつからない', code: 3, codeTo: 4, visuals: [chain(['550e8400', 'e29b', '41d4', 'a716', '446655440000'])] },
      { title: '使い分け', note: 'パスワードリセットなどのトークンには、uniqid ではなく random_bytes を使う', visuals: [table('IDの作り方', ['方法', '向いている使い方'], [['uniqid', '重複しにくい名前(ファイル名など)'], ['random_bytes', 'トークン・秘密の値'], ['UUID', 'システムをまたぐ識別子']])] },
    ],
  },
}

// ===================== ファイル処理・運用 =====================
const files = (...names: string[]) => table('フォルダの中身', ['名前'], names.map((n) => [n]))

export const OPS_LESSONS: Record<string, Lesson> = {
  'debug-output': {
    code: code('PHP のイメージ', [
      "$user = ['name' => 'ナオ', 'age' => 25];",
      'print_r($user);',
      'var_dump($user);',
      'debug($user);  // CakePHP の便利関数',
    ]),
    steps: [
      { title: '変数の中身を、見て調べる', note: 'うまく動かないとき、まず「中に何が入っているか」を確かめる', code: 1, visuals: [table('$user', ['キー', '値'], [['name', 'ナオ'], ['age', 25]])] },
      { title: 'print_r: 見やすく表示', code: 2, visuals: [out('Array', '(', '    [name] => ナオ', '    [age] => 25', ')')] },
      { title: 'var_dump: 型や長さまで表示', note: 'string(6) は6バイトの文字。0や空文字の見分けにも役立つ', code: 3, visuals: [out('array(2) {', '  ["name"]=> string(6) "ナオ"', '  ["age"]=> int(25)', '}')] },
      { title: 'CakePHP では debug()', note: '見やすく整形して、どのファイルの何行目かも出してくれる', code: 4, visuals: [out('(app/Controller/UsersController.php, line 20)', 'Array ( [name] => ナオ … )')] },
      { title: '⚠ 本番の画面には残さない', note: '内部の情報が利用者に見えてしまう。調べ終わったら消す', visuals: [chain(['開発中', 'debug() を使う'], [1]), chain(['本番', '消しておく'], [1])] },
    ],
  },

  'error-log': {
    code: code('PHP / php.ini のイメージ', [
      "error_log('注文の保存に失敗しました');",
      'log_errors = On',
      'error_log = /var/log/php_errors.log',
      'display_errors = Off',
    ]),
    steps: [
      { title: 'エラーを、ファイルに記録する', note: '画面ではなく、ログファイルに書いておけば、あとから調べられる', code: 1, visuals: [out('[07-Nov-2026 10:00:01] 注文の保存に失敗しました')] },
      { title: 'どこに書くかを設定する', code: 2, codeTo: 3, visuals: [table('php.ini の設定', ['設定', '意味'], [['log_errors = On', '記録する'], ['error_log = …', '記録先のファイル']], { marks: { 0: 'hot', 1: 'hot' } })] },
      { title: '本番では、画面にエラーを出さない', note: 'エラーの内容は、攻撃のヒントになる。利用者には見せない', code: 4, visuals: [table('環境ごとの設定', ['環境', 'display_errors'], [['開発', 'On'], ['本番', 'Off']], { marks: { 0: 'dim', 1: 'hot' } })] },
      { title: 'ログを見て、原因を探す', note: 'tail -f で、ログが増えるのをリアルタイムで見られる', visuals: [out('$ tail -f /var/log/php_errors.log', '… Undefined variable $id in order.php on line 12')] },
    ],
  },

  filesystem: {
    code: code('PHP のイメージ', [
      "file_put_contents('memo.txt', 'こんにちは');",
      "echo file_get_contents('memo.txt');",
      "mkdir('backup');",
      "chmod('memo.txt', 0644);",
      "print_r(scandir('.'));",
      "unlink('memo.txt');",
    ]),
    steps: [
      { title: 'ファイルに書く', note: 'なければ作られ、あれば上書きされる', code: 1, visuals: [files('memo.txt')] },
      { title: 'ファイルを読む', code: 2, visuals: [files('memo.txt'), out('こんにちは')] },
      { title: 'mkdir: フォルダを作る', code: 3, visuals: [table('フォルダの中身', ['名前'], [['memo.txt'], ['backup/']], { marks: { 1: 'new' } })] },
      {
        title: 'chmod: 権限を変える',
        note: '0644 = 持ち主は読み書き、ほかの人は読むだけ',
        code: 4,
        visuals: [table('0644 の意味', ['対象', '権限'], [['持ち主', '読む・書く'], ['グループ', '読む'], ['ほかの人', '読む']])],
      },
      { title: 'scandir / glob: 一覧を取る', note: 'glob("*.txt") なら、txt だけを探せる', code: 5, visuals: [out('Array ( [0] => . [1] => .. [2] => backup [3] => memo.txt )')] },
      { title: 'unlink: 削除', note: '消したファイルは、ごみ箱に入らず、元に戻せない', code: 6, visuals: [table('フォルダの中身', ['名前'], [['memo.txt'], ['backup/']], { marks: { 0: 'gone' } })] },
    ],
  },

  serialize: {
    code: code('PHP のイメージ', [
      "$data = ['name' => 'ナオ', 'age' => 25];",
      '$text = serialize($data);',
      '// a:2:{s:4:"name";s:6:"ナオ";s:3:"age";i:25;}',
      "file_put_contents('data.txt', $text);",
      "$back = unserialize(file_get_contents('data.txt'));",
    ]),
    steps: [
      { title: '配列やオブジェクトを、保存したい', note: 'そのままでは、ファイルやDBの「文字の列」に入れられない', code: 1, visuals: [table('$data', ['キー', '値'], [['name', 'ナオ'], ['age', 25]])] },
      { title: 'serialize: 文字列にする', note: '型や長さの情報も、いっしょに文字にして残る', code: 2, codeTo: 3, visuals: [chain(['配列', 'serialize', '文字列'], [1, 2]), out('a:2:{s:4:"name";s:6:"ナオ";s:3:"age";i:25;}')] },
      { title: '文字列だから、保存できる', code: 4, visuals: [chain(['$text', 'data.txt'], [1])] },
      { title: 'unserialize: 元に戻す', code: 5, visuals: [table('$back', ['キー', '値'], [['name', 'ナオ'], ['age', 25]], { marks: { 0: 'hot', 1: 'hot' } })] },
      { title: '⚠ 信頼できないデータには使わない', note: '不正な文字列から、思わぬオブジェクトを作られて悪用される恐れがある。人から届くデータは JSON を使う', visuals: [chain(['自分で作ったデータ', 'unserialize OK'], [1]), chain(['外から届いたデータ', 'JSON を使う'], [1])] },
    ],
  },

  'php-stream': {
    code: code('PHP のイメージ', [
      "$out = fopen('php://output', 'w');",
      "fputcsv($out, ['id', 'name']);",
      "fputcsv($out, [1, 'ナオ']);",
      'fclose($out);',
      "$tmp = fopen('php://temp', 'r+');",
    ]),
    steps: [
      { title: 'ストリーム: 出力先をファイルのように扱う', note: 'php://output は「画面(ブラウザ)への出力」。ファイルと同じ書き方で書き込める', code: 1, visuals: [chain(['fopen', 'php://output', 'ブラウザへ直接'], [1, 2])] },
      { title: 'CSVを1行ずつ書く', note: 'fputcsv が、カンマ区切りやクォートを正しく整えてくれる', code: 2, codeTo: 3, visuals: [out('id,name', '1,ナオ')] },
      { title: '閉じる', code: 4, visuals: [chain(['書き込み', 'fclose', '終わり'], [1])] },
      { title: 'php://temp: メモリ上の一時ファイル', note: '本物のファイルを作らずに、ファイルのように使える。大きくなると自動で一時ファイルへ', code: 5, visuals: [chain(['php://temp', 'メモリ上', '終わると消える'], [0, 1])] },
      { title: 'ダウンロードにするには', note: 'header で「CSVファイルです」と先に伝えてから出力する', visuals: [out('Content-Type: text/csv', 'Content-Disposition: attachment; filename="orders.csv"')] },
    ],
  },
}

// ===================== データベース運用 =====================
export const DBOPS_LESSONS: Record<string, Lesson> = {
  mysqldump: {
    code: code('ターミナルのイメージ', ['$ mysqldump -u user -p shop > backup.sql', '$ mysql -u user -p shop < backup.sql']),
    steps: [
      { title: 'DBの中身を、SQLファイルに書き出す', note: 'mysqldump は、表の作り方とデータを「SQLの文」にして書き出す', code: 1, visuals: [chain(['データベース shop', 'mysqldump', 'backup.sql'], [0, 1, 2])] },
      { title: 'backup.sql の中身', note: '普通のテキストなので、中を読むこともできる', visuals: [out('CREATE TABLE `products` (…);', 'INSERT INTO `products` VALUES (1,…);')] },
      { title: '復元: SQLファイルを流し込む', note: '< は、ファイルの中身を mysql に読み込ませる記号', code: 2, visuals: [chain(['backup.sql', 'mysql', '新しい shop'], [0, 1, 2])] },
      { title: '定期的に、別の場所へ', note: '同じサーバーの中だけに置くと、サーバーごと壊れたときに失われる', visuals: [chain(['毎日 mysqldump', 'backup.sql', '別の場所へコピー'])] },
    ],
  },

  'single-transaction': {
    code: code('ターミナルのイメージ', [
      '# 普通のバックアップ: 表をロックして書き出す',
      '$ mysqldump -u user -p shop > backup.sql',
      '# --single-transaction: ロックせず、ある時点の状態を書き出す',
      '$ mysqldump --single-transaction -u user -p shop > backup.sql',
    ]),
    steps: [
      { title: 'バックアップ中にも、書き込みはある', note: '途中で変更されると、表どうしの内容がずれたバックアップになってしまう', visuals: [chain(['注文の表を書き出し', '← この間に注文が増える →', '在庫の表を書き出し'], [1])] },
      { title: 'ロックすると、サービスが止まる', note: '表をロックしている間は、書き込めない。大きなDBだと長時間になる', code: 1, codeTo: 2, visuals: [chain(['バックアップ(ロック中)', '書き込みが待たされる'], [1])] },
      { title: '--single-transaction: ある時点の写真', note: 'トランザクションを1つ開いて、開始時点の状態を保ったまま書き出す。書き込みは止まらない', code: 3, codeTo: 4, visuals: [chain(['開始時点の状態', '書き出し中も、書き込みOK', '矛盾のないバックアップ'], [0, 1, 2])] },
      { title: 'InnoDB のときに有効', note: 'InnoDB はトランザクションに対応している。MyISAM では、この効果は得られない', visuals: [table('エンジン', ['エンジン', 'single-transaction'], [['InnoDB', '○ 矛盾なし'], ['MyISAM', '× 効果なし']], { marks: { 0: 'hot', 1: 'dim' } })] },
    ],
  },

  gzip: {
    code: code('ターミナルのイメージ', [
      '$ mysqldump -u user -p shop | gzip > backup.sql.gz',
      '$ gunzip backup.sql.gz',
      '$ zcat backup.sql.gz | mysql -u user -p shop',
    ]),
    steps: [
      { title: 'パイプ「|」で、つなぐ', note: '前のコマンドの出力を、次のコマンドへ渡す。大きなファイルを作らずに圧縮できる', code: 1, visuals: [chain(['mysqldump', '|', 'gzip', '>', 'backup.sql.gz'])] },
      { title: 'ファイルが小さくなる', note: 'SQLは同じ言葉のくり返しが多いので、よく縮む', visuals: [table('ファイルの大きさ', ['ファイル', 'サイズ'], [['backup.sql', '500MB'], ['backup.sql.gz', '60MB']], { marks: { 0: 'dim', 1: 'hot' } })] },
      { title: 'gunzip: 展開する', code: 2, visuals: [chain(['backup.sql.gz', 'gunzip', 'backup.sql'], [0, 1, 2])] },
      { title: 'zcat: 展開しながら流し込む', note: '展開したファイルを作らずに、そのまま復元できる', code: 3, visuals: [chain(['backup.sql.gz', 'zcat', '|', 'mysql'], [0, 1, 3])] },
    ],
  },

  'sql-log': {
    code: code('SQLログのイメージ', [
      '1  SELECT * FROM orders WHERE id = 42       (3ms)',
      '2  UPDATE orders SET qty = 2 WHERE id = 42  (5ms)',
      '3  SELECT * FROM users WHERE id = 7         (120ms)',
    ]),
    steps: [
      { title: '実行したSQLが、順番に記録される', code: 1, visuals: [table('SQLログ', ['#', 'SQL', '時間'], [[1, 'SELECT … orders', '3ms']], { marks: { 0: 'hot' } })] },
      { title: '更新のSQLも残る', code: 2, visuals: [table('SQLログ', ['#', 'SQL', '時間'], [[1, 'SELECT … orders', '3ms'], [2, 'UPDATE … orders', '5ms']], { marks: { 1: 'hot' } })] },
      { title: '遅いSQLが見つかる', note: '120ms だけ飛び抜けて遅い。インデックスや書き方を見直すヒントになる', code: 3, visuals: [table('SQLログ', ['#', 'SQL', '時間'], [[1, 'SELECT … orders', '3ms'], [2, 'UPDATE … orders', '5ms'], [3, 'SELECT … users', '120ms']], { marks: { 0: 'dim', 1: 'dim', 2: 'hot' }, hotCols: [2] })] },
      { title: '同じSQLの連発も分かる', note: '同じ形のSQLが何十回も並んでいたら、まとめて取れないか考える', visuals: [table('SQLログ', ['#', 'SQL'], [[1, 'SELECT … users WHERE id = 1'], [2, 'SELECT … users WHERE id = 2'], [3, 'SELECT … users WHERE id = 3']], { marks: all(3, 'g2') })] },
      { title: '⚠ ログには個人情報が残る', note: '値の中に、名前やメールが入ることがある。保管場所と見られる人に注意する', visuals: [chain(['SQLログ', '個人情報を含む', '取り扱いに注意'], [1, 2])] },
    ],
  },

  'multi-db-schema': {
    code: code('SQL のイメージ', ['CREATE DATABASE shop;', 'CREATE DATABASE blog;', 'USE shop;', 'SELECT * FROM shop.orders;', 'SELECT * FROM blog.posts;']),
    steps: [
      { title: '1台のサーバーに、複数のDB', note: 'システムごとに、データベース(スキーマ)を分けて入れられる', code: 1, codeTo: 2, visuals: [chain(['DBサーバー(1台)', 'shop', 'blog'], [1, 2])] },
      { title: 'USE: 今から使うDBを決める', note: '以降の SELECT では、shop の表が対象になる', code: 3, visuals: [table('今のDB: shop', ['表'], [['orders'], ['users']], { marks: { 0: 'hot', 1: 'hot' } })] },
      { title: 'DB名.表名 で、別のDBも指定できる', note: 'USE で切りかえなくても、ほかのDBの表を読める', code: 4, codeTo: 5, visuals: [chain(['shop.orders', 'blog.posts'], [0, 1])] },
      { title: '分ける理由', note: 'データの置き場・バックアップ・見られる人(権限)を、システムごとに分けられる', visuals: [table('DBを分ける理由', ['理由', '例'], [['権限', 'blog の担当者は shop を見られない'], ['バックアップ', 'DBごとに別の時間に取れる']])] },
    ],
  },

  'persistent-connection': {
    code: code('PHP のイメージ', [
      '// 通常: リクエストのたびに接続して、終わったら切る',
      '$pdo = new PDO($dsn, $user, $pass);',
      '// 持続的接続: 切らずに使い回す',
      '$pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_PERSISTENT => true]);',
    ]),
    steps: [
      { title: '通常は、毎回つなぎ直す', note: '接続には、少し時間がかかる', code: 1, codeTo: 2, visuals: [chain(['リクエスト1', '接続→切断'], [1]), chain(['リクエスト2', '接続→切断'], [1])] },
      { title: '持続的接続: つなぎっぱなしで使い回す', note: '接続の時間を節約できる', code: 3, codeTo: 4, visuals: [chain(['リクエスト1', '接続'], [1]), chain(['リクエスト2', '同じ接続を使う'], [1])] },
      {
        title: '落とし穴',
        note: '前の処理の状態が残ったり、接続が溜まって、DBの接続数の上限に達したりする',
        visuals: [table('持続的接続の注意', ['問題', '内容'], [['状態が残る', 'トランザクションや設定が残ることがある'], ['接続が溜まる', '上限に達すると、つなげなくなる']])],
      },
      { title: 'このシステムでは、無効', note: '安全側に倒して、毎回つなぐ設定にしている(false)', visuals: [vars(['PDO::ATTR_PERSISTENT', 'false'])] },
    ],
  },

  'custom-datasource': {
    code: code('CakePHP のイメージ', [
      'class MysqlLog extends Mysql {',
      '    public function execute($sql, $options = array(), $params = array()) {',
      '        error_log($sql);  // 実行するSQLを記録',
      '        return parent::execute($sql, $options, $params);',
      '    }',
      '}',
    ]),
    steps: [
      { title: '既存のDB接続部分を、継承して拡張', note: '元の部品(Mysql)をもとに、自分用の部品(MysqlLog)を作る', code: 1, visuals: [chain(['Mysql(元の部品)', 'extends', 'MysqlLog(拡張版)'], [2])] },
      { title: 'SQLを実行する直前に、記録を足す', code: 2, codeTo: 3, visuals: [chain(['SQLが来る', 'error_log で記録', '次へ進む'], [1])] },
      { title: 'parent:: で、本来の処理を呼ぶ', note: '記録するだけで、SQLの実行そのものは元の部品に任せる', code: 4, codeTo: 6, visuals: [chain(['MysqlLog', 'parent::execute', 'Mysql が実行'], [1, 2])] },
      { title: 'アプリ側は、何も変えない', note: '接続の設定でこの部品を指定すれば、すべてのSQLが記録される', visuals: [chain(['アプリ', 'MysqlLog', 'データベース'], [1])] },
    ],
  },
}
