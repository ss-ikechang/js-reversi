import { player, yourName, partnerName } from "./script.js";

const GAMESIZE = 300;
const CELLSIZE = GAMESIZE / 8;
const CELL_INNER_SIZE = CELLSIZE * 0.98;
const CENTER_POSTION_OF_CIRCLE = CELL_INNER_SIZE / 2;
const RADIUS = CELLSIZE * 0.44;

// base64化した画像を入れる変数
let imageBase64;

// トップに戻るボタンを押した際、確認画面を出す
const moveTop = () => {
  let agree = confirm("本当に最初に戻りますか？（ゲームは保存されません）");
  if (agree === true) {
    location.reload();
  }
};

// const glovalCtx = this.canvas.getContext("2d");
// View: BoardView
export class BoardView {
  canvas;
  ctx;
  nowPlayerElement;

  constructor(controller) {
    this.controller = controller;

    // キャンバス準備
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.nowPlayerElement = document.getElementById("nowPlayer");
    this.resetButton = document.getElementById("reset-button");

    this.addMouseEvent();
  }

  addMouseEvent() {
    // 以下マウスオーバー時に色をつける処理
    // イベントリスナの向こう側でオブジェクトのプロパティを参照するには、一度アロー関数をかませるとできるようになる。
    this.canvas.addEventListener(
      "mousemove",
      (e) => this.handleMouseOver(e),
      false
    );
    // マウスアウト時に付けた色を解除する処理
    // イベントリスナの向こう側でオブジェクトのプロパティを参照するには、一度アロー関数をかませるとできるようになる。
    this.canvas.addEventListener(
      "mouseout",
      (e) => this.handleMouseOut(e),
      false
    );

    // クリック取得
    this.canvas.addEventListener(
      "click",
      (e) => this.handleMouseDown(e),
      false
    );

    this.resetButton.addEventListener("click", moveTop, false);
  }

  handleMouseDown(e) {
    /* https://tech-blog.s-yoshiki.com/entry/90 (参考) */
    // クリック地点の座標を取得
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    /* ここまで */

    // クリックされた四角の配列上での位置を取得する（正方形の一辺は50なので、座標を50で割り、1を足す）
    const numberX = Math.floor(y / CELLSIZE + 1);
    const numberY = Math.floor(x / CELLSIZE + 1);

    this.controller.handleInput(numberX, numberY);
  }

  // 盤面を描写する関数
  renderBoard(boardArray) {
    // 上部のプレイヤー名書き換え;
    if (player === 1) {
      this.nowPlayerElement.innerHTML = "黒" + yourName;
    } else {
      this.nowPlayerElement.innerHTML = "白" + partnerName;
    }

    // 念の為リセット
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // キャンバス背景を緑色に
    this.ctx.fillStyle = "green";

    this.ctx.fillRect(0, 0, GAMESIZE, GAMESIZE);

    for (let x = 1; x <= 8; x++) {
      for (let y = 1; y <= 8; y++) {
        // 配列に従って描写する色を変更
        let position = boardArray[x][y];

        // canvas描写用変数＆描写処理
        let drawX = (y - 1) * CELLSIZE;
        let drawY = (x - 1) * CELLSIZE;

        if (position === 1) {
          // 黒石表示
          this.ctx.beginPath();

          this.ctx.arc(
            drawX + CENTER_POSTION_OF_CIRCLE,
            drawY + CENTER_POSTION_OF_CIRCLE,
            RADIUS,
            (0 * Math.PI) / 180,
            (360 * Math.PI) / 180,
            false
          );
          this.ctx.fillStyle = "black";
          this.ctx.fill();
        } else if (position === 2) {
          // 白石表示
          this.ctx.beginPath();
          this.ctx.arc(
            drawX + CENTER_POSTION_OF_CIRCLE,
            drawY + CENTER_POSTION_OF_CIRCLE,
            RADIUS,
            (0 * Math.PI) / 180,
            (360 * Math.PI) / 180,
            false
          );
          this.ctx.fillStyle = "white";
          this.ctx.fill();
        }
      }
    }

    // セルの線描画
    // パスをリセット
    this.ctx.beginPath();
    // 線の色
    this.ctx.strokeStyle = "black";
    // 線の太さ
    this.ctx.lineWidth = 1;
    for (let xy = 1; xy < 8; xy++) {
      // 線描画位置
      let posXY = (xy - 1) * CELLSIZE + CELL_INNER_SIZE;
      // 縦線
      this.ctx.moveTo(posXY, 0);
      this.ctx.lineTo(posXY, GAMESIZE);
      // 横線
      this.ctx.moveTo(0, posXY);
      this.ctx.lineTo(GAMESIZE, posXY);
    }
    // 線を描画する
    this.ctx.stroke();

    imageBase64 = this.canvas.toDataURL("image/png");
  }

  handleMouseOver(e) {
    // this.nowPlayerElement.innerHTML = "handleMouseOver";
    /* https://tech-blog.s-yoshiki.com/entry/90 (参考。先ほどと同様のものです) */
    // クリック地点の座標を取得
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    /* ここまで */
    // クリックされた四角の配列上での位置を取得する（正方形の一辺は50なので、座標を50で割り、1を足す）
    let numberX = Math.floor(y / CELLSIZE + 1);
    let numberY = Math.floor(x / CELLSIZE + 1);

    // 更新時、生成した盤面画像を読み込む
    let img = new Image();
    img.src = imageBase64;
    this.ctx.drawImage(img, 0, 0);

    // 色を付ける
    this.ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    this.ctx.fillRect(
      (numberY - 1) * CELLSIZE,
      (numberX - 1) * CELLSIZE,
      CELL_INNER_SIZE,
      CELL_INNER_SIZE
    );
  }

  handleMouseOut() {
    // this.nowPlayerElement.innerHTML = "handleMouseOut";
    // 更新時、生成した盤面画像を読み込む
    let img = new Image();
    img.src = imageBase64;
    this.ctx.drawImage(img, 0, 0);
  }

  // メッセージダイアログ出力
  messageDialog(message = "") {
    window.alert(message);
  }

  // 結果を表示ボタン作成
  createResultButton(resultFunction) {
    document.getElementById("result").innerHTML =
      '<input type="button" id="result-button" value="結果を表示">';
    document
      .getElementById("result")
      .addEventListener("click", resultFunction, false);
  }
}
