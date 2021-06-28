import { CONSTANTS } from '../constants';
import {requestAnimationUtil} from '../utils';

/**
 * Board Component.
 */
export class Board {
  /**
   * Creates the Board Component.
   * @param {!Object} The board's width, height, square piece size in pixels.
   */
  constructor(boardConfig) {
    /**
     * @private {!Object}
     */
    this.boardConfig_ = boardConfig;
    
    /**
     * @private {HTMLElement}
     */
    this.canvas_ = document.querySelector('canvas');

    /**
     * @private {HTMLElement}
     */
    this.context_ = this.canvas_.getContext('2d');

    /**
     * @private {!Array<Array<number>>}
     */
    this.matrixSaved_ = [];

    /**
     * @private {!Set}
     */
    this.rowCompleteIdxs_ = new Set();
    
    /**
     * @param {number}
     */
    this.height = this.boardConfig_.height;

    /**
     * @param {number}
     */
    this.width = this.boardConfig_.width;

    /**
     * @param {!Array<Array<number>>}
     */
    this.matrix = [];

    /**
     * @param {number}
     */
    this.isBoardFilledOnYAxis = false;

    /**
     * @private {number}
     */
    this.boardSpeed_ = boardConfig.gameSpeed;

    /**
     * @private {Object}
     */
    this.pixelImg_ = new Image();
  }

  /**
   * Initializes the board matrix.
   * @private
   */
  initMatrix_() {
    const {width, height, pieceSize} = this.boardConfig_;

    this.canvas_.width = width * pieceSize;
    this.canvas_.height = height * pieceSize;

    for (let row = 0; row < this.canvas_.width; row++) {
      this.matrix[row] =
        Array.apply(null, Array(this.canvas_.height)).map(Number.prototype.valueOf, 0);
    } 

    this.matrixSaved_ = this.matrix.map((elem) => [...elem]);
  }

  /**
   * Clears the HTMLElement canvas.
   * @private
   */
  clearBoard_() {
    const {width, height} = this.canvas_;

    this.context_.clearRect(0, 0, width, height);
  }

  /**
   * Saves the horizontal line's index(es) when it/they is/are completed.
   * @param {!Array<number>} row The current row matrix.
   * @param {number} rowIndex The current row index.
   * @private
   */
  saveLineCompleteIdxs_(row, rowIndex) {
    const lineCompleteValue = row.reduce((acc, actual) => acc + actual, 0);

    if (lineCompleteValue === this.width) {
      this.rowCompleteIdxs_.add(rowIndex);
    }
  }

  /**
   * Gets the horizontal line's index(es) when it/they is/are completed.
   * @private
   */
  getLineCompletedIdxs_() {
    for (let rowIndex = 0; rowIndex < this.matrixSaved_.length; rowIndex++) {
      const row = this.matrixSaved_[rowIndex];

      for (let columnIndex = 0; columnIndex < this.width; columnIndex++) {
        const columnValue = row[columnIndex];

        if (columnValue) {
          this.saveLineCompleteIdxs_(row, rowIndex);
        }
      }
    }
  }

  /**
   * Removes the row line from the matrix.
   * @private
   */
  removeLineFromMatrix_() {
    if (!this.rowCompleteIdxs_.size) {
      return;
    }

    this.rowCompleteIdxs_.forEach((elem, index) => {
      for (let col = 0; col < this.canvas_.height; col++) {
        this.matrixSaved_[index][col] = 0;
      }

      this.moveDownMatrix_(elem);
    });

    this.rowCompleteIdxs_ = new Set();
    this.matrix = this.matrixSaved_.map((elem) => [...elem]);
  }

  /**
   * Moves down the matrix when a row is removed.
   * @private
   */
  moveDownMatrix_(rowCompleteIdx) {
    for (let rowIndex = 0; rowIndex < this.matrixSaved_.length; rowIndex++) {
      const rowCompletePrevious = rowCompleteIdx - rowIndex;
      const isRowOnMatrix = this.matrixSaved_[rowCompletePrevious -1];
      const isRowEmpty = this.matrixSaved_[rowCompletePrevious - 1]?.every((elem) => elem === 0);

      if (isRowOnMatrix) {
        this.matrixSaved_[rowCompletePrevious] = this.matrixSaved_[rowCompletePrevious - 1];
      }

      if (isRowEmpty) {
        this.matrixSaved_[rowCompletePrevious] = 
          Array.apply(null, Array(this.height)).map(Number.prototype.valueOf,0);
      }
    }
  }

