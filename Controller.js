import { BoardView } from "./BoardView.js";

// 設定画面の指定を反映させる関数、変数
export let playMode = 1;
export let partnerName = "（CPU）";
const inputName = "あなた";
export let yourName = "（" + inputName + "）";
// プレーヤーの色
export let player = 1; // ->'black'
export let opponent = 2; // ->'white'
// CPU対戦時のパス判定に使用
export let passAuto;

// Controller
export class Controller {
  constructor(model) {
    this.model = model;
    this.view = new BoardView(this);
  }

  // 盤のセル位置を受け取り、必要な操作を行う
  handleInput(numberX, numberY) {
    // 盤の操作（modelに対し操作する）
    let result = this.model.canPut(numberX, numberY);
    if (result[9] === 1) {
      // 石を反転する
      this.model.reverse(numberX, numberY);
      // プレイヤーの反転
      this.switchPlayer();
      // 再描画（viewに対し操作する）
      this.renderBoard();
      // パス・終了判定
      this.judgePass();

      if (playMode === 1 && passAuto == false) {
        // イベントリスナの向こう側でオブジェクトのプロパティを参照するには、一度アロー関数をかませるとできるようになる。
        setTimeout(() => this.opponentAuto(), 300);
      }
    }
  }

  // 盤の状態が変更されたので再描画
  renderBoard() {
    this.view.renderBoard(this.model.board());
  }

  startGame() {
    // Code for starting the game goes here
    // 【JS】 DOMContentLoaded と load の違いを新人でもわかるように解説
    // https://takayamato.com/eventlistener/
    // 盤面を描写
    // window.addEventListener("load", controller.renderBoard, false);
    // イベントリスナの向こう側でオブジェクトのプロパティを参照するには、一度アロー関数をかませるとできるようになる。
    window.addEventListener("load", (e) => this.renderBoard(e), false);
  }

  switchPlayer() {
    // プレイヤーの交代処理を実装
    // プレイヤーの反転
    if (player === 1) {
      player = 2; // ->'white'
      opponent = 1; // ->'black'
    } else {
      player = 1; // ->'black'
      opponent = 2; // ->'white'
    }
  }

  // checkForWinner() {
  //   // 勝者のチェックを行う処理を実装
  // }
  // パス・終了判定
  judgePass() {
    passAuto = false;
    if (this.model.canPutAll() == false) {
      // 置ける場所がない
      // プレイヤーの反転
      this.switchPlayer();
      if (this.model.canPutAll() == true) {
        // 置ける石がある
        if (player === 1) {
          this.view.messageDialog("白はパスされました。");
        } else {
          this.view.messageDialog("黒はパスされました。");
        }
        passAuto = true;
        this.renderBoard();
      } else {
        passAuto = true;
        this.view.createResultButton(() =>
          this.view.result(this.model.board())
        );
        this.view.result(this.model.board());
      }
    }
  }

  // 対戦CPUの関数（ランダムで置いているだけなのでとても弱い）
  opponentAuto() {
    // テストコード
    const valueBoard = this.model.valueBoard();
    this.view.messageDialog(valueBoard);

    while (true) {
      // ランダムにセルを選択
      let a = Math.floor(Math.random() * (8 + 1 - 1)) + 1;
      let b = Math.floor(Math.random() * (8 + 1 - 1)) + 1;

      // 盤の操作（modelに対し操作する）
      let result = this.model.canPut(a, b);
      if (result[9] === 1) {
        // 石を反転する
        this.model.reverse(a, b);
        // プレイヤーの反転
        this.switchPlayer();
        // 再描画（viewに対し操作する）
        this.renderBoard();
        // パス・終了判定
        this.judgePass();

        break;
      }
    }
  }
}
