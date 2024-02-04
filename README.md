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