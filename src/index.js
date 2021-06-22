import './scss/style.scss';
import {Board} from './components/board';
import {Piece} from './components/piece';
import {PieceController} from './components/pieceController';
import {requestAnimationUtil} from './utils';
import {CONSTANTS} from './constants';

const boardConfig = {
  width: 10,
  height: 20,
  pieceSize: 24,
  gameSpeed:
  CONSTANTS.requestAnimationSpeed
};

/**
 * Game Component.
 */
class Game {
  /**
   * Creates the Game Component.
   */
   constructor() {
    /**
     * @private {!HTMLElemet}
     */
    this.document_ = document;

    /**
     * @private {!Object}
     */
    this.board_ = null;

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
     * @private {boolean}
     */
    this.isGameOver_ = false;

    this.getNewPiece_ = this.getNewPiece_.bind(this);
    this.pieceTracker_ = this.pieceTracker_.bind(this);
    this.addHighSpeed_ = this.addHighSpeed_.bind(this);
    this.addDefaultSpeed_ = this.addDefaultSpeed_.bind(this);
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
  
      return
    }

    this.board_.updateMatrix(pieceCoordUpdated);
    requestAnimationUtil(this.pieceTracker_, this.gameSpeed_);
  }

  /**
   * Gets a new piece or piece with new coordinates.
   * @private
   */
  getNewPiece_() {
    if (this.isGameOver_) {
      return
    }

    if (!this.isNewPieceNeeded_) {
      this.pieceTracker_();

      return;
    }

    let newPieceCoord = [];

    this.isNewPieceNeeded_ = false; 
    this.piece_ = new Piece(boardConfig);
    this.pieceController_.wrapNewPiece(this.piece_);
    newPieceCoord = this.piece_.getRandomPieceCoord();
    this.board_.updateMatrix(newPieceCoord);
    this.isGameOver_ = this.board_.isBoardFilledOnXAxis;
  
    requestAnimationUtil(this.getNewPiece_, this.gameSpeed_);
  }

  /**
   * Adds high speed on the game.
   * @param {!Event} event
   * @private
   */
  addHighSpeed_(event) {
    if (event.keyCode === 40) {
      this.gameSpeed_ = CONSTANTS.requestAnimationHighSpeed;
      this.board_.setBoardSpeed(this.gameSpeed_);
    }
  }

  /**
   * Resets the game speed by the default one.
   * @param {!Event} event
   * @private
   */
  addDefaultSpeed_(event) {
    if (event.keyCode === 40) {
      const {gameSpeed} = boardConfig;

      this.gameSpeed_ = gameSpeed;
      this.board_.setBoardSpeed(this.gameSpeed_);
    }
  }

  /**
   * Listen for events.
   * @private
   */
  listenEvents_() {
    this.document_.addEventListener(Events.KEY_DOWN, this.addHighSpeed_);
    this.document_.addEventListener(Events.KEY_UP, this.addDefaultSpeed_);
  }

  /**
   * Starts the game.
   */
  start() {
    this.listenEvents_();
    this.getNewPiece_();
  }

  /**
   * Initializes the component.
   */
  init() {
    const {gameSpeed} = boardConfig;

    this.gameSpeed_ = gameSpeed;
    this.board_ = new Board(boardConfig);
    this.pieceController_ = new PieceController(this.board_);
  
    this.board_.init();
    this.pieceController_.init();
    this.start();
  }
}

/**
 * Events.
 */
 const Events = {
  KEY_DOWN: 'keydown',
  KEY_UP: 'keyup'
};


new Game().init();
