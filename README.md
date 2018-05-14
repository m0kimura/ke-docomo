docomo developper Support API
====

ドコモのDevelopperAPIに簡単にアクセスするためのクラスです。
詳しくは[Docomo Developper Site](https://dev.smt.docomo.ne.jp/?p=docs.api.index)
をご覧ください。

## 解説
  簡単なインターフェイスでDocomoサイトとの会話ができます。
  1.
  ２．メンバーが来店した場合にはアラートする（アテンション、情報表示）
  3.メンバー登録時に、顔の画像も登録する
  4.お客さまがどのゾーンに何名、どれくらいの時間いたかを記録
  5.AWS,LEXサンプル作成

## 依存関係
  とくにありません

## 使い方
### インストール方法
  npm install ke-docomo

### 機能と呼び出し方法
  |メソッド|解説|
  |:-|:-|
  |constructor|new()オブジェクトを作成します。|
  |dialogue|(msg)雑談対話インターフェイスです。返答メッセージが返ってきます。|
  |qa|(msg)質問すると返答してくれます。|
  |analytics|形態素、固定表現解析インターフェイス,文章を解析してくれます。|
  |cluster|カテゴリ分析インターフェイス,文章を分析してカテゴリーに分けてくれます。|

### サンプル
  ~~~javascript
  const keDocomo=require('ke-docomo');
  const Dc=new keDocomo();
  Dc.dialog('雑談の送信メッセージ');
  ~~~

## ライセンス

[MIT](https://github.com/tcnksm/tool/blob/master/LICENCE)

## 作成者

[m0kimura](https://github.com/m0kimura)
[Site](https://www.kmrweb.net/)

