// SQL の解説ページのデータです。キーは languages.ts の項目の id と同じ名前にします。
// どの項目も、同じサンプルの表(商品 products・利用者 users・注文 orders など)を使います。
//   marks: 表の行の状態(hot=注目 / dim=対象外 / new=追加 / edit=書きかえ / gone=削除 / g1〜g3=グループ色)

import type { Cell, Lesson } from '../types'
import { all, chain, table } from './helpers'

const sql = (lines: string[]) => ({ label: 'SQL', lines })

// ---- サンプルの表 ----
const P_COLS = ['id', 'name', 'price', 'category']
const P: Cell[][] = [
  [1, 'ペン', 120, '文具'],
  [2, 'ノート', 250, '文具'],
  [3, 'コーヒー', 480, '飲料'],
  [4, '紅茶', 400, '飲料'],
  [5, 'バッグ', 3200, '雑貨'],
]
const products = (marks?: Record<number, 'hot' | 'dim' | 'new' | 'edit' | 'gone' | 'g1' | 'g2' | 'g3'>, hotCols?: number[], rows: Cell[][] = P) =>
  table('products(商品)', P_COLS, rows, { marks, hotCols })

const O_COLS = ['id', 'user_id', 'total']
const O: Cell[][] = [
  [1, 1, 500],
  [2, 2, 300],
  [3, 1, 800],
  [4, 9, 100],
]
const U_COLS = ['id', 'name']
const U: Cell[][] = [
  [1, 'ナオ'],
  [2, 'ケン'],
  [3, 'ミキ'],
]

