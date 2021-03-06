
import {Board} from './board';
import {Piece} from './piece';
import {PieceController} from './pieceController';
import {Score} from './score.js';
import {requestAnimationUtil, cancelAllAnimationFrames, mobileCheck} from '../utils';
import {CONSTANTS, EVENTS, SELECTORS, EVENT_CODE} from '../constants';

/**
 * Game Component.
 */
export class Game {
  /**
   * Creates the Game Component.
   * @param {!Object} gameConfig The board's width, height, square piece size in pixels.
   */
   constructor(gameConfig) {
    /**
     * @private {!Object}
     */
    this.gameConfig_ = gameConfig;

    /**
     * @private {!HTMLElemet}
     */
    this.document_ = document;

    /**
     * @private {Object}
     */
    this.score_ = null;

    /**
     * @private {!Object}
     */
    this.board_ = new Board(gameConfig);

    /**
     * @private {!Object}
     */
    this.piece_ = null;

    /**
     * @private {!Object}
     */
    this.pieceController_ = null;

    /**
     * @private {boolean}
     */
    this.isNewPieceNeeded_ = true;

    /**
     * @private {number}
     */
    this.gameSpeed_ = 0;

    /**
     * @param {boolean}
     */
    this.isGameOver = false;

    this.getNewPiece_ = this.getNewPiece_.bind(this);
    this.pieceTracker_ = this.pieceTracker_.bind(this);
    this.addHighSpeed_ = this.addHighSpeed_.bind(this);
    this.addDefaultSpeed_ = this.addDefaultSpeed_.bind(this);
    this.addHighSpeedByClick_ = this.addHighSpeedByClick_.bind(this);
  }

  /**
   * Validates if a piece finishes its path when touches the board bottom or another piece.
   * @return {boolean}
   * @private
   */
  validatePiecePath_() {
    const {pieceCoord} = this.piece_;
    const isMatrixCoordAvailable = this.board_.isMatrixCoordAvailable(pieceCoord);

    return isMatrixCoordAvailable;
  }

  /**
   * Watches the piece's track.
   * @private
   */
  pieceTracker_() {
    const {pieceCoord} = this.piece_;
    const pieceCoordUpdated = this.piece_.render(0, 1);
    const isPieceMovingDown = this.validatePiecePath_();

    if (!isPieceMovingDown) {
      this.isNewPieceNeeded_ = true;

      this.board_.saveMatrix(pieceCoord);
      this.getNewPiece_();
      this.setDefaultSpeed_();
  
      return
    }

    this.board_.updateMatrix(pieceCoordUpdated);
    this.score_.linesCompleted = this.board_.getLinesCompleted();
    requestAnimationUtil(this.pieceTracker_, this.gameSpeed_);
  }

  /**
   * Gets a new piece or piece with new coordinates.
   * @private
   */
  getNewPiece_() {
    if (this.isGameOver) {
      return
    }

    if (!this.isNewPieceNeeded_) {
      this.pieceTracker_();

      return;
    }

    let newPieceCoord = [];

    this.isNewPieceNeeded_ = false; 
    this.piece_ = new Piece(this.gameConfig_);
    this.pieceController_.wrapNewPiece(this.piece_);
    newPieceCoord = this.piece_.getRandomPieceCoord();
    this.board_.updateMatrix(newPieceCoord);
    this.isGameOver = this.board_.isBoardFilledOnYAxis;
  
    requestAnimationUtil(this.getNewPiece_, this.gameSpeed_);
  }

  /**
   * Adds high speed on the game.
   * @param {!Event} event
   * @private
   */
  addHighSpeed_(event) {
    const isCursorArrows = event.code === EVENT_CODE.ARROW_LEFT ||  event.code === EVENT_CODE.ARROW_RIGHT;
    const isSpacebar = event.code === EVENT_CODE.SPACE;

    if (isCursorArrows) {
      return;
    }

    if (isSpacebar) {
      return;
    }

    const evenTarget = event.target;
    const isDownAction =
      evenTarget.classList.contains(Classname.DOWN) || event.keyCode === 40;

    if (isDownAction) {
      this.gameSpeed_ = CONSTANTS.requestAnimationHighSpeed;
      this.board_.setBoardSpeed(this.gameSpeed_);
    }
  }

  /**
   * Adds high speed on the game by click event.
   * @param {!Event} event
   * @private
   */
  addHighSpeedByClick_(event) {
    const evenTarget = event.target;
    const isDownAction = evenTarget?.classList.contains(Classname.DOWN);

    if (isDownAction) {
      this.gameSpeed_ = CONSTANTS.requestAnimationHighSpeed;
      this.board_.setBoardSpeed(this.gameSpeed_);
    }
  }

  /**
   * Sets the default speed.
   * @private
   */
  setDefaultSpeed_() {
    const {gameSpeed} = this.gameConfig_;

    this.gameSpeed_ = gameSpeed;
    this.board_.setBoardSpeed(this.gameSpeed_);
  }

  /**
   * Resets the game speed by the default one.
   * @param {!Event} event
   * @private
   */
  addDefaultSpeed_(event) {
    const evenTarget = event.target;
    const isDownAction =
    evenTarget.classList.contains(Classname.DOWN) || event.keyCode === 40;

    if (isDownAction) {
      this.setDefaultSpeed_();
    }
  }

  /**
   * Listen for eVENTS.
   * @private
   */
  listenEvents_() {
    const isMobile = mobileCheck();

    if (isMobile) {
      this.document_.querySelector(
        SELECTORS.DOWN_CTA).addEventListener(EVENTS.CLICK, this.addHighSpeedByClick_);

        return;
    }

    this.document_.addEventListener(EVENTS.KEY_DOWN, this.addHighSpeed_);
    this.document_.addEventListener(EVENTS.KEY_UP, this.addDefaultSpeed_);
    this.document_.addEventListener(EVENTS.MOUSE_DOWN, this.addHighSpeed_);
    this.document_.addEventListener(EVENTS.MOUSE_UP, this.addDefaultSpeed_);
  }

  /**
   * Starts the game.
   */
  start() {
    this.listenEvents_();
    this.getNewPiece_();
  }

  /**
   * Ends the game.
   */
  end() {
    this.isGameOver = true;
    this.pieceController_ = null;
    this.piece_ = null;
    this.pieceController_ = null;
    this.isNewPieceNeeded_ = false;

    this.board_.resetMatrix();
    this.score_.linesCompleted = 0;
    cancelAllAnimationFrames();
  }

  /**
   * Initializes the component.
   */
  init() {
    const {gameSpeed} = this.gameConfig_;
    this.gameSpeed_ = gameSpeed;
    this.score_ = new Score();
    this.pieceController_ = new PieceController(this.board_);

    this.board_.init();
    this.pieceController_.init();  
    this.score_.init();
    this.start();
  }
}

/**
 * Classname.
 */
 const Classname = {
  DOWN: 'js-cursor-down',
};
