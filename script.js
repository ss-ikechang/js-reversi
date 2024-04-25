import { BoardModel } from "./BoardModel.js";
import { Controller } from "./Controller.js";

const GAMESIZE = 300;
const CELLSIZE = GAMESIZE / 8;
const CELL_INNER_SIZE = CELLSIZE * 0.98;
const CENTER_POSTION_OF_CIRCLE = CELL_INNER_SIZE / 2;
const RADIUS = CELLSIZE * 0.44;

// MVCの初期化
// 盤面MODEL生成
const boardModel = new BoardModel();
export const controller = new Controller(boardModel);
controller.startGame();
