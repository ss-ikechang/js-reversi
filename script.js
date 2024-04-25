import { BoardView } from "./BoardView.js";

const GAMESIZE = 300;
const CELLSIZE = GAMESIZE / 8;
const CELL_INNER_SIZE = CELLSIZE * 0.98;
const CENTER_POSTION_OF_CIRCLE = CELL_INNER_SIZE / 2;
const RADIUS = CELLSIZE * 0.44;

// 設定画面の指定を反映させる関数、変数
let playMode = 1;
export let partnerName = "（CPU）";
let inputName = "あなた";
export let yourName = "（" + inputName + "）";

// プレーヤーの色
export let player = 1; // ->'black'
let opponent = 2; // ->'white'
// CPU対戦時のパス判定に使用
let passAuto;

// 盤面の初期設定
let boardArray = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, -1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, -1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, -1],
  [-1, 0, 0, 0, 2, 1, 0, 0, 0, -1],
  [-1, 0, 0, 0, 1, 2, 0, 0, 0, -1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, -1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, -1],
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
];

// Model: BoardModel
class BoardModel {
  constructor() {
    // 方向判定
    this.direction = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 0],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    /* direction = [[左上],[左],[左下],[上],[原点],[下],[右上],[右],[右下]]; */
  }

  // 盤の配列を返却
  board() {
    return boardArray;
  }

  // その場所が置ける場所か、またひっくり返す方向を判定する関数
  // 引数(numberX, numberY) -> (X位置(1~8), Y位置(1~8))
  canPut(numberX, numberY) {
    // 上下左右が置ける位置か判定
    let result = [];
    /* 
        result(出力例) = [false,true,false,false,false,false,false,false,false]; (->この場合、左側に置ける)
        result(方向) = [[左上],[左],[左下],[上],[原点],[下],[右上],[右],[右下]];
    */
    // let allOver 0ならどこも置けない、1ならどこか置ける。result[9]から取得
    let allOver = 0;
    for (let i = 0; i <= 8; i++) {
      if (
        boardArray[numberX + this.direction[i][0]][
          numberY + this.direction[i][1]
        ] === opponent &&
        boardArray[numberX][numberY] === 0
      ) {
        // 上下左右に[相手の色](白(==2))がある場合 && そこが空いている(==0)マスか
        // 現在の8つの方向を記録
        let c = this.direction[i][0];
        let d = this.direction[i][1];
        // とりあえずfalse
        let TorF = false;

        // 置いた先に自分の色があるか探索する処理
        while (true) {
          // もし、先に黒があり、置けるのであればtrue
          if (boardArray[numberX + c][numberY + d] === player) {
            TorF = true;
            allOver = 1;
            break;
          }
          // 壁・緑に当たったら終了
          if (
            boardArray[numberX + c][numberY + d] === -1 ||
            boardArray[numberX + c][numberY + d] === 0
          ) {
            break;
          }
          c += this.direction[i][0];
          d += this.direction[i][1];
        }
        result.push(TorF);
      } else {
        result.push(false);
      }
    }
    result.push(allOver);
    // 結果を返却
    return result;
  }

  // 全体に置ける場所があるか判定する関数
  canPutAll() {
    let count = false;
    for (let x = 1; x <= 8; x++) {
      for (let y = 1; y <= 8; y++) {
        // 置ける場所を判定
        let result = this.canPut(x, y);

        if (result[9] === 1) {
          // 置ける石がある
          count = true;
          // 一箇所でも置けるならそれ以上調べる必要ないのでbreak
          break;
        }
      }
      if (count == true) {
        // 一箇所でも置けるならそれ以上調べる必要ないので外側のfor文でもbreak
        break;
      }
    }
    // countがtrueなら置ける石がある
    return count;
  }

  // ひっくり返す処理
  reverse(numberX, numberY) {
    // 判定プログラムから結果呼び出し
    let result = this.canPut(numberX, numberY);

    for (let i = 0; i <= 8; i++) {
      if (result[i] == true) {
        let c = this.direction[i][0];
        let d = this.direction[i][1];
        while (true) {
          boardArray[numberX + c][numberY + d] = player;
          // 一個先に黒があったらbreak
          if (
            boardArray[numberX + this.direction[i][0] + c][
              numberY + this.direction[i][1] + d
            ] === player
          ) {
            break;
          }
          c += this.direction[i][0];
          d += this.direction[i][1];
        }
      }
    }
    if (result[9] === 1) {
      // 自分のクリックしたところも反転
      boardArray[numberX][numberY] = player;
    }
  }
}

// Controller
class Controller {
  constructor(model) {
    this.model = model;
    this.view = new BoardView(this);
  }

  // 盤のセル位置を受け取り、必要な操作を行う
  handleInput(numberX, numberY) {
    // 盤の操作（modelに対し操作する）
    let result = this.model.canPut(numberX, numberY);
    if (result[9] === 1) {
      this.model.reverse(numberX, numberY);

      // プレイヤーの反転
      if (player === 1) {
        player = 2; // ->'white'
        opponent = 1; // ->'black'
      } else {
        player = 1; // ->'black'
        opponent = 2; // ->'white'
      }

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
  }

  switchPlayer() {
    // プレイヤーの交代処理を実装
  }

  // checkForWinner() {
  //   // 勝者のチェックを行う処理を実装
  // }

  // パス・終了判定
  judgePass() {
    passAuto = false;
    if (this.model.canPutAll() == false) {
      // 置ける場所がない
      if (player === 1) {
        // プレイヤーの反転
        player = 2; // ->'white'
        opponent = 1; // ->'black'
      } else {
        // プレイヤーの反転
        player = 1; // ->'black'
        opponent = 2; // ->'white'
      }
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
        this.view.createResultButton(result);
        result();
      }
    }
  }

  // 対戦CPUの関数（ランダムで置いているだけなのでとても弱い）
  opponentAuto() {
    while (true) {
      let a = Math.floor(Math.random() * (8 + 1 - 1)) + 1;
      let b = Math.floor(Math.random() * (8 + 1 - 1)) + 1;
      let result = this.model.canPut(a, b);
      if (result[9] === 1) {
        this.model.reverse(a, b);

        // プレイヤーの反転
        if (player === 1) {
          player = 2; // ->'white'
          opponent = 1; // ->'black'
        } else {
          player = 1; // ->'black'
          opponent = 2; // ->'white'
        }
        this.renderBoard();
        this.judgePass();

        break;
      }
    }
  }
}

// MVCの初期化
// 盤面MODEL生成
const boardModel = new BoardModel();
const controller = new Controller(boardModel);

// 結果を表示
const result = () => {
  let black = 0;
  let white = 0;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (boardArray[i][j] === 1) {
        black++;
      } else if (boardArray[i][j] === 2) {
        white++;
      }
    }
  }
  if (black > white) {
    alert("白:" + white + ", 黒:" + black + ", 黒" + yourName + "の勝ち");
  } else if (black < white) {
    alert("白:" + white + ", 黒:" + black + ", 白" + partnerName + "の勝ち");
  } else {
    alert("白:" + white + ", 黒:" + black + ", 引き分け");
  }
};

// 【JS】 DOMContentLoaded と load の違いを新人でもわかるように解説
// https://takayamato.com/eventlistener/

// 盤面を描写
// window.addEventListener("load", controller.renderBoard, false);
// イベントリスナの向こう側でオブジェクトのプロパティを参照するには、一度アロー関数をかませるとできるようになる。
window.addEventListener("load", (e) => controller.renderBoard(e), false);
