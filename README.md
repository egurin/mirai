# 松戸子育てみらいカード協賛店一覧

## 概要

嫁からの要請で、松戸子育てみらいカード（以下「みらいカード」と記載）の協賛店一覧がPDF形式だったものをスマホで参照しやすい様にしました。モダンなWeb開発の勉強も兼ねています。データは、AdobeAcrobatでpdfファイルをテキストファイルにした後にExcel上で加工しました。住所がよくわからないものや加工に失敗した情報は削除してます。

***元データ:***
[子育てみらいカード協賛店](http://www.city.matsudo.chiba.jp/kosodate/matsudodekosodate/kosodatenavi/matsudokosodateshien/kosodatejouhou/cardkyousanten.html)

***デモ:***
[GitHub上のデモ](https://egurin.github.io/mirai/)

## 機能

- 松戸市の任意の駅を選択、または現在地情報を取得し、最寄りの子育てみらいカード協賛店情報を一覧表示
- 協賛店の一覧表示は、選択した対象座標から、距離が近い順に表示（緯度、経度で計算）
- 地図はGoogleMapのAPIで画像表示。1日25,000アクセスが何日か超えると機能停止するはず。

## みらいカードの位置づけ

以下、市役所にメールで確認しました。
- マイナンバーカードに移行済なので新規発行が不可
- みらいカードは最長で平成37年12月28日まで利用可能
- 同様のサービスとして「チーパス」を推奨

## 今後の機能拡張

- Code for Matsudoのプロジェクトにするか確認
- サイトを広く利用してもらえる様に口コミでサイトの存在を広げてもいいか、市役所に確認
- みらいカードのデータについて市役所からExcelかCSVでほしい
- チーパスのデータのうち、松戸市に関するデータは反映したい
- ページング機能を追加したい（現状200件程度、チーパスをとりこむと700件程度となる）
- 横展開がしやすい様に工夫したい
- Reduxとかもやりたい・・・

## 依存

create-react-appコマンドで作ったアプリがベースです。
React-BootStrapを依存関係に追加しています。

## 作者

[@egurin](https://github.com/egurin/)

## ライセンス

[MIT](https://raw.githubusercontent.com/b4b4r07/dotfiles/master/doc/LICENSE-MIT.txt)