export const SQL_LESSONS: Record<string, Lesson> = {
  // ===================== 必須 =====================
  select: {
    code: sql(['SELECT name, price', 'FROM products;']),
    steps: [
      { title: '取りたい「列」を選ぶ', note: 'SELECT のあとに、欲しい列の名前を書く', code: 1, visuals: [products(undefined, [1, 2])] },
      { title: 'どの表から取るか', note: 'FROM で、表の名前を指定する', code: 2, visuals: [products(all(5, 'hot'), [1, 2])] },
      {
        title: '結果は、選んだ列だけ',
        note: '全部の列が欲しいときは SELECT * と書く',
        visuals: [table('結果', ['name', 'price'], P.map((r) => [r[1], r[2]]), { hotCols: [0, 1] })],
      },
    ],
  },

  where: {
    code: sql(['SELECT * FROM products', 'WHERE price >= 400;']),
    steps: [
      { title: 'ふつうは全部の行が出る', code: 1, visuals: [products()] },
      {
        title: 'WHERE で行を絞る',
        note: '条件に合う行だけが残る。price が 400 以上なら OK',
        code: 2,
        visuals: [products({ 0: 'dim', 1: 'dim', 2: 'hot', 3: 'hot', 4: 'hot' }, [2])],
      },
      { title: '結果', visuals: [table('結果', P_COLS, [P[2], P[3], P[4]], { hotCols: [2] })] },
      {
        title: 'よく使う条件',
        visuals: [
          table('条件の書き方', ['書き方', '意味'], [
            ['price = 400', '等しい'],
            ['price <> 400', '等しくない'],
            ['A AND B', 'AとB、どちらも'],
            ['A OR B', 'AかB、どちらか'],
            ["name LIKE 'コ%'", '「コ」で始まる'],
          ]),
        ],
      },
    ],
  },

  'order-by': {
    code: sql(['SELECT name, price FROM products', 'ORDER BY price DESC;']),
    steps: [
      { title: 'なにも指定しないと', note: '順番は決まっていない(たまたま登録順に見えるだけ)', code: 1, visuals: [table('結果', ['name', 'price'], P.map((r) => [r[1], r[2]]))] },
      {
        title: 'ORDER BY で並べかえる',
        note: 'DESC は大きい順(降順)、ASC は小さい順(昇順)。省略すると ASC',
        code: 2,
        visuals: [
          table(
            '結果(price の大きい順)',
            ['name', 'price'],
            [['バッグ', 3200], ['コーヒー', 480], ['紅茶', 400], ['ノート', 250], ['ペン', 120]],
            { hotCols: [1] },
          ),
        ],
      },
    ],
  },

  insert: {
    code: sql(['INSERT INTO products (name, price, category)', "VALUES ('クッキー', 300, '菓子');"]),
    steps: [
      { title: 'どの表の、どの列に入れるか', code: 1, visuals: [products(undefined, [1, 2, 3])] },
      {
        title: 'VALUES で値を並べる',
        note: '列の順番どおりに値を書く。id は自動で番号がつく(AUTO_INCREMENT)',
        code: 2,
        visuals: [products({ 5: 'new' }, undefined, [...P, [6, 'クッキー', 300, '菓子']])],
      },
    ],
  },

  update: {
    code: sql(['UPDATE products', 'SET price = 500', "WHERE name = 'コーヒー';"]),
    steps: [
      { title: 'どの表を書きかえるか', code: 1, visuals: [products()] },
      { title: 'どの行を?(WHERE)', note: '書きかえる行を、先に絞り込む', code: 3, visuals: [products({ 0: 'dim', 1: 'dim', 2: 'hot', 3: 'dim', 4: 'dim' })] },
      {
        title: 'SET で値を書きかえる',
        code: 2,
        visuals: [products({ 2: 'edit' }, [2], P.map((r) => (r[0] === 3 ? [3, 'コーヒー', 500, '飲料'] : r)))],
      },
      {
        title: '⚠ WHERE を忘れると全行が変わる',
        note: '書きかえる前に、必ず WHERE を確認する',
        visuals: [products(all(5, 'edit'), [2], P.map((r) => [r[0], r[1], 500, r[3]]))],
      },
    ],
  },

  delete: {
    code: sql(['DELETE FROM products', 'WHERE id = 4;']),
    steps: [
      { title: 'どの表から消すか', code: 1, visuals: [products()] },
      { title: 'どの行を?(WHERE)', code: 2, visuals: [products({ 0: 'dim', 1: 'dim', 2: 'dim', 3: 'hot', 4: 'dim' })] },
      {
        title: '行が消える',
        note: '消した行は元に戻せない。WHERE を忘れると全行が消えるので注意',
        visuals: [products({ 3: 'gone' })],
      },
    ],
  },

  // ===================== 基礎 =====================
  limit: {
    code: sql(['SELECT * FROM products', 'ORDER BY id', 'LIMIT 2 OFFSET 2;']),
    steps: [
      { title: '並び順を決めておく', note: 'LIMIT は、順番が決まっていないと意味がない', code: 1, codeTo: 2, visuals: [products()] },
      { title: 'OFFSET: 先頭を飛ばす', note: 'OFFSET 2 は「最初の2行を読み飛ばす」', code: 3, visuals: [products({ 0: 'dim', 1: 'dim' })] },
      { title: 'LIMIT: 件数を決める', note: 'LIMIT 2 は「2行だけ取る」', code: 3, visuals: [products({ 0: 'dim', 1: 'dim', 2: 'hot', 3: 'hot', 4: 'dim' })] },
      {
        title: 'ページ送りに使う',
        note: '1ページ2件なら、ページ n の OFFSET は (n - 1) × 2',
        visuals: [table('ページ送り', ['ページ', 'OFFSET'], [[1, 0], [2, 2], [3, 4]])],
      },
    ],
  },

  aggregate: {
    code: sql(['SELECT COUNT(*), SUM(price), AVG(price)', 'FROM products;']),
    steps: [
      { title: '集計関数で、行をまとめる', note: 'COUNT は個数、SUM は合計、AVG は平均', code: 1, codeTo: 2, visuals: [products(all(5, 'hot'), [2])] },
      {
        title: '結果は1行だけ',
        note: '5件の価格が、個数・合計・平均の3つの値にまとまる',
        visuals: [table('結果', ['COUNT(*)', 'SUM(price)', 'AVG(price)'], [[5, 4450, 890]], { marks: { 0: 'hot' } })],
      },
    ],
  },

  'group-by': {
    code: sql(['SELECT category, COUNT(*), SUM(price)', 'FROM products', 'GROUP BY category;']),
    steps: [
      { title: 'まとめる基準の列', code: 2, visuals: [products(undefined, [3])] },
      {
        title: 'GROUP BY で同じ値をグループにする',
        note: '色が同じ行が、同じグループ',
        code: 3,
        visuals: [products({ 0: 'g1', 1: 'g1', 2: 'g2', 3: 'g2', 4: 'g3' }, [3])],
      },
      {
        title: 'グループごとに集計',
        note: '1グループが1行になる',
        code: 1,
        visuals: [table('結果', ['category', 'COUNT(*)', 'SUM(price)'], [['文具', 2, 370], ['飲料', 2, 880], ['雑貨', 1, 3200]], { marks: { 0: 'g1', 1: 'g2', 2: 'g3' } })],
      },
    ],
  },

  join: {
    code: sql(['SELECT orders.id, users.name', 'FROM orders', 'INNER JOIN users ON orders.user_id = users.id;']),
    steps: [
      { title: '注文には、利用者の番号しかない', note: 'user_id だけでは、誰の注文か分からない', code: 2, visuals: [table('orders(注文)', O_COLS, O, { hotCols: [1] })] },
      {
        title: 'ON で、同じ値の行をつなぐ',
        note: 'orders.user_id と users.id が同じ行どうしが組になる',
        code: 3,
        visuals: [
          table('orders(注文)', O_COLS, O, { marks: { 0: 'hot', 1: 'hot', 2: 'hot', 3: 'dim' }, hotCols: [1] }),
          table('users(利用者)', U_COLS, U, { marks: { 0: 'hot', 1: 'hot', 2: 'dim' }, hotCols: [0] }),
        ],
      },
      {
        title: '組になった行だけが残る',
        note: '相手のいない注文4と、注文のないミキは消える。これが INNER JOIN',
        code: 1,
        visuals: [table('結果', ['orders.id', 'users.name'], [[1, 'ナオ'], [2, 'ケン'], [3, 'ナオ']], { hotCols: [1] })],
      },
    ],
  },

  'left-join': {
    code: sql(['SELECT users.name, orders.id', 'FROM users', 'LEFT JOIN orders ON orders.user_id = users.id;']),
    steps: [
      { title: '左側の表(FROM)は全部残す', code: 2, visuals: [table('users(左)', U_COLS, U, { marks: all(3, 'hot') })] },
      {
        title: '右側に相手がいれば、くっつける',
        code: 3,
        visuals: [
          table('users(左)', U_COLS, U, { marks: all(3, 'hot') }),
          table('orders(右)', O_COLS, O, { marks: { 0: 'hot', 1: 'hot', 2: 'hot', 3: 'dim' }, hotCols: [1] }),
        ],
      },
      {
        title: '相手がいない行は NULL',
        note: 'ミキの注文はないが、行は残る。右側の列が NULL(値なし)になる',
        code: 1,
        visuals: [table('結果', ['users.name', 'orders.id'], [['ナオ', 1], ['ナオ', 3], ['ケン', 2], ['ミキ', null]], { marks: { 3: 'hot' } })],
      },
    ],
  },

  keys: {
    code: sql([
      'CREATE TABLE users (',
      '  id INT PRIMARY KEY,',
      '  name VARCHAR(50)',
      ');',
      'CREATE TABLE orders (',
      '  id INT PRIMARY KEY,',
      '  user_id INT,',
      '  FOREIGN KEY (user_id) REFERENCES users(id)',
      ');',
    ]),
    steps: [
      {
        title: '主キー: 行の背番号',
        note: '1つの表の中で、重複せず NULL でもない。行を1つに特定できる',
        code: 1,
        codeTo: 4,
        visuals: [table('users', ['id(主キー)', 'name'], [[1, 'ナオ'], [2, 'ケン']], { hotCols: [0] })],
      },
      {
        title: '別の表にも主キー',
        note: 'orders の user_id は、users の誰かを指す番号',
        code: 5,
        codeTo: 7,
        visuals: [table('orders', ['id(主キー)', 'user_id'], [[1, 1], [2, 2]], { hotCols: [1] })],
      },
      {
        title: '外部キー: 表どうしの約束',
        note: 'user_id には、users.id に実在する値しか入れられない。存在しない 9 はエラー',
        code: 8,
        codeTo: 9,
        visuals: [table('orders', ['id', 'user_id'], [[1, 1], [2, 2], [3, 9]], { marks: { 2: 'gone' }, hotCols: [1], label: '⚠ users に 9 はいないので登録できない' })],
      },
    ],
  },

  // ===================== 中級 =====================
  having: {
    code: sql(['SELECT category, COUNT(*) AS n', 'FROM products', 'GROUP BY category', 'HAVING COUNT(*) >= 2;']),
    steps: [
      { title: 'まず、グループにする', code: 3, visuals: [products({ 0: 'g1', 1: 'g1', 2: 'g2', 3: 'g2', 4: 'g3' }, [3])] },
      {
        title: '1グループが1行になる',
        code: 3,
        visuals: [table('まとめた結果', ['category', 'n'], [['文具', 2], ['飲料', 2], ['雑貨', 1]], { marks: { 0: 'g1', 1: 'g2', 2: 'g3' } })],
      },
      {
        title: 'HAVING: まとめた後に絞る',
        note: '個数が 2 未満のグループは消える。WHERE は「まとめる前の行」、HAVING は「まとめた後」',
        code: 4,
        visuals: [table('結果', ['category', 'n'], [['文具', 2], ['飲料', 2], ['雑貨', 1]], { marks: { 0: 'hot', 1: 'hot', 2: 'gone' } })],
      },
    ],
  },

  subquery: {
    code: sql(['SELECT name, price', 'FROM products', 'WHERE price > (', '  SELECT AVG(price) FROM products', ');']),
    steps: [
      {
        title: 'カッコの中が先に実行される',
        note: '全体の平均の価格を、先に求める',
        code: 4,
        visuals: [table('内側のSQLの結果', ['AVG(price)'], [[890]], { marks: { 0: 'hot' } })],
      },
      {
        title: '結果を条件に使う',
        note: 'WHERE price > 890 と書いたのと同じ。平均より高い行だけが残る',
        code: 3,
        codeTo: 5,
        visuals: [products({ 0: 'dim', 1: 'dim', 2: 'dim', 3: 'dim', 4: 'hot' }, [2])],
      },
      { title: '結果', code: 1, visuals: [table('結果', ['name', 'price'], [['バッグ', 3200]], { marks: { 0: 'hot' } })] },
    ],
  },

  null: {
    code: sql(['SELECT * FROM users', 'WHERE email IS NULL;', '-- WHERE email = NULL; は1行も見つからない(NG)']),
    steps: [
      {
        title: 'NULL は「値がない」',
        note: '空の文字や 0 とは別もの。「まだ分からない・存在しない」を表す',
        code: 1,
        visuals: [table('users', ['id', 'name', 'email'], [[1, 'ナオ', 'nao@example.com'], [2, 'ケン', null], [3, 'ミキ', null]])],
      },
      {
        title: 'IS NULL で探す',
        code: 2,
        visuals: [table('users', ['id', 'name', 'email'], [[1, 'ナオ', 'nao@example.com'], [2, 'ケン', null], [3, 'ミキ', null]], { marks: { 0: 'dim', 1: 'hot', 2: 'hot' }, hotCols: [2] })],
      },
      {
        title: '= NULL では探せない',
        note: 'NULL は「不明」なので、何と比べても「分からない」になる。必ず IS NULL を使う',
        code: 3,
        visuals: [table('users', ['id', 'name', 'email'], [[1, 'ナオ', 'nao@example.com'], [2, 'ケン', null], [3, 'ミキ', null]], { marks: all(3, 'dim') })],
      },
    ],
  },

  index: {
    code: sql(['SELECT * FROM products WHERE price = 480;', 'CREATE INDEX idx_price ON products (price);', 'SELECT * FROM products WHERE price = 480;']),
    steps: [
      {
        title: '索引がないと、全部を見る',
        note: '先頭から1行ずつ調べて探す。行が100万件あれば、100万回調べる',
        code: 1,
        visuals: [products(all(5, 'hot'), [2])],
      },
      {
        title: 'インデックスは本の索引',
        note: 'price を小さい順に並べ、「どの行にあるか」をメモしておく',
        code: 2,
        visuals: [table('idx_price(索引)', ['price', '行の場所'], [[120, 1], [250, 2], [400, 4], [480, 3], [3200, 5]], { hotCols: [0] })],
      },
      {
        title: '索引で一直線に探せる',
        note: '480 を索引で見つけ、場所のメモからその行へ直接ジャンプ。ただし書き込みは少し遅くなる',
        code: 3,
        visuals: [
          table('idx_price(索引)', ['price', '行の場所'], [[120, 1], [250, 2], [400, 4], [480, 3], [3200, 5]], { marks: { 0: 'dim', 1: 'dim', 2: 'dim', 3: 'hot', 4: 'dim' } }),
          products({ 0: 'dim', 1: 'dim', 2: 'hot', 3: 'dim', 4: 'dim' }),
        ],
      },
    ],
  },

  transaction: {
    code: sql([
      'START TRANSACTION;',
      'UPDATE accounts SET balance = balance - 1000 WHERE id = 1;',
      'UPDATE accounts SET balance = balance + 1000 WHERE id = 2;',
      'COMMIT;',
    ]),
    steps: [
      {
        title: '「ひとまとまり」の開始',
        note: 'ナオからケンへ 1000円を送る。2つの処理は、両方成功するか、両方なかったことにしたい',
        code: 1,
        visuals: [table('accounts(口座)', ['id', 'name', 'balance'], [[1, 'ナオ', 5000], [2, 'ケン', 3000]])],
      },
      {
        title: 'ナオから引く',
        note: 'まだ「仮」の状態。ほかの人には見えない',
        code: 2,
        visuals: [table('accounts(口座)', ['id', 'name', 'balance'], [[1, 'ナオ', 4000], [2, 'ケン', 3000]], { marks: { 0: 'edit' } })],
      },
      {
        title: 'ケンに足す',
        code: 3,
        visuals: [table('accounts(口座)', ['id', 'name', 'balance'], [[1, 'ナオ', 4000], [2, 'ケン', 4000]], { marks: { 0: 'edit', 1: 'edit' } })],
      },
      {
        title: 'COMMIT で確定',
        note: '途中で失敗したら ROLLBACK で、全部なかったことにできる',
        code: 4,
        visuals: [table('accounts(口座)', ['id', 'name', 'balance'], [[1, 'ナオ', 4000], [2, 'ケン', 4000]], { marks: { 0: 'hot', 1: 'hot' }, hotCols: [2] })],
      },
    ],
  },

  'create-table': {
    code: sql([
      'CREATE TABLE products (',
      '  id INT PRIMARY KEY AUTO_INCREMENT,',
      '  name VARCHAR(50) NOT NULL,',
      '  price INT',
      ');',
      'ALTER TABLE products ADD category VARCHAR(20);',
    ]),
    steps: [
      { title: 'CREATE TABLE: 表を作る', note: 'まだ中身(行)はない。入れ物だけができる', code: 1, visuals: [table('products', ['id', 'name', 'price'], [])] },
      {
        title: '列の名前と型を決める',
        note: 'INT は整数、VARCHAR(50) は50文字までの文字。NOT NULL は「空にできない」',
        code: 2,
        codeTo: 5,
        visuals: [table('products', ['id', 'name', 'price'], [], { hotCols: [0, 1, 2] })],
      },
      {
        title: 'ALTER TABLE: あとから形を変える',
        note: '列を足す・消す・名前を変える、などができる',
        code: 6,
        visuals: [table('products', ['id', 'name', 'price', 'category'], [], { hotCols: [3] })],
      },
    ],
  },

  // ===================== 応用 =====================
  window: {
    code: sql(['SELECT name, price,', '  RANK() OVER (ORDER BY price DESC) AS rnk', 'FROM products;']),
    steps: [
      { title: '行はまとめずに残したい', note: 'GROUP BY だと行が1つにまとまってしまう', code: 3, visuals: [table('products', ['name', 'price'], P.map((r) => [r[1], r[2]]))] },
      {
        title: 'OVER: 行を残したまま計算',
        note: 'price の大きい順に並べたときの順位を、各行に足す',
        code: 1,
        codeTo: 2,
        visuals: [
          table('結果', ['name', 'price', 'rnk(順位)'], [['ペン', 120, 5], ['ノート', 250, 4], ['コーヒー', 480, 2], ['紅茶', 400, 3], ['バッグ', 3200, 1]], { hotCols: [2], marks: { 4: 'hot' } }),
        ],
      },
    ],
  },

  explain: {
    code: sql(['EXPLAIN SELECT * FROM products WHERE price = 480;', 'CREATE INDEX idx_price ON products (price);', 'EXPLAIN SELECT * FROM products WHERE price = 480;']),
    steps: [
      {
        title: 'EXPLAIN: 実行計画を見る',
        note: 'type が ALL なら、全部の行を調べている(フルスキャン)。key が NULL は、索引を使っていない',
        code: 1,
        visuals: [table('EXPLAIN の結果', ['type', 'key', 'rows'], [['ALL', null, 5]], { marks: { 0: 'gone' }, hotCols: [0, 1] })],
      },
      { title: '索引を作ってみる', code: 2, visuals: [chain(['price の索引', 'idx_price を作る'])] },
      {
        title: 'もう一度 EXPLAIN',
        note: 'key に idx_price。調べる行数(rows)も 5 から 1 に減った',
        code: 3,
        visuals: [table('EXPLAIN の結果', ['type', 'key', 'rows'], [['ref', 'idx_price', 1]], { marks: { 0: 'hot' }, hotCols: [1, 2] })],
      },
    ],
  },

  normalize: {
    code: sql([
      '-- 正規化の前',
      'orders(id, user_name, user_email, item)',
      '-- 正規化の後',
      'users(id, name, email)',
      'orders(id, user_id, item)',
    ]),
    steps: [
      {
        title: '同じ情報が何度も出てくる',
        note: 'ナオのメールアドレスが変わると、すべての行を直さなければならない。直し忘れると食い違う',
        code: 1,
        codeTo: 2,
        visuals: [table('orders', ['id', 'user_name', 'user_email', 'item'], [[1, 'ナオ', 'nao@example.com', 'ペン'], [2, 'ナオ', 'nao@example.com', 'ノート'], [3, 'ケン', 'ken@example.com', '紅茶']], { marks: { 0: 'hot', 1: 'hot' }, hotCols: [1, 2] })],
      },
      {
        title: '表を分けて、番号でつなぐ',
        note: '利用者の情報は users に1回だけ書く。orders は user_id で指すだけ',
        code: 3,
        codeTo: 5,
        visuals: [
          table('users', ['id', 'name', 'email'], [[1, 'ナオ', 'nao@example.com'], [2, 'ケン', 'ken@example.com']], { hotCols: [0] }),
          table('orders', ['id', 'user_id', 'item'], [[1, 1, 'ペン'], [2, 1, 'ノート'], [3, 2, '紅茶']], { hotCols: [1] }),
        ],
      },
    ],
  },

  lock: {
    code: sql([
      'START TRANSACTION;',
      'SELECT stock FROM items WHERE id = 1 FOR UPDATE;',
      'UPDATE items SET stock = stock - 1 WHERE id = 1;',
      'COMMIT;',
    ]),
    steps: [
      {
        title: 'FOR UPDATE で鍵をかける',
        note: '在庫は1個。ロックがないと、AさんとBさんが同時に「在庫1」を見て、2個売れてしまう',
        code: 1,
        codeTo: 2,
        visuals: [chain(['Aさん', 'FOR UPDATE', '行に鍵 🔒'], [0, 1, 2]), chain(['Bさん', '同じ行を読みたい', '鍵が開くまで待つ…'], [0, 1, 2])],
      },
      {
        title: 'Aさんだけが書きかえる',
        code: 3,
        visuals: [table('items', ['id', 'name', 'stock'], [[1, '限定ケーキ', 0]], { marks: { 0: 'edit' }, hotCols: [2] })],
      },
      {
        title: 'COMMIT で鍵が開く',
        note: 'Bさんが読むと、在庫はもう 0。買えないと正しく判断できる',
        code: 4,
        visuals: [chain(['Aさん', 'COMMIT', '鍵を開ける 🔓'], [0, 1, 2]), chain(['Bさん', '在庫 0 を見る', '買えない'], [0, 1, 2])],
      },
    ],
  },

  view: {
    code: sql(['CREATE VIEW expensive AS', 'SELECT name, price FROM products', 'WHERE price >= 400;', 'SELECT * FROM expensive;']),
    steps: [
      {
        title: 'SELECT に名前をつけて保存',
        note: 'よく使う検索を、1つの表のように呼べる「ビュー」にする',
        code: 1,
        codeTo: 3,
        visuals: [chain(['SELECT … WHERE price >= 400', '名前: expensive'], undefined), products({ 0: 'dim', 1: 'dim', 2: 'hot', 3: 'hot', 4: 'hot' }, [2])],
      },
      {
        title: '表のように使える',
        note: 'ビューはデータのコピーではない。呼ぶたびに、中のSELECTが動く',
        code: 4,
        visuals: [table('expensive(ビュー)', ['name', 'price'], [['コーヒー', 480], ['紅茶', 400], ['バッグ', 3200]], { hotCols: [1] })],
      },
    ],
  },
}