  /**
   * Validates if the matrix is filled on the Y axis.
   * @private
   */
  validateMatrixfilledOnYAxis_() {
    const rowEmptyDict = new Map();

    for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
      rowEmptyDict.set(rowIndex, this.matrixSaved_[rowIndex]?.every((elem) => elem === 0));
    }

    this.isBoardFilledOnYAxis = [...rowEmptyDict.values()].every((elem) => elem === false);
  }

  /**
   * Fills all the matrix whith dark pixels.
   * @private
   */
  fillMatrix_() {
    if (!this.isBoardFilledOnYAxis) {
      return;
    }
    
    for (let row = 0; row < this.canvas_.width; row++) {
      this.matrix[row] =
        Array.apply(null, Array(this.canvas_.height)).map(Number.prototype.valueOf, 1);
    } 

    this.matrixSaved_ = this.matrix.map((elem) => [...elem]);
  }

  /**
   * Sets the game speed by the number of frames.
   * @param {number} frames The number of frames.
   */
  setBoardSpeed(frames) {
    this.boardSpeed_ = frames;
  }
  
  /**
   * Validates if the actual coordinates are already set on the matrix.
   * @param {!Array<Array<number>>} pieceCoordList The current Piece Coordinates.
   */
  isMatrixCoordAvailable(pieceCoordList) {
    return pieceCoordList.every((elem) => {
      const xPos = elem[1];
      const yPos = elem[0];
      const isValidXpos = xPos >= 0 && xPos < this.width;
      const isValidYpos = yPos >= 0 && yPos < this.height;
      const isOnMatrix = isValidXpos && isValidYpos;

      if (isOnMatrix && !this.matrixSaved_[yPos][xPos]) {
        return true;
      }
    });
  }

  /**
   * Updates the matrix board.
   * @param {!Array<Array<number>>} pieceCoordList The Piece Coordinates to render on the board.
   */
  updateMatrix(pieceCoordList) {
    for (let pieceIdx = 0; pieceIdx < pieceCoordList.length; pieceIdx++) {
      const pieceCoord = pieceCoordList[pieceIdx];
      const pieceXCoord = pieceCoord[0];
      const pieceYCoord = pieceCoord[1];

      this.matrix[pieceXCoord][pieceYCoord] = 1;

      requestAnimationUtil(() => {
        this.matrix[pieceXCoord][pieceYCoord] = 0;
      }, this.boardSpeed_);
    }

    this.clearBoard_();
    this.render();
  }

  /**
   * Saves the current matrix content.
   * @param {!Array<Array<number>>} pieceCoordList The Piece Coordinates to render on the board.
   */
  saveMatrix(pieceCoordList) {
    for (let pieceIdx = 0; pieceIdx < pieceCoordList.length; pieceIdx++) {
      const pieceCoord = pieceCoordList[pieceIdx];
      const pieceXCoord = pieceCoord[0];
      const pieceYCoord = pieceCoord[1];

      this.matrix[pieceXCoord][pieceYCoord] = 1;
      this.matrixSaved_[pieceXCoord][pieceYCoord] = 1;
    }

    this.getLineCompletedIdxs_();
    this.removeLineFromMatrix_();
    this.validateMatrixfilledOnYAxis_();
    this.fillMatrix_();
    this.render();
  }

  /**
   * Draws the pieces on the board.
   */
  render() {
    const {pieceSize} = this.boardConfig_;

    for (let rowIndex = 0; rowIndex < this.matrix.length; rowIndex++) {
      const row = this.matrix[rowIndex];

      for (let columnIndex = 0; columnIndex < this.width; columnIndex++) {
        const columnValue = row[columnIndex];

        if (columnValue) {
          this.context_.drawImage(this.pixelImg_, columnIndex * pieceSize, rowIndex * pieceSize, pieceSize, pieceSize);
        }
      }
    }
  }

  /**
   * Initialize component.
   * @return {!Object}
   */
  init() {
    this.pixelImg_.src = CONSTANTS.pixelImage;

    this.initMatrix_();
    this.render();
  }
}
