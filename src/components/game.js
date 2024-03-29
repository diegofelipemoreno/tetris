
import {Board} from './board';
import {Piece} from './piece';
import {PieceController} from './pieceController';
import {Score} from './score.js';
import {requestAnimationUtil, cancelAllAnimationFrames, mobileCheck} from '../utils';
import {CONSTANTS, EVENTS, SELECTORS} from '../constants';

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
     * @private {number}
     */
    this.requestAnimationFrameId_ = -1;

    /**
     * @private {!Object}
     */
    this.keysPressed = {};

    /**
     * @param {boolean}
     */
    this.isGameOver = false;

    /**
     * @param {number}
     */
    this.pieceMovingXAxisCounter_ = 0;

    /**
     * @param {number}
     */
     this.lastKeyUpAt = 0;

    /**
     * @param {boolean}
     */
    this.isKeyLongPressed = false;

    this.getNewPiece_ = this.getNewPiece_.bind(this);
    this.pieceTracker_ = this.pieceTracker_.bind(this);
    this.manageHighSpeed_ = this.manageHighSpeed_.bind(this);
    this.manageDefaultSpeed_ = this.manageDefaultSpeed_.bind(this);
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
   * Validates the piece X axis advance when any cursor key keeps pressed.
   * @param {Array<Array<number>>} pieceCoord The actual piece coordinates,
   * @private
   * @return {Array<Array<number>>}
   */
  pieceAdvanceYAxis_(pieceCoord) {
    if (this.keysPressed['ArrowDown']) {  
      return pieceCoord;
    }

    if (!this.isKeyLongPressed) {
      this.pieceMovingXAxisCounter_ = 0;
    }  

    this.pieceMovingXAxisCounter_ += 100;
    const counterLimit = 1200;
    const delayMoveOnY = this.pieceMovingXAxisCounter_ % counterLimit;

    if (delayMoveOnY) {
      for (let pieceIdx = 0; pieceIdx < pieceCoord.length; pieceIdx++) {
        pieceCoord[pieceIdx][0] = pieceCoord[pieceIdx][0] - 1;
      }
    }

    return pieceCoord;
  }

  /**
   * Watches the piece's track.
   * @private
   */
  pieceTracker_() {
    if (!this.piece_) {
      return
    }

    const {pieceCoord} = this.piece_;
    let pieceCoordUpdated = this.piece_.render(0, 1);
    const isPieceMovingDown = this.validatePiecePath_();

    if (!isPieceMovingDown) {
      this.isNewPieceNeeded_ = true;

      this.board_.saveMatrix(pieceCoord);
      this.getNewPiece_();
      this.setDefaultSpeed_();
      return
    }

    if (this.isKeyKeepPressed_()) {
      pieceCoordUpdated = this.pieceAdvanceYAxis_([...pieceCoordUpdated]);
    }

    this.board_.updateMatrix(pieceCoordUpdated);
    this.score_.linesCompleted = this.board_.getLinesCompleted();
    this.requestAnimationFrameId_ =
      requestAnimationUtil(this.pieceTracker_,  this.gameSpeed_);
    this.actualTime_ = Date.now();
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
   * Checks if the cursor keys are pressed,
   * @private
   * @return {boolean}
   */
  isKeyKeepPressed_() {
    return this.keysPressed['ArrowDown'] || this.keysPressed['ArrowLeft']  || this.keysPressed['ArrowRight'];
  }

  /**
   * Manages the speed on the game.
   * @param {!Event} event
   * @private
   */
  manageHighSpeed_(event) {
    const keyDownAt = new Date();
  
    this.keysPressed[event.code] = true;

    setTimeout(() => {
      if (+keyDownAt > +this.lastKeyUpAt) {
        this.isKeyLongPressed = true;
      } else {
        this.isKeyLongPressed = false;
      }
    }, 400);

    if (this.isKeyLongPressed && this.isKeyKeepPressed_()) {
      this.setHightSpeed_();
    } else {
      this.setDefaultSpeed_();
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
      this.setHightSpeed_();
    }
  }

  /**
   * Sets the hight speed.
   * @private
   */
  setHightSpeed_() {
    this.gameSpeed_ = CONSTANTS.requestAnimationHighSpeed;

    this.board_.setBoardSpeed(this.gameSpeed_);
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
  manageDefaultSpeed_(event) {
    this.lastKeyUpAt = new Date();

    if (event.code === 'Space') {
      this.pieceMovingXAxisCounter_ = 0;
    }

    delete this.keysPressed[event.key];
    this.setDefaultSpeed_();
  }

  /**
   * Listen for eVENTS.
   * @private
   */
  listenEvents_() {
    const isMobile = mobileCheck();

    this.document_.querySelector(
      SELECTORS.DOWN_CTA).addEventListener(EVENTS.CLICK, this.addHighSpeedByClick_);

    if (isMobile) {
        return;
    }

    this.document_.addEventListener(EVENTS.KEY_DOWN, this.manageHighSpeed_);
    this.document_.addEventListener(EVENTS.KEY_UP, this.manageDefaultSpeed_);
    this.document_.addEventListener(EVENTS.MOUSE_DOWN, this.manageHighSpeed_);
    this.document_.addEventListener(EVENTS.MOUSE_UP, this.manageDefaultSpeed_);
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
    this.score_.linesCompleted = 0;
    this.board_.resetMatrix();

    cancelAllAnimationFrames(this.requestAnimationFrameId_);
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
