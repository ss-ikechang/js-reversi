import { opponent, player } from "./Controller.js";

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
export class BoardModel {
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

    this.placeValue = [
      [120, -20, 20, 5, 5, 20, -20, 120],
      [-20, -40, -5, -5, -5, -5, -40, -20],
      [20, -5, 15, 3, 3, 15, -5, 20],
      [5, -5, 3, 3, 3, 3, -5, 5],
      [5, -5, 3, 3, 3, 3, -5, 5],
      [20, -5, 15, 3, 3, 15, -5, 20],
      [-20, -40, -5, -5, -5, -5, -40, -20],
      [120, -20, 20, 5, 5, 20, -20, 120],
    ];
  }

  // 盤の配列を返却
  board() {
    return boardArray;
  }

  // 指定された場所のコマの色がmyColorの色なら「1」
  // 相手側の色なら「-1」
  // コマなしなら「0」
  pieceValue(numberX, numberY, myColor) {
    const colorValue = boardArray[numberX][numberY];

    if (colorValue === 0) {
      return 0;
    } else if (colorValue === myColor) {
      return 1;
    } else {
      return -1;
    }
  }

  // 盤位置による評価値算定
  valueBoard() {
    let value = 0;
    //評価値は碁盤全体の状態により決まる
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        // pieceValue, myColor = 2 = 白
        value += this.pieceValue(i + 1, j + 1, 2) * this.placeValue[i][j];
      }
    }
    return value;
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

  // コンピューター側リバーシ操作座標決定。
  playBestHand() {
    // テストコード
    // const valueBoard = this.model.valueBoard();
    // this.view.messageDialog(valueBoard);

    let a = Math.floor(Math.random() * (8 + 1 - 1)) + 1; // a = 1～8
    let b = Math.floor(Math.random() * (8 + 1 - 1)) + 1; // b = 1～8

    let position = {
      a: a,
      b: b,
    };

    return position;
  }
}
