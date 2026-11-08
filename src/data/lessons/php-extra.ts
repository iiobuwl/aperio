// PHP の解説ページ(追加分)のデータです。キーは languages.ts の項目の id と同じ名前にします。

import type { Lesson } from '../types'
import { chain, out, table, vars } from './helpers'

const php = (lines: string[]) => ({ label: 'PHP', lines })

export const PHP_EXTRA_LESSONS: Record<string, Lesson> = {
  abstract: {
    code: php([
      '<?php',
      'abstract class Shape {',
      '    abstract public function area();',
      "    public function describe() { return '面積は' . $this->area(); }",
      '}',
      'class Square extends Shape {',
      '    public function __construct(private $side) {}',
      '    public function area() { return $this->side * $this->side; }',
      '}',
      '$s = new Square(3);',
      'echo $s->describe();',
    ]),
    steps: [
      { title: '抽象クラス: 直接は使えない親', note: '共通の形だけを決めておく「設計図の設計図」。new Shape() はエラーになる', code: 2, visuals: [chain(['abstract class Shape', 'new はできない'], [0])] },
      { title: 'abstract メソッド: 「子が必ず作ってね」', note: '中身は書かず、名前だけ決める。子が作らないと、エラーになる', code: 3, visuals: [chain(['area()', '中身なし', '子クラスが実装する'], [1, 2])] },
      { title: '共通の処理は、親に書ける', note: 'describe は、子の area() を呼ぶだけ。どの子でも使い回せる', code: 4, codeTo: 5, visuals: [chain(['describe()', '→ this->area()', '子の area が動く'])] },
      { title: 'extends で、子クラスが実装', code: 6, codeTo: 9, visuals: [chain(['Shape(抽象)', 'extends', 'Square(実物にできる)'], [2])] },
      { title: '子を new して使う', code: 10, codeTo: 11, visuals: [vars(['$s', 'Square(3)']), out('面積は9')] },
    ],
  },

  static: {
    code: php([
      '<?php',
      'class Tax {',
      '    const RATE = 0.1;',
      '    public static function add($price) {',
      '        return $price * (1 + self::RATE);',
      '    }',
      '}',
      'echo Tax::add(1000);',
    ]),
    steps: [
      { title: 'クラスに、定数を持たせる', note: 'const は、プログラムの途中で変えられない値', code: 2, codeTo: 3, visuals: [vars(['Tax::RATE', '0.1'])] },
      { title: 'static: new しなくても呼べる', note: '普通のメソッドは、new した実物が必要。static は、クラス自体に属する', code: 4, codeTo: 6, visuals: [table('呼び方のちがい', ['種類', '呼び方'], [['普通のメソッド', '$tax = new Tax(); $tax->add()'], ['static メソッド', 'Tax::add()']], { marks: { 0: 'dim', 1: 'hot' } })] },
      { title: 'self:: は「このクラス自身」', note: 'static のなかでは、実物がないので $this は使えない。かわりに self:: を使う', code: 5, visuals: [chain(['self::RATE', '=', 'Tax::RATE', '=', '0.1'], [0])] },
      { title: 'クラス名::メソッド() で呼ぶ', code: 8, visuals: [out('1100')] },
      { title: '向いている使いどころ', note: '状態(データ)を持たない、計算や変換のような処理', visuals: [table('static の使いどころ', ['向いている', '向いていない'], [['税込みの計算', '利用者ごとのデータを持つ処理'], ['文字の整形', '実物ごとに状態が変わる処理']])] },
    ],
  },

  instanceof: {
    code: php([
      '<?php',
      'class Animal {}',
      'class Dog extends Animal {}',
      '$d = new Dog();',
      'var_dump($d instanceof Dog);',
      'var_dump($d instanceof Animal);',
      'var_dump($d instanceof Cat);',
    ]),
    steps: [
      { title: 'Dog は Animal を継承している', code: 2, codeTo: 4, visuals: [chain(['Animal', 'Dog($d)'], [1])] },
      { title: '同じクラスなら true', note: '$d は Dog の実物', code: 5, visuals: [out('true')] },
      { title: '親のクラスでも true', note: 'Dog は Animal の仲間でもあるから', code: 6, visuals: [out('true', 'true')] },
      { title: '関係のないクラスは false', note: 'Cat とは何のつながりもない', code: 7, visuals: [out('true', 'true', 'false')] },
      { title: '使いどころ', note: '渡された値が、期待したクラスのものかを確かめてから使う', visuals: [table('instanceof の使いどころ', ['場面', '例'], [['受け取った値の確認', 'if ($x instanceof Dog) { $x->bark(); }'], ['例外の種類の判定', '$e instanceof DomainException']])] },
    ],
  },

  'mb-string': {
    code: php(['<?php', "$s = 'こんにちは';", 'echo strlen($s);', 'echo mb_strlen($s);', 'echo mb_substr($s, 0, 3);', 'echo mb_strwidth($s);']),
    steps: [
      { title: '日本語は、1文字が複数バイト', note: 'UTF-8 では、ひらがなや漢字は1文字で3バイト', code: 2, visuals: [vars(['$s', 'こんにちは']), table('文字とバイト', ['見るもの', '数'], [['文字', 5], ['バイト', 15]])] },
      { title: 'strlen: バイト数を数える', note: '日本語の文字数としては、正しくない', code: 3, visuals: [out('15')] },
      { title: 'mb_strlen: 文字数を数える', note: 'mb_ が頭につく関数は、日本語のような複数バイトの文字を正しく扱う', code: 4, visuals: [out('15', '5')] },
      { title: 'mb_substr: 文字単位で切り出す', note: 'substr だと、文字の途中で切れて文字化けすることがある', code: 5, visuals: [out('15', '5', 'こんに')] },
      { title: 'mb_strwidth: 見た目の幅', note: '半角を1、全角を2として数える。表示幅をそろえるときに使う', code: 6, visuals: [out('15', '5', 'こんに', '10')] },
    ],
  },

  'mb-convert-kana': {
    code: php([
      '<?php',
      "echo mb_convert_kana('ＡＢＣ１２３', 'a');",
      "echo mb_convert_kana('ｱｲｳ', 'K');",
      "echo mb_convert_kana('ABC123', 'A');",
      "echo mb_convert_kana('アイウ', 'k');",
    ]),
    steps: [
      { title: 'a: 全角の英数 → 半角', note: '入力のゆれをそろえるときに使う(例: 郵便番号)', code: 2, visuals: [chain(['ＡＢＣ１２３', 'a', 'ABC123'], [1, 2]), out('ABC123')] },
      { title: 'K: 半角カナ → 全角カナ', code: 3, visuals: [chain(['ｱｲｳ', 'K', 'アイウ'], [1, 2]), out('ABC123', 'アイウ')] },
      { title: 'A: 半角の英数 → 全角', note: 'a の逆。a と A は、大文字・小文字で向きが反対', code: 4, visuals: [chain(['ABC123', 'A', 'ＡＢＣ１２３'], [1, 2]), out('ABC123', 'アイウ', 'ＡＢＣ１２３')] },
      { title: 'k: 全角カナ → 半角カナ', code: 5, visuals: [chain(['アイウ', 'k', 'ｱｲｳ'], [1, 2]), out('ABC123', 'アイウ', 'ＡＢＣ１２３', 'ｱｲｳ')] },
      {
        title: 'オプションのまとめ',
        visuals: [table('よく使う指定', ['指定', '変換'], [['a', '全角英数 → 半角英数'], ['A', '半角英数 → 全角英数'], ['K', '半角カナ → 全角カナ'], ['k', '全角カナ → 半角カナ']])],
      },
    ],
  },

  datetime: {
    code: php([
      '<?php',
      "date_default_timezone_set('Asia/Tokyo');",
      "$now = new DateTime('2026-11-07 10:00:00');",
      "echo $now->format('Y年n月j日');",
      "$next = $now->modify('+1 month');",
      "echo $next->format('Y-m-d');",
      "echo date('Y-m-d', strtotime('2026-11-07 +7 days'));",
    ]),
    steps: [
      { title: 'タイムゾーンを決める', note: '決めないと、時刻がずれる。日本は Asia/Tokyo(UTC+9)', code: 2, visuals: [vars(['タイムゾーン', 'Asia/Tokyo'])] },
      { title: 'DateTime: 日時を扱う実物', code: 3, visuals: [vars(['$now', '2026-11-07 10:00:00'])] },
      { title: 'format: 好きな形で表示', note: 'Y=年(4桁)、n=月、j=日。m と d は 0 を補う(07)', code: 4, visuals: [out('2026年11月7日')] },
      { title: 'modify: 日付の計算', note: '+1 month、-3 days など、英語で書ける。元の $now も変わる点に注意', code: 5, codeTo: 6, visuals: [out('2026年11月7日', '2026-12-07')] },
      { title: 'strtotime: 文字から日時を作る', note: '結果は UNIXタイムスタンプ(秒)。date() で見やすい形に直す', code: 7, visuals: [out('2026年11月7日', '2026-12-07', '2026-11-14')] },
    ],
  },

  'number-format': {
    code: php(['<?php', 'echo number_format(1234567);', 'echo round(3.5);', 'echo floor(3.9);', 'echo ceil(3.1);', 'echo number_format(1234.567, 2);']),
    steps: [
      { title: 'number_format: カンマ区切り', note: '金額の表示に使う。3桁ごとにカンマが入る', code: 2, visuals: [out('1,234,567')] },
      { title: 'round: 四捨五入', code: 3, visuals: [out('1,234,567', '4')] },
      { title: 'floor: 切り捨て', note: '小数点以下を、小さいほうへ落とす', code: 4, visuals: [out('1,234,567', '4', '3')] },
      { title: 'ceil: 切り上げ', code: 5, visuals: [out('1,234,567', '4', '3', '4')] },
      { title: '小数点以下の桁数を指定', note: '2 は「小数点以下2桁」。足りなければ四捨五入される', code: 6, visuals: [out('1,234,567', '4', '3', '4', '1,234.57')] },
      { title: 'まとめ', visuals: [table('丸め方', ['値', 'round', 'floor', 'ceil'], [[3.5, 4, 3, 4], [3.1, 3, 3, 4], [3.9, 4, 3, 4]])] },
    ],
  },

  'array-utils': {
    code: php([
      '<?php',
      '$a = [1, 2];',
      '$b = [3, 4];',
      'print_r(array_merge($a, $b));',
      "$user = ['profile' => ['name' => 'ナオ']];",
      "echo Hash::get($user, 'profile.name');",
    ]),
    steps: [
      { title: '2つの配列を用意', code: 2, codeTo: 3, visuals: [table('$a と $b', ['配列', '中身'], [['$a', '1, 2'], ['$b', '3, 4']])] },
      { title: 'array_merge: 結合する', note: '後ろにつなげて、新しい配列を作る', code: 4, visuals: [table('結果', ['番号', '値'], [[0, 1], [1, 2], [2, 3], [3, 4]], { marks: { 2: 'new', 3: 'new' } })] },
      { title: '入れ子の配列', note: '配列の中に、さらに配列がある形。深くなるほど、取り出しが面倒', code: 5, visuals: [table('$user', ['キー', '値'], [['profile', "['name' => 'ナオ']"]])] },
      { title: 'Hash::get: ドット区切りで取り出す', note: "$user['profile']['name'] と同じ。CakePHP の機能で、途中が無くてもエラーにならない", code: 6, visuals: [chain(["'profile.name'", '→ profile の中の name', 'ナオ'], [0, 2]), out('ナオ')] },
      { title: 'Hash と Set', note: 'Set は古い版の機能で、今は Hash に置きかわっている。古いコードでは両方が出てくる', visuals: [table('CakePHP の配列の道具', ['名前', 'ひとこと'], [['Hash::', '今の標準'], ['Set::', '古い版(Hash の前身)']], { marks: { 0: 'hot', 1: 'dim' } })] },
    ],
  },
}
