import {piecesModel} from '../models/pieces.js';

/**
 * Piece Component.
 */
export class Piece {
  /**
   * Creates the Piece Component.
   * @param {!Object<number>} boardConfig The board's width, height, square piece size in pixels.
   */
  constructor(boardConfig) {
    /**
     * @private {!Object}
     */
    this.boardConfig_ = boardConfig;

    /**
     * @param {!Array<Array<number>>}
     */
    this.pieceCoord = [];

    /**
     * @param {number}
     */
    this.pieceWidth = 0;

    /**
     * @param {number}
     */
    this.pieceHeight = 0;

    /**
     * @param {!Object}
     */
    this.pieceTypeData = {type: '', rotationIndex: -1};
  }

  /**
   * Gets the piece height.
   * @private
   */
  getPieceHeight_(pieceCoord) {
    let yCoorSet = new Set();

    Array.from(pieceCoord, (elem) => yCoorSet.add(elem[0]));

    return yCoorSet.size;
  }

  /**
   * Gets the piece width.
   * @private
   */
  getPieceWidth_(pieceCoord) {
    const xCoorSet = new Set();

    Array.from(pieceCoord, (elem) => xCoorSet.add(elem[1]));
    
    return xCoorSet.size;
  }

  /**
   * Gets the x and y center position from the piece coordinates.
   * @return {number}
   */
  getPieceCurrentPosition_() {
    const currentPieceMaxCoord = this.getCurrentPieceMaxCoord();
    const pieceMaxCoordDict = this.pieceCoord.reduce((acc, actual) => {
      acc.y.push(actual[0]);
      acc.x.push(actual[1]);

      return acc;
    }, {x: [], y: []});
    const maxXpos = currentPieceMaxCoord.xPos;
    const maxYpos = currentPieceMaxCoord.yPos;
    const minXpos = Math.min(...pieceMaxCoordDict.x);
    const minYpos = Math.min(...pieceMaxCoordDict.y);
    
    return {
      xPos: Math.round((minXpos + maxXpos) / 2) -1,
      yPos: Math.round((minYpos + maxYpos) / 2) -1,
    }
  }

  /**
   * Sets a new coordinates for rotation on the current piece.
   * @param {!Array<Array<number>>} newPieceCoord The new piece coordinates.
   * @param {number} indexRotationPiece The piece index rotation.
   */
   setPieceRotationCoord(newPieceCoord, indexRotationPiece) {
    this.pieceTypeData.rotationIndex = indexRotationPiece;  
    this.pieceCoord = newPieceCoord;
  }

  /**
   * Moves the piece new position on the Y axis.
   * @param {string} xDirection The direction type left/right.
   */
  movePieceXPos(xDirection) {
    let xMovement = 0;

    if (xDirection === 'right') {
      xMovement = 1;
    }

    if (xDirection === 'left') {
      xMovement = -1;
    }

    this.pieceCoord = this.pieceCoord.map((elem) => [elem[0], elem[1] + xMovement]);
  }

  /**
   * Moves the piece new position on the Y axis.
   */
  movePieceYPos() {
    this.pieceCoord = this.pieceCoord.map((elem) => [elem[0] + 1, elem[1]]);
  }

  /**
   * Gets the new piece rotation position.
   * @return {!Object}
   */
   getNextPieceRotation() {
    const {type, rotationIndex} = this.pieceTypeData; 
    const pieceRotationList = piecesModel[type];
    const currentPieceCoord = this.getPieceCurrentPosition_();
    const {xPos, yPos} = currentPieceCoord;
    let newIndexRotation = rotationIndex + 1;
    let nextRotationCoord = pieceRotationList[newIndexRotation];

    if (!nextRotationCoord) {
      newIndexRotation = 0;
      nextRotationCoord = pieceRotationList[newIndexRotation];
    }

    return {
      nextPiecePosition: nextRotationCoord.map((elem) => [elem[0] + yPos, elem[1] + xPos]),
      newIndexRotation,
    }
  }

  /**
   * Gets the current max piece coordinate in x and y position.
   * @return {!Object}
   */
  getCurrentPieceMaxCoord() {
    const pieceCoordDict = this.pieceCoord.reduce((acc, actual) => {
      acc.y.push(actual[0]);
      acc.x.push(actual[1]);

      return acc;
    }, {x: [], y: []});

    return {
      xPos: Math.max(...pieceCoordDict.x),
      yPos: Math.max(...pieceCoordDict.y)
    }
  }

  /**
   * Gets a piece valid x random position (the piece coordinates are inside the board area) on the x axis.
   * @return {number}
   */
  getPieceValidXpos_() {
    const {width} = this.boardConfig_;
    const xCoorsList = Array.from(Array(width).keys());
    let xCoorRandom = xCoorsList[Math.floor(Math.random() * xCoorsList.length)];

    if ((xCoorRandom + this.pieceWidth) > width) {
      xCoorRandom = xCoorRandom - this.pieceWidth;
    }

    return xCoorRandom;
  }

  /**
   * Gets a piece with new position coordinates by random.
   * @return {!Array<Array<number>>}
   */
  getRandomPieceCoord() {
    const piecesNameList = Object.keys(piecesModel);
    const pieceType = piecesNameList[Math.floor(Math.random() * piecesNameList.length)];
    const piecePositions = piecesModel[pieceType].length;
    const rotationIndex = Math.floor(Math.random() * piecePositions);
    const pieceCoord = piecesModel[pieceType][rotationIndex];
    let xCoorRandom = 0;

    this.pieceWidth  = this.getPieceWidth_(pieceCoord);
    this.pieceHeight = this.getPieceHeight_(pieceCoord);
    this.pieceTypeData = {type: pieceType, rotationIndex};
    xCoorRandom = this.getPieceValidXpos_();

    this.pieceCoord = pieceCoord.map((elem) => [elem[0], elem[1] + xCoorRandom]);

    return this.pieceCoord;
  }

  /**
   * Renders a piece with new Coordinates according the parameter x/y position.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  render(x, y) {
    x = x || 0;
    y = y || 0;

    this.pieceCoord = this.pieceCoord.map((elem) => [elem[0] + y, elem[1] + x]);
    this.getCurrentPieceMaxCoord();

    return this.pieceCoord;
  }
}