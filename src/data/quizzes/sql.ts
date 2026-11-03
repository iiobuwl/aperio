// SQL のテストの問題です。キーは languages.ts の項目の id と同じ名前にします。
// 選択肢は「正解を先頭」に書く(画面に出すときにシャッフルされる)。

import type { Quiz } from '../types'
import { c, f } from './helpers'

export const SQL_QUIZZES: Record<string, Quiz> = {
  // ===================== 必須 =====================
  select: {
    choice: [
      c('products 表から name 列だけを取り出すSQLは?', ['SELECT name FROM products;', 'GET name FROM products;', 'SELECT FROM products name;', 'FIND name IN products;'], 'SELECT 列 FROM 表 の順に書きます。'),
      c('すべての列を取り出すときに書く記号は?', ['*', '%', '#', '&'], 'SELECT * FROM products; のように書きます。'),
    ],
    fill: [f(['___ name, price', 'FROM products;'], ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], 'データを取り出す命令は SELECT です。')],
  },

  where: {
    choice: [
      c('price が 400 以上の行だけに絞るのは?', ['WHERE price >= 400', 'IF price >= 400', 'FILTER price >= 400', 'ORDER price >= 400'], '行を絞る条件は WHERE に書きます。'),
      c('「AかつB」の両方を満たす条件を表すのは?', ['A AND B', 'A OR B', 'A + B', 'A, B'], 'OR は「AかBのどちらか」です。'),
    ],
    fill: [f(['SELECT * FROM products', '___ price >= 400;'], ['WHERE', 'FROM', 'SET', 'LIMIT'], '条件で行を絞るのは WHERE です。')],
  },

  'order-by': {
    choice: [
      c('price を大きい順に並べるのは?', ['ORDER BY price DESC', 'ORDER BY price ASC', 'SORT price DESC', 'GROUP BY price DESC'], 'DESC は大きい順(降順)です。'),
      c('ORDER BY で向きを省略したとき、並び順は?', ['ASC(小さい順)', 'DESC(大きい順)', 'ランダム', '登録した順'], '省略すると ASC(昇順)になります。'),
    ],
    fill: [f(['SELECT * FROM products', 'ORDER BY price ___;  -- 大きい順'], ['DESC', 'ASC', 'MAX', 'BIG'], '大きい順は DESC、小さい順は ASC です。')],
  },

  insert: {
    choice: [
      c('表に新しい行を追加する命令は?', ['INSERT', 'UPDATE', 'SELECT', 'CREATE'], 'INSERT INTO 表 (列…) VALUES (値…) の形で書きます。'),
      c('INSERT で、入れる値を並べるキーワードは?', ['VALUES', 'ITEMS', 'DATA', 'ADD'], '列の順番どおりに、VALUES のあとへ値を書きます。'),
    ],
    fill: [f(['INSERT INTO products (name, price)', "___ ('クッキー', 300);"], ['VALUES', 'WHERE', 'FROM', 'ORDER BY'], '値の一覧は VALUES のあとに書きます。')],
  },

  update: {
    choice: [
      c('行の値を書きかえる命令は?', ['UPDATE', 'INSERT', 'CHANGE', 'MODIFY'], 'UPDATE 表 SET 列 = 値 WHERE 条件 の形です。'),
      c('UPDATE で WHERE を書き忘れると?', ['全部の行が書きかわる', '何も起きない', 'エラーで必ず止まる', '最初の1行だけ変わる'], '絞り込む条件がないので、すべての行が対象になります。'),
    ],
    fill: [f(['UPDATE products', '___ price = 500', "WHERE name = 'コーヒー';"], ['SET', 'VALUES', 'TO', 'CHANGE'], '書きかえる中身は SET で指定します。')],
  },

  delete: {
    choice: [
      c('id が 4 の行を消すSQLは?', ['DELETE FROM products WHERE id = 4;', 'DELETE products id = 4;', 'REMOVE FROM products WHERE id = 4;', 'DROP products WHERE id = 4;'], 'DELETE FROM 表 WHERE 条件 の形です。'),
      c('DELETE FROM products; (WHEREなし)を実行すると?', ['全部の行が消える', '何も消えない', '最初の1行だけ消える', '表そのものも消える'], '条件がないので全行が対象です(表の入れ物は残ります)。'),
    ],
    fill: [f(['___ FROM products', 'WHERE id = 4;'], ['DELETE', 'DROP', 'REMOVE', 'CLEAR'], '行を消す命令は DELETE です。')],
  },

  // ===================== 基礎 =====================
  limit: {
    choice: [
      c('先頭から3件だけ取り出すのは?', ['LIMIT 3', 'TOP 3', 'FIRST 3', 'ONLY 3'], 'MySQL などでは LIMIT を使います(TOP は別のDBの書き方)。'),
      c('LIMIT 2 OFFSET 4 の意味は?', ['5行目から2件取る', '4件目から2件取る', '先頭の4件を取る', '2件目から4件取る'], 'OFFSET 4 は最初の4行を飛ばすので、5行目から数えます。'),
    ],
    fill: [f(['SELECT * FROM products', 'ORDER BY id', 'LIMIT 2 ___ 2;  -- 先頭2行を飛ばす'], ['OFFSET', 'SKIP', 'START', 'AFTER'], '読み飛ばす行数は OFFSET で指定します。')],
  },

  aggregate: {
    choice: [
      c('行の個数を数える関数は?', ['COUNT', 'SUM', 'AVG', 'MAX'], 'COUNT(*) で行数を数えます。'),
      c('price の平均を出す関数は?', ['AVG(price)', 'MEAN(price)', 'AVERAGE(price)', 'SUM(price)'], 'AVG は average(平均)の略です。'),
    ],
    fill: [f(['SELECT ___(price)', 'FROM products;  -- 価格の合計'], ['SUM', 'COUNT', 'AVG', 'MIN'], '合計を出す関数は SUM です。')],
  },

  'group-by': {
    choice: [
      c('category ごとに件数を数えたいときに必要なのは?', ['GROUP BY category', 'ORDER BY category', 'WHERE category', 'LIMIT category'], '同じ値の行をグループにまとめてから集計します。'),
      c('GROUP BY のあと、結果はどうなる?', ['1グループが1行になる', '全行がそのまま残る', '列が増える', '表が消える'], 'グループごとに1行へまとまります。'),
    ],
    fill: [f(['SELECT category, COUNT(*)', 'FROM products', '___ category;'], ['GROUP BY', 'ORDER BY', 'WHERE', 'HAVING'], 'まとめる基準の列を GROUP BY に書きます。')],
  },

  join: {
    choice: [
      c('INNER JOIN の結果に残るのは?', ['両方の表で対応する行がある組だけ', '左の表の全部の行', '右の表の全部の行', '全部の組み合わせ'], '相手のいない行は消えます。'),
      c('JOIN で、2つの表をつなぐ条件を書くキーワードは?', ['ON', 'BY', 'WITH', 'AT'], 'ON orders.user_id = users.id のように書きます。'),
    ],
    fill: [f(['SELECT orders.id, users.name', 'FROM orders', 'INNER JOIN users ___ orders.user_id = users.id;'], ['ON', 'BY', 'AS', 'IN'], 'つなぐ条件は ON のあとに書きます。')],
  },

  'left-join': {
    choice: [
      c('LEFT JOIN で、右の表に相手がいない行は?', ['残り、右側の列は NULL になる', '消える', 'エラーになる', '0 になる'], '左の表の行は、すべて残ります。'),
      c('「注文のない利用者」も含めて一覧にしたいとき使うのは?', ['users LEFT JOIN orders', 'users INNER JOIN orders', 'orders INNER JOIN users', 'users GROUP BY orders'], '全部残したい表を左(FROM 側)に置いて、LEFT JOIN します。'),
    ],
    fill: [f(['SELECT users.name, orders.id', 'FROM users', '___ JOIN orders ON orders.user_id = users.id;'], ['LEFT', 'INNER', 'ONLY', 'SAME'], '左の表を全部残すのは LEFT JOIN です。')],
  },

  keys: {
    choice: [
      c('主キーの条件は?', ['重複せず、NULL でもない', '同じ値が何度も入る', '必ず文字列', '必ず外部キーと同じ'], '行を1つに特定できる「背番号」です。'),
      c('外部キーの役割は?', ['別の表の行を指す(実在する値しか入れられない)', '行を暗号化する', '表の名前を変える', '表を小さくする'], '表どうしのつながりを守ります。'),
    ],
    fill: [f(['CREATE TABLE users (', '  id INT ___,', '  name VARCHAR(50)', ');'], ['PRIMARY KEY', 'FOREIGN KEY', 'NOT KEY', 'UNIQUE ONLY'], '行を見分ける印は PRIMARY KEY(主キー)です。')],
  },

  // ===================== 中級 =====================
  having: {
    choice: [
      c('グループにまとめた「あと」で絞り込むのは?', ['HAVING', 'WHERE', 'LIMIT', 'ON'], 'まとめた結果(COUNT など)への条件は HAVING に書きます。'),
      c('WHERE と HAVING のちがいは?', ['WHERE はまとめる前の行、HAVING はまとめた後のグループに使う', 'どちらも同じ', 'WHERE は列、HAVING は表に使う', 'HAVING は削除用'], '集計の前に絞るか、あとに絞るかのちがいです。'),
    ],
    fill: [f(['SELECT category, COUNT(*) AS n', 'FROM products', 'GROUP BY category', '___ COUNT(*) >= 2;'], ['HAVING', 'WHERE', 'ORDER BY', 'LIMIT'], '集計した値への条件は HAVING です。')],
  },

  subquery: {
    choice: [
      c('サブクエリとは?', ['SQLの中に入れた、別のSQL', '小さな表の名前', '古い形式のSQL', 'エラー時のSQL'], 'カッコで囲んで、条件や値として使います。'),
      c('WHERE price > (SELECT AVG(price) FROM products) で、先に実行されるのは?', ['カッコの中', 'カッコの外', 'どちらも同時', '実行されない'], '内側のSQLの結果を、外側が使います。'),
    ],
    fill: [f(['SELECT name FROM products', 'WHERE price > (', '  SELECT ___(price) FROM products', ');  -- 平均より高い'], ['AVG', 'SUM', 'COUNT', 'MAX'], '平均を求めるのは AVG です。')],
  },

  null: {
    choice: [
      c('email が NULL の行を探す書き方は?', ['WHERE email IS NULL', 'WHERE email = NULL', 'WHERE email == NULL', 'WHERE email IS EMPTY'], 'NULL との比較は = ではなく IS を使います。'),
      c('NULL とは?', ['値がない(不明)ことを表す', '数字の 0', '空の文字', 'FALSE'], '0 や空の文字とは別ものです。'),
    ],
    fill: [f(['SELECT * FROM users', 'WHERE email ___ NULL;'], ['IS', '=', '==', 'LIKE'], 'NULL かどうかは IS NULL で調べます。')],
  },

  index: {
    choice: [
      c('インデックスの主な目的は?', ['検索を速くする', 'データを暗号化する', '表を小さくする', '書き込みを速くする'], '本の索引のように、探したい行へ直接たどり着けます。'),
      c('インデックスを増やしすぎると?', ['書き込みが遅くなることがある', '検索が必ず遅くなる', 'データが消える', '表が読めなくなる'], '行を書くたびに、索引も更新する必要があるためです。'),
    ],
    fill: [f(['___ INDEX idx_price ON products (price);'], ['CREATE', 'INSERT', 'SELECT', 'DELETE'], 'インデックスは CREATE INDEX で作ります。')],
  },

  transaction: {
    choice: [
      c('トランザクションの働きは?', ['複数の処理を「全部成功か、全部取り消し」にする', '処理を速くする', '表を作る', 'ログを消す'], '送金のように、途中までで終わると困る処理に使います。'),
      c('途中で失敗したとき、全部なかったことにする命令は?', ['ROLLBACK', 'COMMIT', 'UNDO ALL', 'CANCEL'], 'COMMIT は確定、ROLLBACK は取り消しです。'),
    ],
    fill: [f(['START TRANSACTION;', 'UPDATE accounts SET balance = balance - 1000 WHERE id = 1;', 'UPDATE accounts SET balance = balance + 1000 WHERE id = 2;', '___;  -- 確定'], ['COMMIT', 'ROLLBACK', 'SAVE', 'FINISH'], '成功したら COMMIT で確定します。')],
  },

  'create-table': {
    choice: [
      c('新しい表を作る命令は?', ['CREATE TABLE', 'NEW TABLE', 'INSERT TABLE', 'MAKE TABLE'], '列の名前と型をカッコの中に書きます。'),
      c('すでにある表に列を足すときに使うのは?', ['ALTER TABLE', 'UPDATE TABLE', 'CHANGE TABLE', 'MODIFY ROW'], 'ALTER は「変える」の意味です。'),
    ],
    fill: [f(['___ TABLE products ADD category VARCHAR(20);'], ['ALTER', 'CREATE', 'UPDATE', 'INSERT'], '既存の表の形を変えるのは ALTER TABLE です。')],
  },

  // ===================== 応用 =====================
  window: {
    choice: [
      c('ウィンドウ関数の特徴は?', ['行をまとめず、各行に計算結果を足せる', '行を1つにまとめる', '行を消す', '表を作る'], 'GROUP BY は行がまとまりますが、ウィンドウ関数は行が残ります。'),
      c('RANK() OVER (ORDER BY price DESC) が返すのは?', ['price の大きい順の順位', 'price の合計', '行の個数', 'price の平均'], '各行に順位がついて返ります。'),
    ],
    fill: [f(['SELECT name, RANK() ___ (ORDER BY price DESC) AS rnk', 'FROM products;'], ['OVER', 'ON', 'BY', 'WITH'], 'ウィンドウ関数の範囲は OVER ( ) で指定します。')],
  },

  explain: {
    choice: [
      c('EXPLAIN は何を教えてくれる?', ['SQLがどう実行されるか(実行計画)', 'SQLの文法のまちがい', '表の中身', 'DBのバージョン'], '遅い原因を探すときに使います。'),
      c('EXPLAIN の結果で type が ALL とは?', ['全部の行を調べている(索引を使っていない)', '索引を使っている', '1行だけ見ている', 'エラーが出ている'], '行数が多いと遅くなります。索引を検討するサインです。'),
    ],
    fill: [f(['___ SELECT * FROM products WHERE price = 480;'], ['EXPLAIN', 'DESCRIBE ALL', 'CHECK', 'SHOW'], 'SQLの前に EXPLAIN をつけると、実行計画が見られます。')],
  },

  normalize: {
    choice: [
      c('正規化の目的は?', ['重複をなくし、データの食いちがいを防ぐ', 'データを増やす', '検索結果を並べかえる', '表の名前を短くする'], '同じ情報を1か所だけに書くようにします。'),
      c('orders に利用者の名前やメールを毎回書くより良いのは?', ['users 表に分けて、user_id で指す', '列を2倍にする', '列をすべて文字にする', 'メールを消す'], '利用者の情報は users に1回だけ書きます。'),
    ],
    fill: [f(['users(id, name, email)', 'orders(id, ___, item)  -- 利用者は番号で指す'], ['user_id', 'user_name', 'user_email', 'users'], 'orders は users の id を、user_id として持ちます。')],
  },

  lock: {
    choice: [
      c('ロックが必要になるのは?', ['同時に同じデータを書きかえて、壊れるのを防ぎたいとき', '表を作るとき', 'データを読むだけのとき', '列の名前を変えるとき'], '在庫が1つなのに、2人が同時に買えてしまうような事故を防ぎます。'),
      c('SELECT … FOR UPDATE の意味は?', ['読んだ行に鍵をかけ、他の人が書きかえられないようにする', '行を削除する', '行をコピーする', '行を暗号化する'], 'COMMIT するまで、他の人は待たされます。'),
    ],
    fill: [f(['START TRANSACTION;', 'SELECT stock FROM items WHERE id = 1 FOR ___;', 'UPDATE items SET stock = stock - 1 WHERE id = 1;', 'COMMIT;'], ['UPDATE', 'DELETE', 'SELECT', 'LOCK'], '書きかえ前提で読むときは FOR UPDATE です。')],
  },

  view: {
    choice: [
      c('ビューとは?', ['SELECT に名前をつけて、表のように使えるもの', '表のコピー', '画面のデザイン', '古いデータの置き場'], 'よく使う検索を、名前で呼べるようにします。'),
      c('ビューを SELECT するたびに起きるのは?', ['中のSELECTが実行される', '保存済みの結果だけを返す', '表が消える', '列が増える'], 'ビューはデータのコピーではなく、検索の「名前」です。'),
    ],
    fill: [f(['___ VIEW expensive AS', 'SELECT name, price FROM products', 'WHERE price >= 400;'], ['CREATE', 'INSERT', 'SELECT', 'UPDATE'], 'ビューは CREATE VIEW で作ります。')],
  },
}
