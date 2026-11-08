// PHP のテストの問題(追加分)です。選択肢は「正解を先頭」に書く(画面でシャッフルされる)。

import type { Quiz } from '../types'
import { c, f } from './helpers'

export const PHP_EXTRA_QUIZZES: Record<string, Quiz> = {
  abstract: {
    choice: [
      c('抽象クラスの特徴は?', ['直接 new できず、継承して使う', '必ず new して使う', 'メソッドを持てない', '変数を持てない'], '共通の形を決めておく、親のためのクラスです。'),
      c('abstract メソッドの意味は?', ['子クラスが必ず実装するべきメソッド', '削除されたメソッド', '非公開のメソッド', '自動で実行されるメソッド'], '名前だけ決めて、中身は子クラスに任せます。'),
    ],
    fill: [f(['___ class Shape {', '    abstract public function area();', '}'], ['abstract', 'final', 'static', 'public'], 'クラスの前に abstract をつけると、抽象クラスになります。')],
  },

  static: {
    choice: [
      c('静的メソッド(static)の特徴は?', ['インスタンスを作らずに呼べる', '必ず new して呼ぶ', 'クラスの外から呼べない', '変数を持てない'], 'Tax::add() のように、クラス名で直接呼びます。'),
      c('クラスの中で、自分自身のクラスを指す書き方は?', ['self::', '$this->', 'parent->', 'new::'], 'static のなかでは $this が使えないので、self:: を使います。'),
    ],
    fill: [f(['echo Tax___add(1000);  // new せずに呼ぶ'], ['::', '->', '.', '@'], 'static メソッドは、クラス名::メソッド名 で呼びます。')],
  },

  instanceof: {
    choice: [
      c('instanceof の役割は?', ['オブジェクトが、そのクラスのものかを確認する', 'クラスを作る', '変数の型を変える', 'クラスを削除する'], '結果は true か false で返ります。'),
      c('class Dog extends Animal のとき、$dog instanceof Animal の結果は?', ['true', 'false', 'エラー', 'null'], '親のクラスの仲間としても、true になります。'),
    ],
    fill: [f(['if ($d ___ Dog) {', '    echo "犬です";', '}'], ['instanceof', 'extends', 'is', 'isa'], 'クラスのものかを調べるのは instanceof です。')],
  },

  'mb-string': {
    choice: [
      c("strlen('あい') の結果(UTF-8)は?", ['6', '2', '4', '3'], 'ひらがな1文字は3バイトなので、6バイトです。'),
      c('日本語の文字数を、正しく数える関数は?', ['mb_strlen', 'strlen', 'count', 'size'], 'mb_ が頭につく関数は、複数バイトの文字を正しく扱います。'),
    ],
    fill: [f(["echo ___('こんにちは');  // 5"], ['mb_strlen', 'strlen', 'strpos', 'trim'], '文字数を数えるのは mb_strlen です。')],
  },

  'mb-convert-kana': {
    choice: [
      c("mb_convert_kana('ＡＢＣ', 'a') の結果は?", ['ABC(半角)', 'ＡＢＣ(全角)', 'abc', 'エラー'], 'a は「全角の英数 → 半角」の指定です。'),
      c('半角カナを全角カナにするオプションは?', ['K', 'k', 'A', 'a'], 'K は半角カナ → 全角カナ、k は全角カナ → 半角カナです。'),
    ],
    fill: [f(["echo mb_convert_kana('ｱｲｳ', '___');  // アイウ"], ['K', 'k', 'a', 'A'], '半角カナを全角カナにするのは K です。')],
  },

  datetime: {
    choice: [
      c('日本の時刻にする、タイムゾーンの設定は?', ['Asia/Tokyo', 'Japan/Tokyo', 'JST+9', 'Tokyo/Asia'], 'date_default_timezone_set(\'Asia/Tokyo\') のように指定します。'),
      c("strtotime('+7 days') は何を返す?", ['7日後の時刻(UNIXタイムスタンプ)', '7日前の日付の文字', '今日の日付', 'エラー'], '結果は秒の数です。date() で見やすい形に直します。'),
    ],
    fill: [f(["echo $now->format('___');  // 2026-11-07"], ['Y-m-d', 'd-m-Y', 'H:i:s', 'y/m/d'], 'Y=年、m=月、d=日 の順に並べます。')],
  },

  'number-format': {
    choice: [
      c('floor(3.9) の結果は?', ['3', '4', '3.9', '4.0'], 'floor は、小数点以下を切り捨てます。'),
      c('金額に3桁ごとのカンマをつける関数は?', ['number_format', 'round', 'floor', 'ceil'], 'number_format(1234567) は 1,234,567 になります。'),
    ],
    fill: [f(['echo ___(1234567);  // 1,234,567'], ['number_format', 'round', 'floor', 'strlen'], 'カンマ区切りにするのは number_format です。')],
  },

  'array-utils': {
    choice: [
      c('array_merge の役割は?', ['複数の配列を、1つに結合する', '配列を並びかえる', '配列を削除する', '配列の個数を数える'], 'array_merge($a, $b) は、$a のあとに $b をつなげます。'),
      c('CakePHP の Hash:: は何のため?', ['配列(入れ子の配列も)を扱いやすくする関数群', 'データベース接続', '画像処理', 'メール送信'], "Hash::get($user, 'profile.name') のように、ドット区切りで取り出せます。"),
    ],
    fill: [f(['print_r(___($a, $b));  // [1,2,3,4]'], ['array_merge', 'array_sum', 'count', 'implode'], '2つの配列を結合するのは array_merge です。')],
  },
}
