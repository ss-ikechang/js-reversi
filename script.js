import { BoardModel } from "./BoardModel.js";
import { Controller } from "./Controller.js";

// MVCの初期化
// 盤面MODEL生成
const boardModel = new BoardModel();
export const controller = new Controller(boardModel);
controller.startGame();
