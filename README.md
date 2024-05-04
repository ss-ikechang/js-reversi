# js-reversi

JavaScriptで製作したリバーシ

## デモ

リバーシ  
https://ss-ikechang.github.io/js-reversi/

## fork元オリジナルデモ

https://kimoty.net/reversi/

## 得られた知見

```
// canvasの周りの枠を追加
// classListとは
// 特定の要素のクラス名を追加したり、削除したり、参照したりすることが出来る便利なプロパティです！
// classListの後にメソッドを定義することにより、追加削除などの機能を指定することができます！
// 【JavaScript】classListの使い方まとめ(add.remove.contains.toggle) #JavaScript - Qiita
// https://qiita.com/tomokichi_ruby/items/2460c5902d19b81cace5
// 下記class追加
// .canvas {
//     border: solid 5px;
//     border-radius: 15px 15px 15px 15px / 15px 15px 15px 15px;
// }
document.getElementById("canvas").classList.add("canvas");
```

```
// 【JS】 DOMContentLoaded と load の違いを新人でもわかるように解説
// https://takayamato.com/eventlistener/
// 盤面を描写
window.addEventListener('load', draw, false);
```

npm startでWEBサーバを起動させる最小限のこと
https://zenn.dev/okunokentaro/articles/01ejkz0014w0bg9cx3q94rfy0b

npmのローカルインストールとグローバルインストールの違い | GK Front-end Blog
https://gk-fe.com/article/npm-local-global-installation-differences/

## リバーシ評価関数

minimax法によるリバーシの最善手の探索
https://www.ipsj.or.jp/event/taikai/82/82PosterSession/img/portfolio/82P_1062.pdf

リバーシの評価関数について 塩田 好 - 情報学部
https://www.info.kindai.ac.jp/~takasi-i/thesis/2012_09-1-037-0133_S_Shiota_thesis.pdf

大学の課題でαβ法を使ったオセロAIを作れなかった話 #アルゴリズム - Qiita
https://qiita.com/reika727/items/b027f4c20e2c946ea102
